'use client'

import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import { PhoneCall, Sparkles, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { IPhoneMockup } from './ui/iphone-mockup'

interface TryAIProps {
  lang?: 'no' | 'en'
}

const content = {
  no: {
    label: 'Prøv selv',
    heading: 'Ring og test',
    headingAccent: 'AI-resepsjonisten.',
    subtext: 'Opplev hvordan det føles å bli møtt av en AI som svarer profesjonelt på norsk. Trykk på en telefon under — det tar bare 30 sekunder.',
    cta: 'Ring nå',
    phone: '+47 21 93 64 28',
    note: 'Gratis å prøve · Ingen forpliktelser',
    demos: [
      { name: 'Frisørsalong', desc: 'Booking av klipp og farging', image: '/demos/frisorsalong.png' },
      { name: 'Bilpleie', desc: 'Pakkebestilling og tilgjengelighet', image: '/demos/bilpleie.png' },
      { name: 'Tannlege', desc: 'Timebestilling og avbestilling', image: '/demos/tannlege.png' },
    ],
  },
  en: {
    label: 'Try it yourself',
    heading: 'Call and test',
    headingAccent: 'the AI receptionist.',
    subtext: 'Experience what it feels like to be greeted by an AI that answers professionally in Norwegian. Tap a phone below — it only takes 30 seconds.',
    cta: 'Call now',
    phone: '+47 21 93 64 28',
    note: 'Free to try · No commitments',
    demos: [
      { name: 'Hair salon', desc: 'Booking haircuts and coloring', image: '/demos/frisorsalong.png' },
      { name: 'Car care', desc: 'Package orders and availability', image: '/demos/bilpleie.png' },
      { name: 'Dentist', desc: 'Appointment booking and cancellation', image: '/demos/tannlege.png' },
    ],
  },
}

export default function TryAI({ lang = 'no' }: TryAIProps) {
  const t = content[lang]

  return (
    <section className="pt-24 md:pt-28 pb-0 bg-black">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{t.label}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-5">
              {t.heading}{' '}
              <span className="text-zinc-400">{t.headingAccent}</span>
            </h2>

            <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl mx-auto">
              {t.subtext}
            </p>
          </div>
        </ScrollReveal>

        {/* 3 iPhone Mockups */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-8">
          {t.demos.map((demo, i) => (
            <ScrollReveal key={i} y={30} delay={i * 0.12}>
              <a
                href={`tel:${t.phone.replace(/\s/g, '')}`}
                className="group block text-center"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <IPhoneMockup
                    model="15-pro"
                    color="space-black"
                    scale={0.52}
                    screenBg="#000"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={demo.image}
                        alt={demo.name}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                      {/* Hover call overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <PhoneCall className="w-6 h-6 text-zinc-900" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </IPhoneMockup>
                </motion.div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
