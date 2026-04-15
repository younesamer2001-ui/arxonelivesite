'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import IPhoneMockup from '@/components/ui/iphone-mockup'

interface HowItWorksProps { lang?: 'no' | 'en' }

const content = {
  no: {
    badge: 'SLIK FUNGERER DET',
    title: 'Tre ting som skjer',
    titleBold: 'når kunden tar kontakt.',
    desc: 'Arxon tar seg av hele samtalen — fra det ringer til kunden har booket, betalt og fått bekreftelse.',
    steps: [
      { num: '01', title: 'Kunden ringer', desc: 'AI-en svarer umiddelbart — på telefon, SMS eller chat. Ingen kø, ingen tapt anrop.' },
      { num: '02', title: 'AI-en håndterer alt', desc: 'Booker timer, svarer på spørsmål, sender bekreftelse — automatisk.' },
      { num: '03', title: 'Full oversikt i sanntid', desc: 'Samtaler, bookinger, leads og anmeldelser — alt samlet på ett sted.' },
    ],
  },
  en: {
    badge: 'HOW IT WORKS',
    title: 'Three things happen',
    titleBold: 'when a customer reaches out.',
    desc: 'Arxon handles the entire interaction — from the first ring to a booked, confirmed and reminded appointment.',
    steps: [
      { num: '01', title: 'Customer calls', desc: 'The AI answers instantly — by phone, SMS or chat. No queue, no missed call.' },
      { num: '02', title: 'AI handles everything', desc: 'Books appointments, answers questions, sends confirmation — automatically.' },
      { num: '03', title: 'Full overview in real-time', desc: 'Calls, bookings, leads and reviews — everything in one place.' },
    ],
  },
}

/* ─── Phone Screens ─── */
function PhoneScreen1() {
  return (
    <IPhoneMockup model="15-pro" color="space-black" scale={0.58} screenBg="#000" safeArea={false} showDynamicIsland={false} showHomeIndicator={false}>
      <div className="absolute inset-0">
        <Image
          src="/images/iphone-ringing-screen.png"
          alt="AI svarer innkommende anrop"
          fill
          className="object-cover object-top"
          priority
        />
      </div>
    </IPhoneMockup>
  )
}

function PhoneScreen2() {
  return (
    <IPhoneMockup model="15-pro" color="space-black" scale={0.58} screenBg="#000" safeArea={false} showDynamicIsland={false} showHomeIndicator={false}>
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/images/phone-booking-v2.png"
          alt="Arxon booking-notifikasjon"
          width={768}
          height={1376}
          style={{ width: '94%', height: '94%', objectFit: 'cover', objectPosition: '50% 50%' }}
        />
      </div>
    </IPhoneMockup>
  )
}

function PhoneScreen3() {
  return (
    <IPhoneMockup model="15-pro" color="space-black" scale={0.58} screenBg="#16181b" safeArea={false} showDynamicIsland={false} showHomeIndicator={false}>
      <div className="absolute inset-0 bg-[#16181b]">
        <Image
          src="/images/arxon-dashboard-iphone.png"
          alt="Sanntidsoversikt dashboard"
          fill
          className="object-contain object-center"
        />
      </div>
    </IPhoneMockup>
  )
}

const PHONES = [PhoneScreen1, PhoneScreen2, PhoneScreen3]

export default function HowItWorks({ lang = 'no' }: HowItWorksProps) {
  const c = content[lang]
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section className="relative bg-black">
      {/* ── Sticky phone — pinned to right half ── */}
      <div className="sticky top-0 h-screen pointer-events-none z-10">
        <div className="h-full max-w-6xl mx-auto px-6 flex items-center justify-end md:pr-[8%]">
          <div className="relative" style={{ perspective: 1200 }}>
            {PHONES.map((PhoneComp, i) => (
              <motion.div
                key={i}
                className={i === 0 ? 'relative' : 'absolute inset-0'}
                initial={false}
                animate={{
                  opacity: activeStep === i ? 1 : 0,
                  scale: activeStep === i ? 1 : 0.3,
                  rotateY: activeStep === i ? 0 : activeStep > i ? -60 : 60,
                  y: activeStep === i ? 0 : activeStep > i ? -100 : 100,
                }}
                transition={{
                  duration: 0.8,
                  type: 'spring',
                  damping: 20,
                  stiffness: 90,
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <PhoneComp />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll content: text on the LEFT side ── */}
      <div className="relative z-20">
        {/* Header — first screen */}
        <div className="h-screen flex flex-col justify-center px-6">
          <div className="max-w-6xl mx-auto w-full">
            <div className="max-w-lg">
              <div className="inline-block px-3 py-1 border border-zinc-700 rounded-full text-[10px] font-semibold tracking-widest text-zinc-300 uppercase mb-5">
                {c.badge}
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-300 leading-[1.1]">
                {c.title}<br />
                <span className="text-white">{c.titleBold}</span>
              </h2>
              <p className="mt-4 text-base md:text-lg text-zinc-400 leading-relaxed">
                {c.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Each step — left-aligned text, phone stays on right */}
        {c.steps.map((step, i) => (
          <ScrollTrigger key={step.num} index={i} onActivate={setActiveStep}>
            <div className="max-w-6xl mx-auto px-6 w-full">
              <motion.div
                className="max-w-md"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-[11px] font-bold tracking-[0.25em] text-zinc-500 uppercase mb-3 block">
                  {step.num}
                </span>
                <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-snug mb-3">
                  {step.title}
                </h3>
                <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            </div>
          </ScrollTrigger>
        ))}
      </div>
    </section>
  )
}

/* ── ScrollTrigger: watches when this section enters the viewport center ── */
function ScrollTrigger({
  index,
  onActivate,
  children,
}: {
  index: number
  onActivate: (i: number) => void
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onActivate(index)
        }
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [index, onActivate])

  return (
    <div ref={ref} className="h-screen flex items-center">
      {children}
    </div>
  )
}
