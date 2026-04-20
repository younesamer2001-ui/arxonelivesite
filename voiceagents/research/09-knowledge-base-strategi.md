# 09 — Knowledge Base-strategi for Arxon-agenter

Hvordan gir vi Lisa/Max/Ella tilgang til bedriftsspesifikk kunnskap (priser,
tjenestekatalog, FAQ, åpningstider, forsikringspolicyer)? Dette dokumentet veier
de tre metodene Vapi støtter, og konkluderer med den vi standardiserer på.

TL;DR: **Query-tool mot en opplastet fil er best default.** Inline i prompten er OK
kun for små, stabile fakta (~5–10 korte punkter). Vapi sin "koble fil direkte til
assistant"-funksjon unngår vi.

---

## 1. De tre metodene — oversikt

| Metode | Hvordan det fungerer | Når det passer |
| --- | --- | --- |
| **A. Inline i system prompt** | Kunnskap hardkodes i prompten | Små, stabile fakta (< 500 ord), sjelden endring |
| **B. Fil koblet til assistant (file section)** | Vapi injiserer hele filinnholdet i hver LLM-request | Nesten aldri. Anti-mønster. |
| **C. Query-tool mot opplastet fil / KB** | Agenten kaller et tool når den trenger kunnskapen | **Default for Arxon.** Mellomstore KB-er (FAQ, prislister) |
| D. Function tool mot ekstern vektor-DB | Make.com + Qdrant / Pinecone / egen API | Komplekse KB-er med metadata-filtre |

Vapi-terminologi:
- *Files* (`/file` API) — opplastede dokumenter.
- *Knowledge base* — Trieve-indeks bygget på dine files.
- *Tool* — funksjonskall agenten kan trigge under samtalen.

## 2. Hvorfor ikke inline (metode A) for alt?

**Problemer:**
1. **Prompten svulmer.** Lisas prompt skal være < 250 linjer per Regel 3. En
   full prisliste på 40 behandlinger spiser raskt halvparten.
2. **Instruksjonstroskap faller.** Studier på LLM-er viser at presisjon synker
   raskt etter ~2000 tokens i system prompt. Nisje-agentene våre bruker allerede
   ~600–800 tokens til persona og regler.
3. **Upraktiske svar.** Eksempel fra video: hvis prompten inneholder
   "WhatsApp: https://wa.me/47…" leser agenten opp URL-en høyt fordi den ikke
   skjønner at det er en lenke ment for SMS-oppfølging.
4. **Oppdatering krever re-deploy.** Endring av pris = ny prompt = ny versjon
   = full regresjonstest.

**Når det likevel er riktig:**
- Statiske regler ("ikke gi medisinske råd").
- Persona-beskrivelse.
- Åpningstider hvis de er stabile (ligger i `variables.md` uansett).

## 3. Hvorfor ikke fil-kobling (metode B)?

Dette er funksjonen i Vapi hvor du klikker "Attach file" på assistanten.
Innholdet injiseres i hver LLM-request, omtrent som RAG uten retrieval.

**Problemer — i denne rekkefølgen:**
1. **Kostnad.** 50KB fil × flere vendinger per samtale × mange samtaler per dag
   = token-regning som eksploderer. Vi bruker gpt-4o-mini i Fase 1 — inputs
   koster ~$0.15/1M tokens, men dette nullstiller effekten av den billige modellen.
2. **Latency.** Flere tokens = flere ms per respons. Et ekstra sekund per
   svar er synlig for kunden.
3. **Hallusinasjoner.** Motsatt av det man skulle tro — jo mer uspesifikk kontekst
   modellen får, desto oftere blander den sammen punkter. "Service koster 2500"
   kan bli "EU-kontroll koster 2500" fordi begge tallene finnes i prompten.

**Konklusjon:** Aldri bruk file-section for FAQ/prislister/katalog. Den
funksjonen er der fordi Vapi-teamet må tilby den, ikke fordi den er god.

## 4. Hvorfor query-tool (metode C) er default

Prinsippet: **Agenten henter kun når den trenger.** Prompten inneholder *ikke*
kunnskapen, men en beskrivelse av verktøyet og når det skal brukes.

**Fordeler:**
- Prompten holdes kort → bedre instruksjonstroskap.
- Token-kostnad kun ved tool-kall, ikke ved hver vending.
- Oppdatering = bytt ut én fil, ingen deploy.
- Retrieval er semantisk (Trieve under panseret) → bedre svar enn keyword-match.

**Kostnad for Arxon:**
- Hver tool-call legger til ~500 ms latency (vektor-oppslag + injisering).
- Må annonseres: *"Jeg sjekker prislisten — et øyeblikk"*.

**Hvordan vi setter det opp i Vapi:**

```jsonc
// shared/tools-katalog.md (uttrekk — full JSON i tools-katalog.md)
{
  "type": "function",
  "function": {
    "name": "query_company_knowledge",
    "description": "Slår opp bedriftsspesifikk informasjon som priser, tjenester, åpningstider, forsikringer og ofte stilte spørsmål. Bruk denne kun når kunden spør om noe du ikke har i system-prompten.",
    "parameters": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Kundens spørsmål omformulert som et oppslagsspørsmål på norsk."
        }
      },
      "required": ["query"]
    }
  },
  "server": {
    "url": "https://api.vapi.ai/knowledge/{{file_id}}/query"
  },
  "messages": [
    {
      "type": "request-start",
      "content": "Øyeblikk — jeg sjekker det for deg."
    }
  ]
}
```

**Per nisje i `variables.md`:**
```yaml
knowledge_file_id: "file_lisa_helse_faq_v3"   # lastet opp til Vapi /file-endpoint
knowledge_topics: "priser, behandlinger, åpningstider, forsikringsdekning"
```

## 5. Når trenger vi likevel metode D (ekstern vektor-DB)?

Bare hvis:
- Vi får en nisje-kunde med > 500 FAQ-entries.
- Det trengs metadata-filter: "vis bare produkter under 5000 kr for kunde i Bergen".
- Vi vil blande flere kilder (Shopify-katalog + CMS-artikler + bookingkalender).

For Fase 1 — ingen av disse gjelder. Vi bygger ikke Make.com + Qdrant-pipeline
ennå. Hvis behovet oppstår, migrerer vi én nisje, ikke alle tre.

## 6. Hva legger vi inn hvor — praktisk regel

| Info-type | Metode |
| --- | --- |
| Agentens navn, rolle, tone | Prompt (skjelett) |
| "Ikke gi medisinske råd" / nisje-spesifikke regler | Prompt (skjelett + variabler) |
| Åpningstider (stabile) | `variables.md` → injiseres i prompt |
| Telefonnumre til fallback (nødtelefon, vakt) | `variables.md` → injiseres i prompt |
| Tjenestekatalog (f.eks. Lisas 40 behandlinger) | **query-tool** mot KB |
| Prisliste | **query-tool** mot KB |
| Forsikring/egenandel-regler | **query-tool** mot KB |
| Lokasjon, parkering, adresse | `variables.md` (kort) eller KB hvis mange lokasjoner |
| Seneste driftsmeldinger / feriestengt | **query-tool** (enkelt å oppdatere) |

## 7. Hygiene på opplastede KB-filer

Per video: *"rens og strukturer først, gjerne markdown"*. Våre regler:

1. **Én fil per nisje** (f.eks. `lisa-helse-kb.md`). Ikke blande Lisa/Max/Ella.
2. **Markdown med tydelige headers** (`##` per tema, `###` per underseksjon).
   Trieve chunker bedre med klare seksjoner.
3. **Ingen URL-er som er ment for SMS/e-post.** Hvis kunden skal ha link →
   putt i `variables.md` som `sms_booking_link`, og la agenten sende SMS via
   `send_sms_booking_link`-tool.
4. **Tall som skal leses høyt skrives ut.** "2500 kroner" ikke "kr 2 500,-".
5. **Versjonering i filnavn:** `lisa-helse-kb-v3.md`. Når vi laster opp ny,
   bytt `knowledge_file_id` i `variables.md`.
6. **Hold filen < 50 sider.** Ellers → metode D.

## 8. Test-plan før produksjon

For hver nisje, kjør disse 5 spørsmålene manuelt og sjekk at tool-kallet skjer:

1. "Hva koster [vanligste tjenesten]?" → skal trigge `query_company_knowledge`.
2. "Tar dere imot [spesifikk forsikring]?" → skal trigge tool.
3. "Hvor er dere?" → skal IKKE trigge tool (adresse er i variables).
4. "Hei, jeg vil booke time" → skal IKKE trigge tool (går rett til booking-flyt).
5. "Hvem er du?" → skal IKKE trigge tool (disclosure er i firstMessage).

Hvis tool-kallet skjer på spørsmål 3/4/5 → prompten lekker eller tool-beskrivelsen
er for bred. Fiks før deploy.

## 9. Kostnad sammenlignet

Et grovt estimat for en 3-minutters samtale med 10 vendinger:

| Metode | Input tokens per vending | Total input tokens | Est. kostnad (gpt-4o-mini) |
| --- | --- | --- | --- |
| B. File-attach (50KB fil) | ~12 500 | 125 000 | ~$0.019 per samtale |
| A. Full prisliste inline (2000 tokens) | ~2 500 | 25 000 | ~$0.004 |
| C. Query-tool (2 tool-kall à 500 tokens) | ~500 | 5 000 + 1 000 retrieval | ~$0.001 |

Over 1000 samtaler i måneden: $19 (B) vs $1 (C). Skaleringen er tydelig.

## 10. Oppsummering

1. **Default: query-tool mot opplastet fil.** Sett opp per nisje.
2. **Inline i prompt** kun for persona + stabile nisje-variabler (åpningstider,
   navn, telefonnumre).
3. **Unngå fil-kobling (metode B).** Ingen gode grunner til å bruke den.
4. **Vektor-DB (metode D)** først når behovet faktisk er der — ikke før.
5. **Kontinuerlig test** at tool-kall skjer på riktige spørsmål og ikke på feil.

## Referanser

- Video: *"Vapi knowledge base best practices"*, destillert 2026-04-18.
- Vapi docs: `/file`, `/knowledge-base`, `/tool` API-endpoints.
- `shared/tools-katalog.md` — full JSON for `query_company_knowledge`.
- `PRINSIPPER.md §Regel 8` — MVP før workflow.
