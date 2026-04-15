'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { NavBar } from "@/components/ui/tube-light-navbar"
import { Footer } from "@/components/ui/footer-section"
import Image from 'next/image'
import { ArrowRight, Clock, Sparkles } from 'lucide-react'
import { navItems } from "@/lib/nav-items"
import { useLang } from "@/lib/lang-context"
import { posts } from '@/lib/blog-data'
import Link from 'next/link'

const t = {
  no: {
    featured: 'Fremhevet artikkel',
    readArticle: 'Les artikkel',
    allArticles: 'Alle artikler',
    subtitle: 'Innsikt om AI, automasjon og norske SMB-er.',
    readMore: 'Les mer',
    noArticles: 'Ingen artikler i denne kategorien ennå.',
    ctaTitle: 'Ikke miss neste innsikt',
    ctaDesc: 'Vi skriver om AI, automasjon og hvordan norske bedrifter jobber smartere. Kort, praktisk, ingen spam.',
    ctaBtn: 'Kom i gang',
    categories: [
      { id: 'all', label: 'Alle' },
      { id: 'ai', label: 'AI & Teknologi' },
      { id: 'business', label: 'Forretning' },
      { id: 'guides', label: 'Guider' },
    ],
  },
  en: {
    featured: 'Featured article',
    readArticle: 'Read article',
    allArticles: 'All articles',
    subtitle: 'Insights on AI, automation and Norwegian SMBs.',
    readMore: 'Read more',
    noArticles: 'No articles in this category yet.',
    ctaTitle: "Don't miss the next insight",
    ctaDesc: 'We write about AI, automation and how Norwegian businesses work smarter. Short, practical, no spam.',
    ctaBtn: 'Get started',
    categories: [
      { id: 'all', label: 'All' },
      { id: 'ai', label: 'AI & Technology' },
      { id: 'business', label: 'Business' },
      { id: 'guides', label: 'Guides' },
    ],
  },
}

const tagColors: Record<string, string> = {
  AI: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Resultater: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Marked: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
}

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function BloggPage() {
  const { lang: currentLang, setLang: setCurrentLang } = useLang()
  const [activeCategory, setActiveCategory] = useState('all')
  const items = navItems[currentLang]

  const txt = t[currentLang]
  const categories = txt.categories
  const featured = posts.find((p) => p.featured)
  const filtered = activeCategory === 'all'
    ? posts.filter((p) => !p.featured)
    : posts.filter((p) => p.category === activeCategory && !p.featured)

  return (
    <main className="bg-black min-h-screen text-white">
      <NavBar items={items} currentLang={currentLang} onLangChange={setCurrentLang} />

      {/* ── Hero — Featured ── */}
      {featured && (
        <section className="relative mt-20 overflow-hidden">
          {/* glow */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#0066FF]/[0.03] rounded-full blur-[150px] pointer-events-none" />

          <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
            <motion.div initial="hidden" animate="visible" variants={fade} custom={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0066FF]/10 border border-[#0066FF]/20
                rounded-full text-[#0066FF] text-[12px] font-medium mb-8">
                <Sparkles className="w-3.5 h-3.5" /> {txt.featured}
              </div>
            </motion.div>

            <motion.h1 initial="hidden" animate="visible" variants={fade} custom={0.1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-5 max-w-3xl"
              style={{ fontFamily: 'var(--font-grift), sans-serif' }}
            >
              {featured.title}
            </motion.h1>

            <motion.p initial="hidden" animate="visible" variants={fade} custom={0.2}
              className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
              {featured.excerpt}
            </motion.p>

            <motion.div initial="hidden" animate="visible" variants={fade} custom={0.3}
              className="flex items-center gap-5">
              <Link href={`/blogg/${featured.slug}`}
                className="group inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black
                  rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors">
                {txt.readArticle} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <span className="flex items-center gap-1.5 text-zinc-500 text-sm">
                <Clock className="w-3.5 h-3.5" /> {featured.readTime}
              </span>
              <span className="text-zinc-600 text-sm hidden sm:block">{featured.date}</span>
            </motion.div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </section>
      )}

      {/* ── Articles ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2"
              style={{ fontFamily: 'var(--font-grift), sans-serif' }}>
              {txt.allArticles}
            </h2>
            <p className="text-zinc-500 text-sm">{txt.subtitle}</p>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-10 border-b border-white/[0.06]">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* article cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((post, i) => {
            const colors = tagColors[post.tag] ?? 'text-zinc-400 bg-white/5 border-white/10'
            return (
              <motion.div key={post.slug} initial="hidden" whileInView="visible"
                viewport={{ once: true }} variants={fade} custom={i * 0.08}>
                <Link href={`/blogg/${post.slug}`}
                  className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02]
                    hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300 overflow-hidden">
                  {post.image && (
                    <div className="relative w-full aspect-[2/1] overflow-hidden">
                      <Image src={post.image} alt={post.title} fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${colors}`}>
                      {post.tag}
                    </span>
                    <span className="text-[12px] text-zinc-600">{post.date}</span>
                    <span className="flex items-center gap-1 text-[12px] text-zinc-600 ml-auto">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-white group-hover:text-[#0066FF] transition-colors mb-2 tracking-tight leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[13px] font-medium text-white/30
                    group-hover:text-[#0066FF] transition-colors">
                    {txt.readMore} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500">{txt.noArticles}</p>
          </div>
        )}
      </section>

      {/* ── Newsletter / CTA section ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/[0.06] to-transparent border border-[#0066FF]/10 rounded-2xl" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066FF]/[0.04] rounded-full blur-[80px] pointer-events-none" />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">{txt.ctaTitle}</h3>
              <p className="text-[14px] text-white/40 leading-relaxed max-w-md">
                {txt.ctaDesc}
              </p>
            </div>
            <a href="https://cal.com/arxon/30min" target="_blank" rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-black
                rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors">
              {txt.ctaBtn} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
