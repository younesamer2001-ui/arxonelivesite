'use client';

import { motion } from 'framer-motion';
import Image from 'next/image'

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

interface DashboardShowcaseProps {
  lang?: 'no' | 'en';
}

export default function DashboardShowcase({ lang = 'no' }: DashboardShowcaseProps) {
  const t = content[lang];
  const imageSrc = lang === 'no' ? '/images/dashboard-no.jpg' : '/images/dashboard-en.jpg';

  return (
    <section className="relative py-12 md:py-24 px-6 bg-black">
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
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
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
          className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black"
        >
          <Image src="/images/dashboard-no.jpg" alt="Arxon Dashboard" width={1376} height={768} quality={80} priority={false} className="w-full h-auto bg-black" style={{backgroundColor: "black"}} />
        </motion.div>
      </div>
    </section>
  );
}
