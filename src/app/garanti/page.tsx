'use client';

import { motion } from 'framer-motion';
import { NavBar } from '@/components/ui/tube-light-navbar';
import { Footer } from '@/components/ui/footer-section';
import { Check, Clock, Shield, Rocket, ArrowRight, CreditCard, Percent, Star, Package } from 'lucide-react';
import { SectionWrapper } from '@/components/SectionWrapper';
import { navItems as sharedNavItems } from '@/lib/nav-items';
import { useLang } from '@/lib/lang-context';

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
  const { lang: currentLang, setLang: setCurrentLang } = useLang();
  const navItemsList = sharedNavItems[currentLang];

  return (
    <main className="bg-black min-h-screen text-white overflow-x-hidden">
      <NavBar items={navItemsList} currentLang={currentLang} onLangChange={setCurrentLang} />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] bg-black overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-500/5 via-transparent to-transparent" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          {/* Package Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-500/10 border border-zinc-500/30 text-zinc-400 text-sm font-medium rounded-full">
              <Package className="w-4 h-4" />
              Kun for Pakke 1 — AI Resepsjonist
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Vår <span className="text-zinc-400">leveransemodell</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8"
          >
            5 faser. Kartlegging og pilot først. Du ser resultater
            på ekte samtaler før full utrulling.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>5-fase gjennomføring</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
              <Percent className="w-4 h-4 text-zinc-400" />
              <span>Trinnvis betaling</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm">
              <Shield className="w-4 h-4 text-zinc-400" />
              <span>Pilot beviser verdi</span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">5-fase gjennomføring</h2>
            <p className="text-gray-400 text-lg">Strukturert, forutsigbart og bevist med data.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                step: '1',
                title: 'Kartlegging',
                desc: 'Oppstartsmøte, systemer, FAQ og pilotplan.',
                color: 'bg-zinc-500/20 text-zinc-400'
              },
              {
                icon: Rocket,
                step: '2',
                title: 'Pilot',
                desc: 'AI-agent på 2 lokasjoner med ekte samtaler.',
                color: 'bg-zinc-500/20 text-zinc-500'
              },
              {
                icon: Star,
                step: '3',
                title: 'Evaluering',
                desc: 'Gjennomgang av pilotresultater og tall.',
                color: 'bg-zinc-500/20 text-zinc-500'
              },
              {
                icon: Shield,
                step: '4',
                title: 'Utrulling',
                desc: 'Full utrulling til alle lokasjoner.',
                color: 'bg-zinc-500/20 text-zinc-400'
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
            {/* Phase 1 Payment */}
            <motion.div
              className="p-8 rounded-2xl bg-white/5 border border-white/10"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-500/20 flex items-center justify-center">
                  <Percent className="w-8 h-8 text-zinc-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold">1/3 av oppstart</div>
                  <div className="text-gray-400">Ved kartlegging + pilot</div>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-zinc-500" />
                  <span>Kartlegging av bedriften</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-zinc-500" />
                  <span>Pilot på 2 lokasjoner</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-zinc-500" />
                  <span>Ekte samtaler og resultater</span>
                </li>
              </ul>
            </motion.div>

            {/* Phase 2 Payment */}
            <motion.div
              className="p-8 rounded-2xl bg-gradient-to-br from-zinc-500/10 to-zinc-500/10 border border-zinc-500/20"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-500/20 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-zinc-500" />
                </div>
                <div>
                  <div className="text-3xl font-bold">2/3 av oppstart</div>
                  <div className="text-gray-400">Ved full utrulling</div>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-zinc-500" />
                  <span>Etter positiv pilotevaluering</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-zinc-500" />
                  <span>Full utrulling til alle lokasjoner</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-zinc-500" />
                  <span>+ månedlig abonnement starter</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Pilot Note */}
          <motion.div
            className="mt-8 p-6 rounded-2xl bg-zinc-500/10 border border-zinc-500/20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-lg">
              <span className="text-zinc-400 font-semibold">Pilot beviser verdien.</span> Du ser konkrete resultater på ekte samtaler og bookinger før du betaler for full utrulling.
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
            <p className="text-gray-400 text-lg">Fra kartlegging til full utrulling</p>
          </motion.div>

          <div className="space-y-4">
            {[
              { day: 'Uke 1-2', text: 'Kartlegging', sub: 'Oppstartsmøte, systemer, FAQ, pilotplan', highlight: true },
              { day: 'Uke 2-4', text: 'Pilot på 2 lokasjoner', sub: 'AI-agent testes med ekte samtaler', highlight: false },
              { day: 'Uke 4-5', text: 'Evaluering', sub: 'Gjennomgang av tall og resultater', highlight: true },
              { day: 'Uke 5-7', text: 'Full utrulling', sub: 'Alle lokasjoner, chatbot, dashboard', highlight: false },
              { day: 'Løpende', text: 'Optimalisering', sub: 'Månedlige gjennomganger og forbedring', highlight: false },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`flex items-center gap-6 p-5 rounded-xl ${item.highlight ? 'bg-zinc-500/10 border border-zinc-500/20' : 'bg-white/5 border border-white/10'}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className={`w-24 text-right font-bold ${item.highlight ? 'text-zinc-400' : 'text-gray-500'}`}>
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
              'Løpende support',
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
                <Check className="w-5 h-5 text-zinc-400 flex-shrink-0" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-500/10 border border-zinc-500/30 text-zinc-400 text-sm font-medium rounded-full mb-6">
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
