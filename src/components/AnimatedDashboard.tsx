'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Phone, Calendar, TrendingUp, Clock, ChevronRight,
  Settings, Users, Play, Volume2, ArrowLeft,
  CheckCircle2, PhoneIncoming, Star,
  Brain, Zap, Target, MessageSquare
} from 'lucide-react'
import { NumberTicker } from '@/components/ui/number-ticker'

/* ─── Build-up animation helpers — punchy spring ─── */
const buildUp = (delay: number) => ({
  initial: { opacity: 0, y: 50, scale: 0.85 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.6, delay, type: 'spring' as const, damping: 10, stiffness: 120 },
})
const slideLeft = (delay: number) => ({
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, delay, type: 'spring' as const, damping: 10, stiffness: 120 },
})

/* ─── Avatars ─── */
const avatars: Record<string, string> = {
  'Erik Hansen': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  'Ingrid Larsen': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  'Kristoffer Berg': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
  'Sofia Pedersen': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
  'Magnus Olsen': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  'Camilla Johansen': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
  'Hanna Eriksen': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
  'Anders Nilsen': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face',
}
function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const src = avatars[name]
  const s = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-10 h-10' }[size]
  if (!src) {
    return <div className={`${s} rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 font-bold shrink-0`} style={{ fontSize: size === 'lg' ? '11px' : '8px' }}>{name.split(' ').map(n => n[0]).join('')}</div>
  }
  return <img src={src} alt={name} className={`${s} rounded-full object-cover shrink-0`} />
}

/* ─── Data ─── */
const callLog = [
  { name: 'Erik Hansen', phone: '+47 412 34 567', type: 'Booking', duration: '2:14', status: 'booked' as const, time: 'Nå' },
  { name: 'Ingrid Larsen', phone: '+47 923 45 678', type: 'Prisforespørsel', duration: '1:47', status: 'completed' as const, time: '3 min' },
  { name: 'Kristoffer Berg', phone: '+47 481 23 456', type: 'Kundeservice', duration: '3:22', status: 'transferred' as const, time: '12 min' },
  { name: 'Sofia Pedersen', phone: '+47 976 54 321', type: 'Booking', duration: '1:58', status: 'booked' as const, time: '24 min' },
  { name: 'Magnus Olsen', phone: '+47 456 78 901', type: 'Booking', duration: '2:31', status: 'booked' as const, time: '41 min' },
]

const statusConfig = {
  booked: { label: 'Booket', bg: 'bg-zinc-800', text: 'text-zinc-200', dot: 'bg-white' },
  completed: { label: 'Fullført', bg: 'bg-zinc-800', text: 'text-zinc-300', dot: 'bg-zinc-400' },
  transferred: { label: 'Videresendt', bg: 'bg-zinc-800', text: 'text-zinc-300', dot: 'bg-zinc-400' },
}

const barData = [
  { label: 'Man', h1: 68, h2: 41 }, { label: 'Tir', h1: 89, h2: 56 },
  { label: 'Ons', h1: 54, h2: 33 }, { label: 'Tor', h1: 91, h2: 61 },
  { label: 'Fre', h1: 73, h2: 44 }, { label: 'Lør', h1: 38, h2: 22 },
  { label: 'Søn', h1: 21, h2: 11 },
]
const bookings = [
  { time: '09:00', name: 'Erik Hansen', service: 'Herreklipp', duration: '30 min' },
  { time: '09:30', name: 'Sofia Pedersen', service: 'Farge + klipp', duration: '90 min' },
  { time: '11:00', name: 'Magnus Olsen', service: 'Skjegg trim', duration: '20 min' },
  { time: '11:30', name: 'Camilla Johansen', service: 'Herreklipp', duration: '30 min' },
  { time: '13:00', name: 'Hanna Eriksen', service: 'Farge + føn', duration: '60 min' },
  { time: '14:00', name: 'Anders Nilsen', service: 'Herreklipp', duration: '30 min' },
  { time: '15:00', name: 'Ingrid Larsen', service: 'Klipp + styling', duration: '45 min' },
]

type View = 'dashboard' | 'samtaler' | 'bookinger' | 'call-detail'

export default function AnimatedDashboard() {
  const [visibleCalls, setVisibleCalls] = useState(5)
  const [barsVisible, setBarsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeView, setActiveView] = useState<View>('dashboard')
  const [selectedCall, setSelectedCall] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) setIsVisible(true)
    }, { threshold: 0.1 })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [isVisible])
  const handleNavClick = (view: View) => { setActiveView(view) }
  const handleCallClick = (i: number) => { setSelectedCall(i); setActiveView('call-detail') }

  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>, badge: null },
    { id: 'samtaler' as View, label: 'Samtaler', icon: <Phone className="w-3.5 h-3.5" />, badge: '12' },
    { id: 'bookinger' as View, label: 'Bookinger', icon: <Calendar className="w-3.5 h-3.5" />, badge: '7' },
  ]

  return (
    <div ref={containerRef} className="w-full h-full select-none">
      <div className="overflow-hidden bg-[#0f0f0f] h-full" style={{ fontSize: '11px' }}>
        <div className="grid grid-cols-[180px_1fr] h-full">

          {/* ── Sidebar ── */}
          <motion.div className="bg-[#0a0a0a] text-white p-4 flex flex-col"
            {...(isVisible ? slideLeft(0.1) : { initial: { opacity: 0, x: -30 } })}
          >
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <span className="font-bold text-[13px] tracking-tight">Arxon</span>
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-400 font-medium px-2 mb-2">Meny</div>
              {navItems.map((item) => (
                <button key={item.id} onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] font-medium transition-all duration-150 text-left ${
                    (activeView === item.id || (activeView === 'call-detail' && item.id === 'samtaler'))
                      ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
                  {item.icon}{item.label}
                  {item.badge && <span className="ml-auto text-[9px] bg-zinc-700 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold">{item.badge}</span>}
                </button>
              ))}              <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-400 font-medium px-2 mb-2 mt-6">Admin</div>
              {[{ icon: <Users className="w-3.5 h-3.5" />, l: 'Kunder' }, { icon: <TrendingUp className="w-3.5 h-3.5" />, l: 'Rapporter' }, { icon: <Settings className="w-3.5 h-3.5" />, l: 'Innstillinger' }].map((x, i) => (
                <div key={i} className="flex items-center gap-2.5 px-2.5 py-2 text-zinc-400 text-[11px] font-medium">{x.icon}{x.l}</div>
              ))}
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2.5">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=64&h=64&fit=crop&crop=face" alt="" className="w-7 h-7 rounded-lg object-cover" />
              <div><div className="text-[10px] font-semibold text-zinc-200">Kari Nordmann</div><div className="text-[9px] text-zinc-400">Klipp & Stil Majorstuen</div></div>
            </div>
          </motion.div>

          {/* ── Main Content ── */}
          <div className="overflow-y-auto bg-[#111111]">

            {/* ═══ DASHBOARD VIEW ═══ */}
            {activeView === 'dashboard' && (
              <div className="p-5">
                <motion.div className="flex items-center justify-between mb-5"
                  {...(isVisible ? buildUp(0.2) : { initial: { opacity: 0 } })}
                >
                  <div>
                    <h2 className="text-[15px] font-bold text-white">God morgen, Kari</h2>
                    <p className="text-zinc-500 mt-0.5">Fredag 11. april — 7 bookinger i dag</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-semibold text-zinc-200">AI Aktiv</span>
                  </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Anrop i dag', value: 43, icon: <Phone className="w-3.5 h-3.5" />, sub: '+8 fra i går' },
                    { label: 'Bookinger', value: 7, icon: <Calendar className="w-3.5 h-3.5" />, sub: '3 via AI' },
                    { label: 'Svartid', value: 1.4, icon: <Clock className="w-3.5 h-3.5" />, sub: 'sekunder snitt', suffix: 's' },
                    { label: 'Inntekt i dag', value: 14850, icon: <TrendingUp className="w-3.5 h-3.5" />, sub: 'fra bookinger', prefix: 'kr ' },
                  ].map((s, i) => (                    <motion.div key={i} className="bg-zinc-900/80 rounded-xl p-3.5 border border-zinc-800"
                      {...(isVisible ? buildUp(0.35 + i * 0.1) : { initial: { opacity: 0 } })}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-zinc-500 font-medium">{s.label}</span>
                        <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">{s.icon}</div>
                      </div>
                      <div className="text-[18px] font-bold text-white">
                        {isVisible ? <NumberTicker value={s.value} prefix={s.prefix} suffix={s.suffix} decimalPlaces={s.value < 10 ? 1 : 0} /> : '0'}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">{s.sub}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart + Call List */}
                <div className="grid grid-cols-[1fr_1.2fr] gap-3 mb-5">
                  <motion.div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800"
                    {...(isVisible ? buildUp(0.8) : { initial: { opacity: 0 } })}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-zinc-200 text-[12px]">Ukeoversikt</span>
                      <div className="flex items-center gap-3 text-[9px] text-zinc-400">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-500" />Anrop</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-zinc-600" />Booket</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-2 h-[100px]">
                      {barData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full flex gap-0.5 items-end h-[80px]">
                            <div className="flex-1 bg-blue-500 rounded-t-sm transition-all duration-700 ease-out" style={{ height: barsVisible ? `${d.h1}%` : '0%' }} />
                            <div className="flex-1 bg-zinc-600 rounded-t-sm transition-all duration-700 ease-out" style={{ height: barsVisible ? `${d.h2}%` : '0%', transitionDelay: '200ms' }} />
                          </div>
                          <span className="text-[9px] text-zinc-400">{d.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  {/* Recent Calls */}
                  <motion.div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800"
                    {...(isVisible ? buildUp(0.95) : { initial: { opacity: 0 } })}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-zinc-200 text-[12px]">Siste samtaler</span>
                      <button onClick={() => handleNavClick('samtaler')} className="text-[9px] text-zinc-500 hover:text-zinc-300 font-medium flex items-center gap-0.5">Se alle <ChevronRight className="w-3 h-3" /></button>
                    </div>
                    <div className="space-y-1.5">
                      {callLog.slice(0, visibleCalls).map((c, i) => {
                        const st = statusConfig[c.status]
                        return (
                          <div key={i} onClick={() => handleCallClick(i)}
                            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-all duration-300"
                            style={{ opacity: 0, animation: `fadeSlideIn 0.4s ease forwards ${i * 0.1}s` }}>
                            <Avatar name={c.name} />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-zinc-200 truncate">{c.name}</div>
                              <div className="text-[10px] text-zinc-400">{c.type} · {c.duration}</div>
                            </div>
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${st.bg} ${st.text}`}>
                              <div className={`w-1 h-1 rounded-full ${st.dot}`} />{st.label}
                            </div>
                            <span className="text-[9px] text-zinc-400 ml-1">{c.time}</span>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                </div>
                {/* Bottom Row */}
                <div className="grid grid-cols-3 gap-3">
                  <motion.div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800"
                    {...(isVisible ? buildUp(1.1) : { initial: { opacity: 0 } })}
                  >
                    <span className="font-semibold text-zinc-200 text-[12px]">Omsetning denne uken</span>
                    <div className="text-[22px] font-bold text-white mt-2">
                      {isVisible ? <NumberTicker value={174850} prefix="kr " /> : 'kr 0'}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">+12% fra forrige uke</div>
                    <div className="mt-3 h-[40px] flex items-end gap-1">
                      {[35, 42, 38, 56, 48, 62, 71].map((v, i) => (
                        <div key={i} className="flex-1 bg-zinc-700 rounded-t-sm" style={{ height: `${v}%` }}>
                          <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: `${60 + i * 5}%` }} />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  <motion.div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800"
                    {...(isVisible ? buildUp(1.25) : { initial: { opacity: 0 } })}
                  >
                    <div className="flex items-center gap-1.5 mb-3">
                      <Brain className="w-3.5 h-3.5 text-zinc-300" />
                      <span className="font-semibold text-zinc-200 text-[12px]">AI Innsikt</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2 p-2 rounded-lg bg-zinc-800/50">
                        <Zap className="w-3 h-3 text-zinc-400 mt-0.5 shrink-0" />
                        <div className="text-[10px] text-zinc-400 leading-relaxed">Tirs–tors har <span className="font-semibold text-white">38% flere</span> bookinger.</div>
                      </div>
                      <div className="flex items-start gap-2 p-2 rounded-lg bg-zinc-800/50">
                        <Target className="w-3 h-3 text-zinc-500 mt-0.5 shrink-0" />
                        <div className="text-[10px] text-zinc-400 leading-relaxed">Herreklipp mest populært. Snitt ventetid: <span className="font-semibold">1.2 dager</span></div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800"
                    {...(isVisible ? buildUp(1.4) : { initial: { opacity: 0 } })}
                  >
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-zinc-200 text-[12px]">Live</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { icon: <PhoneIncoming className="w-3 h-3 text-zinc-300" />, text: 'Erik Hansen ringer — AI svarer', time: 'nå' },
                        { icon: <CheckCircle2 className="w-3 h-3 text-zinc-500" />, text: 'Booking bekreftet: Sofia kl 09:30', time: '2 min' },
                        { icon: <MessageSquare className="w-3 h-3 text-zinc-500" />, text: 'SMS sendt til Magnus', time: '5 min' },
                      ].map((e, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50">
                          {e.icon}
                          <span className="text-[10px] text-zinc-300 flex-1">{e.text}</span>
                          <span className="text-[9px] text-zinc-400">{e.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Reviews */}
                <motion.div className="mt-3 bg-zinc-900/80 rounded-xl p-4 border border-zinc-800"
                  {...(isVisible ? buildUp(1.6) : { initial: { opacity: 0 } })}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-zinc-300" />
                      <span className="font-semibold text-zinc-200 text-[12px]">Siste tilbakemeldinger</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Snitt: 4.7 / 5</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Camilla Johansen', stars: 5, text: 'Kjempebra! AI-en booket meg på 30 sek.' },
                      { name: 'Anders Nilsen', stars: 4, text: 'Rask og enkel booking.' },
                      { name: 'Hanna Eriksen', stars: 5, text: 'Fikk time samme dag!' },
                    ].map((r, i) => (                      <div key={i} className="p-2.5 rounded-lg bg-zinc-800/50 border border-zinc-700">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Avatar name={r.name} />
                          <span className="font-medium text-zinc-300 text-[10px]">{r.name.split(' ')[0]}</span>
                          <div className="flex ml-auto">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`w-2.5 h-2.5 ${j < r.stars ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'}`} />)}</div>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* ═══ SAMTALER VIEW ═══ */}
            {activeView === 'samtaler' && (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[15px] font-bold text-white">Samtaler</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400">I dag: 43 anrop</span>
                    <div className="h-3 w-px bg-zinc-700" />
                    <span className="text-[10px] text-zinc-400">291 denne uken</span>
                  </div>
                </div>
                <div className="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden">
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-2.5 bg-zinc-800/50 border-b border-zinc-700 text-[9px] font-semibold text-zinc-500 uppercase tracking-wider">
                    <span>Kontakt</span><span>Type</span><span>Varighet</span><span>Status</span><span>Tid</span>
                  </div>
                  {callLog.map((c, i) => {
                    const st = statusConfig[c.status]
                    return (
                      <div key={i} onClick={() => handleCallClick(i)} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 hover:bg-zinc-800/50 cursor-pointer transition-colors border-b border-zinc-800 last:border-0 items-center">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={c.name} />
                          <div><div className="font-medium text-zinc-200">{c.name}</div><div className="text-[10px] text-zinc-400">{c.phone}</div></div>
                        </div>
                        <span className="text-zinc-400">{c.type}</span>
                        <span className="text-zinc-400">{c.duration}</span>
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium w-fit ${st.bg} ${st.text}`}>
                          <div className={`w-1 h-1 rounded-full ${st.dot}`} />{st.label}
                        </div>
                        <span className="text-zinc-400">{c.time}</span>
                      </div>
                    )
                  })}                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: 'Gjennomsnitt varighet', value: '2:08', icon: <Clock className="w-3 h-3" /> },
                    { label: 'AI-håndtert', value: '87%', icon: <Brain className="w-3 h-3" /> },
                    { label: 'Kundetilfredshet', value: '4.7/5', icon: <Star className="w-3 h-3" /> },
                  ].map((s, i) => (
                    <div key={i} className="bg-zinc-900/80 rounded-xl p-3.5 border border-zinc-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">{s.icon}</div>
                      <div><div className="text-[14px] font-bold text-white">{s.value}</div><div className="text-[10px] text-zinc-400">{s.label}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ CALL DETAIL VIEW ═══ */}
            {activeView === 'call-detail' && (() => {
              const call = callLog[selectedCall]
              const st = statusConfig[call.status]
              return (
                <div className="p-5">
                  <button onClick={() => setActiveView('samtaler')} className="flex items-center gap-1 text-zinc-400 hover:text-zinc-400 mb-4 text-[11px]">
                    <ArrowLeft className="w-3.5 h-3.5" /> Tilbake til samtaler
                  </button>
                  <div className="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden">
                    <div className="p-5 border-b border-zinc-700">
                      <div className="flex items-center gap-3">
                        <Avatar name={call.name} size="lg" />
                        <div className="flex-1">
                          <h3 className="text-[14px] font-bold text-white">{call.name}</h3>
                          <p className="text-[11px] text-zinc-400">{call.phone} · {call.type}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${st.bg} ${st.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                        </div>
                      </div>
                    </div>                    <div className="grid grid-cols-4 gap-4 p-5 border-b border-zinc-700">
                      {[
                        { l: 'Varighet', v: call.duration },
                        { l: 'Tidspunkt', v: call.time === 'Nå' ? 'Akkurat nå' : `${call.time} siden` },
                        { l: 'Håndtert av', v: 'AI Resepsjonist' },
                        { l: 'Sentiment', v: '😊 Positiv' },
                      ].map((d, i) => (
                        <div key={i}><div className="text-[9px] text-zinc-400 uppercase tracking-wider mb-1">{d.l}</div><div className="text-[12px] font-semibold text-zinc-200">{d.v}</div></div>
                      ))}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Volume2 className="w-3.5 h-3.5 text-zinc-300" />
                        <span className="font-semibold text-zinc-200 text-[12px]">Transkripsjon</span>
                        <button className="ml-auto flex items-center gap-1 text-[9px] text-zinc-500 hover:text-zinc-300 font-medium"><Play className="w-3 h-3" />Spill av</button>
                      </div>
                      <div className="space-y-2.5 bg-zinc-800/50 rounded-lg p-3">
                        {[
                          { speaker: 'AI', text: 'Hei, du har ringt Klipp & Stil Majorstuen. Hvordan kan jeg hjelpe deg?' },
                          { speaker: call.name.split(' ')[0], text: call.status === 'booked' ? 'Hei! Har dere en ledig time i morgen?' : 'Hei, hva koster en herreklipp?' },
                          { speaker: 'AI', text: call.status === 'booked' ? 'Ja, vi har ledig kl. 14:00. Skal jeg booke den for deg?' : 'Herreklipp koster 449 kr. Vil du booke en time?' },
                          { speaker: call.name.split(' ')[0], text: call.status === 'booked' ? 'Ja, perfekt!' : 'Ok, takk for info!' },
                          { speaker: 'AI', text: call.status === 'booked' ? `Flott! Du er booket kl. 14:00 i morgen. SMS-bekreftelse er sendt.` : 'Bare hyggelig! Ring gjerne tilbake. Ha en fin dag!' },
                        ].map((msg, i) => (
                          <div key={i} className={`flex gap-2 ${msg.speaker === 'AI' ? '' : 'flex-row-reverse'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 ${msg.speaker === 'AI' ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-800 text-white'}`}>
                              {msg.speaker === 'AI' ? 'AI' : msg.speaker[0]}
                            </div>
                            <div className={`max-w-[80%] p-2 rounded-lg text-[10px] leading-relaxed ${msg.speaker === 'AI' ? 'bg-zinc-800 border border-zinc-700 text-zinc-300' : 'bg-blue-600 text-white'}`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
            {/* ═══ BOOKINGER VIEW ═══ */}
            {activeView === 'bookinger' && (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[15px] font-bold text-white">Bookinger i dag</h2>
                  <span className="text-[10px] text-zinc-400">Fredag 11. april 2026</span>
                </div>
                <div className="bg-zinc-900/80 rounded-xl border border-zinc-800 overflow-hidden">
                  {bookings.map((b, i) => {
                    const isNow = b.time === '09:00'
                    return (
                      <div key={i} className={`flex items-center gap-3 px-4 py-3 border-b border-zinc-800 last:border-0 ${isNow ? 'bg-zinc-800/60' : ''}`}>
                        <div className="w-12 text-center">
                          <div className={`text-[12px] font-bold ${isNow ? 'text-white' : 'text-zinc-200'}`}>{b.time}</div>
                        </div>
                        <div className={`w-0.5 h-8 rounded-full ${isNow ? 'bg-blue-500' : 'bg-zinc-700'}`} />
                        <Avatar name={b.name} />
                        <div className="flex-1">
                          <div className="font-medium text-zinc-200">{b.name}</div>
                          <div className="text-[10px] text-zinc-400">{b.service} · {b.duration}</div>
                        </div>
                        {isNow && <span className="text-[9px] font-semibold text-white bg-blue-600 px-2 py-0.5 rounded-full">Nå</span>}
                      </div>
                    )
                  })}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: 'Totalt i dag', value: '7', sub: 'bookinger' },
                    { label: 'Via AI', value: '4', sub: '57% automatisk' },
                    { label: 'Forventet inntekt', value: 'kr 3 740', sub: 'basert på tjenester' },
                  ].map((s, i) => (
                    <div key={i} className="bg-zinc-900/80 rounded-xl p-3.5 border border-zinc-800 text-center">
                      <div className="text-[16px] font-bold text-white">{s.value}</div>
                      <div className="text-[10px] text-zinc-500 font-medium">{s.label}</div>
                      <div className="text-[9px] text-zinc-400 mt-0.5">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>{/* end main content */}
        </div>{/* end grid */}
      </div>{/* end overflow wrapper */}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}