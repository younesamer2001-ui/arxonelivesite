'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/* ═══════════════════════════════════════════
   POST 1 — AI-resepsjonist pipeline
   Vertical timeline with glowing nodes
   ═══════════════════════════════════════════ */
export function InfographicAIFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const steps = [
    { time: '0 sek', title: 'Telefonen ringer', desc: 'Kunden ringer bedriften din utenfor åpningstid.' },
    { time: '2 sek', title: 'AI-en svarer', desc: 'Naturlig norsk samtale. Kunden tror det er en ekte resepsjonist.' },
    { time: '45 sek', title: 'Booking bekreftet', desc: 'Timen er booket direkte i kalendersystemet ditt.' },
    { time: '46 sek', title: 'Du får oppsummering', desc: 'SMS + e-post med hva kunden trengte. Ingen post-its.' },
  ];

  return (
    <Wrapper ref={ref}>
      <div className="max-w-sm mx-auto">
        {steps.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="relative pl-10 pb-10 last:pb-0"
          >
            {/* vertical line */}
            {i < steps.length - 1 && (
              <div className="absolute left-[11px] top-[22px] bottom-0 w-px bg-gradient-to-b from-[#0066FF]/30 to-[#0066FF]/5" />
            )}
            {/* node */}
            <div className="absolute left-0 top-[6px] w-[23px] h-[23px] flex items-center justify-center">
              <div className="w-[9px] h-[9px] rounded-full bg-[#0066FF]" />
              <div className="absolute w-[23px] h-[23px] rounded-full bg-[#0066FF]/20 animate-ping" style={{ animationDuration: '3s', animationDelay: `${i * 0.5}s` }} />
            </div>
            {/* time chip */}
            <div className="inline-block text-[10px] font-mono text-[#0066FF]/70 bg-[#0066FF]/[0.08] rounded px-1.5 py-0.5 mb-1.5">
              {s.time}
            </div>
            <h4 className="text-[14px] font-medium text-white/90 mb-1">{s.title}</h4>
            <p className="text-[12.5px] text-white/30 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Wrapper>
  );
}

/* ═══════════════════════════════════════════
   POST 2 — ROI donut + key metrics
   SVG donut chart with animated stroke
   ═══════════════════════════════════════════ */
export function InfographicROI() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  /* donut math: radius=54, circumference≈339.29 */
  const C = 2 * Math.PI * 54;
  const beforePct = 0.52;
  const afterPct = 0.03;

  return (
    <Wrapper ref={ref}>
      <div className="flex flex-col sm:flex-row items-center gap-10 sm:gap-14">
        {/* donut charts */}
        <div className="flex items-center gap-5 sm:gap-8 shrink-0">
          {/* before */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
              <motion.circle cx="60" cy="60" r="54" fill="none" stroke="#ef4444"
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={inView ? { strokeDashoffset: C * (1 - beforePct) } : {}}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                style={{ opacity: 0.7 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-light text-red-400">52%</span>
              <span className="text-[9px] text-white/20 uppercase tracking-wider">misset</span>
            </div>
          </div>

          {/* arrow */}
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="shrink-0 opacity-20">
            <path d="M0 6h16m0 0l-4-4.5M16 6l-4 4.5" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          {/* after */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
              <motion.circle cx="60" cy="60" r="54" fill="none" stroke="#10b981"
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={inView ? { strokeDashoffset: C * (1 - afterPct) } : {}}
                transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                style={{ opacity: 0.7 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-light text-emerald-400">3%</span>
              <span className="text-[9px] text-white/20 uppercase tracking-wider">misset</span>
            </div>
          </div>
        </div>

        {/* metrics */}
        <div className="flex-1 space-y-5 min-w-0">
          {[
            { value: '+34 000 kr', label: 'ekstra omsetning per måned', color: 'text-[#0066FF]' },
            { value: '+23 bookinger', label: 'flere per måned', color: 'text-emerald-400' },
            { value: '15 timer spart', label: 'per uke i admin', color: 'text-white/60' },
          ].map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.12 }}
            >
              <div className={`text-[18px] font-light ${m.color}`}>{m.value}</div>
              <div className="text-[11px] text-white/20">{m.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}

/* ═══════════════════════════════════════════
   POST 3 — Enterprise vs Arxon
   Two comparison cards: muted vs highlighted
   ═══════════════════════════════════════════ */
export function InfographicSMBvsEnterprise() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const rows = [
    { label: 'Oppstart', enterprise: '500 000 kr+', arxon: '< 15 000 kr' },
    { label: 'Leveringstid', enterprise: '6–12 mnd', arxon: '10 dager' },
    { label: 'Månedlig', enterprise: '~80 000 kr', arxon: '4 990 kr' },
    { label: 'Kontakt', enterprise: 'Prosjektleder', arxon: 'Grunnlegger' },
    { label: 'Målgruppe', enterprise: '500+ ansatte', arxon: '5–50 ansatte' },
  ];

  return (
    <Wrapper ref={ref}>
      <div className="max-w-md mx-auto">
        {/* two cards side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Enterprise card — muted */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 sm:p-5"
          >
            <div className="text-[10px] uppercase tracking-[0.14em] text-white/20 mb-4 sm:mb-5">Enterprise</div>
            <div className="space-y-3 sm:space-y-4">
              {rows.map((r, i) => (
                <div key={i}>
                  <div className="text-[9px] sm:text-[10px] text-white/15 uppercase tracking-wider mb-0.5">{r.label}</div>
                  <div className="text-[12px] sm:text-[14px] text-white/25 font-light">{r.enterprise}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Arxon card — highlighted with blue */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-xl border border-[#0066FF]/20 p-4 sm:p-5 overflow-hidden"
          >
            {/* glow background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0066FF]/[0.06] to-transparent" />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#0066FF]/[0.08] rounded-full blur-[60px]" />
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.14em] text-[#0066FF] font-medium mb-4 sm:mb-5">Arxon</div>
              <div className="space-y-3 sm:space-y-4">
                {rows.map((r, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.35 + i * 0.08 }}
                  >
                    <div className="text-[9px] sm:text-[10px] text-white/20 uppercase tracking-wider mb-0.5">{r.label}</div>
                    <div className="text-[12px] sm:text-[14px] text-white font-medium">{r.arxon}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* punchline */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-[11.5px] text-white/25 mt-8 leading-relaxed"
        >
          95 % av norske bedrifter har under 50 ansatte.<br />
          <span className="text-white/45 font-medium">De fortjener en modell bygget for dem.</span>
        </motion.p>
      </div>
    </Wrapper>
  );
}

/* ═══════════════════════════════════════════
   Shared wrapper — forwardRef for useInView
   ═══════════════════════════════════════════ */
import { forwardRef } from 'react';

const Wrapper = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  function Wrapper({ children }, ref) {
    return (
      <div ref={ref} className="relative my-10 md:my-14 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] to-[#06060e] border border-white/[0.06] rounded-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#0066FF]/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="relative py-10 md:py-14 px-5 sm:px-8 md:px-12">
          {children}
        </div>
      </div>
    );
  }
);

/* ═══════════════════════════════════════════
   Slug → infographic map
   ═══════════════════════════════════════════ */
export const blogInfographics: Record<string, React.FC> = {
  'ai-resepsjonist-norske-bedrifter': InfographicAIFlow,
  'roi-ai-automasjon-smb': InfographicROI,
  'hvorfor-store-konsulenter-feiler-smb': InfographicSMBvsEnterprise,
};
