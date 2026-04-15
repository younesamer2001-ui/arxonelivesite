'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

interface IntegrationsProps {
  lang?: 'no' | 'en'
}

const content = {
  no: {
    label: 'INTEGRASJONER',
    heading: 'Passer rett inn i',
    headingAccent: 'hverdagen din.',
    subtext: 'Arxon snakker med systemene du allerede bruker. Kalender, CRM, e-post — alt synkroniseres automatisk, uten ekstraarbeid.',
    missing: 'Mangler en integrasjon?',
    missingCta: 'Vi bygger den for deg →',
  },
  en: {
    label: 'INTEGRATIONS',
    heading: 'Fits right into',
    headingAccent: 'your workflow.',
    subtext: 'Arxon talks to the systems you already use. Calendar, CRM, email — everything syncs automatically, with zero extra work.',
    missing: 'Missing an integration?',
    missingCta: "We'll build it for you →",
  },
}

const integrations = [
  { name: 'Gmail', desc: { no: 'E-postbekreftelser', en: 'Email confirmations' }, logo: '/logos/gmail.svg' },
  { name: 'Outlook', desc: { no: 'E-post & kalender', en: 'Email & calendar' }, logo: '/logos/outlook.svg' },
  { name: 'Slack', desc: { no: 'Varsler til teamet', en: 'Team notifications' }, logo: '/logos/slack.svg' },
  { name: 'HubSpot', desc: { no: 'CRM & kundehåndtering', en: 'CRM & customer management' }, logo: '/logos/hubspot.svg' },
  { name: 'Zapier', desc: { no: 'Koble alt sammen', en: 'Connect everything' }, logo: '/logos/zapier.svg' },
  { name: 'Airtable', desc: { no: 'Fleksibel database', en: 'Flexible database' }, logo: '/logos/airtable.svg' },
]

export default function Integrations({ lang = 'no' }: IntegrationsProps) {
  const c = content[lang]
  const gridRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(gridRef, { once: true, margin: '-15%' })

  return (
    <section className="py-14 md:py-32 px-6 bg-black overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 md:mb-20"
        >
          <span className="inline-block px-3 py-1 border border-zinc-700 rounded-full text-[10px] font-semibold tracking-widest text-zinc-300 uppercase mb-6">
            {c.label}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
            <span className="text-zinc-300">{c.heading}</span><br />
            <span className="text-white">{c.headingAccent}</span>
          </h2>
          <p className="text-base md:text-lg text-zinc-300 max-w-xl mx-auto">
            {c.subtext}
          </p>
        </motion.div>

        {/* Logos — no boxes, just floating logos that spin in */}
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-10 sm:gap-y-14 gap-x-6 sm:gap-x-8 place-items-center">
          {integrations.map((item, i) => (
            <motion.div
              key={item.name}
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* 3D spinning logo — slow elegant spin */}
              <div style={{ perspective: 600 }}>
                <motion.div
                  className="w-14 h-14 md:w-16 md:h-16"
                  initial={{ rotateY: -180, scale: 0.4, opacity: 0 }}
                  animate={
                    isInView
                      ? { rotateY: 0, scale: 1, opacity: 1 }
                      : {}
                  }
                  transition={{
                    duration: 1.2,
                    delay: 0.2 + i * 0.15,
                    type: 'spring',
                    damping: 12,
                    stiffness: 40,
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.1)]"
                  />
                </motion.div>
              </div>

              {/* Name + description */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }}
              >
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.desc[lang]}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-zinc-300">
            {c.missing}{' '}
            <a href="mailto:hei@arxon.no" className="text-white font-medium hover:underline">
              {c.missingCta}
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
