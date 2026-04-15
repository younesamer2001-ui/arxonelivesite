'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Globe, TrendingUp, ArrowRight } from 'lucide-react';

/* ─── Content ─── */
const content = {
  no: {
    label: 'Om Arxon',
    heading: 'Vi bygger fremtidens resepsjon',
    story:
      'Hver dag mister norske bedrifter kunder fordi ingen svarer telefonen. Arxon er en AI-resepsjonist som tar imot samtaler, booker avtaler og gir bedrifter full oversikt — 24 timer i døgnet, 365 dager i året.',
    founderName: 'Younes Amer',
    founderRole: 'Grunnlegger & daglig leder',
    founderStory:
      'Det begynte med en bulk på bilen. Jeg ringte et verksted — ingen svarte. Prøvde igjen neste dag, samme kø. Til slutt gikk jeg bare til en konkurrent. Det fikk meg til å tenke: hvor mange kunder mister denne bedriften hver uke, uten å vite det?',
    founderStory2:
      'Jeg begynte å bygge på kveldene. Først en enkel AI-resepsjonist for én bilvask, bare for å se om det fungerte. Det gjorde det — og det som startet som et eksperiment, viste raskt hvor stort problemet egentlig var.',
    founderMission:
      'Etter hvert ble det tydelig at dette handlet om mer enn å svare telefonen. Bedrifter trengte systemer som fanget opp informasjon, strukturerte den og gjorde den brukbar i driften. Derfor ble Arxon et helhetlig system: AI-resepsjonist, dashboard som analyserer og organiserer data, og verktøy som gir bedrifter mer kontroll, bedre flyt og færre tapte muligheter.',
    valuesHeading: 'Det vi står for',    values: [
      {
        title: 'Alltid tilgjengelig',
        desc: 'Kundene dine ringer når det passer dem. Vi sørger for at noen alltid svarer.',
        icon: Phone,
      },
      {
        title: 'Bygget for Norge',
        desc: 'Vi forstår norsk, dialekter, og hvordan norske bedrifter faktisk jobber.',
        icon: Globe,
      },
      {
        title: 'Resultater, ikke buzzwords',
        desc: 'Ingen AI-hype. Bare flere bookinger, færre tapte samtaler, og mer tid til det som betyr noe.',
        icon: TrendingUp,
      },
    ],
    ctaHeading: 'Klar for å se hvordan Arxon fungerer?',
    ctaButton: 'Kom i gang',
  },
  en: {
    label: 'About Arxon',
    heading: 'We\u2019re building the reception of the future',
    story:
      'Every day, Norwegian businesses lose customers because no one picks up the phone. Arxon is an AI receptionist that answers calls, books appointments and gives businesses full visibility — 24 hours a day, 365 days a year.',
    founderName: 'Younes Amer',
    founderRole: 'Founder & CEO',
    founderStory:
      'It started with a dent on my car. I called a workshop — no answer. Tried again the next day, same queue. Eventually I just went to a competitor. It made me think: how many customers does this business lose every week without even knowing?',
    founderStory2:
      'I started building in the evenings. First a simple AI receptionist for one car wash, just to see if it worked. It did — and what started as an experiment quickly showed how big the problem really was.',
    founderMission:
      'Over time it became clear this was about more than answering the phone. Businesses needed systems that captured information, structured it and made it useful in their operations. That\u2019s why Arxon became a complete system: AI receptionist, a dashboard that analyzes and organizes data, and tools that give businesses more control, better flow and fewer missed opportunities.',
    valuesHeading: 'What we stand for',
    values: [
      {
        title: 'Always available',
        desc: 'Your customers call when it suits them. We make sure someone always answers.',
        icon: Phone,
      },
      {
        title: 'Built for Norway',
        desc: 'We understand Norwegian, dialects, and how Norwegian businesses actually work.',
        icon: Globe,
      },
      {
        title: 'Results, not buzzwords',
        desc: 'No AI hype. Just more bookings, fewer missed calls, and more time for what matters.',
        icon: TrendingUp,
      },
    ],
    ctaHeading: 'Ready to see how Arxon works?',
    ctaButton: 'Get started',
  },
} as const;

/* ─── Animation ─── */
const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

function Reveal({ children, i = 0 }: { children: React.ReactNode; i?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      custom={i}
      variants={fade}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}
/* ─── Component ─── */
export default function About({ lang = 'no' }: { lang?: 'no' | 'en' }) {
  const t = content[lang];

  return (
    <section className="relative px-6 md:px-12 lg:px-24 pb-32 overflow-hidden">
      {/* ── Subtle radial glow behind hero ── */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[120px]" />

      {/* ── Hero / Origin Story ── */}
      <div className="relative max-w-2xl mx-auto text-center pt-12 pb-24 md:pb-32">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6">
            {t.label}
          </p>
        </Reveal>

        <Reveal i={1}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
            {t.heading}
          </h1>
        </Reveal>

        <Reveal i={2}>
          <p className="mt-8 text-lg md:text-xl leading-relaxed text-zinc-400">
            {t.story}
          </p>
        </Reveal>
      </div>
      {/* ── Founder Profile ── */}
      <div className="max-w-2xl mx-auto mb-24 md:mb-32">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-16" />

        <Reveal>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Image
              src="/images/younes.jpg"
              alt={t.founderName}
              width={80}
              height={80}
              className="shrink-0 w-20 h-20 rounded-full object-cover border border-zinc-700"
            />

            <div className="text-center sm:text-left">
              <p className="text-white font-medium text-lg">
                {t.founderName}
              </p>
              <p className="text-zinc-500 text-sm mb-4">
                {t.founderRole}
              </p>
              <p className="text-zinc-400 text-[15px] leading-relaxed">
                {t.founderStory}
              </p>
              <p className="text-zinc-400 text-[15px] leading-relaxed mt-4">
                {t.founderStory2}
              </p>
              <p className="text-zinc-400 text-[15px] leading-relaxed mt-4">
                {t.founderMission}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
      {/* ── Values ── */}
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-16">
            {t.valuesHeading}
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {t.values.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.title} i={i + 1}>
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 mb-4">
                    <Icon className="w-4 h-4 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-3">
                    {v.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed text-[15px]">
                    {v.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="max-w-2xl mx-auto mt-24 md:mt-32 text-center">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-16" />
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            {t.ctaHeading}
          </h2>
          <Link
            href="/#kontakt"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-colors"
          >
            {t.ctaButton}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}