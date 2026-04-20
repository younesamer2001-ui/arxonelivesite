# Prinsipper for Arxon-voiceagenter

Ti regler vi følger når vi bygger, tester og iterer voice-agentene. Alt annet i denne
mappen er verktøy for å etterleve disse reglene. Les først, før du rører en system prompt.

Reglene er destillert fra to videoer (se `Referanse`) og egne erfaringer. Første fem
handler om **hvordan vi bygger** (håndverk, stack-agnostisk, enkelhet, fleksibilitet,
data). De siste fem handler om **hva vi bygger og hvem vi bygger for** (disclosure,
cold calling, kompleksitet, fallbacks, menneske-i-loopen).

---

## Regel 1 — Vi er samtale-håndverkere, ikke tech-integratører

Den vanskelige delen av å bygge en god voice-agent er *ikke* å koble API-er sammen. Det
er å designe tonen, personligheten, flyten, uttalen og håndteringen av avvik. En
middelmådig agent med fantastisk tech-stack taper alltid mot en enkel agent med
velskrevet prompt og gjennomtenkt flyt.

**Hva det betyr i praksis:**
- Bruk tid i `scenarios.md` og `system-prompt.md` — ikke i Vapi-dashboardet.
- Test med ekte samtaler (ring deg selv, ring en kollega) før finjustering.
- Les transkripter høyt. Lyder det som et menneske, eller som en robot som leser manus?

## Regel 2 — Stack-valget er ikke viktig i seg selv

Vapi, Retell, Bland, egenutviklet LiveKit-pipeline — alle kan levere en fungerende
voice-agent. Vi valgte Vapi fordi vi kan bygge raskt. Hvis vi bytter stack senere,
skal det være fordi kravene har endret seg, ikke fordi verktøyet vi har virker kjedelig.

**Hva det betyr i praksis:**
- Ikke skriv Vapi-spesifikk kode hvis vi kan unngå det. `system-prompt.md` og
  `scenarios.md` er provider-agnostiske.
- Samme logikk for tool-definisjoner: `shared/tools-katalog.md` beskriver dem
  deklarativt. Vapi-JSON er bare serialiseringen.
- Når vi vurderer ny feature — spør "løser det et faktisk problem kunden har?",
  ikke "har Retell dette?".

## Regel 3 — Enklere er alltid bedre

Den raskeste måten å forbedre en prompt på er å *fjerne* tekst, ikke legge til. Lange
prompt-er skaper hallusinasjoner, redusert instruksjonstroskap, og latency-økning.

**Hva det betyr i praksis:**
- Vi har **ett felles prompt-skjelett** (`shared/skeleton-system-prompt.md`) som
  brukes av alle tre nisjer. Nisje-spesifikk info injiseres via `{{variabler}}`.
- Ikke lim inn en fem-siders prompt og håp det beste. Hvis skjelettet vokser over
  ~250 linjer — fjern noe før du legger til.
- Scenarier beskrives som *eksempler på god oppførsel*, ikke som regler LLM-en må
  følge slavisk. "Vi ønsker at Lisa skal svare slik" > "Lisa MÅ svare slik".

**Anti-mønster vi unngår:**
```
❌ "Hvis kunden sier X, si Y. Hvis kunden sier Z, si W. Hvis kunden …"
   (500 if/else-regler som LLM-en blander sammen)
```

**Mønster vi bruker i stedet:**
```
✅ "Du er en resepsjonist for {{business_type}}. Ditt hovedmål er {{primary_goal}}.
    Når noen er opprørt, svar med empati først, løsning etter."
   (Få høy-nivå prinsipper + noen få konkrete eksempler i scenarios.md)
```

## Regel 4 — Vi er ikke gift med stacken

Fase 1 = Vapi + Deepgram + ElevenLabs + OpenAI. Denne kombinasjonen er god nok for
~90 % av henvendelsene og billig nok til MVP. Men:

- Hvis Deepgram sliter med norsk → bytt til Azure Speech.
- Hvis ElevenLabs høres "utenlandsk" på norsk → test Cartesia eller Azure Neural.
- Hvis en kunde krever EU data-residency → migrer Lisa til selv-hostet LiveKit.

**Hva det betyr i praksis:**
- Abstrahér provider-valg i config, ikke i kode. `vapi-config.json` er én av mange
  mulige serialisasjoner av samme master-plan.
- Logg metrics slik at migrasjonsbeslutningen er datadrevet (se Regel 5).
- Aldri anta at den stacken vi valgte i april 2026 er den vi bruker i 2027.

## Regel 5 — Data fra samtalene er gull

Hver samtale genererer transkript, metrics, utkomme. Uten dette er vi blinde.

**Hva det betyr i praksis:**
- **Alle samtaler skal ha post-call-analyse** via `analysisPlan` i Vapi. Se
  `research/01-vapi-kapabiliteter.md §2.5`.
- **Metrics vi trenger (MVP):**
  - `call_duration_seconds`
  - `outcome` (`booking`, `quote_sent`, `lead`, `complaint`, `unresolved`, `hangup`)
  - `customer_sentiment` (`positive`, `neutral`, `negative`)
  - `tools_called` (liste)
  - `interrupted_count` (hvor mange ganger assistenten ble avbrutt)
  - `escalated_to_human` (boolean)
- **Ukentlig gjennomgang**: Fredag ettermiddag. 10 tilfeldige transkripter + alle
  `escalated_to_human = true`. Noter det som gikk galt i nisje-filen.

**Dashboards vi må bygge:**
```
Outcomes per nisje (booking / lead / klage / unresolved)
├── Antall samtaler per dag
├── Gjennomsnittlig varighet
├── Sentiment-fordeling
└── Topp 5 årsaker til eskalering
```

## Regel 6 — Si at du er AI, med en gang

Kunder skal *aldri* lure på om de snakker med et menneske eller en maskin. Det ødelegger
tillit i sekundet de oppdager det, og i helsebransjen er det etisk tvilsomt uansett
hva loven sier.

**Hva det betyr i praksis:**
- Disclosure ligger i **`firstMessage`** (statisk tekst), ikke i system prompt. LLM-en
  kan ikke glemme eller hallusinere en statisk linje.
- Første setning: navn + at det er en AI. F.eks.
  *"Hei, du har ringt klinikken. Jeg er Lisa, en AI-resepsjonist — hva kan jeg hjelpe deg med?"*
- **Opptak-disclosure** hvis vi tar opp samtalen: også i `firstMessage`. Selv om vi er
  i Norge og GDPR ikke alltid krever det ved norsk internsamtale, er det god praksis.
- **QA-varsel**: `analysisPlan` skal sjekke om disclosure faktisk ble sagt (transkript
  inneholder "AI" eller tilsvarende de første 5 sekunder). Hvis ikke → ticket til oss.
- Når kunden direkte spør *"er du et menneske?"* → ærlig svar, alltid. Aldri unnvikende.

**Anti-mønster:** Å gjemme AI-naturen bak "jeg er resepsjonisten her". Det føles lurere
i prompt-testing, men slår alltid tilbake i produksjon.

## Regel 7 — Vi cold-caller ikke uten samtykke

Utgående AI-samtaler til kalde lister er en juridisk og omdømme-minefelt. Både i Norge
(markedsføringsloven, telefonreservasjonsregisteret) og internasjonalt (TCPA i USA,
FCC-regler fra 2024 som klassifiserer AI-stemmer som "artificial voice").

**Hva det betyr i praksis — lovlige outbound-bruk:**
- **Speed-to-lead**: Kunden har nettopp fylt ut skjema på nettsiden vår. Ring innen
  60 sekunder. Samtykke er implisitt ved leadgen-handlingen.
- **Reaktivering av eksisterende kunder**: "Vi så det er 12 måneder siden sist service
  — vil du booke?". Krever at de er i kunderegisteret.
- **Påminnelser**: Booking-bekreftelser, no-show-forebygging. Kun til kunder som har
  gjenstående avtale.

**Forbudte mønstre:**
- Ringe lister kjøpt fra tredjepart.
- Ringe reserverte numre (sjekk Reservasjonsregisteret før enhver utgående kampanje).
- Ringe utenom hvileregler (ikke før 09:00 eller etter 21:00 hverdager, helg strengere).

**Outbound er Fase 2** — først når inbound er stabil, og alltid med samtykke-dokumentasjon
i CRM-et.

## Regel 8 — MVP først, workflows etterpå

Komplekse agenter kræsjer i produksjon. Hver ekstra API-kall, hver nye tool, hver
betinget gren i samtalen er en ny ting som kan feile i noens lunsjpause.

**Hva det betyr i praksis:**
- **MVP-versjonen av hver nisje** løser kun kjerne-use-casen. For Lisa: "ta imot
  henvendelse og book time". Ikke "book time + send epost-bekreftelse + oppdater CRM
  + varsle behandler på Slack" fra dag én.
- **Foretrekk SMS-fallback** når et tool er skjørt. Eksempel: Hvis
  `check_availability` timeout-er, skal Lisa si
  *"Jeg sender deg en SMS med link til bookingsiden vår nå"* — ikke gå inn i en
  retry-løkke.
- **Ikke ring API-er midt i setningen.** Tool-call = stillhet. Stillhet > 2 sekunder
  = kunden legger på eller snakker opp i.
- Tools som tar > 1,5 sekund skal annonseres: "Jeg sjekker — et øyeblikk".

**Tommelfingerregel:** Kan du levere verdien med SMS og en kalenderlink? Start der.
Legg til direkte tool-kall først når SMS-varianten er validert.

**Spesialregel for kunnskap (FAQ, pristabeller, tjenestekataloger):** Bruk et
**query-tool mot knowledge base**, ikke inline i prompten og ikke Vapi sin
direkte-fil-kobling. Agenten henter kun når den trenger det, prompt holdes kort,
og oppdatering er å bytte én fil. Full begrunnelse i
`research/09-knowledge-base-strategi.md`.

## Regel 9 — Hver agent skal ha en menneske-utgang

Det finnes fire grunner til å overføre til menneske, og agenten vår må gjenkjenne
alle fire uten at vi har skrevet en eksplisitt regel for hver:

1. **Kunden ber direkte**: "La meg snakke med et menneske", "kan jeg få en ekte person".
2. **Frustrasjon eskalerer**: Gjentatt "nei, det var ikke det jeg spurte om", hevet
   stemme, banning, 3+ avbrytelser på rad.
3. **Sentiment er negativt**: Post-call-analyse flagger samtalen som negativ → hvis
   den fortsatt pågår, eskalér live.
4. **Scope-brudd**: Kunden trenger noe utenfor agentens kompetanse (medisinsk råd for
   Lisa, juridisk vurdering av forsikring for Max, farlig elektrisk situasjon for Ella).

**Hva det betyr i praksis:**
- **Alltid `transferCall`-tool aktivt**, selv om listen over mottagere er kort eller
  "ikke-bemannet nå". I ikke-bemannet-scenariet → loggfør pluss tilby tilbakeringing
  innen X timer.
- **Fallback-hierarki** (konfigureres per nisje i `variables.md`):
  ```
  1. transferCall → ansvarlig (hvis innenfor åpningstid)
  2. createTicket + SMS → "Vi ringer deg tilbake innen 30 min"
  3. Voicemail → e-post til ansvarlig
  ```
- **Aldri dø stille.** En samtale som ender uten resolusjon og uten eskalering er
  vår verste type feil. Bedre å overeskalere enn å droppe kunden.

## Regel 10 — AI erstatter ikke mennesker, AI forsterker dem

Vi selger ikke "vi erstatter resepsjonisten din". Vi selger "vi håndterer de 80 %
repetitive samtalene så de 20 % som trenger din ekspertise faktisk får den".

**Hva det betyr i praksis — AI tar:**
- Kvalifisering av leads (hvor er du, hva gjelder det, hvor haster det).
- FAQ (åpningstider, adresse, pristabell, tjenestekatalog).
- Ruting (gjelder det regnskap → regnskap; gjelder det booking → booking-flyt).
- Data-innsamling (reg.nummer, adresse, kontaktinfo, ønsket tid).
- Enkle transaksjoner (bekrefte, avbestille, flytte booking i enkle tilfeller).

**Mennesker tar:**
- Nye store kundeforhold hvor relasjon betyr noe.
- Klager og tvister.
- Komplekse medisinske vurderinger (Lisa eskalerer alltid).
- Akutte situasjoner (Ella: brann-fare → 110, deretter elektriker på vakt).
- Nyanserte salg — særlig verdier over X kroner (konfigureres per nisje).

Dette former copyen vi bruker på landingssiden og i salgssamtaler. Hvis vi aldri
snakker om menneske-takeover på salgssidene, kommer forventningsbruddet i produksjon.

---

## Sammendrag — én setning per regel

1. **Håndverk over tech.** Promptkvalitet slår API-integrasjoner.
2. **Stacken er et verktøy.** Velg det som funker, ikke det som er «riktig».
3. **Fjern før du legger til.** Kort prompt > lang prompt.
4. **Vær klar for å migrere.** Abstrahér provider-valg.
5. **Mål alt.** Uten data er vi blinde.
6. **AI-disclosure fra første sekund.** Statisk `firstMessage`, ikke LLM-generert.
7. **Ingen cold calls.** Kun samtykke-baserte outbound — speed-to-lead, reaktivering,
   påminnelser.
8. **MVP før workflow.** SMS-fallback slår skjør API-integrasjon hver gang.
9. **Alltid en menneske-utgang.** Transfer, ticket, tilbakeringing — velg én, aldri null.
10. **Forsterk mennesker, ikke erstatt.** AI tar repetisjon, mennesker tar relasjon.

## Referanse

- *"5 rules for building voice AI agents"* — diskutert 2026-04-18, destillert til
  regel 1–5.
- *"5 lessons from real voice AI deployments"* — diskutert 2026-04-18 samme dag,
  destillert til regel 6–10.

Hvis du oppdaterer dette dokumentet, legg ved dato og notat slik at vi kan se hvordan
tenkingen har utviklet seg.
