'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { posts } from '@/lib/blog-data';

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function Blog() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">

      <motion.div initial="hidden" animate="visible" variants={fade} custom={0} className="mb-16">
        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">
          Blogg
        </h1>
        <p className="text-base text-white/50 max-w-lg">
          Innsikt om AI, automasjon og hvordan norske bedrifter kan jobbe smartere.
        </p>
      </motion.div>

      <div className="space-y-0">
        {posts.map((post, i) => (
          <motion.article key={post.slug} initial="hidden" whileInView="visible"
            viewport={{ once: true }} variants={fade} custom={i * 0.08}
            className="group py-8 border-t border-white/[0.08]"
          >
            <Link href={`/blogg/${post.slug}`} className="block">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] tracking-[0.15em] uppercase text-white/30 border border-white/10 rounded-full px-3 py-0.5">
                  {post.tag}
                </span>
                <span className="flex items-center gap-1 text-xs text-white/25">
                  <Clock size={12} />
                  {post.readTime}
                </span>
                <span className="text-xs text-white/25">{post.date}</span>
              </div>
              <h2 className="text-lg md:text-xl font-medium text-white group-hover:text-white/80 transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-white/45 leading-relaxed mb-3 max-w-2xl">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-white/40 group-hover:text-white/60 transition-colors">
                Les mer <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.article>
        ))}
      </div>

    </div>
  );
}
