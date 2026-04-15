'use client'

import { Phone, Calendar, MessageSquare, TrendingUp } from 'lucide-react'
import { Marquee } from '@/components/ui/marquee'

const activities = {
  no: [
    { icon: Phone, label: 'Anrop besvart', detail: '+47 412 XX XXX · Booking gjennomført', color: 'text-zinc-700', bg: 'bg-zinc-100' },
    { icon: Calendar, label: 'Time booket', detail: 'Herreklipp i morgen kl. 09:00', color: 'text-zinc-700', bg: 'bg-zinc-100' },
    { icon: MessageSquare, label: 'SMS sendt', detail: 'Påminnelse til 3 kunder for i morgen', color: 'text-zinc-500', bg: 'bg-zinc-100' },
    { icon: TrendingUp, label: 'Lead identifisert', detail: 'Ny kunde interessert i fargebehandling', color: 'text-zinc-700', bg: 'bg-zinc-100' },
    { icon: Phone, label: 'Anrop besvart', detail: '+47 923 XX XXX · Prisforespørsel håndtert', color: 'text-zinc-700', bg: 'bg-zinc-100' },
    { icon: Calendar, label: 'Avbestilling håndtert', detail: 'Automatisk tilbudt ny tid til kunden', color: 'text-zinc-700', bg: 'bg-zinc-100' },
  ],
  en: [
    { icon: Phone, label: 'Call answered', detail: '+47 412 XX XXX · Booking completed', color: 'text-zinc-700', bg: 'bg-zinc-100' },
    { icon: Calendar, label: 'Appointment booked', detail: 'Haircut tomorrow at 09:00', color: 'text-zinc-700', bg: 'bg-zinc-100' },
    { icon: MessageSquare, label: 'SMS sent', detail: 'Reminder to 3 customers for tomorrow', color: 'text-zinc-500', bg: 'bg-zinc-100' },
    { icon: TrendingUp, label: 'Lead identified', detail: 'New customer interested in color treatment', color: 'text-zinc-700', bg: 'bg-zinc-100' },
    { icon: Phone, label: 'Call answered', detail: '+47 923 XX XXX · Price inquiry handled', color: 'text-zinc-700', bg: 'bg-zinc-100' },
    { icon: Calendar, label: 'Cancellation handled', detail: 'Automatically offered new time', color: 'text-zinc-700', bg: 'bg-zinc-100' },
  ],
}

function ActivityCard({ icon: Icon, label, detail, color, bg }: {
  icon: React.ElementType; label: string; detail: string; color: string; bg: string
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-zinc-100 bg-white/80 backdrop-blur-sm shrink-0 min-w-[320px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow duration-300">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div>
        <div className="text-[12px] font-semibold text-zinc-900">{label}</div>
        <div className="text-[11px] text-zinc-400">{detail}</div>
      </div>
      <div className="ml-auto">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-600 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-800" />
        </span>
      </div>
    </div>
  )
}

export default function LiveActivityTicker({ lang = 'no' }: { lang?: 'no' | 'en' }) {
  const items = activities[lang]

  return (
    <section className="py-12 border-y border-zinc-100 overflow-hidden bg-gradient-to-b from-zinc-50/50 to-white">
      <div className="mb-6 px-6 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-zinc-200 rounded-full">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-600 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-800" />
          </span>
          <span className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
            {lang === 'no' ? 'Live AI-aktivitet' : 'Live AI Activity'}
          </span>
        </div>
      </div>
      <Marquee
        pauseOnHover
        className="[--marquee-duration:30s] [--marquee-gap:1rem]"
      >
        {items.map((item, i) => (
          <ActivityCard key={i} {...item} />
        ))}
      </Marquee>
    </section>
  )
}