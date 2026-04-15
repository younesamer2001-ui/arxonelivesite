'use client'

import { useEffect, useRef } from 'react'
import { ArrowRight, Phone } from 'lucide-react'
import AnimatedDashboard from './AnimatedDashboard'

interface HeroProps {
  lang?: 'no' | 'en'
}

const content = {
  no: {
    badge: 'AI-resepsjonist for norske bedrifter',
    headline: 'Aldri miss',
    headlineAccent: 'et anrop igjen.',
    sub: 'Hver gang telefonen ringer og ingen svarer, mister du en kunde. Arxon sin AI svarer hvert eneste anrop — booker timer, følger opp leads og gir deg full oversikt.',
    cta: 'Book en gratis demo',
    ctaSecondary: 'Ring og test selv',
    stat1: '24/7',
    stat1Label: 'Tilgjengelig',
    stat2: '<3s',
    stat2Label: 'Svartid',
    stat3: '100%',
    stat3Label: 'Anrop besvart',
    dashboardAlt: 'Arxon AI Dashboard',
    dashboardFallback: 'Arxon Command Center',
  },
  en: {
    badge: 'AI receptionist for Norwegian businesses',
    headline: 'Never miss',
    headlineAccent: 'a call again.',
    sub: "Every time the phone rings and nobody answers, you lose a customer. Arxon's AI answers every single call — books appointments, follows up leads and gives you full visibility.",
    cta: 'Book a free demo',
    ctaSecondary: 'Call and test it',
    stat1: '24/7',
    stat1Label: 'Available',
    stat2: '<3s',
    stat2Label: 'Response',
    stat3: '100%',
    stat3Label: 'Calls answered',
    dashboardAlt: 'Arxon AI Dashboard',
    dashboardFallback: 'Arxon Command Center',
  },
}

export default function Hero({ lang = 'no' }: HeroProps) {
  const c = content[lang]
  const orbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!orbRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* Gradient orbs */}
      <div ref={orbRef} className="transition-transform duration-700 ease-out pointer-events-none">
        <div className="gradient-orb gradient-orb-dark w-[600px] h-[600px] -top-48 -right-48 animate-pulse-soft absolute" />
        <div className="gradient-orb gradient-orb-purple w-[400px] h-[400px] bottom-0 -left-32 animate-pulse-soft absolute" style={{ animationDelay: '2s' }} />
        <div className="gradient-orb gradient-orb-cyan w-[300px] h-[300px] top-1/3 left-1/2 -translate-x-1/2 animate-pulse-soft absolute" style={{ animationDelay: '4s', opacity: 0.15 }} />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 pt-32 pb-8 text-center">
        {/* Badge */}
        <div className="animate-fade-up inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-100/80 border border-zinc-200 text-zinc-700 text-sm font-medium mb-10 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-600 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-800" />
          </span>
          {c.badge}
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8"
          style={{ animationDelay: '0.1s' }}
        >
          {c.headline}
          <br />
          <span className="gradient-text-dark">{c.headlineAccent}</span>
        </h1>

        {/* Subtext */}
        <p
          className="animate-fade-up max-w-2xl mx-auto text-lg md:text-xl text-zinc-500 leading-relaxed mb-12"
          style={{ animationDelay: '0.2s' }}
        >
          {c.sub}
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          style={{ animationDelay: '0.3s' }}
        >
          <a
            href="#kontakt"
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-zinc-900 text-white rounded-full text-base font-medium hover:bg-zinc-800 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            {c.cta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#prov-ai"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-medium border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-700 hover:bg-zinc-50 transition-all duration-300"
          >
            <Phone className="w-4 h-4" />
            {c.ctaSecondary}
          </a>
        </div>

        {/* Stats row */}
        <div
          className="animate-fade-up flex items-center justify-center gap-10 sm:gap-16"
          style={{ animationDelay: '0.4s' }}
        >
          {[
            { value: c.stat1, label: c.stat1Label },
            { value: c.stat2, label: c.stat2Label },
            { value: c.stat3, label: c.stat3Label },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-zinc-900 tabular-nums">{stat.value}</div>
              <div className="text-sm text-zinc-400 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Animated Dashboard */}
      <div
        className="animate-fade-up relative z-20 w-full max-w-5xl mx-auto px-6 mt-8 mb-12"
        style={{ animationDelay: '0.55s' }}
      >
        <div className="relative rounded-2xl border border-zinc-200/80 bg-white/80 backdrop-blur-sm p-2 shadow-2xl shadow-zinc-200/50 glow-dark">
          <AnimatedDashboard />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
    </section>
  )
}
