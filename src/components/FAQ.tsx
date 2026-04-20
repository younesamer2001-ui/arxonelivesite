'use client'

import { useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import { faqContent } from '@/lib/faq-data'

interface FAQProps {
  lang?: 'no' | 'en'
}

/**
 * Antall FAQ-spørsmål som vises før "Vis flere"-knappen.
 * Resten holdes i DOM-en, bare visuelt skjult via `hidden`-attributtet —
 * slik beholder Google FAQPage-schema sin dekning (JSON-LD i layout.tsx
 * inkluderer alle) og accordion-ekspansjon telles som brukerinitiert
 * synlighet per Googles FAQ-retningslinjer.
 */
const VISIBLE_COUNT = 6

/**
 * FAQ section. Source of truth lives in `src/lib/faq-data.ts` so that the
 * on-page content and the FAQPage JSON-LD in `src/app/layout.tsx` stay in
 * lockstep. Diverging them breaks Google's rich-results eligibility.
 *
 * The JSON-LD is read server-side in layout.tsx; this component only renders
 * the visible accordion. Both pull from the same module.
 *
 * A11y:
 *   - Hvert FAQ-element bruker <button> (ikke div), slik at tab + enter/space
 *     fungerer. aria-expanded + aria-controls følger WAI-ARIA-accordion-mønsteret.
 *   - Svarpanel får role="region" og aria-labelledby som peker tilbake på knappen,
 *     så skjermlesere kunngjør "ekspandert/kollapset" riktig.
 *   - "Vis flere"-knappen har aria-expanded + aria-controls mot listen.
 */
export default function FAQ({ lang = 'no' }: FAQProps) {
  const t = faqContent[lang]
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  const hiddenCount = Math.max(0, t.items.length - VISIBLE_COUNT)
  const hasHidden = hiddenCount > 0

  const showMoreLabel =
    lang === 'en'
      ? `Show all ${t.items.length} questions`
      : `Vis alle ${t.items.length} spørsmål`
  const showLessLabel = lang === 'en' ? 'Show fewer' : 'Vis færre'

  return (
    <section id="faq" className="relative py-20 md:py-32 bg-black" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="w-full">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider">{t.label}</p>
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-white mt-2">{t.heading}</h2>
          <p className="text-sm text-zinc-300 mt-3 pb-6 max-w-lg">{t.subtext}</p>

          <ul id="faq-list" className="list-none p-0 m-0">
            {t.items.map((item, index) => {
              const isOpen = openIndex === index
              const isBeyondFold = index >= VISIBLE_COUNT
              const buttonId = `faq-trigger-${index}`
              const panelId = `faq-panel-${index}`
              return (
                <li
                  key={index}
                  hidden={isBeyondFold && !showAll}
                  className="border-b border-zinc-800"
                >
                  <h3 className="m-0">
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between py-5 text-left text-base font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
                    >
                      <span className="pr-4">{item.question}</span>
                      <svg
                        width="18" height="18" viewBox="0 0 18 18" fill="none"
                        className={`shrink-0 transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      >
                        <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`text-sm text-zinc-300 transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'opacity-100 max-h-[400px] translate-y-0 pb-5' : 'opacity-0 max-h-0 -translate-y-2'}`}
                  >
                    {item.answer}
                  </div>
                </li>
              )
            })}
          </ul>

          {/* Vis flere / Vis færre — skjul-toggle for AEO-tunge spørsmål */}
          {hasHidden && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              aria-controls="faq-list"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm px-1 transition-colors group"
            >
              <Plus
                className={`w-4 h-4 transition-transform duration-300 ${
                  showAll ? 'rotate-45' : ''
                }`}
                aria-hidden="true"
              />
              {showAll ? showLessLabel : showMoreLabel}
            </button>
          )}

          {/* Footer CTA */}
          <div className="mt-10 flex items-center gap-2">
            <span className="text-zinc-300 text-sm">{t.footerText}</span>
            <a href="#kontakt" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm px-1 transition-colors group">
              {t.footerCta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
