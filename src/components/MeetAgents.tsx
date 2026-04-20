'use client'

import { useCallback, useEffect, useState } from 'react'
import { Phone, PhoneOff, Loader2, Mic, MicOff, Heart, Car, Zap } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from '@/components/ui/interfaces-carousel'
import { useVapi } from '@/hooks/useVapi'

interface MeetAgentsProps {
  lang?: 'no' | 'en'
}

// Max varighet per demo-samtale (sekunder). 2 minutter.
const MAX_CALL_SECONDS = 120

const content = {
  no: {
    heading: 'Trent for din bransje.',
    subtext:
      'Hver AI-resepsjonist er spesialtrent på akkurat din type henvendelser. Ring og test selv — direkte i nettleseren, helt gratis.',
    cta: 'Ring nå',
    connecting: 'Kobler til…',
    hangUp: 'Legg på',
    ended: 'Samtale avsluttet',
    mute: 'Demp',
    unmute: 'Slå på',
    live: 'Live',
    notConfigured: 'Demo kommer snart',
    disabled: 'Opptatt i annen samtale',
  },
  en: {
    heading: 'Trained for your industry.',
    subtext:
      'Each AI receptionist is specially trained on your exact type of inquiries. Call and test yourself — directly in the browser, completely free.',
    cta: 'Call now',
    connecting: 'Connecting…',
    hangUp: 'Hang up',
    ended: 'Call ended',
    mute: 'Mute',
    unmute: 'Unmute',
    live: 'Live',
    notConfigured: 'Demo coming soon',
    disabled: 'Busy in another call',
  },
}

// Assistant IDs leses fra env. Fallback er tom streng — da vises
// "Demo kommer snart" i stedet for at Ring-nå-knappen feiler stille.
// Vi saniterer mot korrupte Vercel-verdier (f.eks. 'y\nf0e58afb-...') ved å
// plukke ut UUID-mønsteret. Hvis intet match → tom streng → "Demo kommer snart".
const UUID_RE = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
const cleanId = (raw: string | undefined) => (raw ?? '').match(UUID_RE)?.[0] ?? ''

const ASSISTANT_IDS = {
  lisa: cleanId(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_LISA),
  max: cleanId(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_MAX),
  ella: cleanId(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ELLA),
}

type AgentKey = 'lisa' | 'max' | 'ella'

interface Agent {
  key: AgentKey
  name: string
  role: string
  description: string
  icon: typeof Heart
  assistantId: string
}

const agents: Record<'no' | 'en', Agent[]> = {
  no: [
    {
      key: 'lisa',
      name: 'Lisa',
      role: 'Helse & Klinikk',
      description:
        'Jeg hjelper klinikker med timebooking, påminnelser og pasienthenvendelser. Jeg kan snakke om behandlinger og tilgjengelighet.',
      icon: Heart,
      assistantId: ASSISTANT_IDS.lisa,
    },
    {
      key: 'max',
      name: 'Max',
      role: 'Bilverksted',
      description:
        'Jeg tar imot henvendelser for verkstedet – service, EU-kontroll, dekkskift og reparasjoner. Rask og effektiv booking.',
      icon: Car,
      assistantId: ASSISTANT_IDS.max,
    },
    {
      key: 'ella',
      name: 'Ella',
      role: 'Elektriker',
      description:
        'Jeg hjelper elektrikerfirmaer med kundehenvendelser, feilmelding og booking av oppdrag.',
      icon: Zap,
      assistantId: ASSISTANT_IDS.ella,
    },
  ],
  en: [
    {
      key: 'lisa',
      name: 'Lisa',
      role: 'Health & Clinic',
      description:
        'I help clinics with appointment booking, reminders and patient inquiries. I can discuss treatments and availability.',
      icon: Heart,
      assistantId: ASSISTANT_IDS.lisa,
    },
    {
      key: 'max',
      name: 'Max',
      role: 'Auto Workshop',
      description:
        'I handle inquiries for the workshop – service, inspections, tire changes and repairs. Fast and efficient booking.',
      icon: Car,
      assistantId: ASSISTANT_IDS.max,
    },
    {
      key: 'ella',
      name: 'Ella',
      role: 'Electrician',
      description:
        'I help electrician companies with customer inquiries, fault reports and job bookings.',
      icon: Zap,
      assistantId: ASSISTANT_IDS.ella,
    },
  ],
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface AgentCardProps {
  agent: Agent
  t: typeof content.no
  status: 'idle' | 'connecting' | 'active' | 'ended'
  isThisCall: boolean
  isAnyCallActive: boolean
  isMuted: boolean
  remaining: number
  onStart: (assistantId: string) => void
  onStop: () => void
  onToggleMute: () => void
}

function AgentCard({
  agent,
  t,
  status,
  isThisCall,
  isAnyCallActive,
  isMuted,
  remaining,
  onStart,
  onStop,
  onToggleMute,
}: AgentCardProps) {
  const Icon = agent.icon
  const notConfigured = !agent.assistantId
  const disabled = notConfigured || (isAnyCallActive && !isThisCall)

  const renderCTA = () => {
    if (notConfigured) {
      return (
        <button
          disabled
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zinc-800 text-zinc-500 font-semibold text-sm cursor-not-allowed"
        >
          <Phone className="w-4 h-4" />
          {t.notConfigured}
        </button>
      )
    }

    if (isThisCall && status === 'connecting') {
      return (
        <button
          disabled
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold text-sm cursor-wait"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          {t.connecting}
        </button>
      )
    }

    if (isThisCall && status === 'active') {
      return (
        <div className="flex gap-2 w-full">
          <button
            onClick={onStop}
            className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
            {t.hangUp} · {formatTime(remaining)}
          </button>
          <button
            onClick={onToggleMute}
            title={isMuted ? t.unmute : t.mute}
            aria-label={isMuted ? t.unmute : t.mute}
            className={`flex items-center justify-center w-12 py-3 rounded-xl transition-colors ${
              isMuted
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>
      )
    }

    if (isThisCall && status === 'ended') {
      return (
        <span className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zinc-800 text-zinc-400 font-semibold text-sm">
          {t.ended}
        </span>
      )
    }

    return (
      <button
        onClick={() => onStart(agent.assistantId)}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-colors duration-200 ${
          disabled
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : 'bg-white text-black hover:bg-zinc-200'
        }`}
        title={disabled && isAnyCallActive ? t.disabled : undefined}
      >
        <Phone className="w-4 h-4" />
        {t.cta}
      </button>
    )
  }

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border bg-zinc-900/80 p-5 transition-all duration-300 h-full ${
        isThisCall && status === 'active'
          ? 'border-green-500/60 shadow-[0_0_0_1px_rgba(34,197,94,0.3),0_8px_30px_-10px_rgba(34,197,94,0.25)]'
          : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
      }`}
    >
      {isThisCall && status === 'active' && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-xs text-green-400 font-medium">{t.live}</span>
        </div>
      )}

      <div className="flex items-center gap-3.5 mb-4">
        <div className="w-11 h-11 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
          <Icon className="w-5 h-5 text-zinc-300" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{agent.name}</h3>
          <p className="text-sm text-zinc-500">{agent.role}</p>
        </div>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-1">{agent.description}</p>
      {renderCTA()}
    </div>
  )
}

export default function MeetAgents({ lang = 'no' }: MeetAgentsProps) {
  const t = content[lang]
  const agentList = agents[lang]

  const { status, isMuted, start, stop, toggleMute } = useVapi()
  const [selectedAssistantId, setSelectedAssistantId] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const isAnyCallActive = status === 'active' || status === 'connecting'
  const remaining = Math.max(0, MAX_CALL_SECONDS - elapsed)

  // Sporet assistant-id er bare relevant så lenge hooken ikke er i idle —
  // når samtale er helt ferdig faller vi tilbake til null uten å mutere state.
  const activeAssistantId = status === 'idle' ? null : selectedAssistantId

  const handleStart = useCallback(
    (assistantId: string) => {
      setSelectedAssistantId(assistantId)
      setElapsed(0)
      start(assistantId)
    },
    [start],
  )

  const handleStop = useCallback(() => {
    stop()
  }, [stop])

  // Tikk teller og auto-hangup etter 2 min
  useEffect(() => {
    if (status !== 'active') return
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1
        if (next >= MAX_CALL_SECONDS) {
          stop()
        }
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [status, stop])

  const renderCard = (agent: Agent) => (
    <AgentCard
      agent={agent}
      t={t}
      status={status}
      isThisCall={agent.assistantId === activeAssistantId}
      isAnyCallActive={isAnyCallActive}
      isMuted={isMuted}
      remaining={remaining}
      onStart={handleStart}
      onStop={handleStop}
      onToggleMute={toggleMute}
    />
  )

  return (
    <section id="prov-ai" className="py-14 md:py-32 bg-black">
      <div className="px-6 max-w-6xl mx-auto text-center mb-10 md:mb-16">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-5">
          {t.heading}
        </h2>
        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {t.subtext}
        </p>
      </div>

      {/* Mobile: Embla Carousel */}
      <div className="lg:hidden px-6">
        <Carousel opts={{ align: 'start', loop: false }}>
          <CarouselContent className="-ml-3">
            {agentList.map((agent) => (
              <CarouselItem key={agent.name} className="pl-3 basis-[85%] sm:basis-[60%]">
                {renderCard(agent)}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots />
        </Carousel>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden lg:block max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-5">
          {agentList.map((agent) => (
            <div key={agent.name}>{renderCard(agent)}</div>
          ))}
        </div>
      </div>
    </section>
  )
}
