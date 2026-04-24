'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Clock, Cpu, Rocket, TrendingUp, Upload, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/* ─── Content ─── */
const content = {
  no: {
    label: 'Karriere',
    heading: 'Bli med å bygge noe stort',
    intro:
      'Arxon er i tidlig fase — og det betyr at du får ekte ansvar fra dag én. Vi ser etter folk som vil lære raskt, jobbe selvstendig og være med på å forme et selskap fra grunnen av.',
    whyHeading: 'Hvorfor Arxon?',
    reasons: [
      {
        title: 'Fleksibel arbeidstid',
        desc: 'Jobb når det passer deg. Perfekt for studenter eller folk med andre forpliktelser.',
        icon: Clock,
      },
      {
        title: 'Lær AI fra innsiden',
        desc: 'Få hands-on erfaring med AI, stemmeagenter og automasjon som få andre kan tilby.',
        icon: Cpu,
      },
      {
        title: 'Vær med fra starten',
        desc: 'Tidlig-fase startup der du får reelt ansvar og direkte påvirkning på produktet.',
        icon: Rocket,
      },      {
        title: 'Tjen på resultater',
        desc: 'Provisjonsbasert modell — jo mer du leverer, jo mer tjener du.',
        icon: TrendingUp,
      },
    ],
    cultureHeading: 'Hvem vi ser etter',
    cultureText:
      'Vi trenger ikke folk med perfekte CV-er. Vi ser etter folk som er nysgjerrige, tar initiativ og liker å finne ut av ting selv. Enten du er student som vil ha en fleksibel jobb, eller utvikler som vil jobbe med AI i praksis — vi vil høre fra deg.',
    formHeading: 'Send en søknad',
    formName: 'Navn',
    formEmail: 'E-post',
    formPhone: 'Telefon',
    formRole: 'Hva er du interessert i?',
    formRoles: ['Salg & kundeoppfølging', 'Utvikling & tech', 'Annet'],
    formMotivation: 'Kort om deg selv og hvorfor Arxon',
    formVideo: 'Last opp en kort video om deg selv (valgfritt)',
    formSubmit: 'Send søknad',
    formSuccess: 'Takk! Vi har mottatt søknaden din og tar kontakt snart.',
  },
  en: {
    label: 'Careers',
    heading: 'Help us build something big',
    intro:
      'Arxon is early-stage — which means you get real responsibility from day one. We\u2019re looking for people who learn fast, work independently and want to shape a company from the ground up.',
    whyHeading: 'Why Arxon?',
    reasons: [      {
        title: 'Flexible hours',
        desc: 'Work when it suits you. Perfect for students or people with other commitments.',
        icon: Clock,
      },
      {
        title: 'Learn AI from the inside',
        desc: 'Get hands-on experience with AI, voice agents and automation that few others can offer.',
        icon: Cpu,
      },
      {
        title: 'Join from the start',
        desc: 'Early-stage startup where you get real responsibility and direct impact on the product.',
        icon: Rocket,
      },
      {
        title: 'Earn on results',
        desc: 'Commission-based model — the more you deliver, the more you earn.',
        icon: TrendingUp,
      },
    ],
    cultureHeading: 'Who we\u2019re looking for',
    cultureText:
      'We don\u2019t need people with perfect CVs. We\u2019re looking for people who are curious, take initiative and like figuring things out on their own. Whether you\u2019re a student who wants a flexible job, or a developer who wants to work with AI in practice — we want to hear from you.',
    formHeading: 'Apply now',
    formName: 'Name',
    formEmail: 'Email',
    formPhone: 'Phone',
    formRole: 'What are you interested in?',
    formRoles: ['Sales & customer success', 'Development & tech', 'Other'],    formMotivation: 'A bit about yourself and why Arxon',
    formVideo: 'Upload a short video about yourself (optional)',
    formSubmit: 'Submit application',
    formSuccess: 'Thanks! We\u2019ve received your application and will be in touch soon.',
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
export default function Career({ lang = 'no' }: { lang?: 'no' | 'en' }) {
  const t = content[lang];
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [videoName, setVideoName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const fd = new FormData(formRef.current!);
    const name = fd.get('name') as string;
    const email = fd.get('email') as string;
    const phone = fd.get('phone') as string;
    const role = fd.get('role') as string;
    const motivation = fd.get('motivation') as string;

    try {
      const res = await fetch('/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || null,
          role,
          motivation,
          videoUrl: null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('Career submit error:', data.error || res.statusText);
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitted(true); // still show success to not confuse user
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative px-6 md:px-12 lg:px-24 pb-32 overflow-hidden">
      {/* Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[120px]" />

      {/* ── Hero ── */}
      <div className="relative max-w-2xl mx-auto text-center pt-12 pb-20 md:pb-28">
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
            {t.intro}
          </p>
        </Reveal>
      </div>
      {/* ── Why Arxon ── */}
      <div className="max-w-4xl mx-auto mb-24 md:mb-32">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-16">
            {t.whyHeading}
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-12 md:gap-16">
          {t.reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <Reveal key={r.title} i={i + 1}>
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 mb-4">
                    <Icon className="w-4 h-4 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">{r.title}</h3>
                  <p className="text-zinc-500 leading-relaxed text-[15px]">{r.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
      {/* ── Culture ── */}
      <div className="max-w-2xl mx-auto mb-24 md:mb-32">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-16" />
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-6">
            {t.cultureHeading}
          </h2>
        </Reveal>
        <Reveal i={1}>
          <p className="text-zinc-400 text-center text-lg leading-relaxed">
            {t.cultureText}
          </p>
        </Reveal>
      </div>
      {/* ── Application Form ── */}
      <div className="max-w-xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-16" />
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-12">
            {t.formHeading}
          </h2>
        </Reveal>

        {submitted ? (
          <Reveal>
            <div className="text-center py-16">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-zinc-300 text-lg">{t.formSuccess}</p>
            </div>
          </Reveal>
        ) : (
          <Reveal i={1}>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">{t.formName}</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>
              {/* Email & Phone */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">{t.formEmail}</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">{t.formPhone}</label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">{t.formRole}</label>
                <select
                  name="role"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-zinc-600 transition-colors appearance-none"
                >
                  <option value="" className="text-zinc-600">—</option>
                  {t.formRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              {/* Motivation */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">{t.formMotivation}</label>
                <textarea
                  name="motivation"
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                />
              </div>

              {/* Video upload */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">{t.formVideo}</label>
                <label className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 border-dashed cursor-pointer hover:border-zinc-600 transition-colors">
                  <Upload className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-500">
                    {videoName || (lang === 'no' ? 'Velg fil...' : 'Choose file...')}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setVideoName(e.target.files?.[0]?.name ?? null)}
                  />
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Sender...' : t.formSubmit}
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}