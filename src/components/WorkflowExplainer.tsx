'use client';

import { motion } from 'framer-motion';
import { WorkflowVisualizer } from './ui/workflow-visualizer';

const content = {
  no: {
    eyebrow: 'HVORDAN DET FUNGERER',
    title: 'Se hva som skjer bak kulissene',
    subtitle: 'Fra kunden ringer til møtet er booket — alt automatisk',
    cta: 'Prøv selv'
  },
  en: {
    eyebrow: 'HOW IT WORKS',
    title: 'See what happens behind the scenes',
    subtitle: 'From customer calls to booked meeting — all automatic',
    cta: 'Try it yourself'
  }
};

interface WorkflowExplainerProps {
  lang?: 'no' | 'en';
}

export default function WorkflowExplainer({ lang = 'no' }: WorkflowExplainerProps) {
  const t = content[lang];

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

        {/* Workflow Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <WorkflowVisualizer />
        </motion.div>


      </div>
    </section>
  );
}
