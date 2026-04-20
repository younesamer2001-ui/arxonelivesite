# Variables Schema

Dette er kontrakten hver nisjes `variables.md` må følge. Skjelettet i
`skeleton-system-prompt.md` forventer at alle disse feltene er fylt inn før
vi kan generere en gyldig `vapi-config.json`.

---

## Filformat

Hver nisjes `variables.md` er en Markdown-fil med YAML-frontmatter + prosa-seksjoner
der det kreves. Frontmatter-delen leses av build-scriptet. Prosa-seksjoner
som `in_scope_bullets` og lignende hentes via seksjonsheadere.

Grunnskjelett:

```markdown
---
schema_version: "1.0.0"
agent_name: "Lisa"
agent_key: "lisa"
business_name: "Helseklinikken AS"
primary_language: "nb-NO"
primary_language_label: "Norwegian Bokmål"
persona_traits: "warm, calm, patient, empathetic"
tone_description: "reassuring, slightly slower pace, professional"
speaking_speed_hint: "slightly below default"
industry_short_description: "medical clinic"
location: "Grünerløkka, Oslo"

opening_hours_prose: "mandag–fredag 08:00–17:00, lørdag 10:00–14:00, søndag stengt"

max_qualification_questions: 3

# Voice settings
voice_provider: "azure"
voice_id: "nb-NO-PernilleNeural"
voice_provider_fallback: "playht"
voice_id_fallback: "charlotte"
voice_style_ssml: '<prosody rate="-5%" pitch="+2%">'

# Transcriber settings
transcriber_primary: "azure"
transcriber_primary_language: "nb-NO"
transcriber_custom_endpoint_id: null
transcriber_fallback: "deepgram"
transcriber_fallback_model: "nova-3"
endpointing_ms: 550
response_delay_seconds: 0.7
voice_activity_threshold: 0.4

# LLM
llm_model: "gpt-4o"
llm_temperature: 0.4
max_duration_seconds: 480  # 8 min, safety ceiling

# Knowledge base
knowledge_file_id: "file_lisa_helse_faq_v1"
knowledge_topics: "priser, behandlinger, åpningstider, forsikringsdekning, parkering"

# First message (disclosure + recording)
first_message: "Hei, du har ringt Helseklinikken. Jeg heter Lisa og er en AI-resepsjonist. Samtalen kan bli tatt opp for kvalitets- og opplæringsformål. Hva kan jeg hjelpe deg med?"

# Transfer / bemanning
transfer_primary_number: "92000001"
transfer_secondary_number: "92000002"
transfer_working_hours: "08:00-17:00"
transfer_weekend_hours: "10:00-14:00"

# Fallback numbers
emergency_numbers:
  fire: "110"
  medical: "113"
  police: "112"

# Emergency handling
emergency_keywords: "brystsmerter, pustebesvær, bevisstløs, kramper, blødning, slag, hjerte"
emergency_script: "Dette høres alvorlig ut — ring 113 nå. Jeg legger på så linja er fri. Etter du har snakket med dem, ring oss tilbake hvis du trenger hjelp til videre oppfølging."

# Warranty / policy
warranty_policy: null  # kun relevant for Max/Ella
warranty_max_days: null

# PII extra blocks
pii_extra_blocklist: "detaljerte medisinske symptomer utover det som er nødvendig for å plassere henvendelsen"

# Proof points for converting calls
key_differentiator: "Samme dag-timer hos våre spesialister"
proof_points:
  - "Over 20 spesialister under samme tak"
  - "Avtaler med HELFO og Gjensidige forsikring"

# Tools aktivert for denne nisjen
enabled_tools:
  - query_company_knowledge
  - book_appointment
  - check_availability
  - create_ticket
  - send_sms_booking_link
  - send_sms_quote_summary
  - stop_recording
  - transferCall
  - endCall
---

## business_one_paragraph_summary

Helseklinikken AS er en allmenn- og spesialistklinikk på Grünerløkka med
fastleger, fysioterapeuter, psykologer og enkelte spesialister. Vi tar imot
både nye og eksisterende pasienter, og samarbeider med HELFO og flere
forsikringsselskaper.

## in_scope_bullets

- Booking, endring og kansellering av time
- Generelle spørsmål om åpningstider, adresse, parkering
- Informasjon om våre tjenester og priser
- Spørsmål om forsikringsdekning og refusjon
- Ta imot beskjed til behandler
- Henvise akutte medisinske behov til 113

## out_of_scope_bullets

- Konkrete medisinske råd eller diagnoser
- Journalinnhold eller prøvesvar (må hentes av pasienten via Helsenorge)
- Reseptfornyelser (sendes via fastlege-flyt på Helsenorge)
- Forsikringssaker utover vår rolle (disse går til forsikringsselskap direkte)

## out_of_scope_advice_bullets

- Medisinske diagnoser eller behandlingsanbefalinger
- Tolking av prøvesvar eller bilder
- Legemiddel-doser eller interaksjoner

## qualification_questions_bulleted

- "Hva gjelder det — er det en plage som haster, eller noe som kan planlegges?"
- "Er det en spesiell behandler du vil til, eller er du åpen for hvem som er ledig?"
- "Har du forsikring eller HELFO-dekning som er relevant?"

## niche_specific_rules

- Hvis pasienten beskriver symptomer som matcher `emergency_keywords`, gå
  umiddelbart til emergency_script — ikke fortsett booking-flyt.
- Hvis pasient oppgir helseopplysninger som ikke er nødvendig for booking,
  ikke bekreft tilbake (f.eks. diagnoser). Si "notert, jeg videreformidler
  til behandler" og gå videre.
- Refusjon/egenandel: ikke oppgi konkrete beløp — si "egenandel varierer,
  du får beskjed i resepsjonen". Unntak: hvis KB inneholder eksakte satser
  for aktuell behandling.
- Fastlegeordning-henvendelser: Hvis noen spør om å bytte fastlege, forklar
  at det gjøres via Helsenorge.no — ikke ta imot bytte-forespørsel direkte.
```

---

## Påkrevde felter — full liste

Alle feltene under MÅ finnes, enten i frontmatter eller som seksjon. Build-script
feiler hvis noe mangler.

### Frontmatter (YAML)

| Felt | Type | Obligatorisk | Validering |
| --- | --- | --- | --- |
| `schema_version` | string | ja | "1.0.0" (må matche denne dokumentets versjon) |
| `agent_name` | string | ja | 2–20 tegn |
| `agent_key` | string | ja | lowercase, matcher `[a-z-]+` |
| `business_name` | string | ja | |
| `primary_language` | enum | ja | `nb-NO`, `nn-NO`, `en-US` |
| `primary_language_label` | string | ja | Human-readable for prompt |
| `persona_traits` | string | ja | 3–5 adjektiver |
| `tone_description` | string | ja | |
| `speaking_speed_hint` | string | ja | |
| `industry_short_description` | string | ja | |
| `location` | string | ja | |
| `opening_hours_prose` | string | ja | Prose-format, ikke kun tid |
| `max_qualification_questions` | int | ja | 1–5 |
| `voice_provider` | enum | ja | `azure`, `elevenlabs`, `playht`, `cartesia` |
| `voice_id` | string | ja | |
| `voice_provider_fallback` | enum | ja | samme enum som over |
| `voice_id_fallback` | string | ja | |
| `voice_style_ssml` | string \| null | nei | |
| `transcriber_primary` | enum | ja | `azure`, `deepgram`, `google`, `talkscriber` |
| `transcriber_primary_language` | string | ja | |
| `transcriber_custom_endpoint_id` | string \| null | nei | Azure Custom Speech |
| `transcriber_fallback` | enum | ja | |
| `transcriber_fallback_model` | string | ja | |
| `endpointing_ms` | int | ja | 300–800 |
| `response_delay_seconds` | float | ja | 0.3–1.2 |
| `voice_activity_threshold` | float | ja | 0.2–0.7 |
| `llm_model` | string | ja | `gpt-4o-mini`, `gpt-4o`, `claude-haiku-4-5` |
| `llm_temperature` | float | ja | 0.0–1.0 |
| `max_duration_seconds` | int | ja | 120–900 |
| `knowledge_file_id` | string \| null | nei | |
| `knowledge_topics` | string | nei | Komma-separert |
| `first_message` | string | ja | Må inneholde ordet "AI" for disclosure |
| `transfer_primary_number` | string | ja | E.164 uten `+` |
| `transfer_secondary_number` | string | ja | |
| `transfer_working_hours` | string | ja | `"HH:MM-HH:MM"` |
| `transfer_weekend_hours` | string \| null | nei | |
| `emergency_numbers` | object | ja | Må inkludere `fire`, `medical`, `police` |
| `emergency_keywords` | string | ja | Komma-separert liste |
| `emergency_script` | string | ja | |
| `warranty_policy` | string \| null | nei | Ella/Max bruker |
| `warranty_max_days` | int \| null | nei | |
| `pii_extra_blocklist` | string | ja | Kan være tom streng |
| `key_differentiator` | string | ja | |
| `proof_points` | array | ja | 1–4 entries |
| `enabled_tools` | array | ja | Minst `transferCall`, `endCall`, `create_ticket` |

### Seksjoner (prosa)

| Seksjon | Minimum innhold |
| --- | --- |
| `business_one_paragraph_summary` | 2–4 setninger |
| `in_scope_bullets` | 4–7 bullet-points |
| `out_of_scope_bullets` | 3–5 bullet-points |
| `out_of_scope_advice_bullets` | 2–4 bullet-points |
| `qualification_questions_bulleted` | Nøyaktig `max_qualification_questions` bullets |
| `niche_specific_rules` | 3–10 konkrete regler |

---

## Valideringsregler (build-script)

Disse skal sjekkes før vapi-config.json genereres:

1. **Disclosure i firstMessage**: må inneholde "AI" eller "kunstig" (case-insensitive).
2. **Opptaks-disclosure**: hvis recording_enabled==true (default), firstMessage
   må nevne "tatt opp" eller "recorded".
3. **Emergency_keywords og emergency_script**: må begge eksistere sammen, eller
   begge være null (null kun for nisjer uten akutt-scenarier — ingen pr. 2026-04-18).
4. **Language match**: `primary_language` må matche `transcriber_primary_language`.
5. **Voice + language match**: `voice_id` må støtte `primary_language`.
   Eksempel: `nb-NO-PernilleNeural` + `nb-NO` ✓, `en-US-JennyNeural` + `nb-NO` ✗.
6. **Enabled_tools**: må inneholde minst `transferCall`, `endCall`, `create_ticket`.
7. **Qualification questions count**: antall bullets i `qualification_questions_bulleted`
   må matche `max_qualification_questions`.
8. **PII guards**: `pii_extra_blocklist` må ikke være null (tom streng er OK).

Build-scriptet (`voiceagents/build/compile.ts` — fase 1b) er en enkel Node-
script som kjører disse sjekkene, fletter skjelettet og outputter
`vapi-config.json`.

---

## Eksempel på variabel-rendering i skjelettet

Når skjelettet møter `{{in_scope_bullets}}`, erstattes det med bullets fra
nisjens seksjon. For Lisa:

```
You ONLY help with the following:
- Booking, endring og kansellering av time
- Generelle spørsmål om åpningstider, adresse, parkering
- Informasjon om våre tjenester og priser
- Spørsmål om forsikringsdekning og refusjon
- Ta imot beskjed til behandler
- Henvise akutte medisinske behov til 113
```

Liste-format bevares siden bullets er del av input.

For scalarfelt som `{{business_name}}` er det ren tekst-erstatning.

For objekt-felt som `{{emergency_numbers}}` renderer build-scriptet dem som
prosa: "Nødnummer: brann 110, medisinsk 113, politi 112."

---

## Migrasjoner

Hvis vi endrer denne skjemaet:

1. Bump `schema_version` i dette dokumentet (f.eks. 1.0.0 → 1.1.0).
2. Oppdater alle tre nisjers `variables.md` til ny versjon.
3. Legg inn migrasjon i `voiceagents/CHANGELOG.md` (ikke opprettet ennå).
4. Kjør build-script mot alle tre — hvis noen feiler, fiks før commit.

Majorløft (1.x → 2.0) krever også oppdatering av `skeleton-system-prompt.md`.

---

## Referanser

- `skeleton-system-prompt.md` — hvor variablene brukes.
- `tools-katalog.md` — detaljer for `enabled_tools`.
- `PRINSIPPER.md §Regel 6` — disclosure-krav til firstMessage.
- `research/02-norsk-transkribering.md` — hvorfor endpointing=550 for Lisa.
- `research/07-disclosure-og-samtykke.md` — valideringsreglene.
