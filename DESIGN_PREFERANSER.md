# ARXON NETTSIDE - DESIGN PREFERANSER
## Hva Younes liker og ikke liker

---

## ✅ LIKER

### Farger:
- Svart bakgrunn (#000000)
- Hvit tekst og elementer
- Ren, minimalistisk stil
- Ingen fargede gradienter

### Bakgrunn:
- Video-bakgrunn (hvis relevant)
- Subtile animasjoner
- Ikke forstyrrende
- Profesjonell

### Layout:
- Tube-light navbar (glass-effect, lys på aktiv tab)
- Fixed navbar øverst
- Klare seksjoner
- God spacing

### Komponenter:
- shadcn/ui struktur
- Framer Motion for animasjoner
- Lucide React ikoner
- Tailwind CSS

### Animasjoner:
- Staggered fade-in
- Subtile hover-effekter
- Ikke for raske
- Profesjonelle

### Tekst:
- Stor, lesbar font
- Tight tracking på overskrifter
- God kontrast

---

## ❌ LIKER IKKE

### Farger:
- Blå/cyan/lilla gradienter (for mye farge)
- For lyse bakgrunner
- Fargede partikler

### Animasjon:
- For raske bevegelser
- For mange partikler (rotete)
- Tekst-forming med partikler (uleselig)
- Dobbelt-animasjon (kjører to ganger)

### Stil:
- For "techy" eller futuristisk
- Rotete layout
- Overlappende elementer
- "Gamer" aesthetic

### Tekniske problemer:
- Hydration errors
- Server/Client komponent konflikter
- Manglende dependencies

---

## 🎯 NØKKELPUNKTER

1. **Bakgrunn:** Ren svart (#000000)
2. **Navbar:** Tube-light style, glass-effect
3. **Animasjoner:** Subtile, profesjonelle, staggered
4. **Tekst:** Stor, lesbar, hvit
5. **Layout:** Minimalistisk, god spacing
6. **Tech Stack:** Next.js + Tailwind + Framer Motion + shadcn/ui
7. **Ikoner:** Lucide React
8. **Stil:** Corporate, profesjonell, elegant
9. **Språk:** Norsk som standard (NO), lett byttbar til engelsk (EN)

---

## 📁 FILSTRUKTUR (BEST PRACTICE)

```
src/
├── app/
│   ├── page.tsx (Client Component med 'use client')
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn komponenter)
│   │   └── tube-light-navbar.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Process.tsx
│   ├── Pricing.tsx
│   └── Contact.tsx
├── lib/
│   └── utils.ts
└── ...
```

---

## ⚠️ VIKTIGE REGLER

1. **Client Components:** Bruk `'use client'` når du bruker:
   - React hooks (useState, useEffect)
   - Framer Motion
   - Ikoner som sendes som props
   - Event handlers

2. **Server Components:** Standard for:
   - Statisk innhold
   - Data fetching
   - Layouts

3. **Dependencies:** Installer alltid:
   - `framer-motion`
   - `lucide-react`
   - `clsx`
   - `tailwind-merge`

4. **shadcn/ui:** Bruk standard struktur:
   - `/components/ui/`
   - `/lib/utils.ts`

5. **Server Management:**
   - Hvis `localhost:3000` er opptatt: `kill [PID]`
   - Sjekk om server kjører før du starter ny
   - Bruk `lsof -ti:3000 | xargs kill -9` for å drepe prosess på port 3000

---

## 🔄 KONTINUERLIG OPPDATERING

**Husk å logge:**
- ✅ Nye komponenter som fungerer bra
- ❌ Feil og hvordan de ble fikset
- 🎨 Design-endringer og preferanser
- ⚡ Performance tweaks
- 📱 Responsive issues

**Siste endringer:**
- 2026-03-24: Lagt til tube-light navbar, Hero med video, 5 seksjoner
- 2026-03-24: Fikset Client Component issues med ikoner
- 2026-03-24: Lagt til offisiell HubSpot SVG logo (sprocket)
- 2026-03-24: Lagt til offisiell Airtable SVG logo
- 2026-03-24: Lagt til offisiell Gmail SVG logo
- 2026-03-24: Oppdatert integrasjons-seksjon med 6 logoer og scale-hover effekt
- 2026-03-24: Server restart prosedyre dokumentert
- 2026-03-24: Økt navbar størrelse (py-2 px-2, text-base, px-8 py-3)
- 2026-03-24: Økt Hero tekst størrelse (120px font, text-2xl subtext)
- 2026-03-24: Flyttet badges under subtext
- 2026-03-24: Økt knappe størrelse (px-10 py-5, text-lg)
- 2026-03-24: Beholdt tube-light navbar design
- 2026-03-24: Lagt til 3D outline logo (ARXON) til venstre i navbar
- 2026-03-24: Endret Hero H1 til "AI Consulting Built for Performance and Profit"
- 2026-03-24: Oppdatert Hero med Inter font, bedre font weights
- 2026-03-24: Endret badges til norske integrasjoner (Tripletex, HubSpot, Google Calendar)
- 2026-03-24: Endret knapper til norsk
- 2026-03-24: FULLFØRT SPRÅKSTØTTE: Alle komponenter (Hero, Services, Process, Pricing, Contact) støtter NO/EN
- 2026-03-24: Lagt til content-objekter i alle komponenter for enkel oversettelse
- 2026-03-24: Endret H1 til "Automatiser. Vokst. Vinn." (NO) / "Automate. Grow. Win." (EN)
- 2026-03-24: Lagt til staggered animasjon på H1 (hvert ord kommer inn etter hverandre)
- 2026-03-24: Oppdatert integrasjoner til norske systemer: Tripletex, Fiken, Visma, HubSpot

## 💰 PRISSTRATEGI (NOTERT)

**Beslutning: Vise T1-pris tydelig, T2/T3 som "Fra X kr"**

**Bakgrunn:**
- Dokument 02_PRISRESEARCH.md anbefaler verdibasert prising
- T1 (4 990 kr/mnd) er testet og fungerer (under psykologisk grense på 5 000 kr)
- T2/T3 krever salgssamtale uansett pga kompleksitet

**Strategi:**
- ✅ T1: Vis pris tydelig (4 990 kr/mnd) - "impulse-kjøp" pris
- ⚠️ T2: Vis "Fra 8 000 kr/mnd" eller "Kontakt oss"
- ⚠️ T3: Vis "Kontakt oss for tilbud" (enterprise)

**Argumenter FOR å vise T1-pris:**
- Transparent - bygger tillit
- Filtrerer bort kunder uten budsjett
- Under psykologisk grense (5 000 kr)
- Konkurransedyktig

**Argumenter MOT å vise alle priser:**
- Fokuserer på pris i stedet for verdi
- Komplekse løsninger vanskelig å prisfeste
- T2/T3 krever skreddersøm

**Konklusjon:** Vis T1-pris, skjul T2/T3 bak "Kontakt oss"
- 2026-03-24: Lagt til SVG logo-komponenter for alle integrasjoner
- 2026-03-24: Bekreftet at alle integrasjoner er mulige via n8n
- 2026-03-24: Oppdatert SVG logoer med offisiell stil (Tripletex barchart, Fiken circle, Visma V, HubSpot sprocket)
- 2026-03-24: Forbedret logo-visning med bg-white/5, border, hover-effekt og bedre spacing
- 2026-03-24: Lagt til "Book konsultasjon" CTA til høyre
- 2026-03-24: Lagt til NO/EN språk switcher til høyre

## 🎯 VELLYKKEDE IMPLEMENTASJONER (MÅ BEHOLDES)

### Hero Seksjon
- ✅ **H1: "Automatiser. Vokst. Vinn."** - Sticky, konsist, norsk
- ✅ **Staggered animasjon** - Hvert ord kommer inn med 0.2s delay
- ✅ **SF Pro Display font** - Clean, Apple-stil
- ✅ **Integrasjons-logoer** - 7 offisielle SVG-er (HubSpot, Airtable, Gmail, Slack, Teams, Salesforce)
- ✅ **Circular marquee** - 3 logoer synlig, smooth loop, fade-kanter

### Knapper
- ✅ **Liquid Metal Button** - 3D shader-effekt, ripple på klikk, hvit tekst
- ✅ **Størrelse: 220x56px** - Passer norsk tekst
- ✅ **Dynamisk import (ssr: false)** - Fikser WebGL/SSR issues

### AI Resepsjonister Seksjon
- ✅ **6 AI-personligheter** - Lisa, Marcus, Emma, Leo, Max, Ella
- ✅ **Ikoner i stedet for bilder** - Heart, Home, Calculator, Target, Car, Zap
- ✅ **Kun "Ring nå" knapp** - Ingen lydavspiller (for enkelt)
- ✅ **Load More funksjonalitet** - Viser 3 først

### ServicesIntro Seksjon
- ✅ **Clean, minimalistisk tekst** - "Bygget for å automatisere. Designet for å prestere."
- ✅ **Service tags** - 5 tjenester i rounded pills
- ✅ **Workflow Visualizer** - Interaktiv, dragbare noder, transparent bg

### Tekniske Løsninger
- ✅ **Framer Motion** - Alle animasjoner smooth
- ✅ **TypeScript** - Type safety gjennomgående
- ✅ **Tailwind CSS** - Consistent styling
- ✅ **shadcn/ui struktur** - Komponenter i /components/ui/

### Hva som IKKE fungerte (lærdom)
- ❌ **WhatWeDo timeline** - For kompleks, fjernet
- ❌ **Lydavspiller i AI-kort** - Forstyrrende, fjernet
- ❌ **Pris med setup-kostnad** - Rotete, rullet tilbake

### Neste steg (prioritet)
1. Deploye til Vercel
2. Teste på mobil
3. VAPI integrasjon (ekte telefonnummer)
4. Flere seksjoner (om oss, cases)

---

_Sist oppdatert: 2026-03-25_
