# 02 — Norsk transkribering (STT)

Hvordan får vi agenten til å faktisk *forstå* hva kunden sier på norsk? STT er
der de fleste voice-agenter feiler i Norge, og feilene forplantes gjennom
hele LLM-kjeden. Dette dokumentet velger provider, beskriver kjente feilmoduser
og gir konkrete triks for tall, datoer, telefonnummer og regnummer.

---

## 1. Provider-valg: Azure Speech (default), Deepgram Nova-3 (fallback)

Vapi støtter flere transcribere via `transcriber`-blokken i assistant-config.
De relevante for norsk i 2026:

| Provider | Språk | Styrker | Svakheter |
| --- | --- | --- | --- |
| **Azure Speech** | `nb-NO`, `nn-NO` | Lang fartstid på norsk. God på dialekter (Bergen, Trøndelag). Støtter egendefinert ordliste (Custom Speech). Phrase Lists via SDK. | Litt høyere latency (~150–250 ms) enn Deepgram. Noen ord låses inn via normalisering (f.eks. "to tusen" → "2000"). |
| **Deepgram Nova-3** | `no` (multilingual mode) | Raskeste streaming (~100–150 ms). Enkel `keyterm`-API for domeneord. | Svakere på norske dialekter. Nova-3 er primært engelsk-optimalisert med norsk i multilingual-modus; kvaliteten varierer. |
| Google Cloud STT | `nb-NO`, `nn-NO` | God generell kvalitet. | Sammen med Vapi oftere trøbbel ved streaming-avbrudd. |
| Talkscriber | `no` | Norsk spesifikk aktør, men liten prod-historikk i Vapi. | Risiko ved driftsavhengighet. |

**Beslutning for Arxon:**
- **Lisa (Helse)**: Azure Speech `nb-NO`. Latency er akseptabelt, og helse-ord som
  "fysioterapeut", "røntgen", "henvisning" må transkriberes korrekt. Custom
  Speech-ordliste for terminologi.
- **Max (Bilverksted)**: Azure Speech `nb-NO`. Bilmerker og modeller trenger
  presisjon; bilfolk snakker ofte dialekt.
- **Ella (Elektriker)**: Azure Speech `nb-NO`. Elektriske fagord ("sikringsskap",
  "jordfeilbryter") trenger ordliste.

**Deepgram Nova-3 som fallback** (definert i nisjens `vapi-config.json` under
`fallbackTranscribers`): Hvis Azure feiler (outage, timeout > 3 s), bytter
Vapi automatisk midt i samtalen. Nova-3 er valgt over Google fordi Vapi's
streaming-integrasjon er mer stabil der.

**Abstraksjon for Regel 4:** Provider-valget står i nisjens `variables.md` som
`transcriber_primary` og `transcriber_fallback`. Bytte provider = endre én fil.

## 2. Kjente feilmoduser på norsk

Disse har vi sett i alfa-testing og må designe bort:

### 2.1 Tall blir tolket som andre ord
- **"åtte"** ↔ **"aldri"** (i rask tale).
- **"null"** ↔ **"nuller"**, **"nulle"**.
- **"tre"** ↔ **"tri"**, **"treffer"**.

### 2.2 Homofoner som flipper meningen
- **"i dag"** ↔ **"idag"** ↔ **"i natt"**.
- **"åtte"** ↔ **"atten"** (18) — kritisk for tidsangivelse.
- **"klokka to"** ↔ **"klokkeslett"**.

### 2.3 Dialektvarianter av samme ord
- **"ikke"** blir **"itj" / "itte" / "inte" / "ikkje"** avhengig av
  dialekt. Azure håndterer dette bedre enn Deepgram.
- **"eg"** (vestlandsk) ↔ **"jeg"**.

### 2.4 Fornorskning av engelske ord
- Bilmerker: **"Volkswagen"** → transkriberes ofte som **"folks-vogn"** eller
  **"vagen"**.
- **"iPhone"** → **"ai-føn"** eller **"eye-fon"**.
- Dette må løses med phrase lists, ikke prompt-injection.

### 2.5 Telefonnummer
Norske telefonnummer er 8 sifre. Folk uttaler dem som:
- `92 84 17 26` (par)
- `928 417 26` (trippel-par)
- `92841726` (ett tall)
- `ni to åtte fire én sju to seks` (enkeltsifre)

STT-en tolker disse inkonsistent. Løsning: **post-process transcript** før
LLM — se §5.

### 2.6 Registreringsnummer
Norske regnumre: to bokstaver + fem sifre (f.eks. `AB 12345`). Problemer:
- Bokstaver uttales etter stavingssystem (noen bruker ICAO "Alfa Bravo",
  noen bruker norsk "Anne Berit").
- `V` og `W` høres nesten likt.
- `E`, `B`, `P`, `D`, `T` er notorisk vanskelige.

**Løsning:** Agenten må alltid bekrefte regnummeret ved å lese det tilbake, og
spørre på nytt hvis kunden korrigerer. Se `05-edge-cases-og-guardrails.md`.

### 2.7 Adresser og postnummer
- Gatenavn som **"Ole Vigs gate"** — STT-en skriver ofte bare *"olevisgate"*.
- Postnummer blir fire siffer (`0250`) — samme problem som telefon.

## 3. Azure Custom Speech — hvordan vi setter det opp

For hver nisje lager vi en **Custom Speech-modell** med domeneord:

```
Azure Portal → Speech Services → Custom Speech
1. Create project (språk: nb-NO)
2. Upload phrase list: nisje-ordliste.txt
3. Train custom model
4. Deploy endpoint
5. Kopier endpoint ID → nisjens variables.md som transcriber_custom_endpoint_id
```

**Eksempel: `lisa-helse/ordliste.txt`:**
```
henvisning
rekvisisjon
egenandel
fritak
HELFO
Helseplattformen
fastlegeordning
frikort
Dipsy
EPJ
behandlingstime
kontrolltime
akutt-time
ø-hjelp
```

Dette injiserer "bias" i den akustiske modellen så disse ordene gjenkjennes
sterkere enn generelle alternativer.

## 4. Deepgram `keyterm` (brukes når vi faller tilbake)

Hvis Azure er nede og vi faller til Deepgram, setter vi en `keyterm`-liste i
transcriber-config:

```json
{
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-3",
    "language": "multi",
    "keyterm": [
      "henvisning",
      "HELFO",
      "egenandel"
    ]
  }
}
```

Deepgram boost-er disse ordenes sannsynlighet. Typisk sett holdes listen til
< 100 entries for å ikke skape false positives.

## 5. Post-processing: normaliser tall og telefonnummer

STT-output er aldri helt rent. Før vi lar LLM-en se transcriptet, kjører vi
det gjennom en normaliseringsregel. I Vapi gjøres dette via `transcriber.smartFormat`
(Deepgram) eller gjennom `server`-URL hvor vi selv manipulerer transcriptet.

**Regler vi håndhever:**

1. **Tall som ord → sifre** når de opptrer i rekker av 3+:
   `ni to åtte fire én sju to seks` → `92841726`.
2. **Formater telefonnummer** til `NN NN NN NN`.
3. **Fjern fyllord** før LLM: `ehm`, `øh`, `altså`. Gjør transcriptet kortere
   og mer instruksjons-trofast for LLM-en.
4. **Bokstaver-tilbake-lesing**: Når agenten leser tilbake regnummer, bruk
   NATO/ICAO (`Alfa Bravo en to tre fire fem`) for å unngå homofon-feil.
   Se `03-norsk-tts-og-uttale.md`.

**Minimalt webhook-snutt (server.url mottar `transcript-full`):**
```ts
function normalizeNorwegianTranscript(raw: string): string {
  return raw
    .replace(/\b(null|en|to|tre|fire|fem|seks|sju|åtte|ni)\b/gi, (m) => {
      const map: Record<string, string> = {
        null: '0', en: '1', to: '2', tre: '3', fire: '4',
        fem: '5', seks: '6', sju: '7', åtte: '8', ni: '9',
      }
      return map[m.toLowerCase()]
    })
    .replace(/\b(\d)\s+(\d)\s+(\d)\s+(\d)\s+(\d)\s+(\d)\s+(\d)\s+(\d)\b/g,
      '$1$2 $3$4 $5$6 $7$8') // 8 siffer → telefonnummer-format
}
```

> **Viktig:** Ikke normaliser *alt* — hvis kunden sier "klokka to" skal det
> forbli "to" (tid), ikke "2". Bruk kontekst-signaler (foran/bak
> "klokka", "i", "kl.").

## 6. Endpointing (når regnes setningen som ferdig?)

Endpointing er hvor lenge STT-en venter på stillhet før den "commit-er"
setningen til LLM. Standard Vapi-default er 300 ms — for lite på norsk.

**Våre innstillinger:**
```json
{
  "transcriber": {
    "endpointing": 500,        // ms stillhet før commit
    "utteranceEndMs": 1000     // ms før en ny utterance regnes som starten
  }
}
```

Grunnen: Nordmenn har lengre pauser mellom setningsledd enn engelsktalende.
300 ms kutter ofte midt i setningen, og LLM-en svarer før kunden er ferdig.

Full behandling i `04-latens-og-turn-taking.md`.

## 7. Konfidens-terskel og re-ask

Azure returnerer en `confidence` per utterance (0.0–1.0). Når den faller under
**0.55**, skal agenten *ikke* handle på uttalelsen, men spørre på nytt:

> *"Beklager, jeg hørte ikke helt — kan du si det en gang til?"*

Hvordan: Via `server.url` sjekker vi `transcript-partial` confidence. Hvis
< 0.55 og det gjelder data (regnummer, telefon, postnummer), legg inn et
intent i `metadata` som LLM-en skal reagere på ved å re-ask.

For vanlig samtale aksepterer vi ned til **0.40** — LLM-en er god på å tolke
rundt en uklar setning, men ikke rundt et feillest telefonnummer.

## 8. Når bytter vi provider?

Automatisk innen samme samtale via Vapi sin `fallbackTranscribers`-liste. Manuelt
på nisje-nivå hvis vi observerer at en provider konsistent underpresterer:

- Mål ordfeil-rate (WER) ved å ta 20 samtaler per uke, la menneske transkribere
  dem manuelt, og sammenligne med STT-output.
- **Akseptgrenser:** WER < 12% på hverdagssamtale, < 5% på data (tall, navn,
  adresse).
- Bytter vi primær, oppdateres nisjens `variables.md` — ikke selve skjelettet.

## 9. Språk-deteksjon: låst til norsk, men åpen for engelsk

Vapi støtter multilingual transcription. Vår default:

```json
{
  "transcriber": {
    "provider": "azure",
    "language": "nb-NO",
    "languageDetectionEnabled": true,
    "alternativeLanguages": ["en-US"]
  }
}
```

Hvis STT-en detekterer engelsk med høy sannsynlighet > 85%, bytter den språk
midt i samtalen. LLM-en informeres via `metadata.detectedLanguage` og kan
svare på engelsk (per skjelett-prompt-regel: følg kundens språk).

Alle andre språk — be kunden om å holde seg til norsk eller engelsk, evt.
eskalér til menneske som kan det aktuelle språket.

## 10. Sjekkliste før produksjon

For hver nisje, valider:

- [ ] Azure Custom Speech-modell er trent med nisje-ordliste.
- [ ] `variables.md` har `transcriber_primary`, `transcriber_fallback`,
  `transcriber_custom_endpoint_id`.
- [ ] Endpointing satt til 500 ms, utteranceEnd 1000 ms.
- [ ] Confidence-terskler håndteres i server-webhook.
- [ ] Tall-normaliserings-regex er testet på 20 ekte samtaler.
- [ ] Regnummer-tilbake-lesing bruker NATO-alfabet.
- [ ] Språk-deteksjon er aktivert, engelsk som alternativ.
- [ ] WER er målt og logget i `voiceagents/metrics.md` (ikke skrevet ennå).

## Referanser

- Vapi docs: Transcribers → Azure, Deepgram, Language detection.
- Azure Speech: Custom Speech-guide for nb-NO.
- Deepgram Nova-3 keyterm-API.
- `01-vapi-kapabiliteter.md §Transcriber` — tekniske default-verdier.
- `04-latens-og-turn-taking.md` — endpointing i sammenheng med turn-taking.
- `PRINSIPPER.md §Regel 4` — stack-agnostisk tenkning rundt provider-valg.
