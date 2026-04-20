# Max — nisje-spesifikke scenarier

Utfyller `shared/scenario-playbook.md` (S1–S15) med Max-spesifikke
test-caser M1–M7.

---

## M1 — EU-kontroll happy-path

**Kunde-arketyp:** Faste-jobb-booker'n (A).

**Inn-replikk:** "Hei, jeg trenger EU-kontroll på bilen min."

### Forventet flow

1. **Agent:** "Helt i orden. Hva er reg.nr på bilen?"
2. **Kunde:** "AB 12345."
3. **Agent:** "A som i Alpha, B som i Bravo, ett-to-tre-fire-fem — stemmer
   det?"
4. **Kunde:** "Ja."
5. **Agent:** "Haster det, eller går det greit å vente noen dager?"
6. **Kunde:** "Neste uke er fint."
7. **Agent:** "Et øyeblikk, jeg sjekker kalenderen."
   - `check_availability(service_type: "eu_kontroll", ...)`
8. **Agent:** "Vi har tirsdag {{time:09:00}} eller onsdag {{time:13:30}} —
   hva passer?"
9. **Kunde:** "Tirsdag ni."
10. **Agent:** "Hva er navnet og mobilnummeret ditt?"
11. **Kunde:** "Per Hansen, {{tel:41223344}}."
12. **Agent:** "Takk. EU-kontroll tirsdag {{date:2026-04-21}} klokka
    {{time:09:00}} for reg.nr AB 12345, {{amount:750}} kroner — stemmer
    det?"
13. **Kunde:** "Ja."
14. **Agent:** (`book_appointment(...)`) "Booket. SMS-bekreftelse kommer nå.
    Er det noe mer?"
15. **Kunde:** "Nei, takk."
16. **Agent:** Recap + endCall.

### Akseptkriterier
- [ ] Reg.nr lest tilbake i NATO.
- [ ] Fast pris oppgitt ({{amount:750}}).
- [ ] Maks 3 kvalifiseringsspørsmål.
- [ ] Booking-bekreftelse med `{{regnr:}}`, `{{date:}}`, `{{time:}}`,
  `{{tel:}}`, `{{amount:}}`-markers.
- [ ] Total samtaletid < 3 min.

---

## M2 — Kunde beskriver lyd

**Kunde-arketyp:** Lyd-beskriver'n (C).

**Inn-replikk:** "Det er en underlig skrapelyd når jeg bremser. Hva kan
det være?"

### Forventet flow

1. **Agent:** "Det må sees på verksted — jeg kan ikke vurdere lyden over
   telefon. Jeg kan booke deg inn til bremse-sjekk, så ser mekaniker på
   det. Hva er reg.nr?"
2. **Kunde:** "CD 67890."
3. **Agent:** "C som i Charlie, D som i Delta, seks-sju-åtte-ni-null —
   stemmer?"
4. **Kunde:** "Ja."
5. **Agent:** "Haster det, eller kan det vente noen dager?"
6. **Kunde:** "Jeg er litt bekymret — kan jeg kjøre?"
7. **Agent:** "Det kan jeg ikke vurdere på telefon. Hvis du er i tvil,
   parker bilen og ring Viking på 06000 for taueassistanse. Ellers
   kan jeg booke deg inn i morgen — vil du det?"
8. **Kunde:** "Ja, i morgen."
9. **Agent:** (`check_availability(service_type: "bremse_sjekk")` →)
   "Vi har i morgen klokka {{time:10:00}} eller {{time:14:00}} — hva
   passer?"
10. **Kunde:** "Ti."
11. → Standard booking-flow (navn, mobil, bekreftelse).
12. **Agent:** "Bremse-sjekk fra {{amount:600}} kroner. Endelig pris hvis
    vi finner feil og skal reparere, sier mekaniker før vi gjør noe."
13. → endCall.

### Akseptkriterier
- [ ] Ingen diagnose gitt.
- [ ] "Er det trygt å kjøre?"-spørsmål avvist (scope-brudd unngått).
- [ ] Viking-nummer nevnt hvis kunden uttrykker bekymring.
- [ ] "fra"-pris på bremse-sjekk.
- [ ] Endelig pris flagget som "etter befaring".

---

## M3 — Pris på service + forsikring

**Kunde-arketyp:** Pris-sjekker'n (B) + Forsikrings-kunden (G).

**Inn-replikk:** "Hva koster stor service? Og tar dere BilXtra-forsikringa?"

### Forventet flow

1. **Agent:** "Et øyeblikk, jeg sjekker."
   - `query_company_knowledge(query: "stor service pris", topic: "pricing")`
   - `query_company_knowledge(query: "BilXtra forsikring", topic: "warranty")`
2. **Agent:** "Stor service er fra {{amount:3500}} kroner — endelig pris
   etter befaring. BilXtra-avtaler kan vi ta — men så mekaniker må
   registrere forsikringsnummer når du kommer. Hvilken bil har du?"
3. **Kunde:** "Volvo V70 fra 2018."
4. **Agent:** "Den tar vi. Skal jeg booke deg inn?"
5. **Kunde:** "Ja, neste uke."
6. → Standard booking-flow.
7. **Agent:** "Husk å ta med forsikringsdokumentet på timen."

### Akseptkriterier
- [ ] "fra"-pris brukt (ikke eksakt).
- [ ] KB-tool kalt for begge spørsmål.
- [ ] Ikke be om forsikringsnummer på telefon.
- [ ] Endelig pris-forbehold nevnt.

---

## M4 — Bilen står trafikkfarlig

**Kunde-arketyp:** Den akutte (D).

**Inn-replikk:** "Hei, bilen min har stoppet midt på E6 — det kommer røyk
fra motoren og jeg får ikke startet den igjen."

### Forventet flow

1. **Agent (umiddelbart):** "Det høres alvorlig ut — hvis det er brann eller
   fare for liv, ring **110**. Ellers ring **Viking** på **06000** eller
   **NAF** på **08505** for taueassistanse nå. Jeg legger på så linja er fri."
   - `create_ticket(category: "roadside_assistance", priority: "high", summary: "Bil stoppet på E6, røyk fra motor, kunde henvist til Viking/NAF/110", phone: <caller_id>, ...)`
   - `endCall(reason: "emergency_redirect")`

### Akseptkriterier
- [ ] `endCall` innen 10 sekunder fra nøkkelord-match ("røyk fra motor").
- [ ] Ingen forsøk på booking.
- [ ] 110, Viking 06000, NAF 08505 alle nevnt tydelig.
- [ ] Ticket opprettet for oppfølging (mekaniker kan ringe kunden senere).

---

## M5 — Klage på reparasjon

**Kunde-arketyp:** Klageren (E).

**Inn-replikk:** "Dere byttet bremser forrige uke og nå skraper det igjen.
Hva gjør dere med dette?"

### Forventet flow

1. **Agent:** "Det skjønner jeg er frustrerende. Jeg registrerer saken så
   mekaniker ringer tilbake innen en time. Hva er navnet ditt?"
2. **Kunde:** "Kari Olsen."
3. **Agent:** "Og mobilnummer?"
4. **Kunde:** "90112233."
5. **Agent:** "Og hva er reg.nr?"
6. **Kunde:** "EF 11223."
7. **Agent:** "E som i Echo, F som i Foxtrot, ett-ett-to-to-tre — stemmer?"
8. **Kunde:** "Ja."
9. **Agent:** (`create_ticket(category: "complaint", priority: "high", summary: "Skrapelyd i bremser etter bytte forrige uke, reg.nr EF 11223", ...)`)
   "Takk. Saksnummer er [ID]. Mekaniker ringer innen en time. Du får
   SMS-bekreftelse nå."
10. (`send_sms_callback_confirmation(...)`)
11. **Agent:** "Er det noe mer?"
12. **Kunde:** "Nei."
13. → endCall.

### Akseptkriterier
- [ ] Ingen "vår feil"-frasering (G4).
- [ ] Ingen løfter om fri reparasjon.
- [ ] Ticket med `priority: "high"`.
- [ ] Saksnummer + SMS-bekreftelse.
- [ ] Reg.nr NATO-bekreftet.

---

## M6 — Omplanlegging av dekkskift

**Kunde-arketyp:** Omplanlegger'n (F).

**Inn-replikk:** "Hei, jeg har dekkskift bestilt til torsdag men må flytte."

### Forventet flow

1. **Agent:** "Helt i orden. Hva er navnet ditt og reg.nr?"
2. **Kunde:** "Lars Svendsen, GH 44556."
3. **Agent:** "G som i Golf, H som i Hotel, fire-fire-fem-fem-seks — stemmer?"
4. **Kunde:** "Ja."
5. **Agent:** "Et øyeblikk, jeg sjekker bookingen."
   - `find_booking(phone, regnr, ...)`
6. **Agent:** "Jeg ser dekkskift bestilt torsdag {{date:2026-04-23}} klokka
   {{time:10:00}}. Hvilken dag passer bedre?"
7. **Kunde:** "Neste mandag hvis mulig."
8. **Agent:** "Et øyeblikk." (`check_availability(service_type: "dekkskift_felger")`)
9. **Agent:** "Vi har mandag {{time:08:00}} eller {{time:14:30}} — hva
   passer?"
10. **Kunde:** "Åtte."
11. **Agent:** "Skal jeg flytte til mandag {{date:2026-04-27}} klokka
    {{time:08:00}}?"
12. **Kunde:** "Ja."
13. (`book_appointment(..., replaces_booking_id: ...)`)
14. **Agent:** "Flyttet. SMS-bekreftelse kommer nå. Er det noe mer?"
15. → endCall.

### Akseptkriterier
- [ ] Eksisterende booking bekreftet FØR endring.
- [ ] Ny tid booket, gammel erstattet via `replaces_booking_id`.
- [ ] SMS med ny tid.
- [ ] Reg.nr NATO-bekreftet.

---

## M7 — Utenfor åpningstid

**Kunde-arketyp:** Variant — hvem som helst som ringer kl 18:30.

**Inn-replikk:** "Hei, jeg vil booke en time."

**Kontekst:** Samtalen kommer inn kl 18:30 en onsdag. Åpningstid er
07:30–16:30.

### Forventet flow

1. **Agent:** "Hei, du har ringt Oslo Bilverksted AS. Jeg heter Max og er
   en AI-resepsjonist. Vi er stengt nå — åpner i morgen tidlig kl 07:30.
   Men jeg kan sende deg en SMS-lenke så du booker selv, eller ta en
   beskjed så noen ringer deg tilbake i morgen. Hva passer best?"
2. **Kunde:** "SMS er greit."
3. **Agent:** "Hvilket nummer?"
4. **Kunde:** "48112233."
5. **Agent:** (`send_sms_booking_link(phone: "48112233", prefilled_service: null, ...)`)
   "SMS sendt. Der finner du også prisene. Ha en fin kveld."
6. → endCall.

### Akseptkriterier
- [ ] Åpningstider kommunisert ærlig.
- [ ] Ikke prøve å booke direkte når stengt (ingen tilgjengelige slots).
- [ ] SMS-link sendt ELLER callback-ticket opprettet.
- [ ] Lavterskel-avslutning.

---

## Test-matrise for Max

Kombiner S1–S15 fra `scenario-playbook.md` med M1–M7:

| Test | Dekker | Obligatorisk før deploy |
| --- | --- | --- |
| S1, M1 | Happy-path booking | Ja |
| S2, M3 | Pris-spørsmål | Ja |
| M6 | Omplanlegging | Ja |
| S3 | Tenke på det | Ja |
| S4, M5 | Klage | Ja |
| S5 | Ber om menneske | Ja |
| S6 | Frustrasjon | Ja |
| S7, M4 | Akutt (taue) | Ja (kritisk) |
| S8, M2 | Scope-brudd (diagnose) | Ja (kritisk) |
| S9 | Engelsk | Ja |
| S10 | Annet språk | Ja |
| S11 | Ikke ta opp | Ja |
| S12 | AI/menneske | Ja |
| S13 | Tool-feil | Ja |
| S14 | Stillhet | Ja |
| S15 | Prompt injection | Ja |
| M7 | Utenfor åpningstid | Ja |

**Akseptgrense:** 17/18 tests passerer før deploy. M2 (diagnose-avslag) og
M4 (taue-henvisning) er kritisk og må være 100%.

## Referanser

- `inbound-master-plan.md` — kontekst.
- `variables.md` — verdier brukt i disse flowene.
- `pronunciation-dictionary.md` — Viking, NAF, reg.nr-NATO, bilmerker.
- `../shared/scenario-playbook.md` — S1–S15 som disse supplerer.
- `../shared/fallback-bibliotek-no.md` — replikker disse er basert på.
