# 04 — Latens og turn-taking

Hvor godt en voice-agent *føles* avhenger nesten utelukkende av to ting: tiden
fra kunden er ferdig med å snakke til agenten begynner å svare, og hvor smidig
agenten håndterer at kunden avbryter. Dette dokumentet setter tallene vi skal
treffe og hvordan vi får Vapi dit for norsk.

TL;DR: **Mål total responstid < 1.2 sekund fra end-of-speech til lyd ut,**
**endpointing 500 ms**, **responseDelaySeconds 0.7 for norsk**,
**numWordsToInterruptAssistant 2**, **smartEndpointing aktivert**.

---

## 1. Latens-budsjettet

Tid fra kunden slutter å snakke til kunden hører første ord av svar:

```
STT endpointing                 500 ms
STT finalization + transport   ~150 ms
LLM first token (TTFT)         ~400 ms
TTS first chunk                ~150 ms
Network (end-user)             ~100 ms
────────────────────────────────────
Total                         ~1300 ms  (vi sikter mot < 1200)
```

**Budsjettreduksjon kommer fra:**
- Streaming TTS (ikke vent på hele LLM-svaret).
- Kortere system prompt (Regel 3) → raskere TTFT.
- gpt-4o-mini for Max/Ella → raskere enn gpt-4o.
- Response delay buffer på 700 ms lar endpointing kutte tettere.

## 2. Endpointing — hvor lenge vi venter på stillhet

Endpointing = hvor lang pause som må være i talen før STT-en committer
utterance og sender til LLM.

**Verdier i Vapi transcriber:**
```json
{
  "transcriber": {
    "endpointing": 500,         // ms stillhet før final transcript
    "utteranceEndMs": 1000      // ms før ny utterance regnes som ny runde
  }
}
```

**Hvorfor 500 ms for norsk:**
- Engelsk default (300 ms) kutter midt i setninger på norsk.
- > 700 ms føles som at agenten "sover".
- 500 ms er testet optimalt for Oslo-dialekt og standard bokmål.

**Finjustering per nisje:**
- Lisa (Helse): 550 ms — kunder er ofte stresset, snakker oppstykket.
- Max (Bilverksted): 450 ms — kunder er pragmatiske, korte setninger.
- Ella (Elektriker): 500 ms — default.

Disse verdiene settes i nisjens `vapi-config.json`.

## 3. `responseDelaySeconds` — buffer før agenten svarer

Selv etter STT er ferdig, kan vi be Vapi vente før den sender til LLM. Dette
er en "ikke-avbryt"-buffer.

```json
{
  "responseDelaySeconds": 0.7    // norsk default
}
```

**Hvorfor:** Folk gjør korte pauser midt i tanker. Hvis vi kutter ved første
pause, kommer agenten over dem før setningen er ferdig. 700 ms er nok til å
fange "jeg skal… øh… booke en time" som én utterance.

**Hvis vi senker til 0.4 (engelsk default):** Agenten virker raskere men
avbryter oftere. CSAT faller.

**Hvis vi hever til 1.0:** Samtalen føles død mellom turer.

## 4. `numWordsToInterruptAssistant` — hvor raskt agenten tier

Når kunden begynner å snakke mens agenten fortsatt snakker, hvor mange ord
må kunden si før TTS-en kuttes?

```json
{
  "numWordsToInterruptAssistant": 2
}
```

**Hvorfor 2:**
- Ord 1 ("ja", "nei", "okei", "vent") kan være filler.
- Ord 2 bekrefter intensjon.
- Ved 3+ er kunden irritert.

For norsk er "ja, men…" et vanlig mønster — 2 ord fanger denne og kutter
agenten riktig tid.

## 5. `smartEndpointing` — intelligent pause-håndtering

Vapi's `smartEndpointing` bruker en AI-modell til å vurdere om kunden
faktisk er ferdig. Aktivert, erstatter den statisk endpointing når den er
mer sikker.

```json
{
  "smartEndpointing": "livekit",   // eller "vapi", avhengig av hva som er tilgjengelig
  "smartEndpointingPlan": {
    "provider": "livekit",
    "waitFunction": "200 + 8000 * sqrt(prob)",
    "onNoPunctuationSeconds": 1.5
  }
}
```

**Effekt:**
- Høy prob (kunden ferdig) → kort vent (~200 ms).
- Lav prob (kunden midtveis) → lang vent (opp mot 2 s).
- Derfor føles samtalen raskere når kunden er tydelig, og tålmodigere når
  kunden famler.

**Når vi *ikke* vil ha det:** I booking-flyter der vi ber om spesifikke data
("si regnummeret ditt"). Da vil vi ha konsistent 500 ms endpointing, ikke AI-gjett.
Løsning: toggle `smartEndpointing` av i disse under-turene via Vapi sin
conversation-state-mekanisme (eller live-tool som endrer config).

## 6. Fillers — "mhm", "øyeblikk", "la meg se"

Når agenten skal kalle et tool som tar > 1 s, plasser en filler-melding så
kunden ikke tror samtalen er død:

```json
{
  "function": { "name": "query_company_knowledge" },
  "messages": [
    { "type": "request-start", "content": "La meg sjekke det for deg." },
    { "type": "request-response-delayed", "content": "Jeg er fortsatt på tråden — tar det en sekund til." }
  ]
}
```

Fillers på norsk, per nisje:

| Situasjon | Lisa | Max | Ella |
| --- | --- | --- | --- |
| Venter på data | "Et øyeblikk." | "Sekund." | "Et øyeblikk, jeg sjekker." |
| Tool tar > 3 s | "Jeg henter det nå — er fortsatt her." | "Sekund til, vent litt." | "Beklager, det tar litt tid." |
| Avbryter seg selv | "Unnskyld, la meg starte på nytt." | "Vent, la meg si det rett." | "Beklager, la meg gjenta." |

Disse står i `shared/fallback-bibliotek-no.md`.

## 7. LLM-valg vs latens

| Modell | TTFT (time-to-first-token) | Kvalitet norsk | Bruk i |
| --- | --- | --- | --- |
| `gpt-4o-mini` | ~250 ms | God | Max, Ella (default) |
| `gpt-4o` | ~400 ms | Best | Lisa (helse, mer nyansert) |
| `claude-haiku-4-5` | ~300 ms | Meget god på norsk | Vurderes som bytte |

Claude Haiku 4.5 har vist overraskende sterk norsk kvalitet og lav TTFT. Vi
kan pilotere Haiku på Max/Ella i en A/B-test senere. Per 2026-04-18 holder
vi oss på OpenAI fordi Vapi har mer stabile function-call-parsers der.

## 8. Streaming TTS — ikke vent på full LLM-respons

Vapi aktiverer dette som default, men sjekk at det *er* på:
```json
{ "voice": { "fillerInjectionEnabled": false, "chunkPlan": { "enabled": true } } }
```

Effekt: Så snart LLM har generert første setning, begynner TTS å spille mens
LLM fortsetter. Sparer 400–600 ms for lange svar.

**Risiko:** Hvis LLM ombestemmer seg midtveis (f.eks. korrigerer et tall),
kan første halvdel av TTS være feil. Derfor: be LLM-en strukturere svar
med korte, committet setninger. I skjelett-prompten:
```
Svar kort. Gi én setning om gangen. Hvis du er usikker, spør før du
bekrefter en verdi.
```

## 9. Backgrunns-støy og VAD-følsomhet

Vapi bruker Silero VAD som default. Problemer oppstår ved:
- Verkstedstøy (Max) — bakgrunn kan trigge false positive "kunde snakker".
- Barneskrik (Lisa — foreldre som ringer fra bil).

**Justering:** Vi kan ikke endre VAD-modellen direkte, men vi kan skru opp
`voiceActivityThreshold`:
```json
{
  "transcriber": {
    "voiceActivityThreshold": 0.5    // 0.3 default, høyere = mindre følsomt
  }
}
```

Max settes til 0.55 (verksted-støy), Lisa til 0.4 (stille kontor), Ella til 0.5.

## 10. Målinger vi logger

Via `analysisPlan` og server-webhooks, logg per samtale:
- `stt_endpoint_latency_ms` (gjennomsnitt).
- `llm_ttft_ms`.
- `tts_first_chunk_ms`.
- `total_response_latency_ms`.
- `interrupted_count` — hvor mange ganger agenten ble avbrutt.
- `filler_messages_sent` — hvor mange "øyeblikk" vi spilte.

**Akseptgrenser:**
- p50 total_response_latency_ms < 1200.
- p95 < 2000.
- interrupted_count ≤ 2 per 3-minutters samtale.

Rapporteres ukentlig i `metrics.md` (fremtidig fil).

## 11. Sjekkliste før deploy

- [ ] `endpointing` satt per nisje (450–550 ms).
- [ ] `responseDelaySeconds = 0.7`.
- [ ] `numWordsToInterruptAssistant = 2`.
- [ ] `smartEndpointing` aktivert, men av i booking-subflyter.
- [ ] Filler-meldinger definert per tool.
- [ ] Streaming TTS bekreftet på.
- [ ] `voiceActivityThreshold` tunet for nisjens typiske miljø.
- [ ] Latens-målinger logget via webhook.

## Referanser

- Vapi docs: `endpointing`, `responseDelaySeconds`, `numWordsToInterruptAssistant`,
  `smartEndpointing`, `chunkPlan`.
- LiveKit smart-endpointing-blogg.
- Silero VAD-dokumentasjon.
- `02-norsk-transkribering.md §Endpointing` — samme tall, STT-perspektiv.
- `03-norsk-tts-og-uttale.md §Streaming og avbrudd` — samme tall, TTS-perspektiv.
