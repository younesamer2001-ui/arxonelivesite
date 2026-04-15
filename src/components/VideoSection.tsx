'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, Pause } from 'lucide-react'

interface VideoSectionProps {
  lang?: 'no' | 'en'
}

const content = {
  no: {
    label: 'Se hvordan det fungerer',
    heading: 'AI som jobber',
    headingAccent: 'for deg.',
    subtext: 'Se hvordan Arxon svarer telefonen, booker kunder og gir deg full oversikt — alt automatisk.',
    cta: 'Spill av video',
    duration: '2 min',
    scrollHint: 'Scroll for å utforske',
  },
  en: {
    label: 'See how it works',
    heading: 'AI that works',
    headingAccent: 'for you.',
    subtext: 'Watch how Arxon answers the phone, books customers and gives you full visibility — all automatically.',
    cta: 'Play video',
    duration: '2 min',
    scrollHint: 'Scroll to explore',
  },
}

export default function VideoSection({ lang = 'no' }: VideoSectionProps) {
  const t = content[lang]
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Scroll-driven expansion
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Video container expands from ~60% to 100% width as you scroll
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.5], [0.65, 0.85, 1])
  const borderRadius = useTransform(scrollYProgress, [0, 0.3, 0.5], [32, 20, 12])
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1])

  // Text fades and moves up
  const textY = useTransform(scrollYProgress, [0.05, 0.25], [40, 0])
  const textOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1])

  // Background gradient shifts
  const bgOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 0.6])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 bg-white overflow-hidden"
    >
      {/* Background gradient that fades in on scroll */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-white via-zinc-50 to-white"
        style={{ opacity: bgOpacity }}
      />

      {/* Ambient glow orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{
          opacity: bgOpacity,
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{
          opacity: bgOpacity,
          background: 'radial-gradient(circle, rgba(147,51,234,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          style={{ y: textY, opacity: textOpacity }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 uppercase tracking-wider mb-4">
            <span className="w-6 h-px bg-zinc-900" />
            {t.label}
            <span className="w-6 h-px bg-zinc-900" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900">
            {t.heading} <span className="gradient-text-accent">{t.headingAccent}</span>
          </h2>
          <p className="mt-5 text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            {t.subtext}
          </p>
        </motion.div>

        {/* Scroll-expanding video container */}
        <div className="flex justify-center">
          <motion.div
            className="relative w-full max-w-5xl"
            style={{ scale, opacity }}
          >
            {/* Glow behind video — visible on hover */}
            <div className="absolute -inset-4 bg-gradient-to-r from-zinc-800/10 via-zinc-500/10 to-zinc-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Shadow layer */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-br from-zinc-800/5 to-zinc-500/5 pointer-events-none"
              style={{ borderRadius }}
            />

            {/* Main video container */}
            <motion.div
              className="relative overflow-hidden border border-zinc-200/80 shadow-2xl shadow-zinc-300/30 bg-white p-1.5 group"
              style={{ borderRadius }}
            >
              <motion.div
                className="overflow-hidden bg-zinc-900 relative"
                style={{
                  borderRadius: useTransform(borderRadius, (v) => v - 4),
                  aspectRatio: '16/9',
                }}
              >
                {/* Video placeholder — dark gradient with animated mesh */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
                  {/* Animated grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px',
                    }}
                  />

                  {/* Animated gradient sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-400/5 to-transparent animate-shimmer" />

                  {/* Glow spots */}
                  <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-zinc-800/10 rounded-full blur-[80px]" />
                  <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-zinc-500/8 rounded-full blur-[60px]" />
                </div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="relative inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-110 group/btn"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 md:w-10 md:h-10 text-white" fill="white" />
                    ) : (
                      <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
                    )}
                    {/* Ping animation */}
                    <span className="absolute inset-0 rounded-full animate-ping bg-white/10" style={{ animationDuration: '2.5s' }} />
                  </button>
                </div>

                {/* Bottom info bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-white/70 text-sm font-medium">{t.cta}</span>
                      <span className="text-white/30">·</span>
                      <span className="text-white/40 text-sm">{t.duration}</span>
                    </div>
                    {/* Fake progress bar */}
                    <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-zinc-600 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-sm text-white/60 text-xs font-medium">
                    LIVE DEMO
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
