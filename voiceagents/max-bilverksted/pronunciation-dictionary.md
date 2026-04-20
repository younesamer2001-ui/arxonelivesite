# Max — Pronunciation Dictionary

Nisje-spesifikke uttalefikser for Max. SSML-substitusjoner + replace-
regler for bilverksted-termer, bilmerker, og nødnummer.

Følger mal-strukturen i `../shared/variables-schema.md §6`.

---

## 1. Bilverksted-termer

| Term | Feil uttale | Riktig fonetikk | SSML / tag |
| --- | --- | --- | --- |
| EU-kontroll | "e-u-kontroll" (stavet løst) | /ˈeː.ʉː.kɔnˌtrɔl/ "E-U-kontroll" | `<say-as interpret-as="characters">EU</say-as>-kontroll` |
| bremseklosser | "brem-se-kloss-er" | /ˈbrɛm.sə.klɔs.sər/ | *(default OK)* |
| dekkskift | "dekk-skift" | /ˈdɛk.ʃɪft/ | *(default OK)* |
| klimaanlegg | "kli-ma-an-legg" | /ˈkliː.mɑ.ɑnˌlɛɡ/ | *(default OK)* |
| navskift | "nav-skift" | /ˈnɑv.ʃɪft/ | *(default OK)* |
| lånebil | "lå-ne-bil" | /ˈloː.nə.biːl/ | *(default OK)* |
| reklamasjon | "rek-la-ma-sjon" | /rɛk.lɑ.mɑˈʂuːn/ | *(default OK)* |
| garanti | "ga-ran-ti" | /ɡɑˈrɑn.tiː/ | *(default OK)* |
| befaring | "be-fa-ring" | /bɛˈfɑː.rɪŋ/ | *(default OK)* |
| reg.nr | "reg-n-r" (feil) | "registreringsnummer" eller "R-E-G-punkt-N-R" | `<sub alias="registreringsnummer">reg.nr</sub>` |

## 2. Nødnummer / assistanse

| Nummer | Default | Fix | Kommentar |
| --- | --- | --- | --- |
| 110 | "en-hundre-og-ti" | "ett-ett-null" | Brann (bil på brann). SSML: `<say-as interpret-as="digits">110</say-as>` |
| 112 | (hvis nevnt) | "ett-ett-to" | Politi/nødsentral. |
| 113 | — | (ikke relevant for Max) | Medisinsk — Max henviser sjelden hit. |
| 06000 | "seks-null-null-null" | "null-seks-null-null-null" | Viking Redningstjeneste. Les alltid siffer. |
| 08505 | "åtte-fem-null-fem" | "null-åtte-fem-null-fem" | NAF Veihjelp. |

SSML-eksempler:
```xml
ring <say-as interpret-as="digits">06000</say-as> til Viking
ring <say-as interpret-as="digits">08505</say-as> til N-A-F
```

## 3. Partnere og merkevarer

| Navn | Uttale-fix | Notat |
| --- | --- | --- |
| Viking Redningstjeneste | "Vaiking" /ˈvaɪ.kɪŋ/ (engelsk) | Sjekk: norsk uttale er /ˈviː.kɪŋ/ — vi foretrekker norsk |
| NAF | "N-A-F" (stavet) | `<say-as interpret-as="characters">NAF</say-as>` |
| Falck | /fɑlk/ | *(default OK)* |
| BilXtra | "Bil-Ekstra" | `<sub alias="Bilekstra">BilXtra</sub>` |
| Mekonomen | /mɛ.kuˈnuː.mɛn/ | `<phoneme alphabet="ipa" ph="mɛkuˈnuːmɛn">Mekonomen</phoneme>` |
| AutoMester | "Auto-Mester" | *(default OK)* |
| Statens vegvesen | "Sta-tens veg-vesen" | *(default OK)* |

## 4. Bilmerker — norsk uttale-preferanse

Mange bilmerker uttales engelsk i Norge, men norske neural-stemmer sliter
med blandingen. Regel: lå TTS uttale default, med mindre det blir helt galt.

| Merke | Default feil | Fix |
| --- | --- | --- |
| BMW | "be-em-we" (tysk) | `<say-as interpret-as="characters">BMW</say-as>` — gir norsk "B-M-W" som stemmer med daglig bruk |
| Volkswagen | "volks-vaa-gen" | /ˈvɔlks.vɑː.ɡən/ *(default OK)* |
| Mercedes | /mɛrˈseː.dəs/ | *(default OK)* |
| Peugeot | "pøsjo" /pøˈʂoː/ | `<phoneme alphabet="ipa" ph="pøˈʂoː">Peugeot</phoneme>` |
| Citroën | "sitrøen" /siˈtrøː.ɛn/ | `<phoneme alphabet="ipa" ph="siˈtrøːɛn">Citroën</phoneme>` |
| Renault | "reno" /rɛˈnoː/ | `<phoneme alphabet="ipa" ph="rɛˈnoː">Renault</phoneme>` |
| Hyundai | "hyundai" — kaos | `<sub alias="hy-un-dai">Hyundai</sub>` |
| Škoda | "sko-da" | `<sub alias="skoda">Škoda</sub>` |
| Tesla | /ˈtɛs.lɑ/ | *(default OK)* |
| Toyota | /tɔˈjoː.tɑ/ | *(default OK)* |
| Volvo | /ˈvɔl.vʉ/ | *(default OK)* |

## 5. Reg.nr-lesing (NATO alfabet)

Max skal ALLTID bekrefte reg.nr med NATO alfabet. Stav bokstavene,
les sifrene én og én.

### Norsk NATO-mapping (samme som internasjonalt)

| Bokstav | NATO-ord | Uttale-note |
| --- | --- | --- |
| A | Alpha | /ˈæl.fɑ/ — kan aksepteres |
| B | Bravo | /ˈbrɑː.voː/ |
| C | Charlie | /ˈtʃɑːr.liː/ |
| D | Delta | /ˈdɛl.tɑ/ |
| E | Echo | /ˈɛ.koː/ |
| F | Foxtrot | /ˈfɔks.trɔt/ |
| G | Golf | /ɡɔlf/ |
| H | Hotel | /hoːˈtɛl/ |
| I | India | /ˈɪn.diːɑ/ |
| J | Juliet | /ˈjuː.liːɛt/ |
| K | Kilo | /ˈkiː.loː/ |
| L | Lima | /ˈliː.mɑ/ |
| M | Mike | /mɑɪk/ |
| N | November | /noˈvɛm.bər/ |
| O | Oscar | /ˈɔs.kɑr/ |
| P | Papa | /ˈpɑː.pɑ/ |
| Q | Quebec | /kvɛˈbɛk/ |
| R | Romeo | /ˈroː.mɛ.oː/ |
| S | Sierra | /siˈɛr.rɑ/ |
| T | Tango | /ˈtɑŋ.ɡoː/ |
| U | Uniform | /ˈjuː.ni.fɔrm/ |
| V | Victor | /ˈvɪk.tɔr/ |
| W | Whiskey | /ˈvɪs.kiː/ |
| X | X-ray | /ˈɛks.rɛɪ/ |
| Y | Yankee | /ˈjɑŋ.kiː/ |
| Z | Zulu | /ˈsʉː.lʉː/ |

### Template for reg.nr-readback

```
"[Bokstav 1] som i [NATO], [Bokstav 2] som i [NATO], 
<say-as interpret-as="digits">12345</say-as> — stemmer det?"
```

Eksempel: "AB 12345" → "A som i Alpha, B som i Bravo, ett-to-tre-fire-fem
— stemmer det?"

## 6. Telefon, tall, beløp, tid

Arver fra `../shared/variables-schema.md §6`. Max-spesifikke eksempler:

| Markør | Eksempel | SSML |
| --- | --- | --- |
| `{{tel:41223344}}` | 41 22 33 44 | `<say-as interpret-as="telephone">41223344</say-as>` |
| `{{regnr:AB12345}}` | "A som i Alpha..." | se §5 template |
| `{{time:09:00}}` | ni null null | `<say-as interpret-as="time" format="hms24">09:00</say-as>` |
| `{{amount:750}}` | sju hundre og femti kroner | `sju hundre og femti kroner` |
| `{{amount:3500}}` | tre tusen fem hundre kroner | `tre tusen fem hundre kroner` |

## 7. Replace-regler (regex pre-prosessering)

```yaml
replace_rules:
  # Nødnummer siffer for siffer
  - match: "\\b110\\b"
    replace: '<say-as interpret-as="digits">110</say-as>'
  - match: "\\b06000\\b"
    replace: '<say-as interpret-as="digits">06000</say-as>'
  - match: "\\b08505\\b"
    replace: '<say-as interpret-as="digits">08505</say-as>'

  # EU-kontroll
  - match: "\\bEU-kontroll\\b"
    replace: '<say-as interpret-as="characters">EU</say-as>-kontroll'

  # NAF
  - match: "\\bNAF\\b"
    replace: '<say-as interpret-as="characters">NAF</say-as>'

  # reg.nr
  - match: "\\breg\\.nr\\b"
    replace: '<sub alias="registreringsnummer">reg.nr</sub>'

  # BilXtra
  - match: "\\bBilXtra\\b"
    replace: '<sub alias="Bilekstra">BilXtra</sub>'

  # Telefonnummer (8 siffer) → telephone
  - match: "\\b(\\d{2})\\s?(\\d{2})\\s?(\\d{2})\\s?(\\d{2})\\b"
    replace: '<say-as interpret-as="telephone">$1$2$3$4</say-as>'
```

## 8. Pauser og tegnsetting

| Situasjon | SSML | Kommentar |
| --- | --- | --- |
| Etter reg.nr-readback | `<break time="400ms"/>` | La kunden bekrefte |
| Før "stemmer det?" | `<break time="300ms"/>` | Markere spørsmål |
| Etter emergency-setning | `<break time="800ms"/>` | La nummer lande |
| Mellom tjeneste og "fra"-pris | `<break time="250ms"/>` | "Stor service *(pause)* fra tre tusen fem hundre kroner" |

## 9. Kjente feil fra Azure nb-NO-FinnNeural

Basert på prøvekjøring:

1. **"EU-kontroll"** — blir av og til "eu-kontroll" (som ett ord). `<say-as
   interpret-as="characters">EU</say-as>` fikser.
2. **"Peugeot"** — Finn bruker engelsk "pee-zho". `<phoneme>` obligatorisk.
3. **"Hyundai"** — 4 varianter dokumentert, ingen konsistent. `<sub
   alias="hy-un-dai">` gir forutsigbart norsk-preget uttale.
4. **"BilXtra"** — blir "bil-X-tra" (engelsk X). `<sub>` fix.
5. **Nødnummer** — Finn leser 06000 som "seks tusen" hvis ikke wrapped i
   `<say-as interpret-as="digits">`.
6. **Reg.nr** — uten NATO kan Finn lese "AB12345" som "ab tolv tusen
   tre hundre førti fem". Regel-pålegg: alltid NATO.

## 10. Test-setninger for QA før deploy

1. "EU-kontroll koster sju hundre og femti kroner fast pris."
   → Forvent: "E-U-kontroll", tydelig tall.
2. "Hvis bilen står trafikkfarlig, ring Viking på null-seks-null-null-null."
   → Forvent: siffer-for-siffer.
3. "A som i Alpha, B som i Bravo, ett-to-tre-fire-fem — stemmer det?"
   → Forvent: tydelige NATO-ord, sifrene enkeltvis.
4. "Peugeot 308 fra 2019 — tar vi."
   → Forvent: "pøsjo", ikke "pee-zho".
5. "Stor service er fra tre tusen fem hundre kroner, endelig pris etter
   befaring."
   → Forvent: tydelig tall + pause før "endelig".
6. "Jeg sender deg SMS på 41 22 33 44."
   → Forvent: par-vis tel-lesning.

## 11. Versjonering

```yaml
pronunciation_dictionary_version: "1.0.0"
niche_id: "max-bilverksted"
last_updated: "2026-04-18"
depends_on:
  - "../shared/variables-schema.md §6"
  - "../shared/skeleton-system-prompt.md"
```

## Referanser

- `inbound-master-plan.md` — hvilke termer Max møter.
- `variables.md` — voice-provider (`nb-NO-FinnNeural`).
- `scenarios.md` — M1 + M6 bruker reg.nr, M4 bruker Viking/NAF/110.
- `../shared/variables-schema.md §6` — globale SSML-regler.
