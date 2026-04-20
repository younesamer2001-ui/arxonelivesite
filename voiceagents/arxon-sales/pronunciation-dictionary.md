# Arxon — pronunciation-dictionary.md

Custom uttale for ord og fraser som Azure/Deepgram norsk-TTS/STT ofte bommer
på i Arxon-sales-agenten. Last opp som lexicon på Vapi-nivå (voice config →
customVocabulary + pronunciation).

Versjon: 1.0.0
Sist oppdatert: 2026-04-18

---

## 1. Brand- og produktnavn

| Ord / Frase | Uttale (nb-NO IPA) | SSML fallback | Notat |
| --- | --- | --- | --- |
| Arxon | ˈɑrk.sɔn | `<phoneme alphabet="ipa" ph="ˈɑrkˌsɔn">Arxon</phoneme>` | TTS leser ofte "arxon" bokstavelig — tvungen stress på første stavelse. |
| Lisa | ˈliː.sa | — | Azure nb-NO default er OK. |
| Max | mɑks | — | OK. |
| Ella | ˈɛ.la | — | OK. |

## 2. URLer og e-post

| Input | Uttales som (tale) | Notat |
| --- | --- | --- |
| `cal.com/arxon/30min` | "kal punktum com skråstrek arxon skråstrek tretti m-i-n" | På tale: ALDRI les som URL bokstavelig. Webhook kan sende dette på SMS i stedet. |
| `arxon.no` | "arxon punktum no" | — |
| `kontakt@arxon.no` | "kontakt krøllalfa arxon punktum no" | — |
| `+47 993 53 596` | wrap i `{{tel:+4799353596}}` | Webhook SSML: les som "ni, ni, tre — fem, tre — fem, ni, seks". |

## 3. Priser

| Input | Uttales som | Notat |
| --- | --- | --- |
| `{{amount:4990}}` | "fire tusen ni hundre og nitti kroner" | Aldri "fire nitti kr" eller "fire-ni-ni-null". |
| `{{amount:NNNN}}` | Standard norsk tall-uttale | Håndteres av webhook-SSML-wrapper. |

## 4. Generelle norske bransjeord

| Ord | Uttale | Notat |
| --- | --- | --- |
| resepsjonist | re.sɛp.ʃuˈnɪst | Azure OK. |
| henvendelse | ˈhɛnˌvɛn.dɛl.sə | Azure OK. |
| kundesenter | ˈkʉ.nə.ˌsɛn.tɛr | Azure OK. |
| integrasjon | ˌɪn.tə.ɡrɑˈʃuːn | Azure OK. |
| bookingsystem | ˈbuk.ɪŋ.ˌsʏs.teːm | Pass på — TTS velger noen ganger engelsk "booking". Lexicon tvinger norsk uttale. |

## 5. Ord som IKKE skal sies (guardrail — enforce via STT filter hvis mulig)

Hvis STT transkriberer disse fra agenten (regress-test alert):

- Vapi, vapi
- Deepgram, deep gram
- ElevenLabs, eleven labs
- Azure (når det refererer til stack — ikke når det er noens navn)
- Whisper
- GPT, gpt, chat gpt
- Claude, claude
- Anthropic
- OpenAI, open ai
- LiveKit
- Twilio
- Retell, retell ai
- Bland, bland ai

→ Flagges som `guardrail_violation: stack_disclosure` i analysisPlan.

## 6. Fallback-fraser når STT bommer

| Trigger (STT-output) | Sannsynlig reell input | Forventet respons |
| --- | --- | --- |
| "arkson" / "axon" / "arkonn" | "Arxon" | Agenten svarer normalt (ikke korriger brukeren). |
| "kal com" | "cal.com" | Tolk som referanse til demo-lenken. |
| "tretti min" | "30 min" | Demo-lenke-intent. |

## Referanser

- `variables.md` — voice_provider og språk-innstillinger.
- `vapi-config.json` — hvor lexicon refereres.
- `../shared/pronunciation-base-no.md` — felles norsk base-lexicon (hvis det eksisterer).
