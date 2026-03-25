'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const content = {
  no: {
    eyebrow: 'DASHBOARD',
    title: 'Full oversikt i sanntid',
    subtitle: 'Se alle samtaler, leads og konvertering i ett dashboard'
  },
  en: {
    eyebrow: 'DASHBOARD',
    title: 'Complete real-time overview',
    subtitle: 'See all calls, leads and conversions in one dashboard'
  }
};

interface DashboardImageProps {
  lang?: 'no' | 'en';
}

export default function DashboardImage({ lang = 'no' }: DashboardImageProps) {
  const t = content[lang];

  return (
    <section className="relative py-24 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold tracking-wider text-gray-500 mb-4 block">
            {t.eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {t.title}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Dashboard Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/10"
        >
          <Image
            src="/images/dashboard.jpg"
            alt="Arxon Dashboard"
            width={1200}
            height={800}
            className="w-full h-auto"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          {lang === 'no' 
            ? 'Dashboard tilpasses dine behov og integreres med dine systemer.'
            : 'Dashboard is customized to your needs and integrated with your systems.'}
        </motion.p>
      </div>
    </section>
  );
}
