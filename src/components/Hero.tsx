'use client'

import { motion } from 'framer-motion'
const VideoPlayer = dynamic(() => import('./VideoPlayer'), { ssr: false })
import { HubSpotLogo, AirtableLogo, GmailLogo, SlackLogo, MicrosoftTeamsLogo, SalesforceLogo } from './Logos'
import dynamic from 'next/dynamic'

const LiquidMetalButton = dynamic(() => import('./ui/liquid-metal-button').then(mod => ({ default: mod.LiquidMetalButton })), {
  ssr: false,
  loading: () => null,
})

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
    },
  },
}

// Content for both languages
const content = {
  no: {
    headline: ['Automatiser.', 'Vokst.', 'Vinn.'],
    subtext: 'Arxon er din AI-resepsjonist og AI-telefonsvarer. Vi hjelper norske bedrifter med å automatisere kundeservice, booking og salg — med AI som gir målbart resultat.',
    badgesLabel: 'Integrert med',
    badges: ['HubSpot', 'Airtable', 'Gmail', 'Slack', 'Microsoft Teams', 'Salesforce'],
    cta1: 'Book gratis konsultasjon',
    cta2: 'Se våre tjenester'
  },
  en: {
    headline: ['Automate.', 'Grow.', 'Win.'],
    subtext: 'We help Norwegian businesses automate customer service, booking, and sales with AI that delivers measurable results.',
    badgesLabel: 'Integrated with',
    badges: ['HubSpot', 'Airtable', 'Gmail', 'Slack', 'Microsoft Teams', 'Salesforce'],
    cta1: 'Book free consultation',
    cta2: 'See our services'
  }
}

interface HeroProps {
  lang?: 'no' | 'en'
}

export default function Hero({ lang = 'no' }: HeroProps) {
  const t = content[lang]
  
  return (
    <section className="relative min-h-screen bg-black overflow-hidden pt-20">
      {/* Video Background - hidden on mobile for performance */}
      <div className="absolute bottom-[25vh] left-0 right-0 h-[80vh] z-0 hidden md:block">
        <VideoPlayer 
          src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
          className="w-full h-full"
        />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20"
      >
        {/* Headline - Staggered words on one line */}
        <h1 className="text-white text-center mb-6 flex flex-wrap justify-center gap-x-4 md:gap-x-8">
          {t.headline.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.3 + (i * 0.2),
                ease: "easeOut"
              }}
              className="inline-block whitespace-nowrap text-2xl md:text-4xl lg:text-6xl font-black"
              style={{
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                opacity: 1 - (i * 0.15),
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtext */}
        <motion.p
          variants={itemVariants}
          className="text-gray-400 text-center max-w-2xl text-lg md:text-xl leading-relaxed mb-12"
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontWeight: 400,
          }}
        >
          {t.subtext}
        </motion.p>

        {/* Integrations - Circular scrolling marquee */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-4 mb-12 w-full overflow-hidden">
          <span className="text-gray-500 text-sm">{t.badgesLabel}</span>
          <div className="relative w-full md:w-64 mx-auto overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
            
            <motion.div
              className="flex items-center"
              animate={{
                x: [0, -144],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 18,
                  ease: "linear",
                },
              }}
            >
              {/* First set */}
              <div className="flex items-center shrink-0">
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                  <div className="h-10 w-auto"><HubSpotLogo /></div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                  <div className="h-10 w-auto"><AirtableLogo /></div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                  <div className="h-10 w-auto"><GmailLogo /></div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                  <div className="h-10 w-auto"><SlackLogo /></div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                  <div className="h-10 w-auto"><MicrosoftTeamsLogo /></div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                  <div className="h-10 w-auto"><SalesforceLogo /></div>
                </div>
              </div>
              {/* Duplicate set for seamless loop */}
              <div className="flex items-center shrink-0">
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                  <div className="h-10 w-auto"><HubSpotLogo /></div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                  <div className="h-10 w-auto"><AirtableLogo /></div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                  <div className="h-10 w-auto"><GmailLogo /></div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                  <div className="h-10 w-auto"><SlackLogo /></div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                  <div className="h-10 w-auto"><MicrosoftTeamsLogo /></div>
                </div>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0 opacity-70 hover:opacity-100 px-6">
                  <div className="h-10 w-auto"><SalesforceLogo /></div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Buttons - LiquidMetal on desktop, simple buttons on mobile */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center">
          {/* Mobile: simple buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:hidden">
            <a
              href="#kontakt"
              className="bg-white text-black font-medium h-12 px-6 rounded-full text-sm inline-flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              {t.cta1}
            </a>
            <a
              href="#tjenester"
              className="border border-white/20 text-white font-medium h-12 px-6 rounded-full text-sm inline-flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              {t.cta2}
            </a>
          </div>
          {/* Desktop: LiquidMetal shader buttons */}
          <div className="hidden md:flex gap-6 items-center">
            <LiquidMetalButton 
              label={t.cta1} 
              onClick={() => window.location.href = '#kontakt'}
            />
            <LiquidMetalButton 
              label={t.cta2}
              viewMode="icon"
              onClick={() => window.location.href = '#tjenester'}
            />
          </div>
        </motion.div>


      </motion.div>
    </section>
  )
}
