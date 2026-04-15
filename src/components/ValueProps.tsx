'use client'

import ScrollReveal from './ScrollReveal'
import { Phone, CalendarCheck, BarChart3, ArrowUpRight } from 'lucide-react'

interface ValuePropsProps {
  lang?: 'no' | 'en'
}

const content = {
  no: {
    label: 'Tjenester',
    heading: 'Alt du trenger for å aldri',
    headingAccent: 'tape en kunde igjen.',
    cards: [
      {
        icon: Phone,
        title: 'AI-resepsjonist',
        description: 'Svarer hvert eneste anrop på sekunder. Profesjonelt, vennlig og på norsk — som din beste ansatt, bare 24/7.',
        stat: '24/7',
        statLabel: 'tilgjengelighet',
        gradient: 'from-zinc-800 to-zinc-900',
        bgLight: 'bg-zinc-100',
        textColor: 'text-zinc-700',
        imagePlaceholder: 'AI svarer telefonen',
      },
      {
        icon: CalendarCheck,
        title: 'Automatisk booking',
        description: 'AI-en booker timer direkte i kalenderen din. Kunden får bekreftelse umiddelbart — ingen venting, ingen misforståelser.',
        stat: '< 30s',
        statLabel: 'bookingtid',
        gradient: 'from-zinc-600 to-zinc-700',
        bgLight: 'bg-zinc-100',
        textColor: 'text-zinc-700',
        imagePlaceholder: 'Kalender med booking',
      },
      {
        icon: BarChart3,
        title: 'Innsikt og oppfølging',
        description: 'Se hvem som ringer, hva de spør om, og hva du tjener. AI-en følger opp leads automatisk så ingen faller mellom stolene.',
        stat: '100%',
        statLabel: 'oppfølgingsrate',
        gradient: 'from-zinc-500 to-cyan-600',
        bgLight: 'bg-cyan-50',
        textColor: 'text-cyan-600',
        imagePlaceholder: 'Dashboard med analyser',
      },
    ],
  },
  en: {
    label: 'Services',
    heading: 'Everything you need to never',
    headingAccent: 'lose a customer again.',
    cards: [
      {
        icon: Phone,
        title: 'AI Receptionist',
        description: 'Answers every call within seconds. Professional, friendly and in Norwegian — like your best employee, only 24/7.',
        stat: '24/7',
        statLabel: 'availability',
        gradient: 'from-zinc-800 to-zinc-900',
        bgLight: 'bg-zinc-100',
        textColor: 'text-zinc-700',
        imagePlaceholder: 'AI answering calls',
      },
      {
        icon: CalendarCheck,
        title: 'Automatic Booking',
        description: 'The AI books appointments directly in your calendar. The customer gets instant confirmation — no waiting, no misunderstandings.',
        stat: '< 30s',
        statLabel: 'booking time',
        gradient: 'from-zinc-600 to-zinc-700',
        bgLight: 'bg-zinc-100',
        textColor: 'text-zinc-700',
        imagePlaceholder: 'Calendar with bookings',
      },
      {
        icon: BarChart3,
        title: 'Insights & Follow-up',
        description: 'See who calls, what they ask, and what you earn. The AI follows up leads automatically so nothing falls through the cracks.',
        stat: '100%',
        statLabel: 'follow-up rate',
        gradient: 'from-zinc-500 to-cyan-600',
        bgLight: 'bg-cyan-50',
        textColor: 'text-cyan-600',
        imagePlaceholder: 'Analytics dashboard',
      },
    ],
  },
}

export default function ValueProps({ lang = 'no' }: ValuePropsProps) {
  const t = content[lang]

  return (
    <section id="tjenester" className="relative py-24 md:py-36 bg-zinc-50/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-zinc-900" />
              {t.label}
              <span className="w-6 h-px bg-zinc-900" />
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 max-w-4xl mx-auto">
              {t.heading}{' '}
              <span className="gradient-text-accent">{t.headingAccent}</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Bento-style cards */}
        <div className="grid gap-6">
          {t.cards.map((card, i) => (
            <ScrollReveal key={i} y={40} delay={i * 0.1}>
              <div className="group relative rounded-2xl bg-white border border-zinc-200/80 overflow-hidden hover:border-zinc-300 hover:shadow-xl transition-all duration-500">
                <div className="grid md:grid-cols-5 gap-0">
                  {/* Content — takes 3 cols */}
                  <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg shadow-zinc-500/10 group-hover:scale-110 transition-transform duration-500`}>
                          <card.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900">{card.title}</h3>
                      </div>
                      <p className="text-zinc-500 text-lg leading-relaxed max-w-lg">
                        {card.description}
                      </p>
                    </div>

                    <div className="mt-8 flex items-end justify-between">
                      <div>
                        <div className="text-4xl md:text-5xl font-bold text-zinc-900 tabular-nums">{card.stat}</div>
                        <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">{card.statLabel}</div>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-900 group-hover:border-zinc-900 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Image placeholder — takes 2 cols */}
                  <div className="md:col-span-2 bg-zinc-50 border-l border-zinc-100 flex items-center justify-center min-h-[200px] md:min-h-0">
                    {/* PLACEHOLDER — replace with real images later */}
                    <div className="text-center p-8">
                      <div className={`w-20 h-20 mx-auto rounded-2xl ${card.bgLight} flex items-center justify-center mb-4`}>
                        <card.icon className={`w-8 h-8 ${card.textColor}`} />
                      </div>
                      <p className="text-sm text-zinc-400 font-medium">{card.imagePlaceholder}</p>
                      <p className="text-xs text-zinc-300 mt-1">Bilde kommer her</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
