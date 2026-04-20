/**
 * /api/vapi/webhook
 * ---------------------------------------------------------------
 * Receives server messages from Vapi (tool-calls, status-update,
 * transcript, end-of-call-report, hang) for Lisa / Max / Ella.
 *
 * Auth: verifies either
 *   - X-Vapi-Secret: <shared secret>              (simple shared token)
 *   - X-Vapi-Signature: sha256=<hex>              (HMAC of raw body)
 * against VAPI_WEBHOOK_SECRET.
 *
 * Tool router (name → handler) covers the union of tools declared
 * in voiceagents/{niche}/vapi-config.json:
 *   query_company_knowledge, check_availability, book_appointment,
 *   create_ticket, log_emergency, send_sms_booking_link,
 *   send_sms_callback_confirmation, stop_recording.
 *
 * Handlers are intentionally shaped so the voice agent gets a
 * useful, Norwegian-facing reply even when downstream systems
 * (Trieve, Supabase, SMS provider) are not yet configured. Missing
 * env vars → stubbed-but-structured responses, never crashes.
 *
 * Response shape (Vapi tool-calls):
 *   { "results": [{ "toolCallId": "...", "result": "<string>" }] }
 *
 * Non-tool messages (transcript, end-of-call-report, etc.) → 200 OK.
 */

import crypto from 'node:crypto';
import type { NextRequest } from 'next/server';
import {
  bookMeeting,
  cancelBooking,
  CalcomError,
  formatSlotEn,
  formatSlotNo,
  getAvailableSlots,
  listUpcomingBookings,
  parseDateWindow,
  rescheduleBooking,
  type MeetingKind,
} from '@/lib/calcom';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Vapi assistant IDs we recognise. Centralised here so we don't
// duplicate them across handlers.
const ARXON_SALES_ASSISTANT_ID = '42414a1e-adf9-41d1-a22c-3a61c5b95d01';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

type Niche =
  | 'lisa-helse'
  | 'max-bilverksted'
  | 'ella-elektriker'
  | 'arxon-sales';

interface VapiToolCall {
  id: string;
  type?: 'function';
  function?: { name: string; arguments?: string | Record<string, unknown> };
  // Some Vapi payload variants include these at the top level
  name?: string;
  arguments?: Record<string, unknown>;
}

interface VapiArtifactMessage {
  role?: string;
  message?: string;
  content?: string;
  time?: number;
  secondsFromStart?: number;
  toolCalls?: Array<{ id?: string; function?: { name?: string } }>;
  name?: string; // tool-name when role is "tool_calls"
}

interface VapiAnalysis {
  summary?: string;
  successEvaluation?: string | boolean;
  structuredData?: Record<string, unknown>;
}

interface VapiCallObject {
  id?: string;
  assistantId?: string;
  assistant?: { name?: string; id?: string };
  type?: string;
  startedAt?: string;
  endedAt?: string;
  customer?: { number?: string; name?: string };
  phoneNumber?: { number?: string };
  cost?: number;
  artifact?: {
    messages?: VapiArtifactMessage[];
    transcript?: string;
    recordingUrl?: string;
    stereoRecordingUrl?: string;
  };
}

interface VapiMessage {
  type?: string;
  toolCalls?: VapiToolCall[];
  toolCallList?: VapiToolCall[];
  functionCall?: { name: string; parameters?: Record<string, unknown> };
  assistant?: { id?: string; name?: string; metadata?: Record<string, unknown> };
  call?: VapiCallObject;
  transcript?: string;
  endedReason?: string;

  // end-of-call-report fields
  summary?: string;
  analysis?: VapiAnalysis;
  recordingUrl?: string;
  stereoRecordingUrl?: string;
  cost?: number;
  durationSeconds?: number;
  durationMs?: number;
  startedAt?: string;
  endedAt?: string;
  messages?: VapiArtifactMessage[];
  artifact?: {
    messages?: VapiArtifactMessage[];
    transcript?: string;
    recordingUrl?: string;
    stereoRecordingUrl?: string;
  };
}

interface VapiBody {
  message?: VapiMessage;
}

interface ToolResult {
  toolCallId: string;
  result: string;
}

// ----------------------------------------------------------------------
// Signature verification
// ----------------------------------------------------------------------

function timingSafeEqualStrings(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

function timingSafeEqualHex(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, 'hex');
    const bb = Buffer.from(b, 'hex');
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

function verifyRequest(
  rawBody: string,
  secretHeader: string | null,
  signatureHeader: string | null,
  secret: string,
  allHeaders?: Headers,
): { ok: boolean; reason?: string } {
  if (!secret) return { ok: false, reason: 'VAPI_WEBHOOK_SECRET not set' };

  // 1) Shared secret header
  if (secretHeader && timingSafeEqualStrings(secretHeader, secret)) {
    return { ok: true };
  }

  // 2) HMAC signature header: "sha256=<hex>"
  if (signatureHeader) {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('hex');
    const provided = signatureHeader.replace(/^sha256=/, '').trim();
    if (timingSafeEqualHex(expected, provided)) return { ok: true };
  }

  // Diagnose: hash+log what kom inn (uten å eksponere hele secret/sig)
  try {
    const expectedSecretFp = crypto
      .createHash('sha256')
      .update(secret)
      .digest('hex')
      .slice(0, 8);
    const providedSecretFp = secretHeader
      ? crypto
          .createHash('sha256')
          .update(secretHeader)
          .digest('hex')
          .slice(0, 8)
      : 'none';
    const providedSigFp = signatureHeader
      ? signatureHeader.slice(0, 10) + '...'
      : 'none';
    const hdrNames = allHeaders
      ? Array.from(allHeaders.keys()).filter((n) =>
          /vapi|signature|secret|auth/i.test(n),
        )
      : [];
    console.error(
      `[vapi-webhook] AUTH FAIL | env_secret_fp=${expectedSecretFp} provided_secret_fp=${providedSecretFp} sig_prefix=${providedSigFp} auth_hdrs=[${hdrNames.join(',')}] body_len=${rawBody.length}`,
    );
  } catch {
    // ignore
  }

  return { ok: false, reason: 'signature mismatch' };
}

// ----------------------------------------------------------------------
// Niche resolution
// ----------------------------------------------------------------------

function nicheFromAssistant(msg: VapiMessage | undefined): Niche | null {
  // Match the Arxon sales assistant by its fixed ID first — its name
  // ("Arxon — Sales (web widget MVP)") contains no persona keyword.
  const ids = [msg?.assistant?.id, msg?.call?.assistantId].filter(Boolean);
  if (ids.includes(ARXON_SALES_ASSISTANT_ID)) return 'arxon-sales';

  const hay = [
    msg?.assistant?.name,
    msg?.call?.assistant?.name,
    (msg?.assistant?.metadata as Record<string, unknown> | undefined)?.niche,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (hay.includes('arxon')) return 'arxon-sales';
  if (hay.includes('lisa')) return 'lisa-helse';
  if (hay.includes('max')) return 'max-bilverksted';
  if (hay.includes('ella')) return 'ella-elektriker';
  return null;
}

// ----------------------------------------------------------------------
// Tool-call normalisation
// ----------------------------------------------------------------------

function toolCallsFromMessage(msg: VapiMessage | undefined): VapiToolCall[] {
  if (!msg) return [];
  if (Array.isArray(msg.toolCallList) && msg.toolCallList.length) {
    return msg.toolCallList;
  }
  if (Array.isArray(msg.toolCalls) && msg.toolCalls.length) return msg.toolCalls;
  if (msg.functionCall?.name) {
    return [
      {
        id: 'legacy-function-call',
        function: {
          name: msg.functionCall.name,
          arguments: msg.functionCall.parameters ?? {},
        },
      },
    ];
  }
  return [];
}

function parseArgs(tc: VapiToolCall): Record<string, unknown> {
  if (tc.arguments && typeof tc.arguments === 'object') {
    return tc.arguments as Record<string, unknown>;
  }
  const raw = tc.function?.arguments;
  if (raw && typeof raw === 'object') return raw as Record<string, unknown>;
  if (typeof raw === 'string' && raw.length) {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return { _rawArguments: raw };
    }
  }
  return {};
}

function toolNameOf(tc: VapiToolCall): string {
  return tc.function?.name ?? tc.name ?? 'unknown_tool';
}

// ----------------------------------------------------------------------
// Helpers: SMS + timestamps
// ----------------------------------------------------------------------

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(6).toString('hex')}`;
}

// ----------------------------------------------------------------------
// Tool handlers — all return a plain string, which Vapi speaks back
// into the LLM turn as the tool's result.
// ----------------------------------------------------------------------

interface HandlerCtx {
  niche: Niche | null;
  callId: string | undefined;
  callerPhone?: string;
}

async function handleQueryCompanyKnowledge(
  args: Record<string, unknown>,
  ctx: HandlerCtx,
): Promise<string> {
  const query = String(args.query ?? args.spørsmål ?? '').trim();
  if (!query) {
    return JSON.stringify({
      ok: false,
      error: 'Manglet søketekst.',
      hits: [],
    });
  }

  const host = process.env.TRIEVE_HOST || 'https://api.trieve.ai';
  const apiKey = process.env.TRIEVE_API_KEY;
  const datasetEnvByNiche: Record<Niche, string> = {
    'lisa-helse': 'TRIEVE_DATASET_LISA',
    'max-bilverksted': 'TRIEVE_DATASET_MAX',
    'ella-elektriker': 'TRIEVE_DATASET_ELLA',
    'arxon-sales': 'TRIEVE_DATASET_ARXON',
  };

  if (!ctx.niche) {
    return JSON.stringify({
      ok: false,
      error: 'Kunne ikke avgjøre hvilken bedrift dette gjelder. Be agenten fortsette uten kunnskapsoppslag.',
      hits: [],
    });
  }
  const datasetId = process.env[datasetEnvByNiche[ctx.niche]];

  if (!apiKey || !datasetId) {
    // Graceful degradation — agent should fall back to rule-based answers
    return JSON.stringify({
      ok: false,
      offline: true,
      message:
        'Kunnskapsbasen er ikke koblet på enda. Svar ut fra det du vet fra systemprompten, og be kunden ringe ved usikkerhet.',
      hits: [],
    });
  }

  try {
    const res = await fetch(`${host}/api/chunk/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
        'TR-Dataset': datasetId,
      },
      body: JSON.stringify({
        query,
        search_type: 'hybrid',
        page_size: 4,
      }),
    });
    if (!res.ok) {
      return JSON.stringify({
        ok: false,
        error: `Trieve svarte HTTP ${res.status}.`,
        hits: [],
      });
    }
    const data = (await res.json()) as {
      chunks?: Array<{
        chunk?: { chunk_html?: string; metadata?: Record<string, unknown> };
        score?: number;
      }>;
    };
    const hits =
      data.chunks?.slice(0, 4).map((c) => ({
        text: (c.chunk?.chunk_html ?? '').slice(0, 800),
        source: (c.chunk?.metadata as Record<string, unknown> | undefined)
          ?.source_file,
        score: c.score ?? null,
      })) ?? [];
    return JSON.stringify({ ok: true, hits });
  } catch (err) {
    return JSON.stringify({
      ok: false,
      error: `Kunnskapsbase-kall feilet: ${(err as Error).message}`,
      hits: [],
    });
  }
}

/**
 * For Arxon-sales: reelle Cal.com-slots.
 * For Lisa/Max/Ella: stub (kalender-backend ikke koblet på ennå).
 */
async function handleCheckAvailability(
  args: Record<string, unknown>,
  ctx: HandlerCtx,
): Promise<string> {
  if (ctx.niche === 'arxon-sales') {
    const rawKind = String(args.kind ?? args.service_type ?? 'demo_30min');
    const kind: MeetingKind =
      rawKind === 'intro_15min' ? 'intro_15min' : 'demo_30min';
    const hint = String(
      args.date_hint ?? args.date ?? args.when ?? 'ingen preferanse',
    );
    const initialWindow = parseDateWindow(hint);
    try {
      let slots = await getAvailableSlots({
        kind,
        from: initialWindow.from,
        to: initialWindow.to,
        limit: 6,
      });
      let windowUsed = initialWindow;
      let widened = false;

      // Robust fallback: hvis brukerens ønske gir 0 treff (helligdag,
      // stengt uke, feilparset hint), utvid til 21 dager frem og vis
      // neste ledige. Aldri dead-end innringer med "prøv et annet tidsrom".
      if (slots.length === 0) {
        const widenFrom = new Date().toISOString();
        const widenTo = new Date(
          Date.now() + 21 * 24 * 60 * 60 * 1000,
        ).toISOString();
        const wide = await getAvailableSlots({
          kind,
          from: widenFrom,
          to: widenTo,
          limit: 6,
        });
        if (wide.length > 0) {
          slots = wide;
          windowUsed = { from: widenFrom, to: widenTo };
          widened = true;
        }
      }

      const formatted = slots.map((s) => ({
        start: s.start,
        end: s.end,
        pretty_no: formatSlotNo(s.start),
        pretty_en: formatSlotEn(s.start),
      }));
      return JSON.stringify({
        ok: true,
        kind,
        window: windowUsed,
        widened,
        count: formatted.length,
        slots: formatted,
        instruction_to_agent: widened
          ? 'Det opprinnelige vinduet var tomt. Si kort "Det var fullt i akkurat det vinduet — de nærmeste ledige er ..." og les opp de 2-3 første tidene.'
          : formatted.length === 0
            ? 'Ingen ledige tider funnet selv etter 21 dager fram — be om unnskyldning, henvis til kontakt@arxon.no.'
            : 'Les opp 2-3 ledige tider og be innringer velge.',
      });
    } catch (err) {
      const e = err as CalcomError;
      return JSON.stringify({
        ok: false,
        error: 'availability_failed',
        status: e?.status,
        message: e?.message ?? 'ukjent feil',
      });
    }
  }

  // Fallback stub for Lisa/Max/Ella — deres Cal.com er ikke koblet på.
  const now = new Date();
  const mkSlot = (daysOut: number, hour: number): string => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysOut);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };
  const slots = [
    { slot_id: newId('slot'), start: mkSlot(2, 10), duration_min: 30 },
    { slot_id: newId('slot'), start: mkSlot(3, 14), duration_min: 30 },
    { slot_id: newId('slot'), start: mkSlot(5, 9), duration_min: 30 },
  ];
  return JSON.stringify({
    ok: true,
    service_type: String(args.service_type ?? ''),
    date_hint: String(args.date ?? ''),
    slots,
    note: 'Stubbet liste — endelig booking-backend ikke koblet på.',
  });
}

/**
 * For Arxon-sales: ekte Cal.com-booking.
 * For andre nisjer: lokal reservasjon (stub).
 */
async function handleBookAppointment(
  args: Record<string, unknown>,
  ctx: HandlerCtx,
): Promise<string> {
  if (ctx.niche === 'arxon-sales') {
    const rawKind = String(args.kind ?? args.service_type ?? 'demo_30min');
    const kind: MeetingKind =
      rawKind === 'intro_15min' ? 'intro_15min' : 'demo_30min';
    const start = String(args.start ?? args.slot_start ?? '');
    const name = String(args.name ?? args.customer_name ?? '').trim();
    const email = String(args.email ?? args.customer_email ?? '').trim();
    const phone = args.phone ? String(args.phone) : undefined;
    const notes = args.notes ? String(args.notes) : undefined;
    const languageRaw = String(args.language ?? 'no').toLowerCase();
    const language: 'no' | 'en' = languageRaw === 'en' ? 'en' : 'no';

    if (!start || !name || !email) {
      return JSON.stringify({
        ok: false,
        error: 'missing_fields',
        required: ['kind', 'start', 'name', 'email'],
        note:
          'Agent må først ringe check_availability og samle inn navn + e-post før book_meeting.',
      });
    }

    try {
      const result = await bookMeeting({
        kind,
        start,
        attendee: {
          name,
          email,
          phone,
          language,
          timeZone: 'Europe/Oslo',
        },
        notes,
        metadata: { source: 'arxon-vapi-webhook' },
      });
      return JSON.stringify({
        ok: true,
        booking_id: result.bookingId,
        start: result.start,
        end: result.end,
        meeting_url: result.meetingUrl ?? null,
        manage_url: result.manageUrl ?? null,
        pretty_no: formatSlotNo(result.start),
        pretty_en: formatSlotEn(result.start),
      });
    } catch (err) {
      const e = err as CalcomError;
      return JSON.stringify({
        ok: false,
        error: 'booking_failed',
        status: e?.status,
        message: e?.message ?? 'ukjent feil',
      });
    }
  }

  // Fallback stub for Lisa/Max/Ella.
  const bookingId = newId('book');
  return JSON.stringify({
    ok: true,
    booking_id: bookingId,
    status: 'reserved',
    slot_id: args.slot_id ?? null,
    customer_name: args.customer_name ?? null,
    phone: args.phone ?? null,
    created_at: nowIso(),
    note: 'Reservert lokalt — kalender-backend ikke koblet på. Send SMS-bekreftelse manuelt hvis nødvendig.',
  });
}

function handleCreateTicket(args: Record<string, unknown>): string {
  const ticketId = newId('tkt');
  return JSON.stringify({
    ok: true,
    ticket_id: ticketId,
    priority: args.priority ?? 'normal',
    category: args.category ?? 'generell',
    summary: args.summary ?? '',
    created_at: nowIso(),
  });
}

function handleLogEmergency(
  args: Record<string, unknown>,
  ctx: HandlerCtx,
): string {
  const emergencyId = newId('emg');
  const refByNiche: Record<Niche, { number: string; label: string }> = {
    'lisa-helse': { number: '113', label: 'AMK' },
    'max-bilverksted': { number: '110', label: 'Brann' },
    'ella-elektriker': { number: '110', label: 'Brann' },
    // Arxon-sales har ingen akutt-scenarier, men vi må tilfredsstille TS.
    'arxon-sales': { number: '113', label: 'Nødetat' },
  };
  const ref = ctx.niche ? refByNiche[ctx.niche] : { number: '113', label: 'Nødetat' };
  return JSON.stringify({
    ok: true,
    emergency_id: emergencyId,
    emergency_number: ref.number,
    emergency_label: ref.label,
    logged_at: nowIso(),
    type: args.type ?? 'unspecified',
    details: args.details ?? '',
    instruction_to_agent:
      `Be innringer ringe ${ref.number} umiddelbart. Bli på linja til de bekrefter samtalen er satt, eller til de ber om å legge på.`,
  });
}

/**
 * Normaliser et norsk telefonnummer til GatewayAPI sitt format:
 * integer uten pluss, med landskode 47.
 * Godtar: "+47 984 00 000", "004798400000", "98400000", "47 984 00 000".
 * Returnerer null om inputen ikke kan tolkes som et gyldig mobilnummer.
 */
function normaliseNoPhoneForGateway(raw: string | null | undefined): number | null {
  if (!raw) return null;
  // Fjern mellomrom, bindestreker, parenteser, pluss, 00-prefiks.
  let digits = String(raw).replace(/[\s\-()]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  else if (digits.startsWith('00')) digits = digits.slice(2);
  // Kun sifre fra nå.
  if (!/^\d+$/.test(digits)) return null;
  // Norsk mobilnummer (8 sifre) uten landskode → prepend 47.
  if (digits.length === 8 && /^[49]/.test(digits)) digits = '47' + digits;
  // Norske mobile nummer starter med 4 eller 9 etter landskode 47.
  // Geografiske/fasttelefon-nummer (2/3/5/6/7/8) kan ikke motta SMS via alfasender.
  if (digits.length === 10 && digits.startsWith('47')) {
    const mobilePrefix = digits[2];
    if (mobilePrefix !== '4' && mobilePrefix !== '9') return null;
  }
  // Aksepterer andre landskoder også (8-15 sifre totalt), ISO E.164 bredt.
  if (digits.length < 8 || digits.length > 15) return null;
  const n = Number(digits);
  return Number.isSafeInteger(n) ? n : null;
}

async function handleSendSms(
  args: Record<string, unknown>,
  kind: 'booking_link' | 'callback_confirmation',
  ctx: HandlerCtx,
): Promise<string> {
  const token = process.env.GATEWAYAPI_TOKEN;
  const sender = process.env.GATEWAYAPI_SENDER || 'Arxon';
  const endpoint =
    process.env.GATEWAYAPI_ENDPOINT || 'https://messaging.gatewayapi.eu/mobile/single';

  // 1. Resolve mottaker: arg > call.customer.number
  const rawTo =
    (typeof args.phone === 'string' && args.phone) ||
    (typeof args.to === 'string' && args.to) ||
    (typeof args.recipient === 'string' && args.recipient) ||
    ctx.callerPhone ||
    null;
  const recipient = normaliseNoPhoneForGateway(rawTo);
  if (!recipient) {
    return JSON.stringify({
      ok: false,
      error: 'invalid_recipient',
      sms_kind: kind,
      raw_to: rawTo,
      instruction_to_agent:
        'Jeg har ikke et gyldig mobilnummer å sende SMS til. Spør innringer om å bekrefte norsk mobilnummer (4xx xx xxx eller 9xx xx xxx) før du kaller verktøyet igjen.',
    });
  }

  // 2. Bygg meldingstekst.
  const bookingUrl =
    (typeof args.booking_url === 'string' && args.booking_url) ||
    (typeof args.url === 'string' && args.url) ||
    (typeof args.link === 'string' && args.link) ||
    (ctx.niche === 'arxon-sales'
      ? 'https://cal.com/arxon/demo-30'
      : 'https://cal.com/arxon/intro-15');
  const customText =
    typeof args.message === 'string' && args.message.trim() ? args.message.trim() : null;

  let message: string;
  if (customText) {
    message = customText;
  } else if (kind === 'booking_link') {
    message = `Hei! Her er bookinglenken din fra Arxon: ${bookingUrl} — velg tid som passer, så sees vi. Hilsen Arxon.`;
  } else {
    message = `Takk for praten! Vi ringer deg tilbake som avtalt. Hilsen Arxon.`;
  }

  // 3. Fall back til stub om token mangler (unngå 500 under lokal dev).
  if (!token) {
    return JSON.stringify({
      ok: false,
      error: 'sms_provider_not_configured',
      sms_kind: kind,
      to: recipient,
      queued_at: nowIso(),
      provider: 'none',
      instruction_to_agent:
        'SMS-leverandøren er ikke satt opp. Bekreft bookingen muntlig og si at jeg sender e-post i stedet.',
    });
  }

  // 4. POST til GatewayAPI.
  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender,
        recipient,
        message,
      }),
    });
    const respText = await resp.text();
    if (!resp.ok) {
      return JSON.stringify({
        ok: false,
        error: 'sms_provider_error',
        sms_kind: kind,
        to: recipient,
        status: resp.status,
        provider: 'gatewayapi',
        details: respText.slice(0, 400),
        instruction_to_agent:
          'SMS-sendingen feilet. Bekreft bookingen muntlig, og si at vi sender en oppfølgings-e-post i stedet.',
      });
    }
    let payload: unknown = null;
    try {
      payload = JSON.parse(respText);
    } catch {
      payload = respText;
    }
    const messageId =
      (payload &&
        typeof payload === 'object' &&
        'id' in (payload as Record<string, unknown>) &&
        (payload as Record<string, unknown>).id) ||
      (payload &&
        typeof payload === 'object' &&
        'ids' in (payload as Record<string, unknown>) &&
        Array.isArray((payload as Record<string, unknown>).ids) &&
        ((payload as Record<string, unknown>).ids as unknown[])[0]) ||
      null;
    return JSON.stringify({
      ok: true,
      sms_kind: kind,
      to: recipient,
      sender,
      message_length: message.length,
      queued_at: nowIso(),
      provider: 'gatewayapi',
      message_id: messageId,
      instruction_to_agent:
        kind === 'booking_link'
          ? 'SMS-en med bookinglenken er sendt. Si kort til innringer at lenken nå ligger i innboksen på telefonen, og at de kan klikke for å velge tid.'
          : 'SMS-bekreftelsen er sendt. Si kort til innringer at de har fått en bekreftelse på SMS.',
    });
  } catch (err) {
    return JSON.stringify({
      ok: false,
      error: 'sms_network_error',
      sms_kind: kind,
      to: recipient,
      provider: 'gatewayapi',
      details: (err as Error).message,
      instruction_to_agent:
        'SMS-sendingen feilet på grunn av nettverksfeil. Bekreft bookingen muntlig og si at oppfølging kommer på e-post.',
    });
  }
}

function handleStopRecording(): string {
  return JSON.stringify({ ok: true, stopped_at: nowIso() });
}

/**
 * For Arxon-sales: slå opp innringers kommende Cal.com-bookinger.
 * Stemmeagenten skal lese opp 1-3 resultater og spørre hvilken som gjelder.
 */
async function handleFindMyBooking(
  args: Record<string, unknown>,
  ctx: HandlerCtx,
): Promise<string> {
  if (ctx.niche !== 'arxon-sales') {
    return JSON.stringify({
      ok: false,
      error: 'not_supported',
      message: 'Oppslag mot kalender er kun implementert for Arxon-agenten.',
    });
  }
  const email = String(args.email ?? args.customer_email ?? '').trim();
  if (!email || !email.includes('@')) {
    return JSON.stringify({
      ok: false,
      error: 'missing_email',
      instruction_to_agent:
        'Be innringer stave e-postadressen sin før du kaller verktøyet igjen.',
    });
  }
  try {
    const bookings = await listUpcomingBookings({ email, limit: 5 });
    if (bookings.length === 0) {
      return JSON.stringify({
        ok: true,
        count: 0,
        bookings: [],
        instruction_to_agent:
          'Fant ingen kommende bookinger på denne e-posten. Spør om de vil booke en ny demo, eller om e-posten kanskje var feilstavet.',
      });
    }
    const formatted = bookings.map((b) => ({
      booking_uid: b.uid,
      start: b.start,
      end: b.end,
      pretty_no: formatSlotNo(b.start),
      pretty_en: formatSlotEn(b.start),
      status: b.status,
      title: b.title ?? null,
    }));
    return JSON.stringify({
      ok: true,
      count: formatted.length,
      bookings: formatted,
      instruction_to_agent:
        formatted.length === 1
          ? `Det er én kommende booking: ${formatted[0].pretty_no}. Bekreft med innringer at dette er den de vil flytte eller avlyse, før du kaller reschedule_booking eller cancel_booking.`
          : `Det er ${formatted.length} kommende bookinger. Les opp kort med dato og tid og be innringer velge hvilken som gjelder.`,
    });
  } catch (err) {
    const e = err as CalcomError;
    return JSON.stringify({
      ok: false,
      error: 'lookup_failed',
      status: e?.status,
      message: e?.message ?? 'ukjent feil',
    });
  }
}

/**
 * For Arxon-sales: flytt en eksisterende Cal.com-booking til en ny tid.
 * Agenten må først ha hentet ut booking_uid via find_my_booking og funnet
 * en ny start-tid via check_availability.
 */
async function handleRescheduleAppointment(
  args: Record<string, unknown>,
  ctx: HandlerCtx,
): Promise<string> {
  if (ctx.niche !== 'arxon-sales') {
    return JSON.stringify({
      ok: false,
      error: 'not_supported',
      message: 'Flytting er kun implementert for Arxon-agenten.',
    });
  }
  const bookingUid = String(args.booking_uid ?? args.uid ?? '').trim();
  const start = String(args.start ?? args.new_start ?? '').trim();
  const reason = args.reason ? String(args.reason) : undefined;

  if (!bookingUid || !start) {
    return JSON.stringify({
      ok: false,
      error: 'missing_fields',
      required: ['booking_uid', 'start'],
      instruction_to_agent:
        'Ring find_my_booking for å hente booking_uid, og check_availability for å få ny ISO start-tid før du kaller reschedule_booking.',
    });
  }

  try {
    const result = await rescheduleBooking({
      bookingUid,
      start,
      reason,
      timeZone: 'Europe/Oslo',
    });
    return JSON.stringify({
      ok: true,
      rescheduled: true,
      previous_uid: result.previousUid,
      booking_id: result.bookingId,
      start: result.start,
      end: result.end,
      meeting_url: result.meetingUrl ?? null,
      manage_url: result.manageUrl ?? null,
      pretty_no: formatSlotNo(result.start),
      pretty_en: formatSlotEn(result.start),
      instruction_to_agent: `Bekreftet — nytt tidspunkt er ${formatSlotNo(result.start)}. Si det kort til innringer, og nevn at en oppdatert kalenderinvitasjon er sendt på e-post.`,
    });
  } catch (err) {
    const e = err as CalcomError;
    return JSON.stringify({
      ok: false,
      error: 'reschedule_failed',
      status: e?.status,
      message: e?.message ?? 'ukjent feil',
      instruction_to_agent:
        'Flyttingen feilet. Be om unnskyldning, og tilby å sende en e-post til kontakt@arxon.no så ordner teamet det manuelt.',
    });
  }
}

/**
 * For Arxon-sales: avlys en eksisterende Cal.com-booking.
 * Agenten må alltid innhente eksplisitt bekreftelse muntlig før den kaller
 * dette verktøyet, siden avlysning ikke kan angres i dialogen.
 */
async function handleCancelAppointment(
  args: Record<string, unknown>,
  ctx: HandlerCtx,
): Promise<string> {
  if (ctx.niche !== 'arxon-sales') {
    return JSON.stringify({
      ok: false,
      error: 'not_supported',
      message: 'Avlysning er kun implementert for Arxon-agenten.',
    });
  }
  const bookingUid = String(args.booking_uid ?? args.uid ?? '').trim();
  const reason = args.reason ? String(args.reason) : undefined;

  if (!bookingUid) {
    return JSON.stringify({
      ok: false,
      error: 'missing_fields',
      required: ['booking_uid'],
      instruction_to_agent:
        'Ring find_my_booking først for å hente booking_uid, og bekreft muntlig med innringer før du kaller cancel_booking.',
    });
  }

  try {
    const result = await cancelBooking({ bookingUid, reason });
    return JSON.stringify({
      ok: true,
      cancelled: true,
      booking_uid: result.uid,
      status: result.status,
      instruction_to_agent:
        'Møtet er avlyst. Bekreft kort til innringer, og spør om de vil sette opp en ny tid eller om de tar kontakt selv.',
    });
  } catch (err) {
    const e = err as CalcomError;
    return JSON.stringify({
      ok: false,
      error: 'cancel_failed',
      status: e?.status,
      message: e?.message ?? 'ukjent feil',
      instruction_to_agent:
        'Avlysningen feilet. Be om unnskyldning, og tilby å sende en e-post til kontakt@arxon.no så ordner teamet det manuelt.',
    });
  }
}

// ----------------------------------------------------------------------
// Dispatcher
// ----------------------------------------------------------------------

async function dispatchToolCall(
  tc: VapiToolCall,
  ctx: HandlerCtx,
): Promise<ToolResult> {
  const name = toolNameOf(tc);
  const args = parseArgs(tc);
  let result: string;
  try {
    switch (name) {
      case 'query_company_knowledge':
        result = await handleQueryCompanyKnowledge(args, ctx);
        break;
      case 'check_availability':
        result = await handleCheckAvailability(args, ctx);
        break;
      case 'book_appointment':
      case 'book_meeting':
        result = await handleBookAppointment(args, ctx);
        break;
      case 'find_my_booking':
      case 'lookup_booking':
        result = await handleFindMyBooking(args, ctx);
        break;
      case 'reschedule_booking':
      case 'reschedule_appointment':
      case 'reschedule_meeting':
        result = await handleRescheduleAppointment(args, ctx);
        break;
      case 'cancel_booking':
      case 'cancel_appointment':
      case 'cancel_meeting':
        result = await handleCancelAppointment(args, ctx);
        break;
      case 'create_ticket':
        result = handleCreateTicket(args);
        break;
      case 'log_emergency':
        result = handleLogEmergency(args, ctx);
        break;
      case 'send_sms_booking_link':
        result = await handleSendSms(args, 'booking_link', ctx);
        break;
      case 'send_sms_callback_confirmation':
        result = await handleSendSms(args, 'callback_confirmation', ctx);
        break;
      case 'stop_recording':
        result = handleStopRecording();
        break;
      default:
        result = JSON.stringify({
          ok: false,
          error: `Ukjent verktøy: ${name}`,
        });
    }
  } catch (err) {
    result = JSON.stringify({
      ok: false,
      error: `Verktøy kastet: ${(err as Error).message}`,
    });
  }
  return { toolCallId: tc.id ?? 'unknown', result };
}

// ----------------------------------------------------------------------
// End-of-call-report persistence (Supabase `calls`)
// ----------------------------------------------------------------------

/**
 * Flatten a Vapi artifact.messages[] array into the structured transcript
 * shape we store (role ∈ {agent, kunde, tool}, content, timestamp).
 */
function normaliseTranscript(
  messages: VapiArtifactMessage[] | undefined,
): Array<{ role: string; content: string; timestamp?: string }> {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (m) =>
        m.role &&
        m.role !== 'system' &&
        ((m.message && m.message.length) ||
          (m.content && m.content.length) ||
          m.role === 'tool_calls' ||
          m.role === 'tool_call_result'),
    )
    .map((m) => {
      const role =
        m.role === 'bot' || m.role === 'assistant'
          ? 'agent'
          : m.role === 'user'
            ? 'kunde'
            : (m.role ?? 'unknown');
      const content =
        m.message ?? m.content ?? (m.name ? `[tool: ${m.name}]` : '');
      const secs =
        typeof m.secondsFromStart === 'number'
          ? m.secondsFromStart
          : typeof m.time === 'number'
            ? m.time / 1000
            : undefined;
      return {
        role,
        content,
        timestamp:
          typeof secs === 'number' ? `${Math.round(secs)}s` : undefined,
      };
    });
}

/** Extract unique tool names that the assistant actually called. */
function extractToolsUsed(
  messages: VapiArtifactMessage[] | undefined,
): string[] {
  if (!Array.isArray(messages)) return [];
  const names = new Set<string>();
  for (const m of messages) {
    if (Array.isArray(m.toolCalls)) {
      for (const tc of m.toolCalls) {
        const n = tc?.function?.name;
        if (n) names.add(n);
      }
    }
    if (m.role === 'tool_calls' && m.name) names.add(m.name);
  }
  return Array.from(names);
}

/**
 * Heuristic guardrail check: scan transcript for known red flags
 * (made-up pricing, refund promises, PII leakage). Returns an array of
 * short flag codes that we can render in the dashboard.
 */
function detectGuardrailFlags(
  transcript: Array<{ role: string; content: string }>,
): string[] {
  const flags = new Set<string>();
  const agentLines = transcript
    .filter((t) => t.role === 'agent')
    .map((t) => t.content.toLowerCase());

  for (const line of agentLines) {
    // Fabricated kroner amounts outside the sanctioned from-prices.
    if (/\b\d{2,3}\s?000\s*kr\b|\b\d{1,3}\s?\d{3}\s*kroner\b/.test(line)) {
      // Allow explicit 4 990 / 9 990 / 14 990 starter anchors.
      if (
        !/4\s?990|9\s?990|14\s?990|4990|9990|14990/.test(line) &&
        !/fra-pris|fra\s+\d/.test(line)
      ) {
        flags.add('price-outside-anchor');
      }
    }
    if (
      /refundere|refusjon|penger tilbake|money back|garantert|guaranteed/.test(
        line,
      )
    ) {
      flags.add('unauthorised-refund-or-guarantee');
    }
    if (/cvv|kortnummer|fødselsnummer|passord|personnummer/.test(line)) {
      flags.add('sensitive-pii-requested');
    }
    if (/jeg er et menneske|ikke en ai|ikke en robot/.test(line)) {
      flags.add('human-impersonation');
    }
    if (
      /(openai|gpt-4|claude|anthropic|eleven ?labs|deepgram|vapi|livekit)/.test(
        line,
      )
    ) {
      flags.add('tech-stack-disclosure');
    }
  }
  return Array.from(flags);
}

/** Resolve vapi_assistant_id → {client_id, customer_id, internal uuid}. */
async function resolveAssistantMapping(
  vapiAssistantId: string | undefined,
): Promise<{
  niche: string | null;
  customerId: string | null;
  internalId: string | null;
}> {
  if (!vapiAssistantId) {
    return { niche: null, customerId: null, internalId: null };
  }
  try {
    const { data, error } = await supabase
      .from('vapi_assistants')
      .select('id, client_id, customer_id')
      .eq('vapi_assistant_id', vapiAssistantId)
      .limit(1)
      .maybeSingle();
    if (error) {
      console.warn(
        '[vapi-webhook] assistant lookup failed:',
        error.message,
      );
      return { niche: null, customerId: null, internalId: null };
    }
    return {
      niche: (data?.client_id as string | null) ?? null,
      customerId: (data?.customer_id as string | null) ?? null,
      internalId: (data?.id as string | null) ?? null,
    };
  } catch (e) {
    console.warn(
      '[vapi-webhook] assistant lookup threw:',
      (e as Error).message,
    );
    return { niche: null, customerId: null, internalId: null };
  }
}

/**
 * Persist a Vapi `end-of-call-report` event to the `calls` table.
 * Idempotent on vapi_call_id — upserts if a row already exists.
 */
async function persistEndOfCallReport(
  message: VapiMessage,
  fallbackNiche: Niche | null,
): Promise<void> {
  try {
    const call = message.call ?? {};
    const artifact = message.artifact ?? call.artifact ?? {};
    const analysis = message.analysis ?? {};
    const vapiCallId = call.id ?? null;
    const vapiAssistantId = call.assistantId ?? message.assistant?.id ?? null;

    if (!vapiCallId) {
      console.warn('[vapi-webhook] end-of-call-report without call.id — skip persist');
      return;
    }

    const { niche, customerId, internalId } = await resolveAssistantMapping(
      vapiAssistantId ?? undefined,
    );

    const rawMessages = artifact.messages ?? message.messages ?? [];
    const transcript = normaliseTranscript(rawMessages);
    const toolsUsed = extractToolsUsed(rawMessages);
    const guardrailFlags = detectGuardrailFlags(transcript);

    const durationSeconds = (() => {
      if (typeof message.durationSeconds === 'number')
        return Math.round(message.durationSeconds);
      if (typeof message.durationMs === 'number')
        return Math.round(message.durationMs / 1000);
      const startedAt = message.startedAt ?? call.startedAt;
      const endedAt = message.endedAt ?? call.endedAt;
      if (startedAt && endedAt) {
        return Math.round(
          (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000,
        );
      }
      return null;
    })();

    const direction =
      call.type === 'outboundPhoneCall'
        ? 'outbound'
        : call.type === 'webCall'
          ? 'web'
          : 'inbound';

    const callerPhone =
      call.customer?.number ?? call.phoneNumber?.number ?? null;
    const contactName = call.customer?.name ?? null;

    const successEvaluation =
      typeof analysis.successEvaluation === 'boolean'
        ? analysis.successEvaluation
          ? 'pass'
          : 'fail'
        : (analysis.successEvaluation ?? null);

    // Simple sentiment fallback from success-eval.
    const sentiment =
      successEvaluation === 'pass'
        ? 'positive'
        : successEvaluation === 'fail'
          ? 'negative'
          : 'neutral';

    const structuredData = analysis.structuredData ?? null;
    const outcome =
      (structuredData as Record<string, unknown> | null)?.outcome?.toString() ??
      (toolsUsed.includes('book_meeting')
        ? 'booked'
        : transcript.length < 3
          ? 'no_answer'
          : 'completed');

    const recordingUrl =
      message.recordingUrl ??
      artifact.recordingUrl ??
      message.stereoRecordingUrl ??
      artifact.stereoRecordingUrl ??
      null;

    const row: Record<string, unknown> = {
      vapi_call_id: vapiCallId,
      vapi_assistant_id: vapiAssistantId,
      assistant_id: internalId,
      customer_id: customerId,
      niche: niche ?? fallbackNiche ?? null,
      direction,
      duration_seconds: durationSeconds,
      caller_phone: callerPhone,
      contact_name: contactName,
      transcript,
      messages: rawMessages,
      summary: analysis.summary ?? message.summary ?? null,
      sentiment,
      outcome,
      recording_url: recordingUrl,
      ended_reason: message.endedReason ?? null,
      cost: typeof message.cost === 'number' ? message.cost : call.cost ?? null,
      success_evaluation: successEvaluation,
      structured_data: structuredData,
      tools_used: toolsUsed,
      guardrail_flags: guardrailFlags,
      started_at: message.startedAt ?? call.startedAt ?? null,
      ended_at: message.endedAt ?? call.endedAt ?? null,
      meeting_booked_at: toolsUsed.includes('book_meeting')
        ? new Date().toISOString()
        : null,
    };

    // Look for existing row on vapi_call_id for update vs insert.
    const { data: existing } = await supabase
      .from('calls')
      .select('id')
      .eq('vapi_call_id', vapiCallId)
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from('calls')
        .update(row)
        .eq('id', existing.id);
      if (error) {
        console.error(
          '[vapi-webhook] calls UPDATE failed:',
          error.message,
        );
      } else {
        console.log(
          `[vapi-webhook] calls UPDATE ok  call=${vapiCallId}  niche=${niche ?? fallbackNiche ?? '?'}  tools=[${toolsUsed.join(',')}]`,
        );
      }
    } else {
      const { error } = await supabase.from('calls').insert(row);
      if (error) {
        console.error(
          '[vapi-webhook] calls INSERT failed:',
          error.message,
        );
      } else {
        console.log(
          `[vapi-webhook] calls INSERT ok  call=${vapiCallId}  niche=${niche ?? fallbackNiche ?? '?'}  tools=[${toolsUsed.join(',')}]`,
        );
      }
    }
  } catch (e) {
    // Swallow — webhook must return 200 even if persistence fails.
    console.error(
      '[vapi-webhook] persistEndOfCallReport threw:',
      (e as Error).message,
    );
  }
}

// ----------------------------------------------------------------------
// Route handler
// ----------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<Response> {
  const rawBody = await request.text();

  // `.trim()` defends mot whitespace/newline-korrupte env-verdier i Vercel
  // (samme angrepsvektor som UUID-env-vars — jf. feedback_printf_env_corruption).
  const secret = (process.env.VAPI_WEBHOOK_SECRET ?? '').trim();
  const secretHeader = request.headers.get('x-vapi-secret');
  const signatureHeader = request.headers.get('x-vapi-signature');
  const auth = verifyRequest(
    rawBody,
    secretHeader,
    signatureHeader,
    secret,
    request.headers,
  );
  if (!auth.ok) {
    // In dev with no secret set, allow-listed passthrough so you can
    // smoke-test locally. In prod, secret is always required.
    if (!secret && process.env.NODE_ENV !== 'production') {
      console.warn('[vapi-webhook] DEV MODE: secret not set, allowing request');
    } else {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', reason: auth.reason }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }
  }

  let body: VapiBody;
  try {
    body = JSON.parse(rawBody) as VapiBody;
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const message = body.message;
  const ctx: HandlerCtx = {
    niche: nicheFromAssistant(message),
    callId: message?.call?.id,
    callerPhone: message?.call?.customer?.number,
  };

  const toolCalls = toolCallsFromMessage(message);
  if (toolCalls.length) {
    const results = await Promise.all(
      toolCalls.map((tc) => dispatchToolCall(tc, ctx)),
    );
    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Non-tool server messages: log-and-ack.
  // Types we expect: status-update, transcript, end-of-call-report,
  // hang, speech-update, conversation-update, model-output.
  if (message?.type) {
    console.log(
      `[vapi-webhook] ${message.type}  niche=${ctx.niche ?? '?'}  call=${ctx.callId ?? '?'}`,
    );
    if (message.type === 'end-of-call-report') {
      if (message.endedReason) {
        console.log(`[vapi-webhook] ended: ${message.endedReason}`);
      }
      // Fire-and-forget: persist transcript/analysis for the dashboard.
      // Must never block the 200 response back to Vapi.
      persistEndOfCallReport(message, ctx.niche).catch((e) =>
        console.error(
          '[vapi-webhook] end-of-call-report persistence failed:',
          (e as Error).message,
        ),
      );
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Vapi sometimes pings with GET for health checks
export async function GET(): Promise<Response> {
  // Temporary diagnostic: expose sha256-fingerprint (first 8 hex) of the
  // VAPI_WEBHOOK_SECRET env var slik vi kan verifisere at prod faktisk har
  // samme verdi som .env.local. Secreten selv eksponeres aldri.
  const secret = (process.env.VAPI_WEBHOOK_SECRET ?? '').trim();
  const fp =
    secret.length === 0
      ? 'empty'
      : crypto.createHash('sha256').update(secret).digest('hex').slice(0, 8);
  return new Response(
    JSON.stringify({
      ok: true,
      service: 'arxon-vapi-webhook',
      secret_len: secret.length,
      secret_fp8: fp,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
}
