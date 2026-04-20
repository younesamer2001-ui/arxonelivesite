/**
 * Cal.com v2 API klient — brukes av både /api/chat og /api/vapi/webhook
 * for å sjekke ledige tider og booke demo-møter.
 *
 * Migrert fra v1 2026-04-18 pga. "API v1 has been decommissioned" (HTTP 410).
 * v2 aksepterer samme `cal_live_xxx` nøkler som Bearer-token, men krever
 * `cal-api-version`-header per endpoint.
 *
 * Krever disse env-variablene:
 *   - CALCOM_API_KEY            Personlig API-nøkkel (https://app.cal.com/settings/developer/api-keys)
 *   - CALCOM_EVENT_TYPE_30MIN   Numerisk event type ID for "30 min demo"
 *   - CALCOM_EVENT_TYPE_15MIN   (valgfri) Numerisk event type ID for "15 min intro"
 *   - CALCOM_TIMEZONE           (valgfri, default: "Europe/Oslo")
 *
 * Cal.com v2 docs: https://cal.com/docs/api-reference/v2/introduction
 */
const CALCOM_API_BASE = "https://api.cal.com/v2"
// cal-api-version pr. endpoint (stabile versjoner pr. 2024-09):
const SLOTS_API_VERSION = "2024-09-04"
const BOOKINGS_API_VERSION = "2024-08-13"
const DEFAULT_TZ = process.env.CALCOM_TIMEZONE || "Europe/Oslo"

export type MeetingKind = "demo_30min" | "intro_15min"

export type Slot = {
  /** ISO-8601 UTC start, e.g. "2026-04-22T11:00:00.000Z" */
  start: string
  /** ISO-8601 UTC end */
  end: string
}

export type Attendee = {
  name: string
  email: string
  /** E.164-like, optional. Cal.com aksepterer string. */
  phone?: string
  /** IANA timezone. Default Europe/Oslo. */
  timeZone?: string
  /** "no" eller "en". Default "no". */
  language?: "no" | "en"
}

export type BookingResult = {
  bookingId: string | number
  /** Bekreftet start (ISO). */
  start: string
  /** Bekreftet end (ISO). */
  end: string
  /** Cal.com reschedule/cancel URL hvis tilgjengelig. */
  manageUrl?: string
  /** Hvor møtet holdes (Meet/Zoom/telefonlenke) hvis tilgjengelig. */
  meetingUrl?: string
}

export class CalcomError extends Error {
  status: number
  detail?: unknown
  constructor(message: string, status: number, detail?: unknown) {
    super(message)
    this.name = "CalcomError"
    this.status = status
    this.detail = detail
  }
}

function eventTypeIdFor(kind: MeetingKind): number {
  const raw =
    kind === "demo_30min"
      ? process.env.CALCOM_EVENT_TYPE_30MIN
      : process.env.CALCOM_EVENT_TYPE_15MIN
  const id = raw ? Number.parseInt(raw, 10) : NaN
  if (!id || Number.isNaN(id)) {
    throw new CalcomError(
      `Mangler CALCOM_EVENT_TYPE_${kind === "demo_30min" ? "30MIN" : "15MIN"} env-variabel`,
      500
    )
  }
  return id
}

function apiKey(): string {
  const key = process.env.CALCOM_API_KEY
  if (!key) throw new CalcomError("Mangler CALCOM_API_KEY env-variabel", 500)
  return key
}

async function calFetch<T>(
  path: string,
  init: RequestInit & {
    query?: Record<string, string | number | undefined>
    /** Cal.com v2 krever `cal-api-version`-header pr. endpoint. */
    version: string
  }
): Promise<T> {
  const { query, version, ...rest } = init
  const url = new URL(CALCOM_API_BASE + path)
  // v2 autentisering: Bearer-token i Authorization-header (ikke query-param)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
    }
  }

  const res = await fetch(url.toString(), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey()}`,
      "cal-api-version": version,
      ...(rest.headers || {}),
    },
    cache: "no-store",
  })

  const text = await res.text()
  let body: unknown = undefined
  try {
    body = text ? JSON.parse(text) : undefined
  } catch {
    body = text
  }

  if (!res.ok) {
    const msg =
      (body as { message?: string })?.message ||
      (body as { error?: { message?: string } })?.error?.message ||
      `Cal.com API ${res.status}`
    throw new CalcomError(msg, res.status, body)
  }

  return body as T
}

/* ------------------------------------------------------------------ */
/* Slots                                                              */
/* ------------------------------------------------------------------ */

/**
 * Henter ledige tider for en event-type i et tidsintervall.
 *
 * Cal.com v2 /slots returnerer et objekt hvor nøkler er datoer ("YYYY-MM-DD")
 * og verdiene er arrays av `{ time: "<ISO>" }`. Vi flatter det ut til `Slot[]`
 * med beregnet `end` basert på event-type-lengden (30 eller 15 min).
 */
export async function getAvailableSlots(params: {
  kind: MeetingKind
  /** ISO dato/datetime (inklusive). F.eks. "2026-04-22" eller "2026-04-22T09:00:00Z". */
  from: string
  /** ISO dato/datetime (eksklusive). F.eks. "2026-04-29". */
  to: string
  timeZone?: string
  /** Maks antall slots å returnere (sortert stigende). Default 6. */
  limit?: number
}): Promise<Slot[]> {
  const { kind, from, to, timeZone = DEFAULT_TZ, limit = 6 } = params
  const eventTypeId = eventTypeIdFor(kind)
  const durationMin = kind === "demo_30min" ? 30 : 15

  // v2 slots-respons: { status: "success", data: { "YYYY-MM-DD": [{ start: ISO }, ...] } }
  // I enkelte konfigurasjoner kan `data` også være en flat array av `{ start }`-objekter.
  type CalV2Slot = { start: string; time?: string }
  type CalSlotsResponse = {
    status?: string
    data?: Record<string, CalV2Slot[]> | CalV2Slot[]
    // Tåle legacy/alt-shape
    slots?: Record<string, CalV2Slot[]>
  }

  const data = await calFetch<CalSlotsResponse>("/slots", {
    method: "GET",
    version: SLOTS_API_VERSION,
    query: {
      eventTypeId,
      start: from,
      end: to,
      timeZone,
    },
  })

  const flat: Slot[] = []
  const pushFromSlot = (s: CalV2Slot) => {
    const startIso = s.start || s.time
    if (!startIso) return
    const startMs = Date.parse(startIso)
    if (Number.isNaN(startMs)) return
    const end = new Date(startMs + durationMin * 60_000).toISOString()
    flat.push({ start: startIso, end })
  }

  const body = data.data ?? data.slots ?? {}
  if (Array.isArray(body)) {
    for (const s of body) pushFromSlot(s)
  } else {
    for (const day of Object.keys(body).sort()) {
      const slots = body[day]
      if (!Array.isArray(slots)) continue
      for (const s of slots) pushFromSlot(s)
    }
  }

  flat.sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
  return flat.slice(0, limit)
}

/* ------------------------------------------------------------------ */
/* Booking                                                            */
/* ------------------------------------------------------------------ */

export async function bookMeeting(params: {
  kind: MeetingKind
  /** ISO-8601 start — må være en slot returnert fra getAvailableSlots. */
  start: string
  attendee: Attendee
  /** Valgfri notat/agenda som vises i Cal.com-invitasjonen. */
  notes?: string
  /** Vilkårlig metadata — landes i Cal.com-bookingen (t.d. "source: chat" eller "source: vapi"). */
  metadata?: Record<string, string | number | boolean>
}): Promise<BookingResult> {
  const { kind, start, attendee, notes, metadata } = params
  const eventTypeId = eventTypeIdFor(kind)
  const durationMin = kind === "demo_30min" ? 30 : 15

  const startMs = Date.parse(start)
  if (Number.isNaN(startMs)) {
    throw new CalcomError(`Ugyldig start-tid: ${start}`, 400)
  }
  // Fallback-end hvis Cal.com ikke sender det tilbake (de gjør det nesten alltid)
  const computedEnd = new Date(startMs + durationMin * 60_000).toISOString()

  // Cal.com v2 booking-respons:
  // { status: "success", data: { id, uid, status, startTime, endTime, meetingUrl, attendees, ... } }
  type CalBookingData = {
    id?: number | string
    uid?: string
    startTime?: string
    endTime?: string
    start?: string
    end?: string
    rescheduleUid?: string
    rescheduleUrl?: string
    cancelUrl?: string
    meetingUrl?: string
    location?: string
  }
  type CalBookingResponse = CalBookingData & {
    status?: string
    booking?: CalBookingData
    data?: CalBookingData
  }

  // v2 body-format — `attendee` som objekt, ikke `responses`.
  // Notes sendes som `bookingFieldsResponses.notes` hvis til stede.
  const body: Record<string, unknown> = {
    start,
    eventTypeId,
    attendee: {
      name: attendee.name,
      email: attendee.email,
      timeZone: attendee.timeZone || DEFAULT_TZ,
      language: attendee.language || "no",
      ...(attendee.phone ? { phoneNumber: attendee.phone } : {}),
    },
  }
  if (metadata) body.metadata = metadata
  if (notes) body.bookingFieldsResponses = { notes }

  const res = await calFetch<CalBookingResponse>("/bookings", {
    method: "POST",
    version: BOOKINGS_API_VERSION,
    body: JSON.stringify(body),
  })

  const d: CalBookingData = res.data || res.booking || (res as CalBookingData)
  const bookingId = d.uid || d.id
  if (!bookingId) {
    throw new CalcomError("Cal.com-svaret manglet booking-id", 502, res)
  }

  return {
    bookingId,
    start: d.startTime || d.start || start,
    end: d.endTime || d.end || computedEnd,
    manageUrl: d.rescheduleUrl,
    meetingUrl: d.meetingUrl || d.location,
  }
}

/* ------------------------------------------------------------------ */
/* Lookup, reschedule, cancel                                         */
/* ------------------------------------------------------------------ */

export type BookingSummary = {
  uid: string
  /** Kun satt hvis Cal.com returnerer numerisk id også */
  id?: number | string
  start: string
  end: string
  status?: string
  title?: string
  eventTypeId?: number
  meetingUrl?: string
  attendeeEmail?: string
  attendeeName?: string
}

/**
 * Slår opp kommende bookinger på en e-post. Vi filtrerer også i JS
 * (status=upcoming + attendee-match) siden Cal.com v2 har hatt
 * inconsistent filter-støtte over tid.
 */
export async function listUpcomingBookings(params: {
  email: string
  /** Maks antall å returnere. Default 5. */
  limit?: number
}): Promise<BookingSummary[]> {
  const { email, limit = 5 } = params
  const emailLower = email.trim().toLowerCase()

  type CalBookingRaw = {
    id?: number | string
    uid?: string
    start?: string
    end?: string
    startTime?: string
    endTime?: string
    status?: string
    title?: string
    eventTypeId?: number
    meetingUrl?: string
    location?: string
    attendees?: Array<{ email?: string; name?: string }>
  }
  type CalListResponse = {
    status?: string
    data?: CalBookingRaw[] | { bookings?: CalBookingRaw[] }
    bookings?: CalBookingRaw[]
  }

  const res = await calFetch<CalListResponse>("/bookings", {
    method: "GET",
    version: BOOKINGS_API_VERSION,
    query: {
      attendeeEmail: email,
      status: "upcoming",
      take: limit * 4, // hent litt mer siden vi filtrerer i JS også
    },
  })

  let raw: CalBookingRaw[] = []
  if (Array.isArray(res.data)) raw = res.data
  else if (res.data && Array.isArray((res.data as { bookings?: CalBookingRaw[] }).bookings))
    raw = (res.data as { bookings?: CalBookingRaw[] }).bookings || []
  else if (Array.isArray(res.bookings)) raw = res.bookings

  const nowMs = Date.now()
  const out: BookingSummary[] = []
  for (const b of raw) {
    const uid = b.uid || (b.id != null ? String(b.id) : undefined)
    if (!uid) continue
    const start = b.start || b.startTime
    const end = b.end || b.endTime
    if (!start || !end) continue
    if (Date.parse(start) < nowMs - 60_000) continue // kun fremtidige
    const status = (b.status || "").toLowerCase()
    if (status && status !== "accepted" && status !== "pending" && status !== "upcoming")
      continue
    const attendeeMatch = (b.attendees || []).find(
      (a) => (a.email || "").toLowerCase() === emailLower,
    )
    // Aksepter også hvis Cal.com allerede filtrerte på attendee (ingen `attendees` i respons)
    if (b.attendees && b.attendees.length && !attendeeMatch) continue
    out.push({
      uid,
      id: b.id,
      start,
      end,
      status: b.status,
      title: b.title,
      eventTypeId: b.eventTypeId,
      meetingUrl: b.meetingUrl || b.location,
      attendeeEmail: attendeeMatch?.email || email,
      attendeeName: attendeeMatch?.name,
    })
  }
  out.sort((a, b) => Date.parse(a.start) - Date.parse(b.start))
  return out.slice(0, limit)
}

/**
 * Flytter en eksisterende booking til et nytt start-tidspunkt. Cal.com
 * oppretter en NY booking (nytt uid) og avslutter den gamle — derfor
 * returnerer vi både ny og gammel uid.
 */
export async function rescheduleBooking(params: {
  bookingUid: string
  /** Ny start (ISO) — må være en slot returnert fra getAvailableSlots. */
  start: string
  /** Valgfri begrunnelse til verten. */
  reason?: string
  /** IANA timezone (default Europe/Oslo). */
  timeZone?: string
}): Promise<BookingResult & { previousUid: string }> {
  const { bookingUid, start, reason, timeZone } = params
  const startMs = Date.parse(start)
  if (Number.isNaN(startMs)) {
    throw new CalcomError(`Ugyldig start-tid: ${start}`, 400)
  }

  type CalBookingData = {
    id?: number | string
    uid?: string
    startTime?: string
    endTime?: string
    start?: string
    end?: string
    rescheduleUrl?: string
    meetingUrl?: string
    location?: string
  }
  type CalBookingResponse = CalBookingData & {
    status?: string
    data?: CalBookingData
  }

  const body: Record<string, unknown> = {
    start,
    ...(reason ? { reschedulingReason: reason } : {}),
    ...(timeZone ? { rescheduledBy: { timeZone } } : {}),
  }

  const res = await calFetch<CalBookingResponse>(
    `/bookings/${encodeURIComponent(bookingUid)}/reschedule`,
    {
      method: "POST",
      version: BOOKINGS_API_VERSION,
      body: JSON.stringify(body),
    },
  )

  const d: CalBookingData = res.data || (res as CalBookingData)
  const newUid = d.uid || (d.id != null ? String(d.id) : undefined)
  if (!newUid) {
    throw new CalcomError("Cal.com-svaret manglet ny booking-uid", 502, res)
  }
  return {
    bookingId: newUid,
    previousUid: bookingUid,
    start: d.startTime || d.start || start,
    end: d.endTime || d.end || start,
    manageUrl: d.rescheduleUrl,
    meetingUrl: d.meetingUrl || d.location,
  }
}

/**
 * Avbestiller en booking. Cal.com sender automatisk cancel-e-post
 * til både vert og gjester.
 */
export async function cancelBooking(params: {
  bookingUid: string
  reason?: string
}): Promise<{ uid: string; status: string }> {
  const { bookingUid, reason } = params

  type CalCancelResponse = {
    status?: string
    data?: { status?: string; uid?: string }
  }

  const body = reason ? { cancellationReason: reason } : {}

  const res = await calFetch<CalCancelResponse>(
    `/bookings/${encodeURIComponent(bookingUid)}/cancel`,
    {
      method: "POST",
      version: BOOKINGS_API_VERSION,
      body: JSON.stringify(body),
    },
  )

  return {
    uid: res.data?.uid || bookingUid,
    status: res.data?.status || res.status || "cancelled",
  }
}

/* ------------------------------------------------------------------ */
/* Formatering til samtale                                            */
/* ------------------------------------------------------------------ */

const NORSK_UKEDAGER = [
  "søndag",
  "mandag",
  "tirsdag",
  "onsdag",
  "torsdag",
  "fredag",
  "lørdag",
]
const NORSK_MANEDER = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
]

/** "torsdag 24. april kl. 14:00" — norsk bokmål, Europe/Oslo-tid. */
export function formatSlotNo(iso: string, timeZone = DEFAULT_TZ): string {
  // Intl gir oss lokaltid i riktig sone.
  const date = new Date(iso)
  const parts = new Intl.DateTimeFormat("nb-NO", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date)

  const get = (t: string) => parts.find((p) => p.type === t)?.value || ""
  return `${get("weekday")} ${get("day")}. ${get("month")} kl. ${get("hour")}:${get("minute")}`
}

/** "Thursday, April 24 at 14:00" — engelsk. */
export function formatSlotEn(iso: string, timeZone = DEFAULT_TZ): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

/**
 * Tolker et fritekst-ønske som "torsdag neste uke", "i morgen 14", "24. april kl 10"
 * til et [from, to] ISO-vindu vi kan be Cal.com om ledige tider innenfor.
 *
 * Dette er bevisst romslig — vi ber alltid Cal.com om faktisk tilgjengelighet;
 * parseren her gir bare riktige grenser så vi ikke henter en hel måned når
 * brukeren har sagt "torsdag".
 *
 * Returnerer default (nå → +14 dager) hvis vi ikke forstår noe.
 */
export function parseDateWindow(
  hint: string | undefined,
  now = new Date()
): { from: string; to: string } {
  const start = new Date(now)
  start.setSeconds(0, 0)
  // Default: fra nå (rundet opp til neste time) til +14 dager.
  start.setMinutes(0)
  start.setHours(start.getHours() + 1)
  const defaultTo = new Date(start.getTime() + 14 * 24 * 60 * 60_000)

  if (!hint) {
    return { from: start.toISOString(), to: defaultTo.toISOString() }
  }
  const h = hint.toLowerCase()

  const WEEKDAYS: Record<string, number> = {
    søndag: 0, sondag: 0, sunday: 0,
    mandag: 1, monday: 1,
    tirsdag: 2, tuesday: 2,
    onsdag: 3, wednesday: 3,
    torsdag: 4, thursday: 4,
    fredag: 5, friday: 5,
    lørdag: 6, lordag: 6, saturday: 6,
  }

  const isNextWeek = /neste uke|next week/.test(h)
  const isTomorrow = /i morgen|tomorrow/.test(h)
  const isToday = /(?:^|\s)(i dag|today)\b/.test(h) && !isTomorrow
  const weekdayMatch = Object.keys(WEEKDAYS).find((w) =>
    new RegExp(`\\b${w}\\b`).test(h)
  )

  // "om 2 uker" / "om 3 dager" / "in 2 weeks" / "in 3 days" — relativ forskyvning
  let relativeOffsetDays: number | null = null
  const weeksMatch = h.match(/\bom\s+(\d+)\s+uker?\b|\bin\s+(\d+)\s+weeks?\b/)
  if (weeksMatch) {
    const n = parseInt(weeksMatch[1] ?? weeksMatch[2], 10)
    if (!Number.isNaN(n) && n >= 1 && n <= 12) relativeOffsetDays = n * 7
  }
  if (relativeOffsetDays === null) {
    const daysMatch = h.match(/\bom\s+(\d+)\s+dager?\b|\bin\s+(\d+)\s+days?\b/)
    if (daysMatch) {
      const n = parseInt(daysMatch[1] ?? daysMatch[2], 10)
      if (!Number.isNaN(n) && n >= 1 && n <= 90) relativeOffsetDays = n
    }
  }

  // Eksplisitte datoer — "2. mai", "den 2 mai", "2 mai", "May 2", "2/5", "2.5"
  const MONTHS_NO: Record<string, number> = {
    januar: 0, februar: 1, mars: 2, april: 3, mai: 4, juni: 5,
    juli: 6, august: 7, september: 8, oktober: 9, november: 10, desember: 11,
    january: 0, february: 1, march: 2, may: 4, june: 5,
    july: 6, october: 9, december: 11,
  }
  let explicitDate: Date | null = null
  // "2. mai" / "den 2 mai" / "2 mai" — dag før månedsnavn
  const dmMatch = h.match(/\b(\d{1,2})\.?\s+(januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember|january|february|march|april|may|june|july|august|september|october|november|december)\b/)
  if (dmMatch) {
    const day = parseInt(dmMatch[1], 10)
    const month = MONTHS_NO[dmMatch[2]]
    if (day >= 1 && day <= 31 && month !== undefined) {
      const candidate = new Date(start)
      candidate.setMonth(month, day)
      candidate.setHours(0, 0, 0, 0)
      // hvis datoen er i fortid, hopp til neste år
      if (candidate.getTime() < start.getTime() - 24 * 3600_000) {
        candidate.setFullYear(candidate.getFullYear() + 1)
      }
      explicitDate = candidate
    }
  }
  // "May 2" — månedsnavn før dag (engelsk)
  if (!explicitDate) {
    const mdMatch = h.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})\b/)
    if (mdMatch) {
      const month = MONTHS_NO[mdMatch[1]]
      const day = parseInt(mdMatch[2], 10)
      if (day >= 1 && day <= 31 && month !== undefined) {
        const candidate = new Date(start)
        candidate.setMonth(month, day)
        candidate.setHours(0, 0, 0, 0)
        if (candidate.getTime() < start.getTime() - 24 * 3600_000) {
          candidate.setFullYear(candidate.getFullYear() + 1)
        }
        explicitDate = candidate
      }
    }
  }
  // "2/5" eller "2.5" — dag/måned i norsk format
  if (!explicitDate) {
    const numMatch = h.match(/\b(\d{1,2})[./](\d{1,2})\b/)
    if (numMatch) {
      const day = parseInt(numMatch[1], 10)
      const month = parseInt(numMatch[2], 10) - 1
      if (day >= 1 && day <= 31 && month >= 0 && month <= 11) {
        const candidate = new Date(start)
        candidate.setMonth(month, day)
        candidate.setHours(0, 0, 0, 0)
        if (candidate.getTime() < start.getTime() - 24 * 3600_000) {
          candidate.setFullYear(candidate.getFullYear() + 1)
        }
        explicitDate = candidate
      }
    }
  }

  let from = new Date(start)
  let to: Date

  if (explicitDate) {
    // Smalt vindu rundt den konkrete datoen — 1 dag 08:00–20:00
    from = new Date(explicitDate)
    from.setHours(8, 0, 0, 0)
    to = new Date(explicitDate)
    to.setHours(20, 0, 0, 0)
  } else if (relativeOffsetDays !== null) {
    // "om 2 uker" / "om 3 dager" — åpne et 7-dagers vindu fra mål-dagen
    // (tåler litt slingring i intensjonen: gir flere valg rundt ønsket uke).
    const target = new Date(start)
    target.setDate(target.getDate() + relativeOffsetDays)
    target.setHours(8, 0, 0, 0)
    from = target
    to = new Date(target)
    to.setDate(to.getDate() + 7)
    to.setHours(20, 0, 0, 0)
  } else if (isTomorrow) {
    from = new Date(start)
    from.setDate(from.getDate() + 1)
    from.setHours(8, 0, 0, 0)
    to = new Date(from)
    to.setHours(20, 0, 0, 0)
  } else if (isToday) {
    from = new Date(start)
    from.setHours(Math.max(from.getHours(), 9), 0, 0, 0)
    to = new Date(from)
    to.setHours(20, 0, 0, 0)
  } else if (weekdayMatch) {
    const target = WEEKDAYS[weekdayMatch]
    const d = new Date(start)
    const currentDow = d.getDay()
    let delta = (target - currentDow + 7) % 7
    if (delta === 0) delta = 7 // "torsdag" = neste torsdag hvis i dag er torsdag
    if (isNextWeek) delta += 7
    d.setDate(d.getDate() + delta)
    d.setHours(8, 0, 0, 0)
    from = d
    to = new Date(d)
    to.setHours(20, 0, 0, 0)
  } else if (isNextWeek) {
    // "Neste uke" = nærmeste kommende mandag. Søn → i morgen; ellers 8 - dow.
    // (Gammel formel (1 - dow + 7) % 7 + 7 hoppet feilaktig 2 uker frem når det
    //  allerede var en kommende mandag samme uke — f.eks. Lør → 9 dager.)
    const d = new Date(start)
    const currentDow = d.getDay()
    const daysToNextMonday = currentDow === 0 ? 1 : 8 - currentDow
    d.setDate(d.getDate() + daysToNextMonday)
    d.setHours(8, 0, 0, 0)
    from = d
    to = new Date(d)
    to.setDate(to.getDate() + 5) // man–fre
    to.setHours(20, 0, 0, 0)
  } else {
    to = defaultTo
  }

  return { from: from.toISOString(), to: to.toISOString() }
}

// re-export for ergonomi
export { NORSK_UKEDAGER, NORSK_MANEDER, DEFAULT_TZ }
