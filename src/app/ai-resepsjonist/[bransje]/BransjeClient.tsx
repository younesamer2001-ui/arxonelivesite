"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, ChevronDown, Phone } from "lucide-react"
import { NavBar } from "@/components/ui/tube-light-navbar"
import { Footer } from "@/components/ui/footer-section"
import { navItems } from "@/lib/nav-items"
import { useLang } from "@/lib/lang-context"
import type { BransjePage } from "@/lib/bransje-data"
import { bransjePages } from "@/lib/bransje-data"

interface Props {
  page: BransjePage
}

/**
 * Sentralt display-navn-oppslag for alle 12 bransjer.
 * - `singular`: brukes i breadcrumb ("Frisør")
 * - `plural`:   brukes i FAQ-overskrift ("Spørsmål fra frisørsalonger")
 * - `linkLabel`: kort label for relaterte-sider-lenker i footeren
 *
 * Hold denne i sync med BransjePage["slug"] union-typen i
 * src/lib/bransje-data.ts. Hvis du legger til en ny slug der, får du
 * typescript-feil her fordi Record<slug, ...> ikke dekker den. Det er
 * ønsket oppførsel.
 */
const DISPLAY: Record<
  BransjePage["slug"],
  { singular: string; plural: string; linkLabel: string }
> = {
  frisor: {
    singular: "Frisør",
    plural: "frisørsalonger",
    linkLabel: "✂️ AI-resepsjonist for frisører",
  },
  verksted: {
    singular: "Verksted",
    plural: "verksteder",
    linkLabel: "🔧 AI-resepsjonist for verksteder",
  },
  tannlege: {
    singular: "Tannlege",
    plural: "tannklinikker",
    linkLabel: "🦷 AI-resepsjonist for tannleger",
  },
  legekontor: {
    singular: "Legekontor",
    plural: "legekontor",
    linkLabel: "🩺 AI-resepsjonist for legekontor",
  },
  hudpleie: {
    singular: "Hudpleie",
    plural: "hudpleieklinikker",
    linkLabel: "✨ AI-resepsjonist for hudpleie",
  },
  advokat: {
    singular: "Advokat",
    plural: "advokatkontor",
    linkLabel: "⚖️ AI-resepsjonist for advokater",
  },
  regnskap: {
    singular: "Regnskap",
    plural: "regnskapsbyråer",
    linkLabel: "📊 AI-resepsjonist for regnskapsbyråer",
  },
  eiendomsmegler: {
    singular: "Eiendomsmegler",
    plural: "eiendomsmeglerkontor",
    linkLabel: "🏠 AI-resepsjonist for eiendomsmeglere",
  },
  rorlegger: {
    singular: "Rørlegger",
    plural: "rørleggerfirmaer",
    linkLabel: "🔩 AI-resepsjonist for rørleggere",
  },
  elektriker: {
    singular: "Elektriker",
    plural: "elektrikerfirmaer",
    linkLabel: "⚡ AI-resepsjonist for elektrikere",
  },
  restaurant: {
    singular: "Restaurant",
    plural: "restauranter",
    linkLabel: "🍽️ AI-resepsjonist for restauranter",
  },
  treningssenter: {
    singular: "Treningssenter",
    plural: "treningssentre",
    linkLabel: "💪 AI-resepsjonist for treningssentre",
  },
}

// Rekkefølgen som brukes for "Se også"-blokken. Vi vil ikke vise alle
// 11 andre på hver side — bare 3 nærmeste/mest relevante for å ikke
// overvelde. Mapping fra slug → de tre anbefalte søster-slugene.
const RELATED: Record<BransjePage["slug"], BransjePage["slug"][]> = {
  frisor: ["hudpleie", "tannlege", "treningssenter"],
  verksted: ["rorlegger", "elektriker", "eiendomsmegler"],
  tannlege: ["legekontor", "hudpleie", "frisor"],
  legekontor: ["tannlege", "hudpleie", "advokat"],
  hudpleie: ["frisor", "tannlege", "treningssenter"],
  advokat: ["regnskap", "eiendomsmegler", "legekontor"],
  regnskap: ["advokat", "eiendomsmegler", "legekontor"],
  eiendomsmegler: ["advokat", "regnskap", "rorlegger"],
  rorlegger: ["elektriker", "verksted", "eiendomsmegler"],
  elektriker: ["rorlegger", "verksted", "eiendomsmegler"],
  restaurant: ["frisor", "hudpleie", "treningssenter"],
  treningssenter: ["hudpleie", "frisor", "restaurant"],
}

/**
 * Bransjespesifikk landing-page (frisør, verksted, tannlege).
 *
 * Alt innhold kommer fra `src/lib/bransje-data.ts`. Dette er kun en
 * visuell shell — samme layout på tvers av alle bransjer, innholdet
 * varierer. Holder koden DRY og gjør det enkelt å legge til nye bransjer
 * (f.eks. /ai-resepsjonist/legekontor).
 */
export default function BransjeClient({ page }: Props) {
  const { lang, setLang } = useLang()
  const items = navItems[lang]
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="bg-black min-h-screen text-white">
      <NavBar items={items} currentLang={lang} onLangChange={setLang} />

      {/* Breadcrumbs — hjelper Google forstå hierarkiet, og gir brukere navigasjon */}
      <nav
        aria-label="Brødsmulesti"
        className="pt-28 max-w-5xl mx-auto px-4 md:px-8 text-sm text-zinc-500"
      >
        <ol className="flex flex-wrap gap-2 items-center">
          <li>
            <Link href="/" className="hover:text-white transition-colors">
              Hjem
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/#ai-resepsjonist"
              className="hover:text-white transition-colors"
            >
              AI-resepsjonist
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-zinc-300" aria-current="page">
            {DISPLAY[page.slug].singular}
          </li>
        </ol>
      </nav>

      {/* HERO — H1 + lede (AEO-vennlig første-avsnitt svar) */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
            <span>{page.emoji}</span>
            <span>Bransjeløsning</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            {page.h1}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-zinc-300 max-w-3xl leading-relaxed">
            {page.lede}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/#kontakt"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-colors"
            >
              Book demo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+4778896386"
              className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-white font-semibold rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
              Ring AI-en live
            </a>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-16 md:py-24 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <p className="text-red-400 text-sm font-medium uppercase tracking-wider">
            Utfordringen
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-10">
            {page.problemTitle}
          </h2>
          <ul className="space-y-5">
            {page.problems.map((p, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xs font-semibold">
                  {i + 1}
                </span>
                <p className="text-zinc-300 leading-relaxed">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-16 md:py-24 border-t border-zinc-900 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider">
            Løsningen
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-12">
            {page.solutionTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {page.solutionPoints.map((point, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {point.title}
                  </h3>
                </div>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-16 md:py-24 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider">
            Avkastning
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-12">
            {page.roiTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {page.roiStat.map((stat, i) => (
              <div
                key={i}
                className="p-8 rounded-xl border border-zinc-800 bg-gradient-to-br from-emerald-500/5 to-transparent text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-zinc-500 max-w-3xl">
            Tall basert på gjennomsnitt av Arxon-kunder i tilsvarende bransje de
            første 90 dagene etter go-live. Individuelle resultater varierer
            med kundegrunnlag og bruksmønster.
          </p>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-16 md:py-24 border-t border-zinc-900 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider">
            I praksis
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-12">
            {page.useCaseTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {page.useCases.map((uc, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/50"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {uc.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {uc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — bransje-spesifikk, optimalisert for AEO */}
      <section className="py-16 md:py-24 border-t border-zinc-900">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider">
            Vanlige spørsmål
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-10">
            Spørsmål fra {DISPLAY[page.slug].plural}
          </h2>
          <div>
            {page.faq.map((item, i) => {
              const isOpen = openFaq === i
              return (
                <div
                  key={i}
                  className="border-b border-zinc-800 py-5 cursor-pointer"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-medium text-white">
                      {item.question}
                    </h3>
                    <ChevronDown
                      className={`shrink-0 w-4 h-4 text-zinc-500 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    className={`text-sm text-zinc-400 overflow-hidden transition-all duration-500 ${
                      isOpen
                        ? "opacity-100 max-h-[400px] pt-4"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 border-t border-zinc-900 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
            {page.ctaTitle}
          </h2>
          <p className="text-lg text-zinc-300 mb-8">{page.ctaText}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/#kontakt"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-colors"
            >
              Book demo
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+4778896386"
              className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-white font-semibold rounded-lg transition-colors"
            >
              <Phone className="w-4 h-4" />
              +47 78 89 63 86
            </a>
          </div>

          {/* Intern-linker til andre bransjer — hjelper både brukere som er på feil
              side, og Google med å forstå site-strukturen. Viser kun 3 mest
              relevante søster-bransjer (ikke alle 11) for å unngå linkstøy. */}
          <div className="mt-16 pt-10 border-t border-zinc-900">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-4">
              Se også
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {RELATED[page.slug]
                .filter((s) => bransjePages[s])
                .map((s) => (
                  <Link
                    key={s}
                    href={`/ai-resepsjonist/${s}`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-800 hover:border-zinc-600 rounded-lg text-sm text-zinc-300 hover:text-white transition-colors"
                  >
                    {DISPLAY[s].linkLabel}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
