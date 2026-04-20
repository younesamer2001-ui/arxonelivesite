# Vapi-kapabiliteter — hva kan plattformen faktisk gjøre?

Dette dokumentet er den tekniske inventaroversikten. Før vi skriver en scenario-fil
eller system prompt, må vi vite hvilke byggeklosser vi har tilgjengelig. Hver
kapabilitet beskrives med: *hva den gjør*, *når den brukes*, *når den ikke skal brukes*,
og *kjente fallgruver*.

> Kilder: Vapi Docs (docs.vapi.ai), SDK-versjon `@vapi-ai/web@2.2.0` installert i dette
> prosjektet, samt egen testing. Oppdater ved vesentlige API-endringer.

---

## 1. Stacken i korte trekk

En Vapi-assistant er en orkestrering av fire lag:

```
┌──────────────────────────────────────────────────────┐
│  Telefoni / WebRTC (inn- og ut-strøm av lyd)          │
├──────────────────────────────────────────────────────┤
│  Transcriber (STT) ── Deepgram / Azure / Gladia …     │
├──────────────────────────────────────────────────────┤
│  Model (LLM) ── OpenAI / Anthropic / Groq / Custom    │
├──────────────────────────────────────────────────────┤
│  Voice (TTS) ── ElevenLabs / Azure / Cartesia …       │
└──────────────────────────────────────────────────────┘
```

Alle fire lag konfigureres per assistant. Å bytte STT eller TTS er ett
API-kall — gjør det gjerne under A/B-testing.

## 2. Viktige konsept

### 2.1 First message
Første replikk assistenten sier når samtalen kobles opp. *Skal alltid være statisk
eller lett personalisert* (f.eks. via `{{customer_name}}`), aldri generert av LLM
ved start — det gir 1–3 sekunder ekstra latens som høres ut som "død linje".

```json
"firstMessage": "Hei, du har ringt klinikken. Jeg heter Lisa — hva kan jeg hjelpe deg med?"
```

### 2.2 System prompt
Instruksjonen som styrer LLM-ens oppførsel gjennom hele samtalen. Leses én gang ved
start, refereres hver LLM-turn. Se `shared/system-prompt-template.md` for mal.

### 2.3 Tools (function calling)
LLM-en kan påkalle definerte funksjoner midt i samtalen. Vapi støtter:

- **Custom tools** (HTTP webhook til vår backend)
- **Transfer call** (overføre til menneske/annet nummer)
- **End call** (avslutt samtalen kontrollert)
- **DTMF** (sende tastetoner, f.eks. ved IVR)

Tool-kall er ca **300–800 ms** ekstra latens. Bruk dem når det *virkelig* trengs
(sjekk ledige tider i kalender, opprett support-ticket), ikke for rent informasjons-
oppslag som heller kan ligge i knowledge base.

### 2.4 Knowledge base
RAG-lag hvor du kan laste opp PDF/MD/TXT. LLM-en får relevante utdrag injisert i
konteksten ved behov. Krever `provider: "trieve"` eller egen embedding-endpoint.
Perfekt for prisliste, behandlingsinfo, åpningstider som endrer seg ofte.

> **Fallgruve**: Knowledge base er *treg* (1–2 s ekstra ved første treff). Ikke
> bruk den til ting som må være instant — gjør heller statiske svar i system prompt.

### 2.5 Analysis plan
Post-call-analyse. Vapi kjører en avsluttende LLM-kall som genererer:

- Strukturert sammendrag
- Boolean "vellykket" / "trenger oppfølging"
- Utvunne variabler (`customer_name`, `preferred_time`, `car_reg_plate`, …)

Disse pushes til webhook og kan gå rett inn i CRM.

### 2.6 Voicemail detection
Hører etter "hei dette er X, legg igjen beskjed etter pipetonen". Kan da enten
legge igjen forhåndsinnspilt beskjed, eller avslutte stille. Kun relevant for
outbound — vi ignorerer dette i Fase 1.

### 2.7 Server URL / webhooks
Hver assistant kan peke på en server-URL som mottar events:

- `function-call` — LLM kalte en tool → du må returnere resultat
- `status-update` — in-progress / ended / failed
- `end-of-call-report` — full transkript + analyse
- `speech-update` — hver replikk (både user og assistant)
- `hang` — samtalen henger, assistenten har vært stille for lenge

Vi skal ha **én server URL per miljø** (`/api/vapi/webhook`) som ruter videre basert
på `assistant.id`.

## 3. Tools vi kommer til å bruke

### 3.1 `book_appointment`
Slå opp ledige tider og book når kunden bekrefter.

```json
{
  "type": "function",
  "function": {
    "name": "book_appointment",
    "description": "Reserver en tid i kalenderen når kunden har bekreftet dato, klokkeslett og tjeneste. Ikke kall denne før kunden tydelig har sagt ja til en spesifikk tid.",
    "parameters": {
      "type": "object",
      "properties": {
        "service": {"type": "string", "description": "Tjenesten kunden bestiller, f.eks. 'EU-kontroll' eller 'timebooking'."},
        "date": {"type": "string", "description": "ISO-dato: 2026-04-25"},
        "time": {"type": "string", "description": "HH:MM, 24h"},
        "customer_name": {"type": "string"},
        "customer_phone": {"type": "string", "description": "E.164, +47…"},
        "notes": {"type": "string", "description": "Fri tekst, f.eks. 'Bringer med sommerdekk'."}
      },
      "required": ["service", "date", "time", "customer_name", "customer_phone"]
    }
  },
  "async": false
}
```

### 3.2 `check_availability`
Sjekker ledige tider uten å bestille.

```json
{
  "type": "function",
  "function": {
    "name": "check_availability",
    "description": "Returner 3-5 ledige tider som matcher kundens preferanse. Bruk denne før book_appointment.",
    "parameters": {
      "type": "object",
      "properties": {
        "service": {"type": "string"},
        "preferred_date": {"type": "string", "description": "ISO-dato, valgfritt"},
        "preferred_time_of_day": {"type": "string", "enum": ["morgen", "formiddag", "ettermiddag", "kveld", "uansett"]}
      },
      "required": ["service"]
    }
  }
}
```

### 3.3 `get_quote`
Genererer prisestimat. Krever at kunden har gitt nok info.

```json
{
  "type": "function",
  "function": {
    "name": "get_quote",
    "description": "Beregn prisestimat basert på tjeneste og parametre. Ikke kall denne før du har samlet inn alle nødvendige felter for den spesifikke tjenesten.",
    "parameters": {
      "type": "object",
      "properties": {
        "service_code": {"type": "string"},
        "parameters": {"type": "object", "description": "Nisje-spesifikke felter."}
      },
      "required": ["service_code", "parameters"]
    }
  }
}
```

### 3.4 `create_ticket`
Oppretter support-ticket eller lead i CRM. Brukes særlig for klager, tapt utstyr,
eller leads som trenger menneskelig oppfølging.

```json
{
  "type": "function",
  "function": {
    "name": "create_ticket",
    "description": "Opprett en support-sak eller oppfølgings-lead. Bruk ALLTID denne for klager, påstand om tapt eiendel, eller saker som krever menneskelig oppfølging.",
    "parameters": {
      "type": "object",
      "properties": {
        "type": {"type": "string", "enum": ["klage", "tapt_eiendel", "lead", "info"]},
        "urgency": {"type": "string", "enum": ["lav", "medium", "høy", "kritisk"]},
        "summary": {"type": "string"},
        "customer_name": {"type": "string"},
        "customer_phone": {"type": "string"},
        "customer_email": {"type": "string"}
      },
      "required": ["type", "urgency", "summary", "customer_name", "customer_phone"]
    }
  }
}
```

### 3.5 `transferCall` (Vapi built-in)
Overfør til menneske. Bruk for:

- Kunden ber eksplisitt om å snakke med et menneske
- Klage eskaleres (urgency ≥ høy)
- Assistent er usikker tre ganger på rad

```json
{
  "type": "transferCall",
  "destinations": [{
    "type": "number",
    "number": "+4791234567",
    "message": "Jeg setter deg over til en kollega. Bare et øyeblikk."
  }]
}
```

### 3.6 `endCall` (Vapi built-in)
Lar LLM-en avslutte samtalen kontrollert. Må brukes når:

- Kunden sier "takk, ha det"
- Samtalen er ferdig og vi har gitt avsluttende oppsummering
- Kunden er *veldig* forstyrrende (trusler, hets) — etter én advarsel

## 4. Variabel-interpolasjon

Vapi støtter `{{variable}}` både i `firstMessage` og `systemPrompt`. Variabler sendes
inn ved oppstart:

```js
vapi.start(assistantId, {
  variableValues: {
    customer_name: "Ola",
    business_name: "Klinikk Sentrum"
  }
})
```

Bruk for å personalisere uten å måtte lage én assistant per kunde. Kombiner med
`squadMembers` hvis én kunde skal ha flere spesialiserte agenter.

## 5. Multilingual / språkbytting

Vapi selv har ingen innebygd språkdetektor. Løsning:

1. Sett transcriber til `multi`-modus hvis støttet (Deepgram Nova-3 støtter dette)
2. La LLM-en detektere språket fra innhold og svare i samme språk
3. Gi system prompt en eksplisitt regel:

   > "Detect the language the caller speaks. Default is Norwegian. If the caller
   > clearly speaks English (or says 'speak English'), switch to English and stay
   > in English unless they switch back."

TTS-en må støtte begge språk uten kodebytting — ElevenLabs `eleven_multilingual_v2`
er beste valg. Azure krever to separate voice-valg og svitsjing via SSML `<lang>`.

## 6. Timeout og silence

Vapi har innebygde timers:

- **`silenceTimeoutSeconds`** (default 30) — samtale avsluttes hvis helt stille.
  Sett til 20-25 for demo, 45 for ekte produksjon.
- **`maxDurationSeconds`** (default 600) — hard cap. Sett til 120 for demo, 900 for
  ekte samtaler.
- **`responseDelaySeconds`** (default 0.4) — hvor lenge Vapi venter på at kunden
  skal bli ferdig før LLM svarer. Norsk har lengre tenkepauser enn engelsk —
  **øk til 0.7 for norsk**.
- **`llmRequestDelaySeconds`** (default 0.1) — debounce på LLM-kall ved interim
  transcripts. Ikke rør.
- **`numWordsToInterruptAssistant`** (default 3) — hvor mange ord kunden må si
  for å avbryte assistenten. Sett til 2 så "unnskyld" og "vent" virker.

## 7. Interrupt / barge-in

Når kunden snakker mens assistenten snakker, *må* assistenten umiddelbart stoppe
og lytte. Vapi håndterer dette automatisk, men:

- Ved høy bakgrunnsstøy → false triggers. Sett `backgroundSound: "office"` for
  å maskere stillhet og gjør VAD mindre sensitiv.
- Ved veldig lave stemmer → Vapi hører ikke interrupt. Be kunden "snakke litt høyere"
  hvis dette skjer (sjeldent).

## 8. Recording og transkript

All samtale opptas som default. Transkript er tilgjengelig via
`end-of-call-report`-webhooken og har timestamp per turn. Viktig for:

- Opplæring / finjustering av prompt
- GDPR sletting (kunden kan be om det — vi må lagre `assistantId + callId` slik
  at vi kan slette)
- Revisjon ved klage

**GDPR**: Opptak lagres hos Vapi i USA. For norske helse-kunder (Lisa) må vi bruke
`recordingEnabled: false` eller lagre kun i vår EU-database. Se
`shared/guardrails.md`.

## 9. Modeller vi vurderer

| Provider | Modell | Latens (first-token) | Kostnad / min | Norsk-kvalitet | Kommentar |
|---|---|---|---|---|---|
| OpenAI | gpt-4o-mini | ~300ms | ~$0.02 | God | **Default**. Raskt, billig, forstår norsk godt. |
| OpenAI | gpt-4o | ~600ms | ~$0.15 | Veldig god | Bruk for Lisa (helse) hvor nøyaktighet > kostnad. |
| Anthropic | claude-haiku-4-5 | ~500ms | ~$0.03 | Veldig god | Alternativ. Bedre på nyanser, tregere. |
| Groq | llama-3.3-70b | ~150ms | ~$0.01 | OK | Best latens. Sliter med komplekse norske uttrykk. |

**Anbefaling Fase 1**: `gpt-4o-mini` for alle tre. Bytt til `gpt-4o` for Lisa hvis
vi ser medisinske feiltolkninger i loggene.

## 10. Squads (multi-agent)

Vapi støtter at én samtale overføres mellom flere assistenter. Eksempel: Max
(bilverksted) mottar samtalen, men hvis det gjelder bilpleie i stedet for verksted,
overføres det til en spesialisert "bilpleie"-assistent.

**Beslutning Fase 1**: Vi bruker IKKE squads — én assistant per nisje er nok. Tar
opp igjen i Fase 2 hvis vi ser at Max får for mange ikke-verksted-henvendelser.

## 11. Det som IKKE funker (pr 2026-Q1)

- **Ekte streaming TTS-interrupt** med Cartesia — fungerer på ElevenLabs og Azure.
- **Whispering / flere kunder samtidig** — Vapi håndterer én kanal. Ikke problem for
  oss siden vi alltid er 1-til-1.
- **Native norsk nummerhåndtering** — "tjueto" tolkes ofte som "22" men også som
  "2 to". Vi løser dette i system prompt + regex-sanitering før tool-kall.
- **Emosjonsdetektering** — hadde vært nyttig for klage-routing. Ikke tilgjengelig
  native. Vi må detektere via LLM-klassifikasjon i system prompt.

## 12. Viktige lenker

- https://docs.vapi.ai/assistants — assistant-config
- https://docs.vapi.ai/tools — tool-definisjoner
- https://docs.vapi.ai/squads — squads
- https://docs.vapi.ai/webhook — event-payloads
- https://docs.vapi.ai/voices — stemme-oversikt per provider
