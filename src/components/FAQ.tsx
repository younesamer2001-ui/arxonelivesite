'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { faqContent } from '@/lib/faq-data'

interface FAQProps {
  lang?: 'no' | 'en'
}

/**
 * FAQ section. Source of truth lives in `src/lib/faq-data.ts` so that the
 * on-page content and the FAQPage JSON-LD in `src/app/layout.tsx` stay in
 * lockstep. Diverging them breaks Google's rich-results eligibility.
 *
 * The JSON-LD is read server-side in layout.tsx; this component only renders
 * the visible accordion. Both pull from the same module.
 */
export default function FAQ({ lang = 'no' }: FAQProps) {
  const t = faqContent[lang]
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="relative py-20 md:py-32 bg-black">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="w-full">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider">{t.label}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{t.heading}</h2>
          <p className="text-sm text-zinc-400 mt-3 pb-6 max-w-lg">{t.subtext}</p>
          {t.items.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="border-b border-zinc-800 py-5 cursor-pointer"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-white pr-4">{item.question}</h3>
                  <svg
                    width="18" height="18" viewBox="0 0 18 18" fill="none"
                    className={`shrink-0 transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className={`text-sm text-zinc-500 transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'opacity-100 max-h-[400px] translate-y-0 pt-4' : 'opacity-0 max-h-0 -translate-y-2'}`}>
                  {item.answer}
                </div>
              </div>
            )
          })}

          {/* Footer CTA */}
          <div className="mt-10 flex items-center gap-2">
            <span className="text-zinc-400 text-sm">{t.footerText}</span>
            <a href="#kontakt" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-emerald-400 transition-colors group">
              {t.footerCta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
