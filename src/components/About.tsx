'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const content = {
  no: {
    headline: 'AI for norske bedrifter.',
    sub: 'Ikke enterprise-priser. Ikke månedsvis med venting. Bare resultater.',
    originLabel: 'Bakgrunn',
    originP1: 'I 2025 så vi et tydelig gap i det norske markedet. Store aktører som Cognite, Bouvet og Bekk betjener enterprise-kunder med massive budsjetter. Men hvem hjelper tannlegen med 8 ansatte? Eller eiendomsmegleren som misser 30% av henvendelsene?',
    originP2: 'Svaret var: nesten ingen. Så vi bygde Arxon — et AI-konsulentselskap som kombinerer enterprise-kvalitet med SMB-hastighet og priser.',
    promiseLabel: 'Vårt løfte',
    promiseHeadline: '10 dager.',
    promiseText: 'Fra første samtale til live AI-løsning. Funker det ikke? Du betaler ingenting.',
    pillars: [
      { number: '10', unit: 'dager', text: 'Fra oppstart til live AI' },
      { number: '30', unit: 'dagers garanti', text: 'Full refusjon, ingen spørsmål' },
      { number: '23+', unit: 'bookinger/mnd', text: 'Gjennomsnittlig økning' },
    ],
    whoLabel: 'Hvem vi hjelper',
    whoText: 'Helseklinikker som misser anrop. Eiendomsmeglere som ikke følger opp leads. Servicebedrifter som drukner i admin. Har du 3–200 ansatte og bruker mer tid på telefon og epost enn på det du faktisk er god på — da er Arxon for deg.',
    buildLabel: 'Hva vi leverer',
    buildItems: [
      { title: 'AI-resepsjonist', desc: 'Tar imot anrop, booker timer og svarer kunder — 24/7, på norsk.' },
      { title: 'Workflow-automasjon', desc: 'Fjerner repetitive oppgaver. Faktura, oppfølging, rapporter.' },
      { title: 'CRM + integrasjoner', desc: 'Kobler seg på Fiken, Tripletex, HubSpot og systemene du bruker.' },
      { title: 'Skreddersydde AI-agenter', desc: 'Bygget for din bedrift. Ikke et generisk SaaS-produkt.' },
    ],
    marketNumbers: [
      { value: '1.79 mrd', unit: 'USD', label: 'Norsk konsulentmarked' },
      { value: '80%', unit: '', label: 'Regjeringens AI-mål' },
      { value: '< 5', unit: '', label: 'AI-konsulenter for SMB i Norge' },
    ],
    cta: 'Book en samtale',
  },
  en: {
    headline: 'AI for Norwegian businesses.',
    sub: 'No enterprise pricing. No months of waiting. Just results.',
    originLabel: 'Background',
    originP1: 'In 2025, we saw a clear gap in the Norwegian market. Big players like Cognite, Bouvet, and Bekk serve enterprise clients with massive budgets. But who helps the dentist with 8 employees? Or the real estate agent missing 30% of inquiries?',
    originP2: 'The answer was: almost nobody. So we built Arxon — an AI consultancy combining enterprise quality with SMB speed and pricing.',
    promiseLabel: 'Our promise',
    promiseHeadline: '10 days.',
    promiseText: 'From first conversation to live AI solution. Doesn\'t work? You pay nothing.',
    pillars: [
      { number: '10', unit: 'days', text: 'From kickoff to live AI' },
      { number: '30', unit: 'day guarantee', text: 'Full refund, no questions' },
      { number: '23+', unit: 'bookings/mo', text: 'Average increase' },
    ],
    whoLabel: 'Who we help',
    whoText: 'Health clinics missing calls. Real estate agents not following up leads. Service businesses drowning in admin. If you have 3–200 employees and spend more time on phone and email than on what you do best — Arxon is for you.',
    buildLabel: 'What we deliver',
    buildItems: [
      { title: 'AI receptionist', desc: 'Answers calls, books appointments and responds to customers — 24/7, in Norwegian.' },
      { title: 'Workflow automation', desc: 'Removes repetitive tasks. Invoices, follow-ups, reports.' },
      { title: 'CRM + integrations', desc: 'Connects to Fiken, Tripletex, HubSpot and your existing systems.' },
      { title: 'Custom AI agents', desc: 'Built for your business. Not a generic SaaS product.' },
    ],
    marketNumbers: [
      { value: '1.79B', unit: 'USD', label: 'Norwegian consulting market' },
      { value: '80%', unit: '', label: 'Government AI target' },
      { value: '< 5', unit: '', label: 'AI consultancies for Norwegian SMBs' },
    ],
    cta: 'Book a call',
  },
};

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

interface AboutProps { lang?: 'no' | 'en' }

export default function About({ lang = 'no' }: AboutProps) {
  const t = content[lang];

  return (
    <div className="max-w-5xl mx-auto px-6">

      {/* Hero */}
      <motion.div initial="hidden" animate="visible" variants={fade} custom={0}
        className="pt-20 pb-16 md:pt-28 md:pb-20"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.05]">
          {t.headline}
        </h1>
        <p className="mt-5 text-lg md:text-xl text-white/60 max-w-xl leading-relaxed">
          {t.sub}
        </p>
      </motion.div>

      {/* Origin — two columns */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fade} custom={0.1}
        className="py-14 md:py-16 border-t border-white/[0.08]"
      >
        <span className="text-[11px] tracking-[0.25em] uppercase text-white/35 block mb-6">
          {t.originLabel}
        </span>
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <p className="text-base md:text-lg text-white/70 leading-relaxed">{t.originP1}</p>
          <p className="text-base md:text-lg text-white/70 leading-relaxed">{t.originP2}</p>
        </div>
      </motion.div>

      {/* Promise + Pillars — combined section */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fade} custom={0.1}
        className="py-14 md:py-16 border-t border-white/[0.08]"
      >
        <span className="text-[11px] tracking-[0.25em] uppercase text-white/35 block mb-6">
          {t.promiseLabel}
        </span>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight mb-3">
          {t.promiseHeadline}
        </h2>
        <p className="text-base md:text-lg text-white/60 max-w-lg mb-12">
          {t.promiseText}
        </p>
        {/* Pillars inline */}
        <div className="grid grid-cols-3 gap-6">
          {t.pillars.map((p, i) => (
            <motion.div key={p.number} initial="hidden" whileInView="visible"
              viewport={{ once: true }} variants={fade} custom={i * 0.1}
              className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.02]"
            >
              <div className="text-3xl md:text-4xl font-semibold text-white">{p.number}</div>
              <div className="text-xs text-white/40 mt-0.5 uppercase tracking-wide">{p.unit}</div>
              <p className="text-sm text-white/50 mt-3">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Who we help */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fade} custom={0.1}
        className="py-14 md:py-16 border-t border-white/[0.08]"
      >
        <span className="text-[11px] tracking-[0.25em] uppercase text-white/35 block mb-6">
          {t.whoLabel}
        </span>
        <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-3xl">
          {t.whoText}
        </p>
      </motion.div>

      {/* What we deliver */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fade} custom={0.1}
        className="py-14 md:py-16 border-t border-white/[0.08]"
      >
        <span className="text-[11px] tracking-[0.25em] uppercase text-white/35 block mb-8">
          {t.buildLabel}
        </span>
        <div className="grid sm:grid-cols-2 gap-4">
          {t.buildItems.map((item, i) => (
            <motion.div key={item.title} initial="hidden" whileInView="visible"
              viewport={{ once: true }} variants={fade} custom={i * 0.08}
              className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <h3 className="text-white font-medium text-sm mb-1.5">{item.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market numbers */}
      <div className="py-14 md:py-16 border-t border-white/[0.08] grid grid-cols-3 gap-6">
        {t.marketNumbers.map((n, i) => (
          <motion.div key={n.label} initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={fade} custom={i * 0.1}
          >
            <div className="text-2xl md:text-3xl font-semibold text-white">
              {n.value}<span className="text-sm text-white/40 ml-1 font-normal">{n.unit}</span>
            </div>
            <p className="text-xs text-white/40 mt-1">{n.label}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fade} custom={0.1}
        className="py-16 md:py-20 border-t border-white/[0.08] flex justify-center"
      >
        <a href="https://cal.com/arxon/30min" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-medium text-sm hover:bg-white/90 transition-colors"
        >
          {t.cta}
          <ArrowRight size={16} />
        </a>
      </motion.div>

    </div>
  );
}
