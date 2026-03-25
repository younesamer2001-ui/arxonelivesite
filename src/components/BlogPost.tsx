'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import type { BlogPost as BlogPostType } from '@/lib/blog-data';

/* ── scroll reveal wrapper ── */
function Reveal({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(16px)',
      transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}
/* ── stat section — fullbleed visual break ── */
function StatStrip({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <Reveal>
      <div className="relative -mx-6 md:-mx-16 my-16 py-14 px-6 md:px-16
        bg-[#080810] border-y border-white/[0.04]">
        <div className="max-w-[660px] mx-auto grid grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-[2.75rem] font-light tracking-tight text-white leading-none">
                {s.value}
              </div>
              <div className="mt-3 text-[11px] text-white/30 tracking-wide uppercase leading-relaxed">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
/* ── content blocks ── */
function renderSection(section: BlogPostType['content'][number], index: number) {
  switch (section.type) {
    case 'heading':
      return (
        <Reveal key={index}>
          <h2 className="text-xl md:text-2xl font-semibold text-white mt-16 mb-5 tracking-[-0.02em]">
            {section.text}
          </h2>
        </Reveal>
      );
    case 'paragraph':
      return (
        <Reveal key={index}>
          <p className="text-[15.5px] md:text-[16.5px] text-[#8a8a8a] leading-[1.8] mb-5">
            {section.text}
          </p>
        </Reveal>
      );
    case 'stat-row':
      return <StatStrip key={index} stats={section.stats!} />;
    case 'quote':
      return (
        <Reveal key={index}>
          <div className="my-14 py-10 border-y border-white/[0.06] text-center">
            <p className="text-lg md:text-xl text-white/80 italic leading-relaxed max-w-lg mx-auto font-light">
              &ldquo;{section.text}&rdquo;
            </p>
          </div>
        </Reveal>
      );
    case 'list':
      return (
        <Reveal key={index}>
          <ul className="my-6 space-y-3">
            {section.items!.map((item, j) => (
              <li key={j} className="flex items-start gap-3 text-[15.5px] text-[#8a8a8a] leading-[1.75]">
                <span className="mt-[11px] w-1.5 h-px bg-[#0066FF] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      );
    default:
      return null;
  }
}
/* ── main layout ── */
export default function BlogPost({ post }: { post: BlogPostType }) {
  return (
    <article className="overflow-hidden">
      {/* ── hero zone ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-[660px] mx-auto px-6 pt-8 md:pt-12"
      >
        <Link href="/blogg"
          className="text-[13px] text-white/25 hover:text-white/50 transition-colors">
          &larr; Blogg
        </Link>

        <div className="mt-12 mb-4 flex items-center gap-3">
          <span className="text-[11px] tracking-[0.08em] uppercase text-[#0066FF] font-medium">
            {post.tag}
          </span>
          <span className="w-3 h-px bg-white/15" />
          <span className="text-[12px] text-white/25">{post.date}</span>
          <span className="text-[12px] text-white/25">&middot;</span>
          <span className="text-[12px] text-white/25">{post.readTime}</span>
        </div>

        <h1 className="text-[1.75rem] md:text-[2.8rem] leading-[1.1] font-semibold text-white
          tracking-[-0.035em] mb-10 max-w-[580px]">
          {post.title}
        </h1>
      </motion.div>
      {/* ── visual divider — the "experience" moment ── */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full h-px bg-gradient-to-r from-transparent via-[#0066FF]/30 to-transparent mb-12"
      />

      {/* ── lede ── */}
      <div className="max-w-[660px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-[17px] md:text-[18px] text-white/55 leading-[1.8] mb-4">
            {post.content[0]?.text}
          </p>
          {post.content[1]?.type === 'paragraph' && (
            <p className="text-[17px] md:text-[18px] text-white/55 leading-[1.8] mb-4">
              {post.content[1]?.text}
            </p>
          )}
        </motion.div>
      </div>

      {/* ── body ── */}
      <div className="max-w-[660px] mx-auto px-6 md:px-16">
        {post.content.slice(2).map((section, i) => renderSection(section, i + 2))}
      </div>
      {/* ── CTA ── */}
      <Reveal className="max-w-[660px] mx-auto px-6 md:px-16 mt-20 pb-24 md:pb-32">
        <div className="relative py-12 px-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[#0066FF]/[0.04] border border-[#0066FF]/10 rounded-2xl" />
          <div className="relative">
            <p className="text-white text-lg font-medium mb-2">
              Klar til å teste?
            </p>
            <p className="text-white/40 text-[15px] leading-relaxed mb-6 max-w-sm">
              Vi setter opp AI-resepsjonisten din på 10 dager. Ingen lang kontrakt.
            </p>
            <Link href="/#kontakt"
              className="inline-flex text-[14px] text-white bg-[#0066FF] rounded-full
                px-7 py-2.5 font-medium hover:bg-[#0055DD] transition-colors duration-200">
              Kom i gang
            </Link>
          </div>
        </div>
      </Reveal>
    </article>
  );
}