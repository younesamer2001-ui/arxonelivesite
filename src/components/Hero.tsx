'use client'

import { useState, useEffect } from 'react'
import { HubSpotLogo, AirtableLogo, GmailLogo, SlackLogo, MicrosoftTeamsLogo, SalesforceLogo } from './Logos'
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('./VideoPlayer'), { ssr: false })
const LiquidMetalButton = dynamic(() => import('./ui/liquid-metal-button').then(mod => ({ default: mod.LiquidMetalButton })), {
  ssr: false,
})

const content = {
  no: {
    headline: ['Automatiser.', 'Vokst.', 'Vinn.'],
    subtext: 'Arxon er din AI-resepsjonist og AI-telefonsvarer. Vi hjelper norske bedrifter med å automatisere kundeservice, booking og salg — med AI som gir målbart resultat.',
    badgesLabel: 'Integrert med',
    cta1: 'Book gratis konsultasjon',
    cta2: 'Se våre tjenester'
  },
  en: {
    headline: ['Automate.', 'Grow.', 'Win.'],
    subtext: 'We help Norwegian businesses automate customer service, booking, and sales with AI that delivers measurable results.',
    badgesLabel: 'Integrated with',
    cta1: 'Book free consultation',
    cta2: 'See our services'
  }
}

interface HeroProps {
  lang?: 'no' | 'en'
}

export default function Hero({ lang = 'no' }: HeroProps) {
  const t = content[lang]
  const [showHeavy, setShowHeavy] = useState(true)

  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowHeavy(false)
    }
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-144px); }
        }
        .hero-animate {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .hero-word { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
        .hero-word-0 { animation-delay: 0.3s; }
        .hero-word-1 { animation-delay: 0.5s; }
        .hero-word-2 { animation-delay: 0.7s; }
        .hero-subtext { animation-delay: 0.6s; }
        .hero-badges { animation-delay: 0.8s; }
        .hero-cta { animation-delay: 1.0s; }
        .marquee-track {
          animation: marqueeScroll 18s linear infinite;
        }
      `}</style>
      <section className="relative min-h-screen bg-black overflow-hidden pt-20">
        {showHeavy && (
          <div className="absolute bottom-[25vh] left-0 right-0 h-[80vh] z-0">
            <VideoPlayer
              src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
              className="w-full h-full"
            />
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20">
          <h1 className="text-white text-center mb-6 flex flex-wrap justify-center gap-x-4 md:gap-x-8">
            {t.headline.map((word, i) => (
              <span
                key={i}
                className={`hero-word hero-word-${i} inline-block whitespace-nowrap text-2xl md:text-4xl lg:text-6xl font-black`}
                style={{
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          <p
            className="hero-animate hero-subtext text-gray-400 text-center max-w-2xl text-lg md:text-xl leading-relaxed mb-12"
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 400,
            }}
          >
            {t.subtext}
          </p>

          <div className="hero-animate hero-badges flex flex-col items-center gap-4 mb-12 w-full overflow-hidden">
            <span className="text-gray-500 text-sm">{t.badgesLabel}</span>
            <div className="relative w-full md:w-64 mx-auto overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

              <div className="marquee-track flex items-center">
                {[0, 1].map(set => (
                  <div key={set} className="flex items-center shrink-0">
                    {[HubSpotLogo, AirtableLogo, GmailLogo, SlackLogo, MicrosoftTeamsLogo, SalesforceLogo].map((Logo, i) => (
                      <div key={i} className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                        <div className="h-10 w-auto"><Logo /></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-animate hero-cta flex flex-col sm:flex-row gap-4 md:gap-6 items-center">
            {showHeavy ? (
              <>
                <LiquidMetalButton
                  label={t.cta1}
                  onClick={() => window.location.href = '#kontakt'}
                />
                <LiquidMetalButton
                  label={t.cta2}
                  viewMode="icon"
                  onClick={() => window.location.href = '#tjenester'}
                />
              </>
            ) : (
              <>
                <a
                  href="#kontakt"
                  className="bg-white text-black font-semibold px-8 py-3 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {t.cta1}
                </a>
                <a
                  href="#tjenester"
                  className="border border-white/30 text-white font-semibold px-8 py-3 rounded-full text-sm hover:bg-white/10 transition-colors"
                >
                  {t.cta2}
                </a>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
