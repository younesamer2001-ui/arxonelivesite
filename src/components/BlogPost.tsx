'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, Clock, Copy, Check } from 'lucide-react';
import type { BlogPost as BlogPostType } from '@/lib/blog-data';
import { posts } from '@/lib/blog-data';
import { blogInfographics } from './BlogInfographics';

/* ── scroll reveal ── */
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

/* ── stat strip ── */
function StatStrip({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <Reveal>
      <div className="my-10 md:my-14">
        <div className={`grid gap-3 ${stats.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : stats.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          {stats.map((s, i) => (
            <div key={s.label}
              className="relative group rounded-xl border border-white/[0.06] bg-white/[0.02]
                px-5 py-6 text-center overflow-hidden">
              {/* subtle top accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-[#0066FF]/40" />
              <div className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-white whitespace-nowrap leading-none">
                {s.value}
              </div>
              <div className="mt-2.5 text-[10.5px] text-white/30 tracking-[0.1em] uppercase leading-relaxed">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ── mid-article CTA ── */
function MidCTA() {
  return (
    <Reveal>
      <div className="my-14 p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]
        flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex-1">
          <p className="text-[14px] font-medium text-white/80 mb-1">Vil du se dette i praksis?</p>
          <p className="text-[13px] text-white/30">Vi setter opp en gratis demo tilpasset din bedrift.</p>
        </div>
        <a href="https://cal.com/arxon/30min" target="_blank" rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 text-[13px] font-medium text-[#0066FF]
            px-5 py-2.5 rounded-full border border-[#0066FF]/20 hover:bg-[#0066FF]/10 transition-colors">
          Book demo <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </Reveal>
  );
}

/* ── reading progress bar ── */
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#0066FF] origin-left z-50"
      style={{ scaleX }} />
  );
}

/* ── copy link button ── */
function CopyLink() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy}
      className="inline-flex items-center gap-2 text-[12px] text-white/25 hover:text-white/50 transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Kopiert!' : 'Kopier lenke'}
    </button>
  );
}

/* ── content blocks ── */
function renderSection(section: BlogPostType['content'][number], index: number, totalSections: number) {
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

/* ── related posts ── */
function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const others = posts.filter((p) => p.slug !== currentSlug).slice(0, 2);
  if (others.length === 0) return null;

  return (
    <Reveal className="max-w-[660px] mx-auto px-6 md:px-16 mt-16 mb-8">
      <div className="border-t border-white/[0.06] pt-12">
        <p className="text-[11px] uppercase tracking-[0.15em] text-white/25 mb-8">Les også</p>
        <div className="grid sm:grid-cols-2 gap-5">
          {others.map((p) => (
            <Link key={p.slug} href={`/blogg/${p.slug}`}
              className="group p-5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.03] transition-all">
              <span className="text-[11px] text-[#0066FF]/60 font-medium">{p.tag}</span>
              <h3 className="text-[14px] font-medium text-white/80 mt-2 mb-2 leading-snug group-hover:text-white transition-colors">
                {p.title}
              </h3>
              <span className="flex items-center gap-1 text-[11px] text-white/20">
                <Clock className="w-3 h-3" /> {p.readTime}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════════════════════════════════
   MAIN LAYOUT
   ═══════════════════════════════════════════ */
export default function BlogPost({ post }: { post: BlogPostType }) {
  /* count leading paragraphs as the lede (max 2) */
  let ledeCount = 0;
  for (let i = 0; i < Math.min(2, post.content.length); i++) {
    if (post.content[i]?.type === 'paragraph') ledeCount++;
    else break;
  }
  const bodyContent = post.content.slice(ledeCount);
  const midPoint = Math.floor(bodyContent.length / 2);

  return (
    <article className="overflow-hidden">
      <ReadingProgress />

      {/* ── hero zone ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-[660px] mx-auto px-6 pt-8 md:pt-12"
      >
        <Link href="/blogg"
          className="inline-flex items-center gap-1.5 text-[13px] text-white/25 hover:text-white/50 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Blogg
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
          tracking-[-0.035em] mb-6 max-w-[580px]">
          {post.title}
        </h1>

        {/* share row */}
        <div className="flex items-center gap-4 mb-10">
          <CopyLink />
        </div>
      </motion.div>

      {/* ── hero image ── */}
      {post.image && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-[740px] mx-auto px-6 mb-2"
        >
          <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden border border-white/[0.06]">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          </div>
        </motion.div>
      )}

      {/* ── infographic ── */}
      {(() => {
        const Infographic = blogInfographics[post.slug];
        return Infographic ? (
          <div className="max-w-[660px] mx-auto px-6">
            <Infographic />
          </div>
        ) : null;
      })()}

      {/* ── visual divider ── */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="w-full h-px bg-gradient-to-r from-transparent via-[#0066FF]/30 to-transparent mb-12"
      />

      {/* ── lede ── */}
      <div className="max-w-[660px] mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}>
          {post.content.slice(0, ledeCount).map((s, i) => (
            <p key={i} className="text-[17px] md:text-[18px] text-white/55 leading-[1.8] mb-4">
              {s.text}
            </p>
          ))}
        </motion.div>
      </div>

      {/* ── body — first half ── */}
      <div className="max-w-[660px] mx-auto px-6 md:px-16">
        {bodyContent.slice(0, midPoint).map((section, i) =>
          renderSection(section, i + 2, bodyContent.length)
        )}
      </div>

      {/* ── mid-article CTA ── */}
      <div className="max-w-[660px] mx-auto px-6 md:px-16">
        <MidCTA />
      </div>

      {/* ── body — second half ── */}
      <div className="max-w-[660px] mx-auto px-6 md:px-16">
        {bodyContent.slice(midPoint).map((section, i) =>
          renderSection(section, i + midPoint + 2, bodyContent.length)
        )}
      </div>

      {/* ── bottom CTA ── */}
      <Reveal className="max-w-[660px] mx-auto px-6 md:px-16 mt-20">
        <div className="relative py-10 md:py-12 px-5 sm:px-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[#0066FF]/[0.04] border border-[#0066FF]/10 rounded-2xl" />
          <div className="relative text-center">
            <p className="text-white text-lg font-medium mb-2">
              Klar til å teste?
            </p>
            <p className="text-white/40 text-[15px] leading-relaxed mb-6 max-w-sm mx-auto">
              Vi setter opp AI-resepsjonisten din med kartlegging og pilot først. Strukturert leveranse.
            </p>
            <a href="https://cal.com/arxon/30min" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[14px] text-white bg-[#0066FF] rounded-full
                px-7 py-2.5 font-medium hover:bg-[#0055DD] transition-colors duration-200">
              Kom i gang <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </Reveal>

      {/* ── related posts ── */}
      <RelatedPosts currentSlug={post.slug} />

      {/* ── back to blog ── */}
      <div className="max-w-[660px] mx-auto px-6 md:px-16 pb-24 md:pb-32">
        <Link href="/blogg"
          className="inline-flex items-center gap-1.5 text-[13px] text-white/25 hover:text-white/50 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Tilbake til alle artikler
        </Link>
      </div>
    </article>
  );
}
