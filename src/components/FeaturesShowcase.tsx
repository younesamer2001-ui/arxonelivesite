'use client'

import { useRef, useState } from 'react'
import { Phone, Calendar, TrendingUp } from 'lucide-react'
import { NumberTicker } from '@/components/ui/number-ticker'

const content = {
  no: {
    badge: 'SLIK FUNGERER DET',
    title: 'Tre ting som skjer',
    titleBold: 'når telefonen ringer.',
    description: 'Arxon tar seg av hele samtalen — fra det ringer til kunden har booket, betalt og fått bekreftelse.',
    features: [
      {
        num: '01',
        title: 'AI-en svarer på 1,4 sekunder',
        desc: 'Ingen ventemusikk, ingen «trykk 1 for...». AI-en gjenkjenner faste kunder, vet hva de booket sist, og tilpasser samtalen til bransjen din.',
        icon: Phone,
        stat: 1.4,
        statSuffix: 's',
        statDecimals: 1,
        statLabel: 'gjennomsnittlig svartid',
        gradient: 'from-zinc-500/10 to-zinc-500/0',
      },
      {
        num: '02',
        title: 'Finner ledig tid og booker',
        desc: 'Koblet rett til kalenderen. AI-en sjekker tilgjengelighet i sanntid, bekrefter med kunden, og sender SMS-bekreftelse — uten at du løfter en finger.',
        icon: Calendar,
        stat: 291,
        statSuffix: '',
        statDecimals: 0,
        statLabel: 'bookinger denne måneden',
        gradient: 'from-zinc-500/10 to-zinc-500/0',
      },
      {
        num: '03',
        title: 'Følger opp leads automatisk',
        desc: 'Hver samtale scores for salgspotensial. Varme leads får oppfølging på SMS innen 5 minutter. Du får varsling — og kan ta over når det passer.',
        icon: TrendingUp,
        stat: 68,
        statSuffix: '%',
        statDecimals: 0,
        statLabel: 'av leads konverterer',
        gradient: 'from-zinc-500/10 to-zinc-500/0',
      },
    ],
  },
  en: {
    badge: 'HOW IT WORKS',
    title: 'Three things happen',
    titleBold: 'when the phone rings.',
    description: 'Arxon handles the entire call — from the first ring to a booked, confirmed and reminded appointment.',
    features: [
      {
        num: '01',
        title: 'AI answers in 1.4 seconds',
        desc: 'No hold music, no "press 1 for...". The AI recognizes regulars, knows their last booking, and adapts to your industry.',
        icon: Phone,
        stat: 1.4,
        statSuffix: 's',
        statDecimals: 1,
        statLabel: 'average response time',
        gradient: 'from-zinc-500/10 to-zinc-500/0',
      },
      {
        num: '02',
        title: 'Finds a slot and books it',
        desc: 'Connected to your calendar. The AI checks availability in real-time, confirms with the customer, and sends an SMS confirmation.',
        icon: Calendar,
        stat: 291,
        statSuffix: '',
        statDecimals: 0,
        statLabel: 'bookings this month',
        gradient: 'from-zinc-500/10 to-zinc-500/0',
      },
      {
        num: '03',
        title: 'Follows up leads automatically',
        desc: 'Every call is scored for sales potential. Warm leads get SMS follow-up within 5 minutes. You get notified — and can take over when it suits.',
        icon: TrendingUp,
        stat: 68,
        statSuffix: '%',
        statDecimals: 0,
        statLabel: 'of leads convert',
        gradient: 'from-zinc-500/10 to-zinc-500/0',
      },
    ],
  },
}

export default function FeaturesShowcase({ lang = 'no' }: { lang?: 'no' | 'en' }) {
  const c = content[lang]
  const [activeIdx, setActiveIdx] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
      <div className="max-w-3xl mb-16 md:mb-20">
        <div className="inline-block px-3 py-1 border border-zinc-200 rounded-full text-[10px] font-semibold tracking-widest text-zinc-500 uppercase mb-6">
          {c.badge}
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-400 leading-[1.1]">
          {c.title}<br />
          <span className="text-zinc-900">{c.titleBold}</span>
        </h2>
        <p className="mt-5 text-base md:text-lg text-zinc-400 leading-relaxed max-w-xl">
          {c.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {c.features.map((f, i) => (
          <div key={i} onMouseEnter={() => setActiveIdx(i)}
            className={`group relative rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden ${
              activeIdx === i
                ? 'border-zinc-300 bg-gradient-to-br ' + f.gradient + ' shadow-lg scale-[1.02]'
                : 'border-zinc-200/60 bg-white hover:border-zinc-300'
            }`}>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-semibold tracking-widest text-zinc-400 font-mono">[{f.num}]</span>
                <f.icon className={`w-5 h-5 transition-colors duration-300 ${activeIdx === i ? 'text-zinc-900' : 'text-zinc-300'}`} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-zinc-900 mb-2 leading-snug">{f.title}</h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed mb-8">{f.desc}</p>
              <div className="pt-6 border-t border-zinc-200/60">
                <div className="text-2xl md:text-3xl font-bold text-zinc-900 tabular-nums">
                  <NumberTicker value={f.stat} suffix={f.statSuffix} decimalPlaces={f.statDecimals} delay={0.3 + i * 0.2} locale="nb-NO" className="text-2xl md:text-3xl font-bold text-zinc-900" />
                </div>
                <div className="text-[11px] text-zinc-400 font-medium mt-1">{f.statLabel}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
