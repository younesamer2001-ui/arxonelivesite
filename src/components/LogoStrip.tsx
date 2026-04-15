"use client";

import { motion } from "framer-motion";

interface LogoStripProps {
  lang?: "no" | "en";
}

/* ── Inline SVG logo components ── */

function NordicSmilesLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Tooth icon */}
      <g transform="translate(20,20)">
        <path d="M-10 0C-10-9-5-14 0-14 5-14 10-9 10 0 10 7 7 12 3 16 1.5 17.5 0 17.5 0 17.5 0 17.5-1.5 17.5-3 16-7 12-10 7-10 0Z"
          stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M-5 2C-2 6 2 6 5 2" stroke="#93c5fd" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      </g>
      {/* Text */}
      <text x="38" y="19" fill="currentColor" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="700" letterSpacing="1.5">
        NORDIC SMILES
      </text>
      <text x="38" y="32" fill="#9ca3af" fontFamily="Arial,sans-serif" fontSize="7" fontWeight="400" letterSpacing="3">
        DENTAL
      </text>
    </svg>
  );
}

function FixFlowLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Arrow/flow icon */}
      <g transform="translate(18,12)">
        <path d="M-8-4L8-4 4 0-8 0Z" fill="currentColor"/>
        <path d="M-5 3L11 3 7 7-5 7Z" fill="currentColor" opacity="0.7"/>
        <path d="M-2 10L14 10 10 14-2 14Z" fill="currentColor" opacity="0.45"/>
      </g>
      {/* Text */}
      <text x="34" y="22" fill="currentColor" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="700" letterSpacing="0.5">
        FixFlow
      </text>
      <text x="34" y="34" fill="#9ca3af" fontFamily="Arial,sans-serif" fontSize="6.5" fontWeight="400" letterSpacing="3.5">
        SERVICES
      </text>
    </svg>
  );
}

const logos: { name: string; initials: string; Logo?: React.FC<{ className?: string }> }[] = [
  { name: "Nordic Smiles Dental", initials: "NS", Logo: NordicSmilesLogo },
  { name: "FixFlow Services", initials: "FF", Logo: FixFlowLogo },
  { name: "Strand Frisør", initials: "SF" },
  { name: "Oslo Hudklinikk", initials: "OH" },
  { name: "Nordvik Auto", initials: "NA" },
];

export default function LogoStrip({ lang = "no" }: LogoStripProps) {
  const label = lang === "no"
    ? "Brukes av bedrifter over hele Norge"
    : "Used by businesses across Norway";

  return (
    <section className="py-10 md:py-14 bg-black border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-neutral-400 mb-8">
          {label}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-2.5 group"
            >
              {logo.Logo ? (
                <logo.Logo className="h-10 w-auto text-zinc-400 group-hover:text-white transition-colors duration-200" />
              ) : (
                <>
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 group-hover:bg-white group-hover:text-black transition-colors duration-200">
                    {logo.initials}
                  </div>
                  <span className="text-sm font-medium text-zinc-500 group-hover:text-white transition-colors duration-200 hidden sm:block">
                    {logo.name}
                  </span>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
