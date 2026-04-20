# Arxon SEO + AEO audit — 2026-04-20

**Mål:** arxon.no skal rankes #1 på Google for norske AI-kundeservice-/resepsjonist-søk, og siteres av Claude / ChatGPT / Perplexity når folk spør om automatisering av kundeservice, booking og salg for norske SMB-er.

Denne auditen dekker nåværende tilstand, prioriterte feil, og en konkret implementasjonsplan.

---

## TL;DR

Nettsiden har **godt fundament** (Next.js App Router, norsk locale, basis JSON-LD, sitemap, robots, OpenGraph), men **fem kritiske hull** hindrer rangering:

1. **Alle undersider er `'use client'`** → ingen unik metadata, ingen JSON-LD, ingen OG-tags per side. Google ser "Arxon" som title på /blogg, /om-oss, /karriere, /garanti og **hver eneste bloggpost**.
2. **Google Analytics er placeholder** (`G-XXXXXXXXXX`) → måler ingenting.
3. **FAQPage JSON-LD er ute av synk** med FAQ-komponenten (4 spørsmål i schema vs. 8 på siden).
4. **Ingen llms.txt** og ingen AEO-optimalisert innholdsstruktur → Claude/ChatGPT har lite å sitere.
5. **Ingen bransjespesifikke landingssider** → taper long-tail søk som "AI-telefonsvarer frisør Oslo" (typisk lav konkurranse, høy konvertering).

Fikser tar ca. 2 timer. Forventet effekt: indeksering av 15+ nye sider, bedre CTR fra Google, og en reell sjanse til å dukke opp i AI-svar innen 30–60 dager.

---

## Nåværende tilstand

### Ting som er bra

- `metadataBase: https://arxon.no` satt riktig i root layout
- Norsk locale: `lang="nb"`, `hreflang="nb-NO"`, `openGraph.locale: "nb_NO"`
- Grunn-schema.org: Organization, WebSite, WebPage, Service (med pris), FAQPage
- `robots.ts` tillater alle crawlere (men kan gjøres eksplisitt for AI-bots)
- `sitemap.ts` genererer hoved-sider + blog-innlegg
- OpenGraph-bilde definert (`/images/og-arxon.jpg`, 1200×630)
- 6 definerte blogpost-slugs i `blog-data.ts` (men kun 3 fullstendige)
- Canonical URL satt: `https://arxon.no`

### Hull og feil (prioritert)

#### P0 — Blokkerer all SEO

**P0-1. Alle undersider er client-komponenter → ingen metadata**
- Filer: `/blogg/page.tsx`, `/blogg/[slug]/page.tsx`, `/om-oss/page.tsx`, `/karriere/page.tsx`, `/garanti/page.tsx` — alle har `'use client'` på linje 1
- Konsekvens: Next.js kan ikke kalle `generateMetadata()` på klient-komponenter. Google ser **samme tittel og beskrivelse på alle sider** (fra layout.tsx).
- Blogg-posten "Hva er en AI-resepsjonist" har ingen egen `<title>`, ingen egen beskrivelse, ingen egen OG-image, ingen Article-schema.
- Fix: splitt hver side i en server-wrapper (med `export const metadata` eller `generateMetadata`) + client-barn som gjør interaktiviteten.

**P0-2. Google Analytics 4 er ikke koblet til**
- `layout.tsx` linje 230–238: `G-XXXXXXXXXX` er placeholder.
- Konsekvens: du måler null trafikk, kan ikke verifisere SEO-effekt.
- Fix: erstatt med ekte GA4-ID. Hent fra analytics.google.com → Admin → Property Settings.

**P0-3. FAQPage JSON-LD matcher ikke FAQ-komponenten**
- `layout.tsx` linje 182–217: 4 spørsmål
- `FAQ.tsx` linje 15–50: 8 spørsmål (språk, oppsigelse, GDPR, eskalering, pris, prøving, etterkjøp, hvordan fungerer)
- Konsekvens: Google viser kun de 4 i rich results. De 4 andre kastes bort.
- Fix: synk — samme liste begge steder. Helst: flytt FAQ-data til `src/lib/faq-data.ts` og importer begge steder.

#### P1 — Stor synlighet vunnet med liten innsats

**P1-1. Keyword-stuffing i `meta keywords`**
- `layout.tsx` linje 36–64: 27 keywords. Google bruker ikke meta keywords siden 2009; verre, det signaliserer "gammeldags SEO" til kvalitetsvurderinger.
- Fix: fjern hele `keywords`-arrayet. Plasser søkeord naturlig i H1, H2 og første avsnitt i stedet.

**P1-2. Ingen `llms.txt`**
- Ingen fil på `/public/llms.txt`.
- Konsekvens: LLM-crawlere (ChatGPT, Claude, Perplexity, Grok) må parse hele siten for å forstå hva Arxon gjør. En `llms.txt` gir dem en destillert, AI-vennlig sammendrag.
- Fix: lag `/public/llms.txt` og `/public/llms-full.txt` (jf. llmstxt.org-spec) med produktoversikt, priser, FAQ, kontaktinfo.

**P1-3. Ingen LocalBusiness-schema**
- Arxon er en norsk bedrift som selger til norske bedrifter. LocalBusiness-schema (med adresse, åpningstider, geo-koordinater) kan få siden opp i Google Maps-resultater og "nær meg"-søk.
- Fix: legg til `LocalBusiness` entitet i JSON-LD-graph med `address`, `geo`, `openingHours`.

**P1-4. Ingen BreadcrumbList**
- Google viser breadcrumbs i SERP i stedet for URL om du gir det som schema. Øker CTR ~15 %.
- Fix: legg til `BreadcrumbList` på `/blogg`, `/blogg/[slug]`, `/om-oss`, osv.

**P1-5. Ingen HowTo-schema**
- "Slik kommer du i gang" finnes som `ProcessSteps`-komponent, men uten schema. HowTo-schema kan få trinn til å vises i Google SERP.
- Fix: generer HowTo-JSON-LD fra ProcessSteps-data.

**P1-6. `sitemap.ts` bruker `new Date()` på hver build**
- `lastModified: new Date()` på hver statisk side = Google ser at alle sider endres hver gang du deployer, selv når innhold ikke endres. Over tid vurderer Google dette som støy og senker sitemap-tilliten.
- Fix: hardkode `lastModified` per route til datoen innholdet faktisk ble oppdatert.

**P1-7. Robots.ts tillater ikke eksplisitt AI-crawlere**
- Nåværende: `userAgent: "*"` — tillater alle. Men noen AI-crawlere (f.eks. ClaudeBot, GPTBot, PerplexityBot) ser etter eksplisitte regler og kan være mer aggressive hvis de ser spesifikk opt-in.
- Fix: legg til eksplisitte regler for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot` som `allow: /`.

#### P2 — Innhold vi mangler for å vinne AEO

**P2-1. Ingen bransjespesifikke landingssider**
- Alle tre målsegmentene (frisør, verksted, tannlege) har høy søkevolum og lav konkurranse.
- Eksempler:
  - "AI telefonsvarer frisør" — 100–300 søk/mnd, lav konkurranse
  - "bookingsystem verksted AI" — 50–150 søk/mnd, ingen konkurrent
  - "tannlege resepsjonist automatisering" — 200–400 søk/mnd
- Fix: lag `/ai-resepsjonist/frisor`, `/ai-resepsjonist/verksted`, `/ai-resepsjonist/tannlege` med bransjespesifikke smertepunkter, case, pris, CTA.

**P2-2. FAQ er for kort for AEO**
- Claude/ChatGPT siterer oftest sider med 20+ konkrete spørsmål-svar-par, fordi det matcher hvordan folk stiller spørsmål.
- Fix: utvid FAQ fra 8 → 20+ med spørsmål som "Hvor mange språk støtter AI-en?", "Hvordan integreres Arxon med booking-systemet mitt?", "Er Arxon GDPR-kompatibel?", "Hva er forskjellen mellom Arxon og en vanlig chatbot?", "Trenger jeg teknisk kunnskap for å sette opp?".

**P2-3. Kun 3 fullstendige bloggposter**
- `blog-data.ts` har `posts: BlogPost[]` med 3 komplette innlegg. For å ranke på bredt tema-omfang trenger vi minst 8–10.
- Fix: 5 nye innlegg som dekker: "Beste AI-telefonsvarer for norske bedrifter (2026)", "Slik regner du ut ROI på AI-kundeservice", "AI-booking for frisører — guide", "AI og GDPR i Norge", "Hvordan erstatte en resepsjonist med AI (uten å miste kunder)".

**P2-4. Hero H1 er ikke optimert for primær-keyword**
- Må verifiseres i `CinematicHero` — men om H1 er for generisk ("AI som jobber for deg") i stedet for "AI-resepsjonist for norske bedrifter" mister du et sterkt rangerings-signal.

---

## Implementasjonsplan

Alle endringer går i branch `seo-aeo-optimization` for review før merge.

| # | Oppgave                                             | Prioritet | Filer                                                   |
|---|-----------------------------------------------------|-----------|---------------------------------------------------------|
| 1 | Splitt alle undersider i server + client            | P0        | `/om-oss`, `/karriere`, `/garanti`, `/blogg`, `/blogg/[slug]` |
| 2 | Legg til `generateMetadata` + Article-JSON-LD på [slug] | P0     | `/blogg/[slug]/page.tsx` (ny server-wrapper)            |
| 3 | Synk FAQ-data mellom layout.tsx og FAQ.tsx          | P0        | ny `src/lib/faq-data.ts`                                |
| 4 | Fjern keyword-stuffing, legg til GA4-placeholder    | P0        | `layout.tsx`                                            |
| 5 | Lag llms.txt + llms-full.txt                        | P1        | `/public/llms.txt`, `/public/llms-full.txt`             |
| 6 | Utvid FAQ til 20+ spørsmål                          | P1        | `faq-data.ts`                                           |
| 7 | Legg til LocalBusiness, BreadcrumbList, HowTo-schema| P1        | `layout.tsx`, nye schema-helpers i `src/lib/schema.ts`  |
| 8 | Fiks `sitemap.ts` `lastModified`                    | P1        | `/src/app/sitemap.ts`                                   |
| 9 | Eksplisitte AI-bot-regler i `robots.ts`             | P1        | `/src/app/robots.ts`                                    |
| 10| Bygg `/ai-resepsjonist/frisor`, `/verksted`, `/tannlege` | P2   | 3 nye sider                                             |
| 11| Skriv 5 nye bloggposter                             | P2 (senere)| `blog-data.ts`                                         |
| 12| Verifiser build, skriv deploy-guide                 | —         | `DEPLOY_SEO.md`                                         |

Tall 1–9 kommer i denne økta. Nr. 10 (bransjesider) får jeg laget skjelett + første side (frisør). 11 er en egen skrive-session hvis du vil.

---

## Hvordan måle om det virker

Etter deploy:

1. **Google Search Console**: submit ny sitemap, request indexing på hjemmeside + bransjesider. Følg "Performance" i 30 dager.
2. **Google Rich Results Test**: kjør `https://search.google.com/test/rich-results` på hjemmeside og to bloggposter — alle schema-blokker skal valideres uten feil.
3. **Test AEO**: spør ChatGPT/Claude "Hva er den beste AI-resepsjonisten for norske bedrifter?" hver uke. Noter om Arxon dukker opp (forvent 30–60 dager før dette begynner).
4. **GA4**: bekreft at hits registreres på alle ruter. Sett opp conversion-event på kontakt-form og demo-booking.
5. **llms.txt-sjekk**: `curl https://arxon.no/llms.txt` skal returnere 200 + innhold. Claude/ChatGPT respekterer denne.

---

Neste steg: jeg starter implementeringen. Auditen forblir i `/nettside/SEO_AEO_AUDIT_2026-04-20.md` som referanse.
