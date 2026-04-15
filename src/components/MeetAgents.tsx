'use client'

import { Phone, Heart, Car, Zap } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from '@/components/ui/interfaces-carousel'

interface MeetAgentsProps {
  lang?: 'no' | 'en'
}

const content = {
  no: {
    heading: 'Trent for din bransje.',
    subtext: 'Hver AI-resepsjonist er spesialtrent på akkurat din type henvendelser. Ring og test selv — direkte i nettleseren, helt gratis.',
    cta: 'Ring nå',
  },
  en: {
    heading: 'Trained for your industry.',
    subtext: 'Each AI receptionist is specially trained on your exact type of inquiries. Call and test yourself — directly in the browser, completely free.',
    cta: 'Call now',
  },
}

const agents = {
  no: [
    { name: 'Lisa', role: 'Helse & Klinikk', description: 'Jeg hjelper klinikker med timebooking, påminnelser og pasienthenvendelser. Jeg kan snakke om behandlinger og tilgjengelighet.', icon: Heart, phone: '+47 21 93 64 91' },
    { name: 'Max', role: 'Bilverksted', description: 'Jeg tar imot henvendelser for verkstedet – service, EU-kontroll, dekkskift og reparasjoner. Rask og effektiv booking.', icon: Car, phone: '+47 21 93 64 95' },
    { name: 'Ella', role: 'Elektriker', description: 'Jeg hjelper elektrikerfirmaer med kundehenvendelser, feilmelding og booking av oppdrag.', icon: Zap, phone: '+47 21 93 64 96' },
  ],
  en: [
    { name: 'Lisa', role: 'Health & Clinic', description: 'I help clinics with appointment booking, reminders and patient inquiries. I can discuss treatments and availability.', icon: Heart, phone: '+47 21 93 64 91' },
    { name: 'Max', role: 'Auto Workshop', description: 'I handle inquiries for the workshop – service, inspections, tire changes and repairs. Fast and efficient booking.', icon: Car, phone: '+47 21 93 64 95' },
    { name: 'Ella', role: 'Electrician', description: 'I help electrician companies with customer inquiries, fault reports and job bookings.', icon: Zap, phone: '+47 21 93 64 96' },
  ],
}

function AgentCard({ agent, cta }: { agent: typeof agents.no[0]; cta: string }) {
  const Icon = agent.icon
  return (
    <div className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300 h-full">
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
      <a
        href={`tel:${agent.phone.replace(/\s/g, '')}`}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors duration-200"
      >
        <Phone className="w-4 h-4" />
        {cta}
      </a>
    </div>
  )
}
export default function MeetAgents({ lang = 'no' }: MeetAgentsProps) {
  const c = content[lang]
  const agentList = agents[lang]

  return (
    <section id="prov-ai" className="py-14 md:py-32 bg-black">
      <div className="px-6 max-w-6xl mx-auto text-center mb-10 md:mb-16">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-5">
          {c.heading}
        </h2>
        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {c.subtext}
        </p>
      </div>

      {/* Mobile: Embla Carousel */}
      <div className="lg:hidden px-6">
        <Carousel opts={{ align: 'start', loop: false }}>
          <CarouselContent className="-ml-3">
            {agentList.map((agent) => (
              <CarouselItem key={agent.name} className="pl-3 basis-[85%] sm:basis-[60%]">
                <AgentCard agent={agent} cta={c.cta} />
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
            <AgentCard key={agent.name} agent={agent} cta={c.cta} />
          ))}
        </div>
      </div>
    </section>
  )
}