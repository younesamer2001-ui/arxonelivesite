'use client'

import { useRef, useState } from 'react'
import { TrendingUp, TrendingDown, Phone, Clock, Wallet } from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import DashboardMetricCard from '@/components/ui/dashboard-metric-card'
import { DonutChart, type DonutChartSegment } from '@/components/ui/donut-chart'
import ScrollPang from './ScrollPang'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from '@/components/ui/interfaces-carousel'

interface AnalyticsProps {
  lang?: 'no' | 'en'
}

const content = {
  no: {
    label: 'Analyse og innsikt',
    heading: 'Se verdien i',
    headingAccent: 'hvert anrop.',    subtext: 'Hver samtale inneholder informasjon du kan tjene på. Arxon samler, sorterer og viser deg nøyaktig hva kundene spør om — så du kan ta smartere beslutninger, raskere.',
    callAnalytics: 'Samtaleanalyse',
    callsThisMonth: 'samtaler denne måneden',
    monthlyGrowth: '+23% fra forrige måned',
    topReasons: 'Toppgrunner til anrop',
    appointmentBooking: 'Booking av time',
    priceInformation: 'Prisinformasjon',
    customerService: 'Kundeservice',
    other: 'Annet',
    conversionRate: 'Konverteringsrate',
    callsToBookings: 'anrop → booking',
    avgCallDuration: 'Gjennomsnittlig samtaletid',
    minutes: 'minutter',
    durationTrend: '-12% fra forrige måned',
    estimatedValue: 'Estimert verdi',
    savedThisMonth: 'spart denne måneden',
    valueTrend: '↑ 31%',
  },
  en: {
    label: 'Analytics & insights',
    heading: 'See the value in',
    headingAccent: 'every call.',
    subtext: 'Every conversation holds information you can profit from. Arxon collects, organizes and shows you exactly what customers are asking — so you can make smarter decisions, faster.',
    callAnalytics: 'Call Analytics',
    callsThisMonth: 'calls this month',
    monthlyGrowth: '+23% from last month',
    topReasons: 'Top call reasons',
    appointmentBooking: 'Appointment booking',    priceInformation: 'Price information',
    customerService: 'Customer service',
    other: 'Other',
    conversionRate: 'Conversion rate',
    callsToBookings: 'calls → bookings',
    avgCallDuration: 'Avg call duration',
    minutes: 'minutes',
    durationTrend: '-12% from last month',
    estimatedValue: 'Estimated value',
    savedThisMonth: 'saved this month',
    valueTrend: '↑ 31%',
  },
}

const barHeights = [65, 78, 42, 54, 82, 46, 71, 88, 60, 75, 92, 68, 85, 50, 78, 95, 72, 88, 55, 80, 70, 90, 62, 84]

function CallAnalyticsCard({ c }: { c: typeof content['no'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <div ref={ref} className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 md:p-8 hover:shadow-lg transition-shadow h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-6">{c.callAnalytics}</h3>
      <div className="flex-1 flex flex-col justify-end mb-6">
        <div className="flex items-end gap-[3px] h-44">
          {barHeights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={isInView ? { height: `${h}%` } : {}}              transition={{ duration: 0.6, delay: 0.3 + i * 0.03, ease: [0.22, 1, 0.36, 1] }}
              className={`flex-1 rounded-sm ${i % 2 === 0 ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-gradient-to-t from-emerald-600 to-emerald-400'} hover:opacity-80 transition-opacity cursor-pointer`}
              style={{ minHeight: '4px' }}
            />
          ))}
        </div>
      </div>
      <div className="border-t border-zinc-800 pt-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-4xl font-bold text-white">847</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-900/30 text-emerald-400 text-xs font-medium rounded-full">
            <TrendingUp className="w-3 h-3" />
            {c.monthlyGrowth}
          </span>
        </div>
        <p className="text-sm text-zinc-400">{c.callsThisMonth}</p>
      </div>
    </div>
  )
}

function TopReasonsDonut({ lang, c }: { lang: 'no' | 'en'; c: typeof content['no'] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const donutData: DonutChartSegment[] = [
    { value: 45, color: '#3b82f6', label: c.appointmentBooking },
    { value: 25, color: '#a855f7', label: c.priceInformation },
    { value: 20, color: '#06b6d4', label: c.customerService },
    { value: 10, color: '#a1a1aa', label: c.other },
  ]
  const active = donutData.find((s) => s.label === hovered)
  const displayValue = active ? `${active.value}%` : '100%'
  const displayLabel = active?.label ?? c.topReasons
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 md:p-8 hover:shadow-lg transition-shadow h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-6">{c.topReasons}</h3>
      <div className="flex-1 flex items-center justify-center mb-6">
        <DonutChart data={donutData} size={200} strokeWidth={28} animationDuration={1.2} animationDelayPerSegment={0.06} highlightOnHover onSegmentHover={(seg) => setHovered(seg?.label ?? null)}
          centerContent={
            <AnimatePresence mode="wait">
              <motion.div key={displayLabel} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }} className="flex flex-col items-center text-center">
                <span className="text-3xl font-bold text-white">{displayValue}</span>
                <span className="text-xs text-zinc-400 max-w-[120px] truncate">{displayLabel}</span>
              </motion.div>
            </AnimatePresence>
          }
        />
      </div>
      <div className="space-y-2 border-t border-zinc-700 pt-4">
        {donutData.map((segment, i) => (
          <motion.div key={segment.label} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${hovered === segment.label ? 'bg-zinc-800' : ''}`}
            onMouseEnter={() => setHovered(segment.label)} onMouseLeave={() => setHovered(null)}>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
              <span className="text-sm font-medium text-zinc-300">{segment.label}</span>
            </div>
            <span className="text-sm font-semibold text-white">{segment.value}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
export default function Analytics({ lang = 'no' }: AnalyticsProps) {
  const c = content[lang]
  return (
    <section className="relative py-14 md:py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollPang className="mb-12 md:mb-20">
          <span className="inline-block text-sm font-medium text-zinc-400 mb-4">{c.label}</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {c.heading}{' '}
            <span className="gradient-text-accent">{c.headingAccent}</span>
          </h2>
          <p className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed">{c.subtext}</p>
        </ScrollPang>

        {/* Row 1 — Mobile: Carousel / Desktop: Grid */}
        <div className="md:hidden mb-6">
          <Carousel opts={{ align: 'start', loop: false }}>
            <CarouselContent className="-ml-3">
              <CarouselItem className="pl-3 basis-[88%]">
                <CallAnalyticsCard c={c} />
              </CarouselItem>
              <CarouselItem className="pl-3 basis-[88%]">
                <TopReasonsDonut lang={lang} c={c} />
              </CarouselItem>
            </CarouselContent>
            <CarouselDots />
          </Carousel>
        </div>        <div className="hidden md:grid md:grid-cols-2 md:gap-8 mb-8">
          <CallAnalyticsCard c={c} />
          <TopReasonsDonut lang={lang} c={c} />
        </div>

        {/* Row 2 — Mobile: Carousel / Desktop: Grid */}
        <div className="md:hidden">
          <Carousel opts={{ align: 'start', loop: false }}>
            <CarouselContent className="-ml-3">
              <CarouselItem className="pl-3 basis-[80%]">
                <DashboardMetricCard title={c.conversionRate} value="68%" icon={Phone} trendChange={c.callsToBookings} trendType="up">
                  <div className="flex items-center gap-5 py-2">
                    <div className="relative w-24 h-24 shrink-0">
                      <svg width="96" height="96" className="transform -rotate-90">
                        <circle cx="48" cy="48" r="40" fill="none" stroke="#27272a" strokeWidth="7" />
                        <defs><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
                        <circle cx="48" cy="48" r="40" fill="none" stroke="url(#cg)" strokeWidth="7" strokeDasharray={`${(68/100)*2*Math.PI*40} ${2*Math.PI*40}`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold text-white">68%</span></div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">847</p>
                      <p className="text-xs text-zinc-400 mt-1">{c.callsToBookings}</p>
                    </div>
                  </div>
                </DashboardMetricCard>
              </CarouselItem>              <CarouselItem className="pl-3 basis-[80%]">
                <DashboardMetricCard title={c.avgCallDuration} value="1:42" icon={Clock} trendChange={c.durationTrend} trendType="down">
                  <div className="py-2">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-1">1:42</div>
                    <p className="text-xs text-zinc-400">{c.minutes}</p>
                  </div>
                </DashboardMetricCard>
              </CarouselItem>
              <CarouselItem className="pl-3 basis-[80%]">
                <DashboardMetricCard title={c.estimatedValue} value="187 400 kr" icon={Wallet} trendChange={c.valueTrend} trendType="up">
                  <div className="py-2">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">187 400 kr</div>
                    <p className="text-xs text-zinc-400">{c.savedThisMonth}</p>
                  </div>
                </DashboardMetricCard>
              </CarouselItem>
            </CarouselContent>
            <CarouselDots />
          </Carousel>
        </div>
        {/* Row 2 Desktop */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-8">
          <DashboardMetricCard title={c.conversionRate} value="68%" icon={Phone} trendChange={c.callsToBookings} trendType="up">
            <div className="flex items-center gap-5 py-2">
              <div className="relative w-24 h-24 shrink-0">
                <svg width="96" height="96" className="transform -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#27272a" strokeWidth="7" />
                  <defs><linearGradient id="cg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs>
                  <circle cx="48" cy="48" r="40" fill="none" stroke="url(#cg2)" strokeWidth="7" strokeDasharray={`${(68/100)*2*Math.PI*40} ${2*Math.PI*40}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold text-white">68%</span></div>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">847</p>
                <p className="text-xs text-zinc-400 mt-1">{c.callsToBookings}</p>
              </div>
            </div>
          </DashboardMetricCard>
          <DashboardMetricCard title={c.avgCallDuration} value="1:42" icon={Clock} trendChange={c.durationTrend} trendType="down">
            <div className="py-2">
              <div className="text-4xl md:text-5xl font-bold text-white mb-1">1:42</div>
              <p className="text-xs text-zinc-400">{c.minutes}</p>
            </div>
          </DashboardMetricCard>
          <DashboardMetricCard title={c.estimatedValue} value="187 400 kr" icon={Wallet} trendChange={c.valueTrend} trendType="up">
            <div className="py-2">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">187 400 kr</div>
              <p className="text-xs text-zinc-400">{c.savedThisMonth}</p>
            </div>
          </DashboardMetricCard>
        </div>
      </div>
    </section>
  )
}