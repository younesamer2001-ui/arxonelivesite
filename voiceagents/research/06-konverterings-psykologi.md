# 06 — Konverterings-psykologi

Hvordan får vi agenten til å konvertere ringende interessenter til betalende
kunder, uten å være pushy, manipulativ eller tydelig et "salgsmanus"?

TL;DR: **Kvalifisér raskt, foreslå neste konkrete steg, fjern friksjon,
aldri tving en beslutning.** Norsk kulturell kontekst: pushy selger ≠ trygg
kjøpsopplevelse. Vi vinner med klarhet og lav terskel, ikke med "limited-time
offer".

---

## 1. Konverteringstrakten for innringere

Alle tre nisjene følger samme grunntrakt:

```
Inn → Kvalifisere → Forstå behov → Foreslå tiltak → Bekrefte → Følge opp
```

| Steg | Hvem gjør hva |
| --- | --- |
| Inn | Kunde ringer, agent svarer med disclosure + "Hva kan jeg hjelpe deg med?" |
| Kvalifisere | Agent stiller 1–3 korte spørsmål for å plassere kunden |
| Forstå behov | Agent speiler behovet tilbake for å vise at det er forstått |
| Foreslå tiltak | Agent gir konkret neste steg (befaring, time, tilbud) |
| Bekrefte | Agent sikrer avtalen (dato, kontaktinfo, SMS-bekreftelse) |
| Følge opp | Ticket/SMS/kalenderinnkalling sendes |

Fallet skjer oftest i steg 4 eller 5 — kunden sier "jeg må tenke på det".
Vår default mot det: **lavterskel-neste-steg** (se §5).

## 2. Kvalifisering — 1 til 3 spørsmål, aldri fler

Per video om enkelhet (Regel 3): **Aldri fem spørsmål når tre holder.** En AI
som intervjuer deg for lenge i telefonen føles som et skjema.

**Lisa (Helse):** Behov + hastverk + forsikring.
1. "Hva gjelder det?"
2. "Haster det, eller kan det vente noen dager?"
3. "Er det en refusjonsordning eller forsikring som dekker det?"

**Max (Bilverksted):** Bil + problem + tidshorisont.
1. "Hvilken bil — merke og modell?"
2. "Hva er problemet?"
3. "Når trenger du den ferdig?"

**Ella (Elektriker):** Type jobb + lokasjon + hastverk.
1. "Hva er det du trenger — mindre reparasjon, installasjon, eller noe større?"
2. "Hus eller leilighet, og hvor er det?"
3. "Haster det, eller kan vi komme innen uka?"

**Regel:** Hvis spørsmål 3 ikke kan besvares kort, gå videre — ikke blokkér.

## 3. Speiling — vis at du har forstått

Etter kvalifisering, speile tilbake i én setning. Dette er *ikke* salgstrick, det
er "basic human listening". Men LLM-er glemmer det hvis vi ikke ber eksplisitt.

Skjelett-prompten:
```
Etter kunden har gitt kvalifiseringssvar, oppsummer kort hva du har hørt
i én setning, bekreft med "stemmer det?" eller tilsvarende.
```

Eksempel (Ella):
```
Kunde: Jeg trenger en ladeboks hjemme, hus i Oslo, ikke hastverk.
Ella:  Så du vil ha en ladeboks installert i et hus i Oslo, uten noe hastverk —
       stemmer det?
Kunde: Ja.
Ella:  Fint. Da foreslår jeg at vi sender en elektriker på befaring...
```

Effekten: Kunden føler seg hørt, og agenten unngår å handle på halvforstått info.

## 4. Foreslå konkret neste steg — ikke "ring oss tilbake"

Agenten må alltid foreslå **ett konkret steg**, ikke generell oppfordring:

| ✗ Svakt | ✓ Sterkt |
| --- | --- |
| "Ring oss tilbake hvis du vil bestille" | "Skal jeg booke befaring onsdag eller torsdag?" |
| "Du kan se priser på nettsiden" | "Jeg sender deg en SMS med pristabellen nå" |
| "Vi har mange alternativer" | "Det passer best med X fordi [grunn] — vil du prøve det?" |

Dette er "alternative-close" på salgs-språk. Men på norsk trigger alternativ-
close ikke forsvar hvis det er *relevant* og ikke presset.

## 5. Fjern friksjon — SMS med link

En vanlig norsk respons er "jeg må sjekke kalenderen" / "jeg må snakke med
samboeren". Ikke press — send SMS.

**Tools som trigges:**
- `send_sms_booking_link` → SMS med direktelink til booking-side med
  pre-utfylt info.
- `send_sms_quote_summary` → SMS med oppsummering av samtalen + pris-range.

**Replikk:**
```
Agent: Helt greit, ta den tiden du trenger. Jeg sender deg en SMS med
       link til booking nå, så kan du velge tid når det passer.
       <send_sms_booking_link>
       Hvis du har spørsmål før det, bare ring tilbake.
```

Effekten:
- Kunden tar kontroll → lavere defensive respons.
- SMS-link gir målbar konvertering.
- Hvis de ikke booker, utløser follow-up-automation etter 24t (fase 2).

## 6. Håndtering av innvendinger — 3-steg

LLM-er har en tendens til å overforklare når kunden sier "det er dyrt". Bruk
**anerkjenn → kontekstualisér → neste steg**.

### Eksempel: "Det er for dyrt"

Kunde: "Seks tusen for å skifte en ladeboks? Det er mye."

Svakt LLM-svar: "Vi tilbyr markedets beste service og Norge har høye priser..."
(forsvar, føles hul)

Riktig:
```
Ella: Jeg skjønner at det høres mye ut. Prisen inkluderer befaring,
      selve installasjonen, sertifisering og garanti — og vi tar alt
      avfall etter oss. Hvis det er budsjettet som er utfordringen,
      har vi en rimeligere modell som starter på [X kroner]. Vil du
      høre om den?
```

Mønster:
1. **Anerkjenn**: "Jeg skjønner at det høres mye ut."
2. **Kontekstualisér**: Hva inngår, hvorfor prisen er som den er.
3. **Neste steg**: Tilby alternativ, spør om interesse.

### Eksempel: "Jeg må tenke på det"

```
Lisa: Helt i orden. Skal jeg sende deg en SMS med informasjonen vi har
      snakket om, så har du alt samlet når du bestemmer deg?
```

Ikke "når vil du ha svar tilbake innen?" — det er press. Gjør lav-friksjon
follow-up.

### Eksempel: "Har dere konkurrent X?"

Agenten skal *ikke* trashe konkurrenter. Norge er et lite land, kunden
kjenner kanskje eieren.

```
Max: De er dyktige folk, absolutt. Det som skiller oss er [én tydelig
     differensiator fra variables.md — f.eks. "vi er åpne på lørdag"].
     Skal jeg booke deg likevel, eller vil du sammenligne først?
```

Differensiatoren står i `variables.md` som `key_differentiator`.

## 7. Konverterings-ord vi bruker / unngår

**Bruker:**
- "Skal vi sette det opp?" (lavere press enn "vil du booke?")
- "Det passer best onsdag" (konkret alternativ)
- "Jeg sender en SMS nå så har du alt" (service, ikke salg)
- "Det er inkludert" (fjerner bekymring)
- "Trygt og raskt" (to ord nordmenn vekter høyt)

**Unngår:**
- "Limited offer" / "bare i dag"
- "Ikke gå glipp av"
- "100 % garantert"
- "Alle velger oss"
- "Tro meg"
- Hype-adjektiver: fantastisk, utrolig, amazing

Skjelett-prompten har svarteliste:
```
Ikke bruk ord: fantastisk, utrolig, garantert, limited, eksklusiv,
tro meg. Hold tonen saklig og hjelpende.
```

## 8. Pris-kommunikasjon — range før eksakt

Når kunden spør om pris, gi alltid **range først**, ikke eksakt tall:

```
Kunde: Hva koster EU-kontroll?
Max:   En EU-kontroll ligger vanligvis mellom 900 og 1500 kroner hos
       oss, avhengig av biltype. Hva slags bil har du, så blir jeg mer
       presis?
```

Grunn: Hvis vi gir ett tall og kunden finner én krone dyrere på fakturaen,
har vi et problem. Range skaper forventning om variabel pris og gir rom for
nøyaktighet når vi har data.

## 9. Sosialt bevis — sparsomt og konkret

Norsk publikum er skeptiske til testimonial-spam. Men konkrete referanser
funker:

```
Ella: Vi har installert rundt 200 ladebokser i Oslo-området siste året,
      så vi kjenner byggene godt.
```

Ikke: "Tusenvis av fornøyde kunder". Vagt = mistroisk.

Tall står i `variables.md` som `proof_points` og brukes bare når relevant.

## 10. Timing — når skal agenten "lukke"?

Reglen: **Første konkrete forslag bør komme innen 90 sekunder** inn i
samtalen. Hvis agenten småprater i 3 minutter uten å foreslå handling,
legger kunden på.

Målt i `analysisPlan`:
- `time_to_first_offer_seconds`.
- Akseptgrense: p50 < 90 s, p95 < 180 s.

## 11. Norsk kulturell kontekst

- **Vi liker ikke skryt.** Selv velbegrunnet skryt utløser skepsis. Hold tonen
  saklig.
- **Vi liker konkrete tall.** "Vi kan være der tirsdag kl. 14" slår "vi
  kommer snart".
- **Vi liker å velge selv.** Alternativer > pålegg.
- **Vi liker transparens.** Hvis noe er dyrere, si hvorfor.
- **Vi liker "ja, og"** > "nei, men". Agenten skal aldri si "nei, det går
  ikke" uten å følge opp med et alternativ.

## 12. Konverterings-metrikker

Logges via `analysisPlan`:

| Metrikk | Definisjon | Mål |
| --- | --- | --- |
| `call_outcome` | booked / quote_sent / info_only / abandoned / escalated | Booked ≥ 35% av ikke-service-samtaler |
| `time_to_first_offer_seconds` | Fra start til første forslag | p50 < 90 |
| `objection_count` | Antall innvendinger i samtalen | Mål ≤ 2 |
| `customer_sentiment_end` | LLM-vurdering av kundens tone ved slutt | ≥ 0.6 på skala −1 til 1 |
| `sms_followup_sent` | Boolean — ble SMS sendt? | Bør være høyt for ikke-bookede |

Rapport ukentlig i fredag-review (per `PRINSIPPER.md §Regel 5`).

## 13. Anti-mønstre å banne eksplisitt i prompt

```
Ikke:
- Press kunden til å bestemme seg "nå".
- Snakk ned konkurrenter.
- Gi rabatt som agenten ikke har fullmakt til.
- Bekreft bestilling uten eksplisitt "ja" fra kunden.
- Forlenge samtalen hvis kunden signaliserer at de vil legge på.
```

Alle står i skjelett-promptens guardrails-seksjon.

## 14. Sjekkliste før deploy

- [ ] Kvalifiserings-spørsmål definert per nisje (maks 3).
- [ ] Speilings-regel aktivert i prompt.
- [ ] Alternativ-close-mønster i bruk.
- [ ] SMS-tools (`send_sms_booking_link`, `send_sms_quote_summary`) konfigurert.
- [ ] Innvendings-håndtering øvet på 5 typiske caser.
- [ ] Svarteliste av hype-ord aktivert.
- [ ] Key differentiator i `variables.md`.
- [ ] Pris-range (ikke eksakt) håndtert via KB.
- [ ] Metrikker logget.

## Referanser

- `PRINSIPPER.md §Regel 5 og §Regel 10` — måle alt, forsterke mennesker.
- `05-edge-cases-og-guardrails.md §Scenario F` — kvalifiseringsflyt.
- `09-knowledge-base-strategi.md` — prisranger kommer fra KB.
- `shared/skeleton-system-prompt.md` — hvor reglene her blir til prompt-tekst.
