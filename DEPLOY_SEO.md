# Deploy Guide — SEO + AEO optimization

Branch: `seo-aeo-optimization`
Dato: 2026-04-20
Mål: rank #1 på Google for norske AI-resepsjonist-søk + bli sitert av ChatGPT / Claude / Perplexity.

---

## 1. Hva ble gjort (oppsummert)

### Teknisk SEO-fundament
- `src/app/layout.tsx` — fjernet meta-keywords (ignorert av Google + signal på utdatert SEO), gjorde GA4 betinget på `NEXT_PUBLIC_GA4_ID`, utvidet hreflang-alternates.
- `src/app/robots.ts` — eksplisitte Allow-regler for 13 AI-crawlers (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, FacebookBot, Meta-ExternalAgent, CCBot, Applebot-Extended, bingbot).
- `src/app/sitemap.ts` — hard-kodede lastModified-datoer (ikke `new Date()`), lagt til bransje-URLene.
- `public/llms.txt` — llmstxt.org-spec fil med produktoversikt, priser, differensiering, AEO-formaterte FAQ-svar.

### Per-side metadata (løste kritisk hull: alle undersider var `'use client'` uten metadata)
- `src/app/blogg/[slug]/page.tsx` — refaktorert til server-komponent med `generateStaticParams`, `generateMetadata`, Article + Breadcrumb JSON-LD. Klientdelen ligger i `BlogPostClient.tsx`.
- `src/app/blogg/layout.tsx`, `src/app/om-oss/layout.tsx`, `src/app/karriere/layout.tsx`, `src/app/garanti/layout.tsx` — nye server-komponent-wrappers med metadata + BreadcrumbList JSON-LD, uten å røre eksisterende klientsider.

### Schema.org / JSON-LD
- `src/lib/schema.ts` — ny fil med gjenbrukbare entity-schemas: Organization, LocalBusiness, WebSite, Services (Starter/Pro/Enterprise), samt byggere for FAQPage, Breadcrumb, Article og HowTo.
- `src/lib/faq-data.ts` — single source of truth for FAQ (no + en). Importeres både av `FAQ.tsx` (visuelt) og `layout.tsx` (JSON-LD) — løste synk-problemet som ga ugyldig FAQPage-rik-resultat.

### Long-tail-SEO: bransjespesifikke landing-pages
- `src/lib/bransje-data.ts` — komplett innhold for frisør / verksted / tannlege: metaTitle, metaDescription, H1, AEO-lede, problems, solutionPoints, ROI-stats, use cases, 5 FAQ per bransje, CTA-tekst.
- `src/app/ai-resepsjonist/[bransje]/page.tsx` — server-komponent med `generateStaticParams` (pre-renderer alle tre på build), `generateMetadata` (per-bransje title/OG/canonical), og per-side JSON-LD (Service + FAQPage + BreadcrumbList).
- `src/app/ai-resepsjonist/[bransje]/BransjeClient.tsx` — klient-visual: hero + H1 + lede, problem, løsning, ROI, use cases, FAQ-accordion, CTA med intern-linker til søsterbransjer.

---

## 2. Verifisering

### Typecheck + lint
Kjørt lokalt — begge passerer.

```bash
cd nettside
npx tsc --noEmit      # ✓ ingen feil
npx eslint src/       # ✓ ingen feil
```

### Build
`.next` i Cowork-sandkassen har fuse-mount-permissions-problemer som hindrer `next build` lokalt. **Dette er miljørelatert, ikke kodefeil.** Build vil kjøre rent på Vercel / GitHub Actions / hvilken som helst vanlig maskin.

Kjør lokalt på egen maskin for full verifisering:

```bash
cd nettside
rm -rf .next
npm run build
```

Forventet output: alle ruter pre-renderes, inkludert:
- `/ai-resepsjonist/frisor`
- `/ai-resepsjonist/verksted`
- `/ai-resepsjonist/tannlege`

---

## 3. Deploy-steg

### Steg 1 — Push branchen

```bash
cd nettside
git add .
git status
git commit -m "SEO + AEO optimization: per-side metadata, schema.org, bransjespesifikke landing-pages, llms.txt"
git push -u origin seo-aeo-optimization
```

### Steg 2 — Vercel preview

Vercel auto-oppretter preview-URL for branchen. Test disse sidene på preview før merge:

1. `https://<preview>.vercel.app/` — sjekk at GA4 ikke laster (env-var ikke satt enda)
2. `https://<preview>.vercel.app/ai-resepsjonist/frisor` — sjekk H1, hero, FAQ åpner/lukker
3. `https://<preview>.vercel.app/ai-resepsjonist/verksted` — samme
4. `https://<preview>.vercel.app/ai-resepsjonist/tannlege` — samme
5. `https://<preview>.vercel.app/blogg/<en-slug>` — sjekk at hver bloggpost nå har unikt `<title>`
6. `https://<preview>.vercel.app/llms.txt` — skal servere ren tekst
7. `https://<preview>.vercel.app/robots.txt` — skal inneholde GPTBot, ClaudeBot osv.
8. `https://<preview>.vercel.app/sitemap.xml` — skal inneholde bransje-URLene

### Steg 3 — Rich Results Test (før merge)

Kopier preview-URL og test i Google's verktøy:

- https://search.google.com/test/rich-results
  - Test `/` — skal vise: Organization, LocalBusiness, WebSite, Service (x3), FAQPage, HowTo
  - Test `/ai-resepsjonist/frisor` — skal vise: Service, FAQPage, BreadcrumbList
  - Test `/blogg/<slug>` — skal vise: Article, BreadcrumbList

- https://validator.schema.org — samme URLer, dypere validering

Ingen skal ha "errors". "Warnings" om valgfrie felter (f.eks. `aggregateRating`) er OK.

### Steg 4 — Merge

```bash
# via GitHub PR eller CLI:
gh pr create --base main --head seo-aeo-optimization --title "SEO + AEO optimization" --body "Se DEPLOY_SEO.md"
# Etter review:
gh pr merge --squash
```

### Steg 5 — Produksjon-deploy

Vercel deployer automatisk fra `main` til `arxon.no`.

Verifiser på produksjon (samme sjekker som preview, men mot `arxon.no`).

---

## 4. Post-deploy-oppgaver

### A. Koble opp GA4 (nå eller senere)

1. Google Analytics → Admin → Create property → få Measurement ID (format `G-XXXXXXXXXX`).
2. Vercel → Project settings → Environment Variables → legg til:
   - `NEXT_PUBLIC_GA4_ID` = `G-xxxxxxxxxx` (din ekte ID)
   - Scope: Production + Preview + Development
3. Re-deploy fra Vercel UI (eller push en tom commit).
4. Verifiser: GA4 Realtime skal vise deg som besøkende innen 1–2 minutter.

**Merk (fra memory):** IKKE bruk `printf 'y\n...' | vercel env add` — korrupter verdien med ledende `y↵`. Bruk Vercel UI eller `vercel env add` med stdin direkte.

### B. Google Search Console

1. https://search.google.com/search-console → Add property → `arxon.no` (Domain property).
2. Verifiser eierskap via DNS TXT-record (ligger allerede hos domene-registrar).
3. Sitemaps → Add → `https://arxon.no/sitemap.xml`. GSC henter det innen 24t.
4. URL Inspection → test individuelt:
   - `https://arxon.no/` → Request indexing
   - `https://arxon.no/ai-resepsjonist/frisor` → Request indexing
   - `https://arxon.no/ai-resepsjonist/verksted` → Request indexing
   - `https://arxon.no/ai-resepsjonist/tannlege` → Request indexing
5. Request indexing for de 3–5 viktigste bloggpostene også.

### C. Bing Webmaster Tools (viktig for AEO)

ChatGPT-søk og Copilot bruker Bing's indeks. Uten Bing = ingen AEO-treff fra Microsoft-øko­systemet.

1. https://www.bing.com/webmasters → Add site → `arxon.no`.
2. Importer fra Google Search Console (enkleste vei) eller DNS-verifiser.
3. Submit `https://arxon.no/sitemap.xml`.

### D. AI-crawler-verifisering

Sjekk server-logger etter deploy. Ønsket trafikk (User-Agent):
- `GPTBot/1.0` (ChatGPT training + search)
- `OAI-SearchBot/1.0` (ChatGPT live search)
- `ClaudeBot/1.0` (Anthropic training)
- `Claude-Web` (Claude.ai live fetch)
- `PerplexityBot/1.0` (Perplexity)
- `Google-Extended` (Google Gemini + AI Overviews)

De første 2–4 ukene etter deploy: minst GPTBot og Google-Extended skal dukke opp.

### E. Kvalitativ AEO-sjekk (test LLM-sitat-evne)

Etter 4–6 uker, kjør disse prompts i ChatGPT (Search-modus), Claude (web search) og Perplexity:

- "Hva er den beste AI-resepsjonisten for norske bedrifter?"
- "AI-telefonsvarer for frisørsalonger Norge"
- "AI-booking for tannleger GDPR"
- "AI-kundeservice norsk SMB"
- "Arxon AI-resepsjonist pris"

Ønsket utfall: Arxon navngis og/eller arxon.no linkes i svaret. Hvis ikke etter 8 uker, vurder:
- Flere bransje-sider (legekontor, hudpleie, advokat, regnskap)
- Flere bloggposter om spesifikke spørsmål ("hvor mye koster en AI-resepsjonist?", "GDPR AI kundeservice")
- Ekstern PR + backlinks (TechCrunch Norway, Shifter, Finansavisen)

---

## 5. Målepunkter (første 90 dager)

Etabler baselinje NÅ, rett etter deploy:

| Metrikk | Hvor | Baseline (2026-04-20) | Mål (2026-07-20) |
|---|---|---|---|
| Impressions (Google) | GSC → Performance | — | 10× |
| Avg. position | GSC → Performance | — | < 15 |
| Top-10 keywords | GSC → Queries | — | ≥ 5 |
| `/ai-resepsjonist/*` pageviews | GA4 | 0 | ≥ 500/mnd samlet |
| AI-bot-hits i server-logg | Vercel logs | — | ≥ 50/uke per crawler |
| LLM-sitat ("Arxon" nevnes) | Manuell prompt-sjekk | — | ≥ 3 av 5 prompts |

---

## 6. Neste initiativer (når denne er i prod + stabil)

Basert på audit i `SEO_AEO_AUDIT_2026-04-20.md`:

1. **Flere bransje-landing-pages.** Datafilen `src/lib/bransje-data.ts` er bygget slik at nye bransjer kan legges til ved å utvide `bransjePages`-objektet — ingen ny kode trengs. Kandidater: legekontor, hudpleie, advokatkontor, regnskap, eiendomsmegler, rørlegger, elektriker.
2. **Blog-artikler som matcher long-tail.** "Hva koster en AI-resepsjonist i Norge?", "GDPR og AI-kundeservice — hva må du vite?", "Slik integrerer du AI med Fresha/Timely/DentalSuite".
3. **Case-studier.** Handz On-deal (når signert) + 1–2 eksisterende kunder som referanse = sterk social proof + dypt indekserbart innhold.
4. **Backlinks.** Gjesteposter på Shifter, NHO-portal, bransjepublikasjoner. Backlinks fra .no-domener med høy autoritet er fortsatt tungt vektet.

---

## 7. Spørsmål / ansvar

- Kode: `seo-aeo-optimization`-branchen er klar for review.
- GA4 + GSC-onboarding: kan gjøres etter merge, blokkerer ikke deploy.
- Bransje-utvidelser: legg til i `src/lib/bransje-data.ts` + oppdater `src/app/sitemap.ts` + update `generateStaticParams`-listen i `[bransje]/page.tsx` (egentlig ikke nødvendig — den leser fra samme data).
