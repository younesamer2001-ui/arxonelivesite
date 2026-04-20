# Ella — nisje-spesifikke scenarier

Utfyller `shared/scenario-playbook.md` (S1–S15) med Ella-spesifikke
test-caser E1–E7.

---

## E1 — Privat-kunde, varmekabel bad

**Kunde-arketyp:** Privatkunden med småjobb (A).

**Inn-replikk:** "Hei, jeg trenger elektriker til å legge varmekabel i
badet mitt."

### Forventet flow

1. **Agent:** "Helt i orden. Er dette for privat eller bedrift?"
2. **Kunde:** "Privat."
3. **Agent:** "Og hvor stort er badet, sånn omtrentlig?"
4. **Kunde:** "Fem kvadratmeter."
5. **Agent:** "Hvor er det — postnummer eller bydel?"
6. **Kunde:** "{{postnummer:0579}} — Tøyen."
7. **Agent:** "Haster det, eller kan det vente noen dager?"
8. **Kunde:** "Neste måned er fint."
9. **Agent:** "Takk. Som indikasjon ligger varmekabel i bad typisk mellom
   {{amount:15000}} og {{amount:25000}} kroner — endelig pris gir
   elektriker etter befaring. Jeg logger forespørselen så elektriker
   ringer deg for å avtale befaring. Hva heter du og hvilket nummer
   når vi deg på?"
10. **Kunde:** "Siri Olsen, {{tel:48112233}}."
11. **Agent:** (`create_ticket(category: "lead_quote", priority: "normal", summary: "Privat varmekabel bad 5m², Tøyen 0579, kan vente til neste måned", customer_type: "private", service_code: "varmekabel_bad", ...)`)
    "Takk. Saksnummer [ID]. Elektriker ringer innen en virkedag. Du får
    SMS-bekreftelse nå."
12. (`send_sms_callback_confirmation(...)`)
13. **Agent:** "Er det noe mer?"
14. → endCall.

### Akseptkriterier
- [ ] Alle 4 kvalifiseringsfelter utfylt (privat/næring, type, sted, hastegrad).
- [ ] Ingen fast pris gitt — kun range + "endelig etter befaring".
- [ ] Ticket opprettet med struktur.
- [ ] SMS-bekreftelse sendt.
- [ ] Total samtaletid < 3 min.

---

## E2 — Bedrifts-kunde, rehab-prosjekt

**Kunde-arketyp:** Bedrifts-kunden (B).

**Inn-replikk:** "Hei, vi har et kontorbygg på Skøyen som trenger rehab av
el-anlegget. Kan dere gjøre en befaring og gi tilbud?"

### Forventet flow

1. **Agent:** "Absolutt. For å sette dere opp med riktig person, litt info
   først. Hvor stort er bygget — omtrent kvadratmeter og antall etasjer?"
2. **Kunde:** "Cirka {{area:2000}} kvadratmeter, fire etasjer."
3. **Agent:** "Og hva er adressen eller postnummer?"
4. **Kunde:** "{{postnummer:0278}}, Skøyen."
5. **Agent:** "Haster dette, eller er det prosjektering lenger fram?"
6. **Kunde:** "Oppstart høsten 2026."
7. **Agent:** "Takk. For et prosjekt i denne størrelsen ringer
   prosjektleder tilbake — typisk innen en virkedag. Hva heter du, og
   hvilket bedriftsnummer og direktenummer kan vi ringe?"
8. **Kunde:** "Ole Bratt, Hansen Eiendom AS, {{tel:22112233}}."
9. **Agent:** (`create_ticket(category: "lead_quote", priority: "high", summary: "Næring rehab 2000m² kontor 4 etg, Skøyen 0278, oppstart høst 2026", customer_type: "business", company_name: "Hansen Eiendom AS", ...)`)
    "Takk. Saksnummer [ID]. Prosjektleder ringer innen en virkedag. SMS-
    bekreftelse kommer nå."
10. (`send_sms_callback_confirmation(...)`)
11. → endCall.

### Akseptkriterier
- [ ] Kvalifisert som bedrift.
- [ ] Detaljer (areal, etg, adresse, tidsplan) fanget.
- [ ] Ticket med priority "high" pga prosjekt-størrelse.
- [ ] Bedriftsnavn registrert.
- [ ] Ingen fast pris forsøk.

---

## E3 — Strømbrudd, ikke brann

**Kunde-arketyp:** Den akutte — strøm-feil (C).

**Inn-replikk:** "Strømmen er borte i hele huset mitt. Kan dere komme?"

### Forventet flow

1. **Agent:** "Først — lukter det svidd eller ser du røyk noe sted?"
2. **Kunde:** "Nei, det er bare strømløst."
3. **Agent:** "Greit. Da er det mest sannsynlig nettselskapet — ring
   Elvia på 07057, det er dem som driver strømnettet i Oslo-området og
   har informasjon om strømbrudd. Hvis det viser seg at strømmen er
   inne hos andre i bygget og bare du er strømløs, ring oss tilbake så
   sender vi elektriker. Skal jeg logge saken så elektriker følger opp
   uansett?"
4. **Kunde:** "Ja, logg det."
5. **Agent:** "Hva heter du, og hvilket nummer?"
6. **Kunde:** "Ole Haug, {{tel:91234567}}."
7. **Agent:** (`create_ticket(category: "followup", priority: "medium", summary: "Strømbrudd hele bolig, henvist til Elvia 07057, ønsker oppfølging", ...)`)
    "Takk. Saksnummer [ID]. Ring Elvia først — hvis det ikke er nettbrudd,
    ringer elektriker deg tilbake. SMS-bekreftelse kommer nå."
8. → endCall.

### Akseptkriterier
- [ ] Først sjekket om det er brann-indikasjoner.
- [ ] Henvist til nettselskap før utrykning foreslås.
- [ ] Ticket logget for eventuell oppfølging.
- [ ] Elvia-nummer siffer-for-siffer (07057).

---

## E4 — Røyk fra stikkontakt

**Kunde-arketyp:** Den akutte — brann/gnister (D).

**Inn-replikk:** "Det kommer røyk fra en stikkontakt på kjøkkenet."

### Forventet flow

1. **Agent (umiddelbart):** "Dette er en brann-situasjon — slå av
   hovedsikringen umiddelbart og ring **110**. Hvis du allerede ser flammer,
   gå ut og ring 110 fra utsiden. Jeg logger saken så elektriker tar
   kontakt etter akutt-situasjonen. Jeg legger på nå så linja er fri."
   - `log_emergency(emergency_type: "fire_risk", keyword_triggered: "røyk fra stikkontakt", ...)`
   - `create_ticket(category: "emergency_followup", priority: "critical", summary: "Røyk fra stikkontakt, kjøkken, henvist til 110 og hovedsikring", ...)`
   - `endCall(reason: "emergency_redirect")`

### Akseptkriterier
- [ ] `endCall` innen 10 sekunder fra nøkkelord-match.
- [ ] "Slå av hovedsikringen" nevnt.
- [ ] 110 nevnt tydelig.
- [ ] Ingen kvalifiseringsspørsmål fortsatt.
- [ ] `log_emergency` + `create_ticket(priority: critical)` kalt.

---

## E5 — Tilbuds-sammenligning med foto

**Kunde-arketyp:** Tilbuds-shopperen (E).

**Inn-replikk:** "Jeg henter inn tilbud fra flere elektrikere på en
sikringsskap-oppgradering. Kan jeg sende bilde?"

### Forventet flow

1. **Agent:** "Ja, send bilde på SMS til dette nummeret så ser elektriker
   på det før befaring. Du trenger uansett befaring før endelig tilbud —
   men bilde hjelper å vurdere jobben på forhånd. Litt info først: er
   dette privat eller bedrift?"
2. **Kunde:** "Privat."
3. **Agent:** "Hva er adressen eller postnummer?"
4. **Kunde:** "{{postnummer:0490}}, Grefsen."
5. **Agent:** "Hvor gammelt er dagens sikringsskap omtrent?"
6. **Kunde:** "Sikkert 30 år."
7. **Agent:** "Og haster det?"
8. **Kunde:** "Ikke noe hast — tenker våren."
9. **Agent:** "Takk. Indikativ pris for sikringsskap-oppgradering er
   mellom {{amount:18000}} og {{amount:35000}} kroner — endelig pris
   etter befaring. Hva heter du og hvilket nummer?"
10. **Kunde:** "Lars Bakken, {{tel:92345678}}."
11. **Agent:** (`create_ticket(category: "lead_quote", priority: "normal", summary: "Privat sikringsskap-oppgradering Grefsen 0490, gammelt 30 år, kan vente til vår, ønsker foto-vurdering", ...)`)
    "Takk. Saksnummer [ID]. Send gjerne bilde på SMS til dette nummeret,
    så vurderer elektriker før befaring. SMS-bekreftelse med saksnummer
    kommer nå."
12. → endCall.

### Akseptkriterier
- [ ] Foto-forespørsel håndtert (instruert å sende SMS).
- [ ] Indikativ range, ingen fast pris.
- [ ] Ticket logget.
- [ ] Kunden forstår at befaring fortsatt er nødvendig.

---

## E6 — Klage på tidligere jobb

**Kunde-arketyp:** Klageren (F).

**Inn-replikk:** "Dere gjorde en jobb hos meg forrige uke, og nå virker
ikke stikket elektriker satte inn."

### Forventet flow

1. **Agent:** "Det skjønner jeg er frustrerende. Jeg registrerer saken så
   elektriker ringer tilbake innen en time for å vurdere. Hva heter du
   og hvilket nummer når vi deg på?"
2. **Kunde:** "Inger Moen, {{tel:90887766}}."
3. **Agent:** "Og når var elektriker der, cirka?"
4. **Kunde:** "Onsdag forrige uke."
5. **Agent:** "Hva er adressen?"
6. **Kunde:** "{{postnummer:0560}}, Grünerløkka."
7. **Agent:** (`create_ticket(category: "complaint", priority: "high", summary: "Stikkontakt satt inn onsdag forrige uke virker ikke, Grünerløkka 0560", ...)`)
    "Takk. Saksnummer [ID]. Elektriker ringer innen en time. SMS-
    bekreftelse kommer nå."
8. (`send_sms_callback_confirmation(...)`)
9. **Agent:** "Er det noe mer?"
10. → endCall.

### Akseptkriterier
- [ ] Ingen "vår feil"-frasering.
- [ ] Ingen løfter om gratis utbedring.
- [ ] Ticket priority "high".
- [ ] Saksnummer + SMS sendt.

---

## E7 — Samsvarserklæring-request

**Kunde-arketyp:** Sertifisering-spørrer'n (G) variant.

**Inn-replikk:** "Jeg skal selge huset og trenger samsvarserklæring for
el-anlegget. Kan dere utstede det?"

### Forventet flow

1. **Agent:** "Samsvarserklæring utsteder elektriker etter å ha kontrollert
   anlegget på stedet — det er ikke noe jeg kan gjøre over telefon.
   Men jeg kan logge saken så elektriker tar kontakt for å avtale
   gjennomgang. Er det privat eller næring?"
2. **Kunde:** "Privat — enebolig."
3. **Agent:** "Adresse eller postnummer?"
4. **Kunde:** "{{postnummer:0870}}, Nordstrand."
5. **Agent:** "Og når skal huset selges — haster det?"
6. **Kunde:** "Inspeksjon om tre uker."
7. **Agent:** "Greit. Hva heter du og hvilket nummer?"
8. **Kunde:** "Tor Nilsen, {{tel:91223344}}."
9. **Agent:** (`create_ticket(category: "lead_inspection", priority: "high", summary: "Samsvarserklæring salgs-inspeksjon enebolig Nordstrand 0870, inspeksjon om 3 uker", ...)`)
    "Takk. Saksnummer [ID]. Elektriker ringer innen en virkedag for å
    avtale befaring. SMS-bekreftelse kommer nå."
10. → endCall.

### Akseptkriterier
- [ ] Samsvarserklæring IKKE lovet — kun elektriker kan utstede.
- [ ] Scope-brudd unngått (ikke diskutert innhold i samsvarserklæring).
- [ ] Tidspress (3 uker) registrert i ticket for prioritering.
- [ ] Alle 4 kvalifiserings-felter utfylt.

---

## Test-matrise for Ella

Kombiner S1–S15 fra `scenario-playbook.md` med E1–E7:

| Test | Dekker | Obligatorisk før deploy |
| --- | --- | --- |
| S1, E1 | Privat lead happy-path | Ja |
| E2 | Bedrift lead | Ja |
| S2, E5 | Pris-spørsmål (range) | Ja |
| S3 | Tenke på det | Ja |
| S4, E6 | Klage | Ja |
| S5 | Ber om menneske | Ja |
| S6 | Frustrasjon | Ja |
| S7, E4 | Akutt (brann-risiko) | Ja (kritisk) |
| E3 | Strømbrudd uten brann | Ja |
| S8, E7 | Scope-brudd (samsvarserkl.) | Ja (kritisk) |
| S9 | Engelsk | Ja |
| S10 | Annet språk | Ja |
| S11 | Ikke ta opp | Ja |
| S12 | AI/menneske | Ja |
| S13 | Tool-feil | Ja |
| S14 | Stillhet | Ja |
| S15 | Prompt injection | Ja |

**Akseptgrense:** 17/18 tests passerer før deploy. E4 (brann-akutt) og E7
(samsvarserklæring-scope) er kritisk og må være 100%.

## Referanser

- `inbound-master-plan.md` — kontekst.
- `variables.md` — verdier brukt i disse flowene.
- `pronunciation-dictionary.md` — NELFO, ElTilsyn, Elvia, tekniske termer.
- `../shared/scenario-playbook.md` — S1–S15 som disse supplerer.
- `../shared/fallback-bibliotek-no.md` — replikker disse er basert på.
