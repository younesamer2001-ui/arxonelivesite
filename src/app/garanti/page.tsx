'use client';

import { motion } from 'framer-motion';
import { NavBar } from '@/components/ui/tube-light-navbar';
import { Footer } from '@/components/ui/footer-section';
import { Home, Briefcase, Users, FileText, Mail, Check, Clock, Shield, Rocket, ArrowRight, CreditCard, Percent, Star, Package } from 'lucide-react';
import { SectionWrapper } from '@/components/SectionWrapper';

const navItems = [
  { name: 'Hjem', url: '/', icon: Home },
  { name: 'Tjenester', url: '/#ai-resepsjonister', icon: Briefcase },
  { name: 'Prosess', url: '/#prosess', icon: FileText },
  { name: 'Priser', url: '/#priser', icon: Users },
  { name: 'Kontakt', url: '/#kontakt', icon: Mail },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
    },
  },
};

export default function GarantiPage() {
  return (
    <main className="bg-black min-h-screen text-white overflow-x-hidden">
      <NavBar items={navItems} currentLang="no" onLangChange={() => {}} />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] bg-black overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          {/* Package Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium rounded-full">
              <Package className="w-4 h-4" />
              Kun for Pakke 1 — AI Resepsjonist
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Vår <span className="text-blue-400">garanti</span> til deg
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8"
          >
            10 dager oppsett. 50% depositum. 20 dager å evaluere. 
            Full refusjon hvis du ikke ser verdi.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>10 dager oppsett</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
              <Percent className="w-4 h-4 text-blue-400" />
              <span>50/50 betaling</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>20 dager garanti</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <SectionWrapper className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Slik fungerer det</h2>
            <p className="text-gray-400 text-lg">Ingen overraskelser. Ingen binding.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                step: '1',
                title: 'Avklaring',
                desc: 'Gratis samtale. Vi kartlegger dine behov.',
                color: 'bg-blue-500/20 text-blue-400'
              },
              {
                icon: Percent,
                step: '2',
                title: '50% Depositum',
                desc: 'Du betaler halvparten ved oppstart.',
                color: 'bg-purple-500/20 text-purple-400'
              },
              {
                icon: Rocket,
                step: '3',
                title: 'Oppsett',
                desc: 'Vi bygger din AI på 10 dager.',
                color: 'bg-emerald-500/20 text-emerald-400'
              },
              {
                icon: Shield,
                step: '4',
                title: 'Evaluering',
                desc: '20 dager å teste. Resten hvis fornøyd.',
                color: 'bg-orange-500/20 text-orange-400'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-sm text-gray-500 mb-2">Steg {item.step}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Payment Breakdown */}
      <SectionWrapper className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hva koster det?</h2>
            <p className="text-gray-400 text-lg">Pakke 1 — AI Resepsjonist</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* First Payment */}
            <motion.div
              className="p-8 rounded-2xl bg-white/5 border border-white/10"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Percent className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold">7 500 kr</div>
                  <div className="text-gray-400">Ved oppstart (dag 3)</div>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>50% av setup-fee</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Starter bygging av AI</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>20-dagers garanti starter</span>
                </li>
              </ul>
            </motion.div>

            {/* Second Payment */}
            <motion.div
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold">7 500 kr</div>
                  <div className="text-gray-400">Etter 20 dager</div>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Resterende 50% av setup</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Kun hvis du ser verdi</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>+ 4 990 kr/mnd starter</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Refund Note */}
          <motion.div 
            className="mt-8 p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-lg">
              <span className="text-orange-400 font-semibold">Ikke fornøyd?</span> Full refusjon av depositum (7 500 kr) innen 20 dager. Ingen spørsmål.
            </p>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Timeline */}
      <SectionWrapper className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tidslinje</h2>
            <p className="text-gray-400 text-lg">Dine første 20 dager med Arxon</p>
          </motion.div>

          <div className="space-y-4">
            {[
              { day: 'Dag 1-2', text: 'Gratis avklaringssamtale', sub: 'Ingen forpliktelser', highlight: false },
              { day: 'Dag 3', text: '50% depositum (7 500 kr)', sub: 'Garantiperiode starter', highlight: true },
              { day: 'Dag 3-10', text: 'Vi bygger din AI-resepsjonist', sub: 'Du får teste underveis', highlight: false },
              { day: 'Dag 10', text: 'AI går live i din bedrift', sub: 'Full integrasjon', highlight: false },
              { day: 'Dag 11-20', text: 'Evalueringsperiode', sub: 'Test, juster, mål resultater', highlight: false },
              { day: 'Dag 20', text: 'Beslutningstid', sub: 'Restbetaling eller full refusjon', highlight: true },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`flex items-center gap-6 p-5 rounded-xl ${item.highlight ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white/5 border border-white/10'}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className={`w-24 text-right font-bold ${item.highlight ? 'text-blue-400' : 'text-gray-500'}`}>
                  {item.day}
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex-1">
                  <div className={`font-medium ${item.highlight ? 'text-white' : 'text-gray-300'}`}>
                    {item.text}
                  </div>
                  <div className="text-sm text-gray-500">{item.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* What's Included */}
      <SectionWrapper className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hva er inkludert i Pakke 1?</h2>
            <p className="text-gray-400 text-lg">Alt du trenger for å komme i gang</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'AI telefon & chat',
              '24/7 tilgjengelighet',
              'Kalender-integrasjon',
              'CRM-tilkobling',
              'Norsk stemme',
              'Månedlig rapport',
              '20 dager support',
              'Ingen binding',
              'Full opplæring'
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium rounded-full mb-6">
              <Package className="w-4 h-4" />
              Kun for Pakke 1 — AI Resepsjonist
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Klar til å starte?</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Book en gratis avklaringssamtale. Ingen forpliktelser. Vi kartlegger dine behov og starter når du er klar.
            </p>
            <a
              href="/#kontakt"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-200 transition-all"
            >
              Book gratis samtale
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
