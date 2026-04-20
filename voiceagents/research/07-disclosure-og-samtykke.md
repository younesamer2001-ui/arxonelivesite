# 07 — Disclosure og samtykke

Hva må vi si til kunden i starten av samtalen, hva skal vi gjøre hvis de
spør direkte om de snakker med AI, og hvilke samtykke- og personvernregler
må Arxon-agenter etterleve i Norge/EU?

TL;DR: **Si AI fra første sekund. Si at samtalen kan bli tatt opp hvis den
gjør det. Lisa har strengest regime (GDPR spesialkategori). Samtykke skal
logges; avslag skal respekteres umiddelbart.**

---

## 1. Tre krav vi alltid møter

Hver Arxon-samtale skal oppfylle:

1. **AI-disclosure** — kunden vet at de snakker med en maskin.
2. **Opptak-disclosure** — hvis vi tar opp, sier vi det før opptaket begynner.
3. **Formål-kommunikasjon** — hvorfor vi samler data vi ber om.

Krav 1 og 2 sitter i `firstMessage`. Krav 3 veves inn i agentens replikker
når den ber om personopplysninger (se §6).

## 2. Norsk lovkrav — oppsummert

### 2.1 AI-disclosure
Det er ingen *eksplisitt* lov i Norge (per april 2026) som krever at du
oppgir at en telefonsamtale er AI — men:
- **EU AI Act Artikkel 50** (i kraft for "high-risk" og "transparency
  obligations" gradvis fra august 2026) krever at brukere informeres når
  de interagerer med AI-systemer "med mindre det er åpenbart".
- **Forbrukertilsynets veiledning** (2024): "villedende fremstilling" kan
  rammes av markedsføringsloven hvis et firma later som AI er et menneske.
- **God skikk**: bransjen beveger seg mot disclosure som norm.

**Vår praksis: alltid disclosure, uansett om loven krever det eller ikke.**
Se også `PRINSIPPER.md §Regel 6`.

### 2.2 Opptak-disclosure
- **Straffeloven § 205** tillater *én*-parts-samtykke til opptak — den som
  tar opp kan lovlig gjøre det. Men:
- **Personvernforordningen (GDPR) art. 6**: opptak av samtale med identifiserbar
  person er behandling av personopplysninger, og krever *behandlingsgrunnlag*.
  "Berettiget interesse" + informasjon til den registrerte er det vanlige.
- **Ekomloven § 2-14**: en part har rett til å ta opp egen samtale, men
  offentliggjøring/bruk er regulert.

**Vår praksis:**
- Hvis opptak aktivert → informer i `firstMessage`.
- Kunden kan si "jeg vil ikke bli tatt opp" — da skal opptak skrus av
  for resten av samtalen (se §5).

### 2.3 Spesialkategorier (Lisa-spesifikk)
Helseopplysninger er **GDPR art. 9 spesialkategori** — krever eksplisitt
samtykke eller annet spesifikt grunnlag. Det betyr:
- Lisa må ikke spørre om diagnose, tidligere behandlinger eller lignende
  uten å forklare hvorfor og få samtykke.
- Hvis kunden frivillig deler (f.eks. "jeg har vondt i ryggen"), er det OK
  som del av booking-formålet — men data skal ikke brukes til andre formål.

Dette har konsekvenser for både prompt og webhook-logging (se §7).

## 3. Eksempel firstMessage per nisje

Alle nisjer bruker samme struktur: identifikasjon + AI + (opptak) + åpent
spørsmål.

### Lisa (Helse)
```
Hei, du har ringt {{bedriftsnavn}}. Jeg heter Lisa og er en AI-resepsjonist.
Samtalen kan bli tatt opp for kvalitets- og opplæringsformål.
Hva kan jeg hjelpe deg med?
```

### Max (Bilverksted)
```
Hei, dette er {{bedriftsnavn}}. Jeg er Max, en AI som tar imot henvendelser.
Samtalen kan bli tatt opp. Hva trenger du hjelp med?
```

### Ella (Elektriker)
```
Hei, du har ringt {{bedriftsnavn}}. Jeg er Ella, en AI som tar imot
forespørsler. Samtalen kan bli tatt opp. Hva kan jeg hjelpe med?
```

Variabler som `{{bedriftsnavn}}` injiseres fra `variables.md`.

## 4. Hva hvis kunden spør "er du en ekte person?"

**Aldri unnvikende. Aldri "ja".**

```
Kunde: Er du en ekte person?
Agent: Nei, jeg er en AI-resepsjonist. Men jeg kan hjelpe deg med det
       meste, og koble deg videre til et menneske hvis du heller vil.
```

Dette står i skjelett-prompten som en *hard* regel:
```
Hvis kunden spør om du er menneske, AI, bot, robot, eller lignende —
svar ærlig at du er en AI. Tilby transfer til menneske umiddelbart.
```

Brudd på denne regelen i produksjon er en kritisk bug. Detekteres via
`analysisPlan`-flagg `lied_about_ai_nature`.

## 5. Hvis kunden ikke vil bli tatt opp

```
Kunde: Jeg vil ikke at samtalen skal tas opp.
Agent: Helt i orden. Jeg slår av opptak nå.
       <stop_recording_tool>
       Hvordan kan jeg hjelpe deg videre?
```

### Implementasjon
- Vapi har `stopRecording`-tool vi kan registrere.
- Trigges via `stop_recording` function call i LLM-respons.
- Metadata på samtalen oppdateres: `recording_consent: "refused"`.
- Transcript kan fortsatt lagres for drift/feilsøking, men slettes etter
  X dager (se retention-regler i §8).

Hvis kunden kommer med samtykkevegring *midt* i samtalen, skal fortsatt
opptak opp til det tidspunkt være lovlig (kunden visste, jf. firstMessage).
Men vi bør også ha en regel som sletter det første segmentet hvis kunden
eksplisitt ber om det — se §8.

## 6. Formåls-kommunikasjon når vi samler data

Hver gang agenten ber om nye personopplysninger, skal formålet være klart:

**Svakt:** "Hva er telefonnummeret ditt?"
**Sterkt:** "Hva er telefonnummeret ditt så vi kan sende bekreftelse?"

**Svakt:** "Er det noe annet jeg bør vite?"
**Sterkt:** "Er det annen informasjon som er relevant for besøket — f.eks.
          om noen av gangene du har vært hos oss før?" *(Lisa-spesifikk)*

Skjelett-prompten:
```
Når du ber om personopplysninger (navn, tlf, e-post, adresse, regnummer,
helseinfo), si alltid kort *hvorfor* du trenger det.
```

## 7. Lagring og sletting — datapolicy

### Default for Max / Ella
| Datatype | Lagres | Slettes etter |
| --- | --- | --- |
| Audio-opptak | Ja (opt-in) | 90 dager |
| Transcript | Ja | 180 dager |
| Strukturert metadata (outcome, tlf) | Ja | 24 måneder (bokføringshensyn) |
| PII i analyse-output | Pseudonymisert | Umiddelbart |

### Lisa (Helse) — strengere
| Datatype | Lagres | Slettes etter |
| --- | --- | --- |
| Audio-opptak | Opt-in, kryptert | 30 dager |
| Transcript | Ja, men spesialkategori-data maskes | 90 dager |
| Helseopplysninger (eksplisitt) | Kun hvis nødvendig for booking | Slettes etter booking bekreftet |
| Kontaktinfo | Ja | 24 måneder |

### Hvordan maskes helseopplysninger?
Vi kjører transcript gjennom en regex + LLM-basert PII-detektor (egen
service, se fase 2). Diagnoser, legemiddelnavn, kroppsdeler kobles til
`[HEALTH_REDACTED]` i lagret transcript.

## 8. Samtykke-logging

For hver samtale lagrer vi i CRM:
- `disclosure_ai_spoken: true/false` (sjekk via transcript-match på
  "AI" i første 10 sekunder).
- `disclosure_recording_spoken: true/false`.
- `recording_consent: "implicit" | "explicit" | "refused"`.
- `data_purposes_communicated: [{purpose: "booking", timestamp}, ...]`.
- `special_category_shared: true/false` (Lisa).

Alt dette går inn i `end-of-call-report` webhook og lagres i Arxon-backend.

## 9. Rettigheter — hva kunden kan kreve

Kunden kan ringe inn og be om:
1. **Innsyn** i egne data (GDPR art. 15).
2. **Sletting** (art. 17, "retten til å bli glemt").
3. **Dataportabilitet** (art. 20).
4. **Trekking av samtykke** (art. 7).

Agenten skal *ikke* håndtere dette selv. Respons:
```
Agent: Det er en personvern-henvendelse. Jeg overfører deg til
       [personvernansvarlig] — eller hvis du foretrekker, kan jeg ta
       ned detaljene så de ringer deg tilbake innen 48 timer. Hva
       passer best?
```

Loggfør med `ticket_category: "gdpr_request"`, høy prioritet.

## 10. Cold calling — repetert fra PRINSIPPER §Regel 7

- Innringing (inbound) er alltid samtykke-basert — kunden initierte.
- Utgående (outbound) krever dokumentert samtykke. Ikke ringe reserverte
  numre (Brønnøysundregistrene sitt Reservasjonsregister — sjekk før
  enhver utgående liste).
- FCC (US) og lignende strenge regler gjelder for AI-stemmer — norsk
  markedsføringslov har ikke eksplisitt AI-paragraf i 2026, men vi antar
  strammere regulering kommer.

Outbound-arbeid er Fase 2, ikke del av denne dokumentasjonen ennå.

## 11. DPA og underleverandører

Følgende systemer behandler personopplysninger i våre samtaler:

| Leverandør | Rolle | Databehandler-avtale |
| --- | --- | --- |
| Vapi (OpenMind AI) | Orchestration | DPA signert (vedlegg Arxon-DPA-001) |
| Azure Speech | STT + TTS | DPA via Microsoft Online Services |
| OpenAI | LLM | DPA signert (OpenAI Enterprise DPA) |
| ElevenLabs (hvis aktivert) | TTS | DPA signert |
| Trieve | KB retrieval | DPA under forhandling |
| Twilio | Telefoni | DPA via Twilio Trust Center |

Data-flytdiagram vedlegges `voiceagents/compliance/dataflow.md` (ikke skrevet
ennå).

Alle leverandører er i EU eller EU-adekvate land, eller vi bruker SCCs der
det ikke holder. ChatGPT Enterprise DPA dekker OpenAI; Vapi's DPA spesifiserer
EU-residens for Arxon-data via region `eu-west`.

## 12. Sjekkliste før deploy

- [ ] `firstMessage` inneholder navn + AI + opptak-melding.
- [ ] Skjelett-prompten har regel om ærlighet om AI-natur.
- [ ] `stop_recording`-tool registrert.
- [ ] Formål nevnes når data samles inn.
- [ ] Retention-regler implementert i backend.
- [ ] Samtykke-felter logges i end-of-call-report.
- [ ] DPA-er på plass for alle underleverandører.
- [ ] For Lisa: helseopplysninger maskes i transcript-lagring.
- [ ] GDPR-request-flow eskaleres korrekt.
- [ ] Intern personvern-ansvarlig identifisert per nisje-kunde.

## Referanser

- EU AI Act Art. 50 (transparens-krav).
- Personopplysningsloven / GDPR art. 6, 7, 9, 13, 15, 17, 20.
- Ekomloven § 2-14 (opptak).
- Straffeloven § 205 (samtykke til opptak).
- `PRINSIPPER.md §Regel 6` — disclosure som hard regel.
- `05-edge-cases-og-guardrails.md §10` — barn og samtykke.
- `08-fallback-og-menneske-overtakelse.md` — eskalering for personvern-requests.
