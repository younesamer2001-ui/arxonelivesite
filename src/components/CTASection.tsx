'use client'

import { ArrowRight, Phone, Clock, Shield } from 'lucide-react'

const content = {
  no: {
    title: 'Hva skjer med anropene',
    titleBold: 'du ikke svarer på?',
    desc: 'De ringer konkurrenten. Gjennomsnittlig norsk bedrift taper 12–18 anrop i uken — det er kunder som aldri kommer tilbake.',
    cta: 'Prøv Arxon gratis i 14 dager',
    secondary: 'Se priser →',
    trust: [
      { icon: Clock, text: 'Oppsett på under 24 timer' },
      { icon: Shield, text: 'Ingen bindingstid' },
      { icon: Phone, text: 'Norsk AI-stemme' },
    ],
    social: '32 bedrifter bruker Arxon akkurat nå',
    mail: 'Vil du heller snakke med oss?',
    mailCta: 'Book et 15-min møte',
    mailLink: 'kontakt@arxon.no',
  },
  en: {
    title: 'What happens to the calls',
    titleBold: "you don't answer?",
    desc: "They call your competitor. The average Norwegian business misses 12–18 calls per week — that's customers who never come back.",
    cta: 'Try Arxon free for 14 days',
    secondary: 'See pricing →',
    trust: [
      { icon: Clock, text: 'Setup in under 24 hours' },
      { icon: Shield, text: 'No commitment' },
      { icon: Phone, text: 'Norwegian AI voice' },
    ],
    social: '32 businesses use Arxon right now',
    mail: 'Rather talk to a human?',
    mailCta: 'Book a 15-min call',
    mailLink: 'contact@arxon.no',
  },
}

export default function CTASection({ lang = 'no' }: { lang?: 'no' | 'en' }) {
  const c = content[lang]
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl bg-zinc-950 p-10 md:p-16 relative overflow-hidden">
          {/* Subtle gradient orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-800/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-white">
              {c.title}<br />
              <span className="text-zinc-400">{c.titleBold}</span>
            </h2>
            <p className="mt-4 text-base text-zinc-400 max-w-lg leading-relaxed">
              {c.desc}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <a href="#kontakt" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-zinc-900 rounded-full text-sm font-bold hover:bg-zinc-100 transition-colors shadow-lg">
                {c.cta} <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#priser" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                {c.secondary}
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-white/10">
              {c.trust.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <t.icon className="w-4 h-4 text-zinc-500" />
                  <span className="text-[13px] text-zinc-400">{t.text}</span>
                </div>
              ))}
            </div>

            {/* Social proof line */}
            <div className="flex items-center gap-3 mt-6">
              <div className="flex -space-x-2">
                {['https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=32&h=32&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-zinc-950 object-cover" />
                ))}
              </div>
              <span className="text-[12px] text-zinc-500">{c.social}</span>
            </div>
          </div>
        </div>

        {/* Below-card contact option */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <span className="text-[13px] text-zinc-400">{c.mail}</span>
          <a href={`mailto:${c.mailLink}`} className="text-[13px] font-semibold text-zinc-900 hover:text-zinc-700 transition-colors flex items-center gap-1">
            {c.mailCta} <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  )
}
