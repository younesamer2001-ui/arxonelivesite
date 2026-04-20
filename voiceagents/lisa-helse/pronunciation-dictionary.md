# Lisa — Pronunciation Dictionary

Nisje-spesifikke uttalefikser for Lisa. Disse brukes som SSML-substitusjoner,
Azure lexicon-XML entries, eller replace-regler i transcriber før TTS.

Følger mal-strukturen i `../shared/variables-schema.md §6` og rulles opp
i `vapi-config.json` under `voice.ssml.substitutions`.

---

## 1. Helse- og offentlig-sektor-termer

| Term (skrift) | Feil uttale (Azure default) | Riktig fonetikk | SSML / tag |
| --- | --- | --- | --- |
| HELFO | "hel-fo" (stavet, flatt) | /hɛlˈfuː/ "hell-FOO" | `<sub alias="hellfoo">HELFO</sub>` |
| HELFO-refusjon | blandet kaos | /hɛlˈfuː rɛfʉˈʂuːn/ | `<sub alias="hellfoo refusjon">HELFO-refusjon</sub>` |
| egenandel | "e-ge-nan-del" (feil trykk) | /ˈeː.ɡən.ɑn.dəl/ trykk på "e" | `<phoneme alphabet="ipa" ph="ˈeːɡənɑndəl">egenandel</phoneme>` |
| fastlege | "fast-leh-ge" | /ˈfɑst.leː.ɡə/ | *(fungerer default)* |
| fysioterapeut | "fy-zi-o..." | /fyˈsiː.oː.tɛ.rɑ.pøyt/ | `<phoneme alphabet="ipa" ph="fyˈsiːoːtɛrɑpøyt">fysioterapeut</phoneme>` |
| psykolog | "psy-ko-log" (s-lyd feil) | /psyˈkoː.lɔɡ/ | *(sjekk, default ofte OK)* |
| takstkode | "takst-koh-de" | /ˈtɑkst.koː.də/ | *(default OK)* |
| sykemelding | "sy-ke-mel-ding" | /ˈsyː.kə.mɛl.dɪŋ/ | *(default OK)* |
| henvisning | "hen-vis-ning" | /ˈhɛn.viːs.nɪŋ/ | *(default OK)* |
| journal | "jor-nal" (fransk) | /jʉrˈnɑːl/ (norsk) | `<sub alias="jurnaal">journal</sub>` |
| allmennlege | "all-menn-leh-ge" | /ˈɑl.mən.leː.ɡə/ | *(default OK)* |
| samtykke | "sam-tyk-ke" | /ˈsɑm.tyk.kə/ | *(default OK)* |
| taushetsplikt | "taws-hets-plikt" | /ˈtæʉs.hets.plɪkt/ | *(default OK)* |
| rekvisisjon | "rek-vi-sis-jon" | /rɛk.vɪ.sɪˈʂuːn/ | `<sub alias="rekvisisjon">rekvisisjon</sub>` |

## 2. Nødnummer og offentlige enheter

| Term | Default | Fix | Kommentar |
| --- | --- | --- | --- |
| 113 | "en-hundre-og-tretten" | "ett-en-tre" (siffer) | Akutt medisinsk — les alltid siffer for siffer |
| 116 117 | "hundre-og-seksten..." | "en-en-seks en-en-sju" | Legevakt, siffer for siffer |
| NAV | "nav" (som ord) | "N-A-V" (bokstaver) | Hvis nevnt, stav alltid |
| Pasientreiser | default | /pɑˈsi.ɛnt.rɛɪ.sər/ | *(default OK)* |
| Inspera / Helsenorge | varierer | se §4 produktnavn | — |

SSML for 113:
```xml
<say-as interpret-as="digits">113</say-as>
```
…eller:
```xml
ring <say-as interpret-as="digits">113</say-as> nå.
```

## 3. Telefon, tall, beløp og tid

Disse er allerede dekket globalt (i `../shared/skeleton-system-prompt.md`),
men vi gjentar Lisa-spesifikke eksempler for testing:

| Markør i prompt | Eksempel verdi | SSML-rendering |
| --- | --- | --- |
| `{{tel:92841726}}` | 92 84 17 26 | `<say-as interpret-as="telephone">92841726</say-as>` |
| `{{time:14:30}}` | halv tre | `<say-as interpret-as="time" format="hms12">14:30</say-as>` |
| `{{date:2026-04-23}}` | torsdag 23. april | `<say-as interpret-as="date" format="ymd">2026-04-23</say-as>` |
| `{{amount:650}}` | 650 kroner | `seks hundre og femti kroner` (spell out, unngå "sex hundre") |
| `{{amount:212}}` | 212 kroner egenandel | `to hundre og tolv kroner egenandel` |

**OBS:** "650" lest av Azure default kan bli "seks-null-fem" hvis uheldig.
Pre-prosesser: erstatt `{{amount:NNN}}` med norske tallord før TTS.

## 4. Produktnavn, systemer, partnere

| Navn | Uttale-fix | Notat |
| --- | --- | --- |
| Helseklinikken AS | "Helse-klinikken A-S" | Stav "AS", ikke "ass" |
| Vapi | "Vap-i" /ˈvɑː.pi/ | Intern, sjelden nevnt overfor kunde |
| Trieve | "Triiv" /triːv/ | Intern, aldri overfor kunde |
| Azure | "Asjur" /ˈæ.ʒɚ/ | Intern, aldri overfor kunde |
| Helsenorge.no | "Helse-norge punktum no" | Hvis nevnt |

**Regel:** Interne systemnavn (Vapi, Trieve, Azure) skal ALDRI nevnes i
kunde-samtaler. Dette er dekket av G7 i `../shared/guardrails.md`.

## 5. Provider / behandler-navn (fiktive for MVP)

Klinikken har tre faste navn i demoen. Legges i KB + her for uttale-testing.

| Navn | Rolle | SSML / fonetikk |
| --- | --- | --- |
| Ingrid Hansen | fysioterapeut | `<phoneme alphabet="ipa" ph="ˈɪŋ.ɡrɪd ˈhɑn.sən">Ingrid Hansen</phoneme>` |
| Ola Bergstrøm | fastlege | `<phoneme alphabet="ipa" ph="ˈuː.lɑ ˈbærɡ.strœm">Ola Bergstrøm</phoneme>` |
| Marte Lien | psykolog | `<phoneme alphabet="ipa" ph="ˈmɑr.tə ˈliː.ən">Marte Lien</phoneme>` |

**NB:** "Bergstrøm" har ø-vokal — Azure default sliter ofte med ø midt i
ord. Hvis `<phoneme>` ikke støttes i runtime, fallback til `<sub
alias="Bergstrøm">Bergstrøm</sub>` og la Azure gjette.

## 6. Adresse / sted

| Term | Fix | SSML |
| --- | --- | --- |
| Grünerløkka | "Gry-ner-lø-kka" | `<phoneme alphabet="ipa" ph="ˈɡryː.nər.lœ.kɑ">Grünerløkka</phoneme>` |
| Oslo | /ˈʉʂ.lʉ/ (ikke "os-lo") | *(default OK på nb-NO)* |
| T-banen | "te-ba-nen" | `<sub alias="te baanen">T-banen</sub>` |

## 7. Engelske termer som kunden kan bruke

Hvis en kunde bruker engelsk ord i norsk setning (vanlig i Oslo), uttale-fiks:

| Term | Norsk uttale (foretrukket) | SSML |
| --- | --- | --- |
| booking | /ˈbuː.kɪŋ/ | *(default OK)* |
| app | /ˈɑp/ kort | *(default OK)* |
| SMS | "ess-emm-ess" | `<say-as interpret-as="characters">SMS</say-as>` |
| QR-kode | "ku-ær kode" | `<sub alias="kuær-kode">QR-kode</sub>` |
| MVA | "emm-ve-aa" | `<say-as interpret-as="characters">MVA</say-as>` |

## 8. Replace-regler (regex pre-prosessering)

Disse kjøres i agent-lag FØR teksten sendes til Azure TTS:

```yaml
replace_rules:
  # Akutt-sifre alltid leses enkeltvis
  - match: "\\b113\\b"
    replace: '<say-as interpret-as="digits">113</say-as>'
  - match: "\\b116\\s*117\\b"
    replace: '<say-as interpret-as="digits">116117</say-as>'

  # HELFO
  - match: "\\bHELFO\\b"
    replace: '<sub alias="hellfoo">HELFO</sub>'

  # Telefonnummer (8 siffer) → telephone
  - match: "\\b(\\d{2})\\s?(\\d{2})\\s?(\\d{2})\\s?(\\d{2})\\b"
    replace: '<say-as interpret-as="telephone">$1$2$3$4</say-as>'

  # Tid HH:MM
  - match: "\\b(\\d{1,2}):(\\d{2})\\b"
    replace: '<say-as interpret-as="time" format="hms24">$1:$2</say-as>'
```

Merk: Regex er defensiv — eksempler, må testes i faktisk agent-layer (Vapi
`voice.lexicon` eller egen pre-TTS-pipeline).

## 9. Tegnsetting og pauser

| Situasjon | SSML | Kommentar |
| --- | --- | --- |
| Etter emergency-setning | `<break time="800ms"/>` | La "113" lande før neste setning |
| Før recap av booking | `<break time="400ms"/>` | "Skal jeg booke... *(pause)* torsdag kl 14:30?" |
| Mellom tjeneste og pris | `<break time="250ms"/>` | "Førstegangskonsultasjon *(pause)* seks hundre og femti kroner." |
| Efter "Et lite øyeblikk" | `<break time="300ms"/>` | Før tool-kall-lyd |

## 10. Kjente feil fra Azure nb-NO-PernilleNeural

Basert på prøvekjøring (logg i `voiceagents/research/09-uttale-tester.md`
hvis den finnes):

1. **"egenandel"** — trykket havner feil (`e-gen-AN-del` i stedet for
   `E-gen-an-del`). Fikses med `<phoneme>` eller skriv om til "pasientens
   egenandel" (lengre frase endrer rytme).
2. **"HELFO"** — uttales "hel-F-O" (stavet) i 40% av tilfellene. `<sub>`
   alias-fix i §1 løser dette.
3. **"bergstrøm"** — Pernille uttaler ofte /beːr-strøm/ uten g. `<phoneme>`-
   tag obligatorisk.
4. **ø midt i ord** — generelt: `<phoneme>` hvis kritisk navn.
5. **Tall > 100** — Pernille default leser 650 som "seks hundre femti"
   (uten "og") — akseptabelt, men inkonsistent med norsk formell skrift.
   Velg én stil og hold den.

## 11. Test-setninger for QA før deploy

Disse skal lyttes til før Lisa går live:

1. "Ring **113** nå. Jeg legger på så linja er fri."
   → Forvent: siffer-for-siffer, pause etter.
2. "**HELFO** dekker delvis. Din **egenandel** blir to hundre og tolv kroner."
   → Forvent: "hellfoo", "E-gen-an-del".
3. "Du har time hos **Ingrid Hansen** torsdag klokka halv tre."
   → Forvent: ren norsk uttale, ikke engelsk I-.
4. "**Ola Bergstrøm** er ledig mandag klokka ti."
   → Forvent: g-lyd hørbar i "Bergstrøm".
5. "**Grünerløkka** — vi ligger i Thorvald Meyers gate."
   → Forvent: ü uttales som y, ikke u.
6. "Jeg sender deg en SMS på nummeret **92 84 17 26** nå."
   → Forvent: par-vis lesning av telefonnummer.

## 12. Versjonering

```yaml
pronunciation_dictionary_version: "1.0.0"
niche_id: "lisa-helse"
last_updated: "2026-04-18"
depends_on:
  - "../shared/variables-schema.md §6"
  - "../shared/skeleton-system-prompt.md"
```

## Referanser

- `inbound-master-plan.md` — hvilke termer Lisa møter.
- `variables.md` — voice-provider (`nb-NO-PernilleNeural`).
- `scenarios.md` — L1 bruker HELFO + egenandel, L4 bruker 113.
- `../shared/variables-schema.md §6` — globale SSML-regler.
- `../shared/skeleton-system-prompt.md` — hvor `{{}}`-markører renderes.
