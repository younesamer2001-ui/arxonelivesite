# 08 — Fallback og menneske-overtakelse

Hvordan sikrer vi at ingen kunde blir avvist, "droppet", eller sittende igjen
med en AI som ikke klarer å hjelpe? Dette dokumentet definerer fallback-
hierarkiet, eskalerings-triggere, og hva som skjer når agenten ikke kan
håndtere noe selv.

TL;DR: **Tre-trinns fallback: transfer → ticket+SMS → voicemail. Agenten skal
aldri avslutte en samtale der kunden ikke er «servet».**

---

## 1. Fallback-hierarki (default for alle nisjer)

```
1. transferCall       → ansvarlig, hvis innenfor åpningstid og bemanning
2. createTicket + SMS → "Vi ringer deg tilbake innen X min/timer"
3. voicemail + email  → beskjed til ansvarlig for gjennomgang neste virkedag
```

Hvilket nivå vi lander på avhenger av:
- Tid på døgnet.
- Bemanning (settes manuelt via admin-panel — fase 2, eller statisk tabell i
  `variables.md` i fase 1).
- Type eskalering (akutt vs. generell).

## 2. Fire triggere for menneske-overtakelse

Fra `PRINSIPPER.md §Regel 9`:

| Trigger | Hvordan agenten oppdager det |
| --- | --- |
| **1. Kunden ber direkte** | Transcript-match: "menneske", "ekte person", "la meg snakke med noen", "ikke en robot" |
| **2. Frustrasjon eskalerer** | 3+ avbrytelser, banning, gjentatt "nei, det var ikke det" |
| **3. Scope-brudd** | Kunden spør om noe utenfor agentens kompetanse (se per-nisje-liste) |
| **4. Akutt / sikkerhet** | Nøkkelord: brann, gnist, røyk, støt, anmeldelse |

**Prompt-tekst (i skjelettet):**
```
Eskalér til menneske når:
- Kunden ber om det.
- Kunden uttrykker frustrasjon (banning, gjentatte avbrytelser, klage over
  deg som AI).
- Du blir bedt om noe utenfor {{scope_tight}}.
- Samtalen involverer akutt/sikkerhet (se {{emergency_keywords}}).
```

## 3. transferCall — hvordan det ser ut

Vapi har et `transferCall`-tool. Vi registrerer det per nisje:

```json
{
  "type": "transferCall",
  "destinations": [
    {
      "type": "number",
      "number": "+47{{transfer_primary_number}}",
      "message": "Kobler deg videre til ansvarlig. Et øyeblikk.",
      "description": "Primær ansvarlig for {{bedriftsnavn}}"
    },
    {
      "type": "number",
      "number": "+47{{transfer_secondary_number}}",
      "message": "Kobler deg videre til vår backup. Et øyeblikk.",
      "description": "Sekundær kontaktperson"
    }
  ]
}
```

Per nisje settes:
- `transfer_primary_number`
- `transfer_secondary_number`
- `transfer_working_hours`: `"08:00-17:00"` i `variables.md`.

### Når transfer feiler
Hvis primær ikke svarer innen 20 sekunder → vapi prøver sekundær. Hvis
sekundær heller ikke → fallback til ticket+SMS (neste seksjon).

## 4. createTicket + SMS — trinn 2

Hvis transfer ikke kan gjennomføres (utenfor åpningstid, eller alle ledige
er opptatt), gjør vi følgende:

```
Agent: Alle er opptatt akkurat nå. La meg ta ned det du trenger, så
       ringer vi deg tilbake innen [åpningstid_time] — er det greit?
Kunde: Ja.
Agent: Hva er beskjeden?
Kunde: ...
Agent: Hva er nummeret vi når deg på?
Kunde: 92 84 17 26.
Agent: Takk. Du får en SMS-bekreftelse nå.
       <create_ticket>
       <send_sms_callback_confirmation>
       Er det noe mer?
```

**Tickets har følgende felter:**
- `category` (booking, claim, question, complaint, emergency, other)
- `priority` (low, normal, high, critical)
- `summary` (LLM-generert oppsummering)
- `transcript_excerpt` (relevant del av samtalen)
- `callback_promised_by` (timestamp)
- `customer_phone`
- `customer_name`

**SMS-tekst:**
```
Hei {{navn}}, vi har mottatt henvendelsen din hos {{bedriftsnavn}}.
Vi ringer deg tilbake innen {{callback_hours}}.
Saksnummer: #{{ticket_id}}
```

## 5. Voicemail-fallback — trinn 3

Hvis kunden ringer utenfor åpningstid og ikke vil vente på tilbakeringing:

```
Agent: Vi er stengt akkurat nå. Skal jeg ta imot en beskjed, eller
       vil du heller sende SMS med booking-link så velger du tid selv?
Kunde: Beskjed.
Agent: Snakk etter pipet.
       <record_voicemail>
```

Vapi tar opp, agenten avslutter med:
```
Agent: Takk. Jeg har lagret beskjeden, og [ansvarlig] lytter til den
       første ting i morgen. Ha en fin kveld.
```

Voicemail sendes som e-post til ansvarlig + lagres i ticket som vedlegg.

## 6. Hva kunden IKKE skal oppleve

- **Ingen "blindveier"**: agenten skal aldri si *"Jeg kan ikke hjelpe med det"*
  uten å følge opp med neste steg.
- **Ingen ventefeller**: agenten setter ikke kunden på "hold" i minutter uten
  tilbakemelding.
- **Ingen hengte samtaler**: hvis tool-call feiler og samtalen bryter,
  trigges automatisk tilbakeringing.

**Skjelett-regel:**
```
Hvis du ikke kan hjelpe, foreslå alltid en menneskelig kontakt eller
automatisk oppfølging. Si aldri bare "jeg vet ikke".
```

## 7. Sentiment-basert proaktiv eskalering

Vi bruker sentiment-scoring under samtalen via `analysisPlan.live`. Hvis
sentiment-score faller under **-0.4** i > 20 sekunder, trigger vi proaktiv
eskalering:

```
Agent: Jeg merker at dette ikke er enkelt — skal jeg koble deg direkte
       til [ansvarlig] med én gang?
```

Hvis kunden takker ja → transfer.

Hvis kunden sier nei → fortsett samtalen men øk prioritet i log (`customer_flagged_negative_sentiment: true`).

## 8. Stille fallback — kunden forsvinner

Allerede dekket i `05-edge-cases-og-guardrails.md §13`. Kort:
- 5 s stillhet → agent spør én gang.
- 10 s til → agenten varsler om dårlig forbindelse.
- 15 s → `endCall()`, auto-ticket, SMS *"Vi ble avbrutt. Svar JA for tilbakeringing."*.

## 9. Feil i tool-call — gracious degradation

Eksempel: `book_appointment`-tool timeout-er.

### Svakt svar (hva vi IKKE vil)
```
Agent: Det oppstod en feil. Prøv igjen senere.
```

### Riktig svar
```
Agent: Jeg får ikke koblet meg til kalenderen akkurat nå. Jeg lager
       en ticket så [ansvarlig] booker deg manuelt innen en time,
       og du får SMS-bekreftelse når det er gjort. Er det greit?
```

Skjelett-regel:
```
Hvis et tool feiler, erkjenn at du har et teknisk problem, tilby
manuell oppfølging, og fortsett samtalen. Si aldri "teknisk feil" uten
å gi en vei videre.
```

## 10. Bemanning-kart per nisje (fase 1 — statisk)

I `variables.md`:

```yaml
transfer_rules:
  - weekday_start: "08:00"
    weekday_end: "17:00"
    weekday_numbers: ["+4792...", "+4798..."]
  - saturday_start: "10:00"
    saturday_end: "14:00"
    saturday_numbers: ["+4792..."]
  - sunday_closed: true

emergency_numbers:
  fire: "110"
  medical: "113"
  police: "112"
  internal_on_call: "+4790..."  # kun Ella
```

Fase 2 gjør dette dynamisk via admin-panel, men for MVP holder statisk fil.

## 11. Metrikker for fallback-kvalitet

Logges per samtale:
- `fallback_tier_reached`: null | transfer | ticket | voicemail.
- `transfer_success`: bool.
- `transfer_time_to_connect_seconds`: ms det tok å koble.
- `ticket_created`: bool.
- `sms_sent`: bool.
- `escalation_reason`: "customer_request" | "frustration" | "scope_break" | "emergency" | "tool_failure".

**Mål-verdier:**
- 100 % av ikke-fullførte samtaler har fallback-tier > null.
- Transfer-success når åpningstid ≥ 85 %.
- SMS sendes innen 30 s fra samtale-slutt.

## 12. End-of-call-report — obligatoriske felter

Alle samtaler produserer en rapport via Vapi `end-of-call-report` webhook:

```json
{
  "call_id": "...",
  "duration_seconds": 142,
  "outcome": "booked | quoted | info | abandoned | escalated | emergency",
  "fallback_tier_reached": null,
  "transfer_target": null,
  "ticket_id": null,
  "customer_phone": "+47...",
  "customer_name": "...",
  "disclosure_ai_spoken": true,
  "disclosure_recording_spoken": true,
  "recording_consent": "implicit",
  "customer_sentiment_end": 0.7,
  "objection_count": 1,
  "interrupted_count": 1,
  "tool_calls": [{ "name": "book_appointment", "success": true }],
  "transcript_url": "https://...",
  "niche": "lisa-helse"
}
```

Lagres i Arxon-backend, eksponeres via dashboard (fase 2).

## 13. Ukentlig review — hva vi ser etter

Fredag 15:00, 30 min, per `PRINSIPPER.md §Regel 5`:
1. Alle samtaler med `fallback_tier_reached: null` og `outcome: abandoned`.
2. Alle samtaler med `escalation_reason: "tool_failure"`.
3. Alle `customer_sentiment_end < -0.3`.
4. Random sample av 10 vellykkede booking-samtaler for kvalitets-audit.

Funn → todos i `voiceagents/backlog.md` (ikke opprettet ennå — gjøres når
det finnes funn å legge inn).

## 14. Sjekkliste før deploy

- [ ] `transferCall`-tool registrert med primary + secondary destinations.
- [ ] `create_ticket` og `send_sms_callback_confirmation` registrert.
- [ ] Voicemail-flyt konfigurert.
- [ ] Bemanning-regler i `variables.md`.
- [ ] Sentiment-basert proaktiv eskalering aktivert.
- [ ] Silence-timeout-flow testet.
- [ ] Tool-failure-graceful degradation testet manuelt.
- [ ] `end-of-call-report`-webhook mottar obligatoriske felter.
- [ ] Ukentlig review-kalender satt.

## Referanser

- `PRINSIPPER.md §Regel 9 og §Regel 10` — menneske-utgang og samspill.
- `05-edge-cases-og-guardrails.md` — per-scenario-flow som utløser eskalering.
- `07-disclosure-og-samtykke.md` — samtykkebaserte eskaleringer (GDPR-requests).
- `shared/tools-katalog.md` — JSON-definisjoner av transfer, ticket, SMS-tools.
- Vapi docs: `transferCall`, `endCall`, `server.url` webhooks.
