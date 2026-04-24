'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, X } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

const content = {
  no: {
    badge: 'HVORFOR BYTTE',
    title: 'Du taper penger',
    titleBold: 'på tapte anrop.',
    description: 'En gjennomsnittlig frisørsalong mister 15–30 anrop i uken. Med en booking-verdi på 400–800 kr er det opptil 100 000 kr/mnd i tapt omsetning.',
    rows: [
      { label: 'Svarer 24/7, inkl. helger', arxon: true, trad: false, voice: true },
      { label: 'Booker timer direkte i kalenderen', arxon: true, trad: false, voice: false },
      { label: 'Gjenkjenner faste kunder', arxon: true, trad: true, voice: false },
      { label: 'Sender SMS-bekreftelse automatisk', arxon: true, trad: false, voice: false },
      { label: 'Følger opp leads automatisk', arxon: true, trad: false, voice: false },
      { label: 'Skalerbar til 50+ lokasjoner', arxon: true, trad: false, voice: false },
    ],
    cols: ['Arxon AI', 'Resepsjonist', 'Telefonsvarer'],
    cost: ['Kontakt for pris', '~28 000 kr/mnd', 'Gratis — men taper kunder'],
    costLabel: 'Kostnad',
  },  en: {
    badge: 'WHY SWITCH',
    title: "You're losing money",
    titleBold: 'on missed calls.',
    description: 'An average hair salon misses 15–30 calls per week. At 400–800 kr per booking, that\'s up to 100,000 kr/month in lost revenue.',
    rows: [
      { label: 'Answers 24/7, incl. weekends', arxon: true, trad: false, voice: true },
      { label: 'Books directly in your calendar', arxon: true, trad: false, voice: false },
      { label: 'Recognizes returning customers', arxon: true, trad: true, voice: false },
      { label: 'Sends SMS confirmation automatically', arxon: true, trad: false, voice: false },
      { label: 'Follows up leads automatically', arxon: true, trad: false, voice: false },
      { label: 'Scales to 50+ locations', arxon: true, trad: false, voice: false },
    ],
    cols: ['Arxon AI', 'Receptionist', 'Voicemail'],
    cost: ['Contact for pricing', '~28,000 kr/mo', 'Free — but loses customers'],
    costLabel: 'Cost',
  },
}

const calcContent = {
  no: {
    sliderLabel: 'Hvor mange anrop mister du i uken?',
    perCall: 'Snitt bookingverdi',
    monthly: 'Tapt omsetning per måned',
    yearly: 'Tapt omsetning per år',
    cta: 'Arxon redder disse kundene →',
    calls: 'anrop/uke',
  },
  en: {
    sliderLabel: 'How many calls do you miss per week?',
    perCall: 'Avg. booking value',
    monthly: 'Lost revenue per month',
    yearly: 'Lost revenue per year',
    cta: 'Arxon saves these customers →',
    calls: 'calls/week',
  },
}
/* ── Animated counter ── */
function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1200
    const step = Math.max(1, Math.floor(value / 60))
    const interval = setInterval(() => {
      start += step
      if (start >= value) { setDisplay(value); clearInterval(interval) }
      else setDisplay(start)
    }, duration / 60)
    return () => clearInterval(interval)
  }, [inView, value])

  return <span ref={ref}>{prefix}{display.toLocaleString('nb-NO')}{suffix}</span>
}

/* ── Cell icon with stagger ── */
function CellIcon({ val, delay }: { val: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
    >
      {val
        ? <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} /></div>
        : <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center"><X className="w-3.5 h-3.5 text-zinc-300" strokeWidth={3} /></div>
      }
    </motion.div>
  )
}
/* ── Savings Calculator ── */
function SavingsCalculator({ lang }: { lang: 'no' | 'en' }) {
  const t = calcContent[lang]
  const [calls, setCalls] = useState(20)
  const avgValue = 600
  const monthly = calls * avgValue * 4
  const yearly = monthly * 12

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-16 rounded-2xl border border-zinc-200 bg-white p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="max-w-2xl mx-auto">
        <label className="block text-sm font-semibold text-zinc-700 mb-4">{t.sliderLabel}</label>

        <div className="relative mb-2">
          <input
            type="range"
            min={1}
            max={60}
            value={calls}
            onChange={(e) => setCalls(Number(e.target.value))}
            className="w-full h-2 bg-zinc-100 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-900
              [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:cursor-grab
              [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110"
          />
        </div>
        <div className="text-right text-xs text-zinc-400 mb-8">
          <span className="text-2xl font-bold text-zinc-900">{calls}</span>{' '}{t.calls}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-zinc-50 p-5 text-center">
            <p className="text-xs text-zinc-400 mb-1">{t.perCall}</p>
            <p className="text-xl font-bold text-zinc-900">{avgValue} kr</p>
          </div>
          <div className="rounded-xl bg-red-50 p-5 text-center">
            <p className="text-xs text-red-400 mb-1">{t.monthly}</p>
            <p className="text-xl font-bold text-red-600">{monthly.toLocaleString('nb-NO')} kr</p>
          </div>
          <div className="rounded-xl bg-red-50 p-5 text-center">
            <p className="text-xs text-red-400 mb-1">{t.yearly}</p>
            <p className="text-2xl font-extrabold text-red-600">{yearly.toLocaleString('nb-NO')} kr</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="#priser" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-full hover:bg-zinc-800 transition-colors">
            {t.cta}
          </a>
        </div>
      </div>
    </motion.div>
  )
}
export default function ComparisonSection({ lang = 'no' }: { lang?: 'no' | 'en' }) {
  const c = content[lang]

  return (
    <section className="py-24 md:py-32 px-6 bg-[#fafafa]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 border border-zinc-200 rounded-full text-[10px] font-semibold tracking-widest text-zinc-500 uppercase mb-6">
            {c.badge}
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
            <span className="text-zinc-400">{c.title}</span><br />
            <span className="text-zinc-900">{c.titleBold}</span>
          </h2>
          <p className="mt-4 text-base text-zinc-400 max-w-2xl mx-auto">{c.description}</p>
        </motion.div>
        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_130px_130px_130px] md:grid-cols-[1fr_160px_160px_160px] border-b border-zinc-100">
            <div className="p-4 md:p-5" />
            {c.cols.map((col, i) => (
              <div key={i} className={`p-4 md:p-5 text-center ${i === 0 ? 'bg-zinc-900 relative' : ''}`}>
                {i === 0 && <div className="absolute inset-0 bg-zinc-900 shadow-[0_0_40px_rgba(0,0,0,0.15)]" />}
                <span className={`relative z-10 text-xs md:text-sm font-bold ${i === 0 ? 'text-white' : 'text-zinc-400'}`}>{col}</span>
              </div>
            ))}
          </div>

          {/* Feature rows */}
          {c.rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="grid grid-cols-[1fr_130px_130px_130px] md:grid-cols-[1fr_160px_160px_160px] border-b border-zinc-50 last:border-b-0 hover:bg-zinc-50/50 transition-colors"
            >
              <div className="p-4 md:p-5 text-[13px] md:text-sm text-zinc-700 font-medium">{row.label}</div>
              <div className="p-4 md:p-5 flex items-center justify-center bg-zinc-900/[0.02]"><CellIcon val={row.arxon} delay={i * 0.08 + 0.2} /></div>
              <div className="p-4 md:p-5 flex items-center justify-center"><CellIcon val={row.trad} delay={i * 0.08 + 0.3} /></div>
              <div className="p-4 md:p-5 flex items-center justify-center"><CellIcon val={row.voice} delay={i * 0.08 + 0.4} /></div>
            </motion.div>
          ))}
          {/* Cost row */}
          <div className="grid grid-cols-[1fr_130px_130px_130px] md:grid-cols-[1fr_160px_160px_160px] border-t border-zinc-200 bg-zinc-50/50">
            <div className="p-4 md:p-5 text-[13px] md:text-sm text-zinc-900 font-bold">{c.costLabel}</div>
            {c.cost.map((cost, i) => (
              <div key={i} className={`p-4 md:p-5 text-center ${i === 0 ? 'bg-zinc-900/[0.02]' : ''}`}>
                <span className={`text-[11px] md:text-xs font-bold ${i === 0 ? 'text-zinc-900' : 'text-zinc-400'}`}>{cost}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Savings Calculator */}
        <SavingsCalculator lang={lang} />
      </div>
    </section>
  )
}
