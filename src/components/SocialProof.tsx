'use client'

import ScrollReveal from './ScrollReveal'
import { Star, Quote } from 'lucide-react'

interface SocialProofProps {
  lang?: 'no' | 'en'
}

const content = {
  no: {
    label: 'Resultater',
    heading: 'Bedrifter som',
    headingAccent: 'stoler på Arxon.',
    stats: [
      { value: '20+', label: 'Bedrifter' },
      { value: '95%', label: 'Svarprosent' },
      { value: '< 3s', label: 'Svartid' },
      { value: '24/7', label: 'Tilgjengelighet' },
    ],
    testimonials: [
      {
        quote: 'Vi mistet kunder fordi ingen svarte telefonen. Med Arxon svarer AI-en på 2 sekunder, og kundene tror de snakker med en ekte resepsjonist.',
        name: 'Thomas K.',
        role: 'Daglig leder, bilpleiesenter',
        stars: 5,
        avatar: 'T',
      },
      {
        quote: 'Bookingene gikk opp 40% den første måneden. Kundene våre elsker at de kan ringe når som helst og få booket time umiddelbart.',
        name: 'Maria S.',
        role: 'Eier, frisørsalong',
        stars: 5,
        avatar: 'M',
      },
    ],
    logosLabel: 'Brukes av bedrifter over hele Norge',
  },
  en: {
    label: 'Results',
    heading: 'Businesses that',
    headingAccent: 'trust Arxon.',
    stats: [
      { value: '20+', label: 'Businesses' },
      { value: '95%', label: 'Answer rate' },
      { value: '< 3s', label: 'Response time' },
      { value: '24/7', label: 'Availability' },
    ],
    testimonials: [
      {
        quote: "We were losing customers because nobody answered the phone. With Arxon, the AI answers in 2 seconds, and customers think they're talking to a real receptionist.",
        name: 'Thomas K.',
        role: 'CEO, car care center',
        stars: 5,
        avatar: 'T',
      },
      {
        quote: 'Bookings went up 40% in the first month. Our customers love that they can call anytime and get an appointment booked instantly.',
        name: 'Maria S.',
        role: 'Owner, hair salon',
        stars: 5,
        avatar: 'M',
      },
    ],
    logosLabel: 'Used by businesses across Norway',
  },
}

export default function SocialProof({ lang = 'no' }: SocialProofProps) {
  const t = content[lang]

  return (
    <section className="relative py-24 md:py-36 bg-zinc-50/50 overflow-hidden">
      <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2 w-2/3" />

      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-zinc-900" />
              {t.label}
              <span className="w-6 h-px bg-zinc-900" />
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900">
              {t.heading}{' '}
              <span className="gradient-text-accent">{t.headingAccent}</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Stats — glass cards */}
        <ScrollReveal stagger={0.08}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {t.stats.map((stat, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold text-zinc-900 tabular-nums">{stat.value}</div>
                <div className="mt-2 text-sm text-zinc-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6">
          {t.testimonials.map((item, i) => (
            <ScrollReveal key={i} y={40} delay={i * 0.12}>
              <div className="relative p-8 md:p-10 rounded-2xl bg-white border border-zinc-200/80 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-zinc-300 mb-4" fill="currentColor" />

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: item.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <blockquote className="text-lg text-zinc-700 leading-relaxed mb-8">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  {/* Avatar placeholder — replace with real photos */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-600 flex items-center justify-center text-white font-semibold text-sm">
                    {item.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900">{item.name}</div>
                    <div className="text-sm text-zinc-500">{item.role}</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Logo placeholder strip */}
        <ScrollReveal y={20} delay={0.3}>
          <div className="mt-20 text-center">
            <p className="text-sm text-zinc-400 font-medium mb-8">{t.logosLabel}</p>
            <div className="flex items-center justify-center gap-12 opacity-30">
              {/* PLACEHOLDER — replace with real client logos */}
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="w-24 h-8 bg-zinc-300 rounded" />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
