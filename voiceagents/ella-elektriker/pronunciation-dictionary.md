# Ella — Pronunciation Dictionary

Nisje-spesifikke uttalefikser for Ella. SSML-substitusjoner for bransje-
termer, sertifiseringer, nettselskap, og tekniske begreper.

Følger mal-strukturen i `../shared/variables-schema.md §6`.

---

## 1. Bransje- og sertifiserings-termer

| Term | Feil uttale | Riktig fonetikk | SSML / tag |
| --- | --- | --- | --- |
| NELFO | "nel-fo" flatt | /ˈnɛl.fuː/ "nell-foo" | `<sub alias="nellfoo">NELFO</sub>` |
| ElTilsyn | "el-til-syn" | /ˈeːl.tɪl.syːn/ | *(default OK)* |
| samsvarserklæring | "sam-svars-er-klæ-ring" | /ˈsɑm.svɑʂ.ɛr.klæː.rɪŋ/ | *(default OK, men test)* |
| sentral godkjenning | "sen-tral god-kjen-ning" | /sɛnˈtrɑːl ˈɡuːˈçɛn.nɪŋ/ | *(default OK)* |
| ElHub | "el-hub" (engelsk) | /ˈeːl.hʉb/ (norsk) | `<sub alias="el-hubb">ElHub</sub>` |
| varmekabel | "var-me-ka-bel" | /ˈvɑr.mə.kɑː.bəl/ | *(default OK)* |
| sikringsskap | "sik-rings-skap" | /ˈsiːk.rɪŋs.skɑːp/ | *(default OK)* |
| stikkontakt | "stikk-kon-takt" | /ˈstɪk.kɔn.tɑkt/ | *(default OK)* |
| feilsøking | "feil-sø-king" | /ˈfæɪl.søː.kɪŋ/ | *(default OK)* |
| hovedsikring | "ho-ved-sik-ring" | /ˈhuː.vəd.sɪk.rɪŋ/ | *(default OK)* |
| jordfeil | "jord-feil" | /ˈjuːr.fæɪl/ | *(default OK)* |
| kursfordeler | "kurs-for-de-ler" | /ˈkʉʂ.fɔ.deː.lər/ | *(default OK)* |
| autorisert | "au-to-ri-sert" | /æʉ.tɔ.rɪˈseːt/ | *(default OK)* |
| befaring | "be-fa-ring" | /bɛˈfɑː.rɪŋ/ | *(default OK)* |

## 2. Nødnummer og nettselskap

| Nummer | Default | Fix | Kommentar |
| --- | --- | --- | --- |
| 110 | "en-hundre-og-ti" | "ett-ett-null" | Brann. `<say-as interpret-as="digits">110</say-as>` |
| 112 | "en-tolv" | "ett-ett-to" | Politi (sjelden relevant) |
| 07057 | "sju-null-fem-sju" | "null-sju-null-fem-sju" | Elvia Oslo-feilmelding |
| 07030 | (hvis annen region) | "null-sju-null-tre-null" | Lede (Viken) |

SSML-eksempler:
```xml
ring nettselskapet <phoneme alphabet="ipa" ph="ˈɛl.viːɑ">Elvia</phoneme> på <say-as interpret-as="digits">07057</say-as>
slå av hovedsikringen og ring <say-as interpret-as="digits">110</say-as>
```

## 3. Nettselskap og partnere

| Navn | Uttale-fix | Notat |
| --- | --- | --- |
| Elvia | /ˈɛl.viːɑ/ | Stort nettselskap Oslo/Viken |
| Lede | /ˈleː.də/ | Nettselskap Vestfold/Telemark |
| Tensio | /ˈtɛn.siː.oː/ | Nettselskap Trøndelag |
| Enova | /ɛˈnuː.vɑ/ | Energi-støtte |
| Elviken | (hvis nevnt) — split | `<sub alias="el-viken">Elviken</sub>` |
| DSB | "D-S-B" (stavet) | Direktoratet for samfunnssikkerhet |
| REN | "R-E-N" (stavet) | `<say-as interpret-as="characters">REN</say-as>` |

## 4. Elbil-lader / EV-termer

Disse kommer ofte fra kunder som har kjøpt elbil og vil ha hjem-lader:

| Term | Fix | SSML |
| --- | --- | --- |
| elbil-lader | "el-bil-la-der" | *(default OK)* |
| Type 2 | "type to" | `type <say-as interpret-as="cardinal">2</say-as>` |
| kWh | "kil-o-vatt-ti-me" | `<sub alias="kilowatt-time">kWh</sub>` |
| 22 kW | "to-to ki-lo-vatt" | `<say-as interpret-as="cardinal">22</say-as> <sub alias="kilowatt">kW</sub>` |
| Enova-støtte | "E-no-va støtte" | *(default OK)* |
| lastbalansering | "last-ba-lan-sering" | *(default OK)* |
| OCPP | "O-C-P-P" | `<say-as interpret-as="characters">OCPP</say-as>` |

## 5. Postnummer og områder

Ella spør ofte postnummer. Lesing bør være siffer-for-siffer for klarhet:

| Markør | Eksempel | SSML |
| --- | --- | --- |
| `{{postnummer:0579}}` | "null-fem-sju-ni" | `<say-as interpret-as="digits">0579</say-as>` |
| `{{postnummer:0278}}` | "null-to-sju-åtte" | `<say-as interpret-as="digits">0278</say-as>` |

Oslo-bydeler Ella kan møte:

| Navn | Uttale-fix | SSML |
| --- | --- | --- |
| Grünerløkka | "Gry-ner-lø-kka" | `<phoneme alphabet="ipa" ph="ˈɡryː.nər.lœ.kɑ">Grünerløkka</phoneme>` |
| Skøyen | "Skøy-en" /ˈʂøː.jən/ | *(default OK)* |
| Nordstrand | "Nord-strand" /ˈnuːr.strɑnd/ | *(default OK)* |
| Alnabru | "Al-na-bru" /ˈɑl.nɑ.brʉː/ | *(default OK)* |
| Tøyen | /ˈtœː.jən/ | *(default OK)* |
| Grefsen | /ˈɡrɛf.sən/ | *(default OK)* |
| Ullevål | /ˈʉl.lə.voːl/ | *(default OK)* |

## 6. Tall, beløp, tid

Arver fra `../shared/variables-schema.md §6`. Ella-spesifikke:

| Markør | Eksempel | Lesing |
| --- | --- | --- |
| `{{amount:15000}}` | 15 000 kroner | "femten tusen kroner" |
| `{{amount:35000}}` | 35 000 kroner | "trettifem tusen kroner" |
| `{{area:2000}}` | 2000 kvadratmeter | "to tusen kvadratmeter" |
| `{{tel:48112233}}` | 48 11 22 33 | `<say-as interpret-as="telephone">48112233</say-as>` |

## 7. Replace-regler (regex pre-prosessering)

```yaml
replace_rules:
  # Nødnummer siffer for siffer
  - match: "\\b110\\b"
    replace: '<say-as interpret-as="digits">110</say-as>'

  # Nettselskap-numre
  - match: "\\b07057\\b"
    replace: '<say-as interpret-as="digits">07057</say-as>'
  - match: "\\b07030\\b"
    replace: '<say-as interpret-as="digits">07030</say-as>'

  # NELFO
  - match: "\\bNELFO\\b"
    replace: '<sub alias="nellfoo">NELFO</sub>'

  # ElHub
  - match: "\\bElHub\\b"
    replace: '<sub alias="el-hubb">ElHub</sub>'

  # Elvia
  - match: "\\bElvia\\b"
    replace: '<phoneme alphabet="ipa" ph="ˈɛlviːɑ">Elvia</phoneme>'

  # DSB, REN (stavede bokstaver)
  - match: "\\bDSB\\b"
    replace: '<say-as interpret-as="characters">DSB</say-as>'
  - match: "\\bREN\\b"
    replace: '<say-as interpret-as="characters">REN</say-as>'

  # Postnummer (4 siffer, starter med 0 eller 1-9)
  - match: "\\bpostnummer (\\d{4})\\b"
    replace: 'postnummer <say-as interpret-as="digits">$1</say-as>'

  # Telefonnummer (8 siffer)
  - match: "\\b(\\d{2})\\s?(\\d{2})\\s?(\\d{2})\\s?(\\d{2})\\b"
    replace: '<say-as interpret-as="telephone">$1$2$3$4</say-as>'

  # kW og kWh
  - match: "\\bkWh\\b"
    replace: '<sub alias="kilowatt-time">kWh</sub>'
  - match: "\\bkW\\b"
    replace: '<sub alias="kilowatt">kW</sub>'
```

## 8. Pauser

| Situasjon | SSML | Kommentar |
| --- | --- | --- |
| Etter emergency-setning | `<break time="900ms"/>` | Kritisk at 110 lander |
| Mellom "slå av hovedsikringen" og "ring 110" | `<break time="400ms"/>` | Gir kunden tid til å ta inn |
| Før pris-range | `<break time="250ms"/>` | "Sikringsskap *(pause)* fra 18 000 til 35 000 kroner" |
| Etter "endelig pris etter befaring" | `<break time="300ms"/>` | Markere at tilbud kommer senere |

## 9. Kjente feil fra Azure nb-NO-IselinNeural

Basert på prøvekjøring:

1. **"NELFO"** — stavet "N-E-L-F-O" istedenfor uttalt som ett ord.
   `<sub alias="nellfoo">` fikser.
2. **"Elvia"** — blandet aksent. `<phoneme>` obligatorisk.
3. **"ElHub"** — "el-hæbb" (engelsk hub). Norsk foretrukket: "el-hubb".
4. **"kWh"** — "k-w-h" (stavet). Må substitueres.
5. **Postnummer** — Iselin leser 0579 som "femhundreogsyttini" hvis ikke
   wrapped i `<say-as interpret-as="digits">`.
6. **"samsvarserklæring"** — inkonsistent trykk. Test nøye. Hvis kritisk,
   `<phoneme>`.
7. **"110"** — samme som Max: må tvinges til siffer-for-siffer.

## 10. Test-setninger for QA før deploy

1. "Slå av hovedsikringen og ring ett-ett-null."
   → Forvent: tydelig siffer-for-siffer, pause etter "hovedsikringen".
2. "Ring nettselskapet Elvia på null-sju-null-fem-sju."
   → Forvent: "ell-viia", siffer-for-siffer.
3. "Vi er NELFO-medlem og har sentral godkjenning."
   → Forvent: "nellfoo", ikke stavet.
4. "Varmekabel i bad ligger typisk mellom femten tusen og tjueefem tusen
   kroner, endelig pris etter befaring."
   → Forvent: tydelige tall, pause før "endelig pris".
5. "Postnummer null-fem-sju-ni, Tøyen."
   → Forvent: siffer-for-siffer, norsk "Tøyen".
6. "Elbil-lader med tjue-to kilowatt lastbalansering."
   → Forvent: "kilowatt" stavet ut, ikke "k-w".

## 11. Versjonering

```yaml
pronunciation_dictionary_version: "1.0.0"
niche_id: "ella-elektriker"
last_updated: "2026-04-18"
depends_on:
  - "../shared/variables-schema.md §6"
  - "../shared/skeleton-system-prompt.md"
```

## Referanser

- `inbound-master-plan.md` — hvilke termer Ella møter.
- `variables.md` — voice-provider (`nb-NO-IselinNeural`), Elvia-nummer.
- `scenarios.md` — E3 bruker Elvia, E4 bruker 110, E7 bruker samsvarserklæring.
- `../shared/variables-schema.md §6` — globale SSML-regler.
