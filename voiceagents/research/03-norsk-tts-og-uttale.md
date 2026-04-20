# 03 — Norsk TTS og uttale

Hvordan får vi agenten til å høres ut som en nordmann, ikke en ChatGPT-robot
med norsk aksent? Dette dokumentet velger TTS-provider, beskriver hvordan vi
fikser uttalefeil, og dokumenterer SSML-triks som funker innenfor Vapi.

TL;DR: **Azure Neural (`nb-NO`) som default for alle tre nisjer.**
ElevenLabs Multilingual v2 vurderes for Lisa (hvor varme i stemmen er viktigst)
— men bare hvis nøye testet på norsk først. Cartesia og PlayHT foreløpig ikke.

---

## 1. Provider-sammenligning

| Provider | Norske stemmer | Styrker | Svakheter |
| --- | --- | --- | --- |
| **Azure Neural** | `nb-NO-PernilleNeural`, `nb-NO-FinnNeural`, `nb-NO-IselinNeural`, `nb-NO-IsakNeural` | Naturlig prosodi. SSML-støtte (phoneme, say-as, break). Stabil under last. | Noen stemmer er litt "nyhetsopplesere". |
| **ElevenLabs v2 (Multilingual)** | Ingen native norske — bruker engelske stemmer med norsk tekst | Følelsesrik, dynamisk. | Norsk aksent kan være for "amerikansk", feil trykk på ord. Ingen full SSML-støtte. |
| **Cartesia Sonic-2** | Ikke offisielt norsk | Laveste latency (~90 ms time-to-first-byte). | Norsk støttes via multilingual-mode, uprofesjonelt for kunder. |
| **PlayHT** | Begrenset norsk | Har forbedret seg, men mindre robust enn Azure. |
| OpenAI TTS | Ikke dedikert norsk | Fungerer, men leveres alltid med mild amerikansk aksent. |

**Beslutning for Arxon:**
- **Default alle nisjer:** Azure Neural `nb-NO-PernilleNeural` (kvinnelig, varm, trygg).
- **Max (mannsstemme):** `nb-NO-FinnNeural`.
- **Eksperiment Lisa:** A/B-test ElevenLabs mot Azure på et lite sett
  samtaler. Hvis ElevenLabs vinner på CSAT, bytter vi kun for Lisa.
- **Fallback:** Hvis Azure Neural er nede, fall til PlayHT multilingual.
  Ikke ideelt, men bedre enn stillhet.

Provider-valget står i nisjens `variables.md`:
```yaml
voice_provider: "azure"
voice_id: "nb-NO-PernilleNeural"
voice_provider_fallback: "playht"
voice_id_fallback: "charlotte"
```

## 2. Stemme-karakter per nisje

Vi velger ikke bare provider, men hvordan stemmen skal *føles*:

| Agent | Stemme | Karakter |
| --- | --- | --- |
| **Lisa (Helse)** | `nb-NO-PernilleNeural` | Varm, trygg, litt ned i tempo. Empatisk. |
| **Max (Bilverksted)** | `nb-NO-FinnNeural` | Direkte, handlekraftig, litt opp i tempo. Pragmatisk. |
| **Ella (Elektriker)** | `nb-NO-IselinNeural` | Nøytral, saklig. Trygg ved akutt-situasjoner. |

**Justeringer via Azure SSML:**
```xml
<prosody rate="-5%" pitch="+2%">
  Hei, du har kommet til klinikken. Jeg er Lisa, en AI-resepsjonist.
</prosody>
```

- `rate="-5%"` → Lisa snakker 5% saktere enn default (trygghetsfølelse).
- `rate="+3%"` → Max snakker litt raskere (effektivitet).

Disse settes i skjelett-prompten via `{{voice_style_ssml}}`-variabel.

## 3. Phoneme-triks for feiluttalte ord

Azure Neural støtter `<phoneme>`-tag med IPA-alfabet. Brukes for ord som
konsekvent uttales feil.

**Eksempel: "HELFO" (Helseøkonomiforvaltningen)**
Default TTS sier "helfoh" (amerikansk). Fix:
```xml
<phoneme alphabet="ipa" ph="ˈhɛl.fuː">HELFO</phoneme>
```

**Eksempel: bilmerke "Peugeot"**
Default sier "pjudsjot". Fix:
```xml
<phoneme alphabet="ipa" ph="pøˈʃo">Peugeot</phoneme>
```

Vi samler alle fixes per nisje i `<nisje>/pronunciation-dictionary.md` som en
JSON-tabell som genereres inn i nisjens `vapi-config.json`:

```json
{
  "pronunciations": [
    { "term": "HELFO", "ipa": "ˈhɛl.fuː" },
    { "term": "Peugeot", "ipa": "pøˈʃo" },
    { "term": "jordfeilbryter", "ipa": "ˈjuːɾˌfæɪlˌbɾyːtəɾ" }
  ]
}
```

Et pre-processing-steg erstatter disse termene med `<phoneme>`-tagger før
teksten sendes til Azure. Gjøres i server-webhook som håndterer
`speech-generation-request`.

## 4. `say-as` for tall, datoer og telefonnumre

Azure SSML `<say-as interpret-as="...">`:

| interpret-as | Eksempel input | Effekt |
| --- | --- | --- |
| `cardinal` | `<say-as interpret-as="cardinal">2500</say-as>` | "to tusen fem hundre" |
| `digits` | `<say-as interpret-as="digits">92841726</say-as>` | "ni to åtte fire én sju to seks" |
| `date` | `<say-as interpret-as="date" format="dmy">25-04-2026</say-as>` | "tjuefemte april tjueseksogtjue" |
| `time` | `<say-as interpret-as="time" format="hms24">14:30</say-as>` | "fjorten tretti" |
| `telephone` | `<say-as interpret-as="telephone">92 84 17 26</say-as>` | Leser som par: "ni to, åtte fire, én sju, to seks" |

**Vår praksis:** LLM-en skriver *aldri* direkte SSML. I stedet sender den
strukturert output, og server-webhook wrapper i SSML. Grunn: LLM-er ødelegger
SSML ved å sitere den halvveis ("jeg sier: `<say-as...`").

**Eksempel-flyt:**
```
LLM output: "Din time er bekreftet til {{date:2026-04-25}} klokka {{time:14:30}}."
Webhook → "Din time er bekreftet til <say-as ...>2026-04-25</say-as> klokka <say-as ...>14:30</say-as>."
Azure → "Din time er bekreftet til tjuefemte april tjueseksogtjue klokka fjorten tretti."
```

Mønsteret `{{date:...}}` / `{{time:...}}` / `{{tel:...}}` / `{{amount:...}}`
defineres i `shared/tools-katalog.md`.

## 5. Tilbake-lesing av regnummer — NATO + pause

Regnummer (`AB 12345`) krever ekstra omtanke. Problemer:
1. Kunden hører ikke forskjell på B/D/P/T.
2. Norsk stavemåte varierer mellom "A-ågen" og "Alfa".

**Vår regel (gjelder Max primært, men også andre):**
Les tilbake med ICAO-alfabet og eksplisitt pause:

```xml
<speak>
  Så bilen din har regnummer
  <break time="300ms"/>
  Alfa <break time="200ms"/> Bravo <break time="400ms"/>
  <say-as interpret-as="digits">12345</say-as>.
  Stemmer det?
</speak>
```

Konvertering fra rå regnummer til ICAO-setning gjøres i webhook. Tabell:

```
A → Alfa, B → Bravo, C → Charlie, D → Delta, E → Echo, F → Foxtrot,
G → Golf, H → Hotel, I → India, J → Juliett, K → Kilo, L → Lima,
M → Mike, N → November, O → Oscar, P → Papa, Q → Quebec, R → Romeo,
S → Sierra, T → Tango, U → Uniform, V → Victor, W → Whiskey, X → X-ray,
Y → Yankee, Z → Zulu, Ø → Ørn, Æ → Ekko med prikk, Å → Åse
```

De norske bokstavene `Æ`, `Ø`, `Å` finnes ikke i regnumre, så ICAO dekker alt.

## 6. Break-tag — når skal agenten puste?

For lange svar, legg `<break>`-pauser slik at kunden ikke føler seg "monologet".

**Regel:**
- Etter hver setning med tall eller data: `<break time="300ms"/>`.
- Før et spørsmål: `<break time="400ms"/>` slik at kunden får plass til å svare.
- Mellom to bekreftelser ("Fint." / "Greit, da er det booket."): `<break time="200ms"/>`.

**For lang:** > 500 ms break føles kleint. Kunden tror samtalen er over.

Alle breaks settes i webhook-post-processing, aldri i LLM-output direkte.

## 7. Stemme-emosjon (kun ElevenLabs og noen Azure-stemmer)

Noen Azure Neural-stemmer støtter `express-as`:
```xml
<mstts:express-as style="empathetic" styledegree="1.2">
  Jeg forstår at det er vanskelig. Vi skal få dette løst.
</mstts:express-as>
```

For Lisa, bruk `style="empathetic"` når kunden viser tegn på stress
(tårer-ord, raske pust-indikasjoner i transcript, ord som "redd",
"vondt", "hjelp"). LLM-en trigger dette ved å sette `speech.emotion = "empathetic"`
i structured output.

Finn/Isak-stemmene (mannsstemmer) har mer begrenset støtte. For Max/Ella —
hold det nøytralt med prosody-justering, ikke express-as.

## 8. Dialekt-politikk

Azure Neural har kun østlandsk + standard bokmål. Vi *simulerer* ikke dialekt.

**Hvorfor:** Å be en agent "snakke bergensk" gir dårlige resultater (høres
karikert ut), og kunder forventer at en profesjonell aktør bruker standardisert
norsk. Unntaket er hvis én av nisje-kundene insisterer (en frisør i Bergen
kan ønske lokal lyd) — da bytter vi stemme per kunde via `variables.md`.

## 9. Streaming og avbrudd

Vapi streamer TTS mens LLM fortsatt genererer. Problemer:
- Hvis kunden avbryter mens setningen leses ("vent — det var feil"), må
  TTS-en kuttes.
- Vapi håndterer dette via `numWordsToInterruptAssistant: 2`. Etter to ord
  fra kunden, stoppes TTS-en midtveis.

**Risiko:** Lydkvalitet kan krakke når TTS-en kuttes i midten av en setning
(klikkelyd, fadeout). Fix: sett `smartEndpointing: true` i Vapi-config så
avbruddet gjøres med fade-out.

Full behandling i `04-latens-og-turn-taking.md`.

## 10. Pronunciation dictionary per nisje — format

Filen `<nisje>/pronunciation-dictionary.md` har dette formatet:

```markdown
# Lisa — Uttaleordbok

## Bedriftsnavn og institusjoner
| Term | IPA | Notat |
| --- | --- | --- |
| HELFO | ˈhɛl.fuː | Akronym, uttales som ord |
| Dipsy | ˈdɪp.si | EPJ-system |
| Helseplattformen | ˈhɛl.sə.plɑ.tˌfɔr.mən | Midt-Norges EPJ |

## Fagterminologi
| Term | IPA | Notat |
| --- | --- | --- |
| rekvisisjon | ɾɛ.kvɪ.sɪˈʃuːn | |
| henvisning | ˈhɛn.viːs.nɪŋ | |

## Legemidler (hvis aktuelt)
| Term | IPA | Notat |
| --- | --- | --- |
| ... | ... | Legg til etter behov |
```

Filen eksporteres til JSON i build-steg og serveres til webhook som erstatter
termer før TTS-kall.

## 11. Test-protokoll før deploy

For hver nisje, ta opp en test-samtale med disse 10 termene og lytt manuelt:

1. Bedriftens egne navn (Arxon, nisje-kundens navn).
2. Tre viktigste fagtermer.
3. Ett telefonnummer.
4. Én dato.
5. Ett klokkeslett.
6. Ett regnummer (kun Max).
7. Pris med tusen-separator ("2500 kroner").
8. Ett bilmerke eller produktnavn.
9. Ordet "takk" (test om prosody faller naturlig).
10. En lang setning med komma og punktum (test pausering).

**Akseptgrenser:** 9 av 10 skal høres naturlige ut. Ett unntak tillates og
loggføres som kjent fix i neste iterasjon.

## 12. Kostnad og takter

Azure Neural per 1M tegn: ~$16.
ElevenLabs Multilingual v2 per 1M tegn: ~$330 (Pro tier).

For Arxons skala (forventet ~10 000 samtaler/måned, gjennomsnitt 400 tegn
TTS per samtale = 4M tegn/måned):
- Azure: ~$64/måned.
- ElevenLabs: ~$1320/måned.

20× kostnadsforskjell gjør det vanskelig å forsvare ElevenLabs utenfor Lisa,
og kun hvis det faktisk flytter CSAT.

## Referanser

- Azure Speech SSML-dokumentasjon: `mstts:express-as`, `<phoneme>`, `<say-as>`.
- ElevenLabs Multilingual v2 — norsk-støtte i beta.
- Vapi docs: Voice providers, `smartEndpointing`, `numWordsToInterruptAssistant`.
- `02-norsk-transkribering.md` — speiler STT-problemene vi løser her for TTS.
- `04-latens-og-turn-taking.md` — avbrudd og streaming.
