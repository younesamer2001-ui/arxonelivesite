'use client';

import { motion } from 'framer-motion';
import { NavBar } from '@/components/ui/tube-light-navbar';
import { Footer } from '@/components/ui/footer-section';
import { Home, Briefcase, Users, FileText, Mail, Check, Clock, Shield, Rocket, ArrowRight } from 'lucide-react';
import { SectionWrapper } from '@/components/SectionWrapper';

const navItems = [
  { name: 'Hjem', url: '/', icon: Home },
  { name: 'Tjenester', url: '/#ai-resepsjonister', icon: Briefcase },
  { name: 'Prosess', url: '/#prosess', icon: FileText },
  { name: 'Priser', url: '/#priser', icon: Users },
  { name: 'Kontakt', url: '/#kontakt', icon: Mail },
];

// Animation variants - matching landing page
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

export default function TenDayPromisePage() {
  return (
    <main className="bg-black min-h-screen text-white overflow-x-hidden">
      <NavBar items={navItems} currentLang="no" onLangChange={() => {}} />
      
      {/* Hero Section - Matching landing page style */}
      <section className="relative min-h-screen bg-black overflow-hidden pt-20">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-emerald-400 text-sm font-medium rounded-full">
              <Shield className="w-4 h-4" />
              10-Day Promise
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-center text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Din AI er klar på{' '}
            <span className="text-emerald-400">10 dager</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            variants={itemVariants}
            className="text-center text-lg md:text-xl text-gray-400 max-w-2xl mb-8"
          >
            10 dager oppsett + 30 dager gratis prøveperiode. 
            Ingen binding. Ingen risiko.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <a
              href="/#kontakt"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-200 transition-all"
            >
              Book gratis samtale
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#hvordan"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all"
            >
              Se hvordan det fungerer
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* What is Section */}
      <SectionWrapper className="py-24 px-6 border-t border-white/5">
        <div id="hvordan" className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Hva er <span className="text-emerald-400">10-Day Promise?</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-4">
                Vi lover å sette opp og integrere din AI-resepsjonist på kun 10 dager. 
                Fra første samtale til ferdig løsning i din bedrift.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Etter oppsettet får du 30 dager gratis prøveperiode. 
                Hvis du ikke ser verdi, betaler du ingenting.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <Clock className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <div className="text-5xl font-bold text-white">10</div>
                  <div className="text-gray-400">dager oppsett</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-blue-400" />
                </div>
                <div>
                  <div className="text-5xl font-bold text-white">30</div>
                  <div className="text-gray-400">dager gratis prøveperiode</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Steps Section */}
      <SectionWrapper className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Slik fungerer det</h2>
            <p className="text-gray-400 text-lg">Tre enkle steg til din AI-resepsjonist</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                day: 'Dag 1-2',
                title: 'Avklaring',
                description: '30-minutters samtale om dine behov. Vi setter opp kalender og CRM-integrasjon.',
                color: 'bg-blue-500/20 text-blue-400'
              },
              {
                icon: Rocket,
                day: 'Dag 3-10',
                title: 'Oppsett',
                description: 'Vi bygger og trener din AI-resepsjonist. Du får teste underveis.',
                color: 'bg-purple-500/20 text-purple-400'
              },
              {
                icon: Check,
                day: 'Dag 11-30',
                title: 'Testing',
                description: '30 dager med justeringer og support. Ser du ikke verdi? Betal ingenting.',
                color: 'bg-emerald-500/20 text-emerald-400'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mb-6`}>
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-sm font-medium text-gray-500 mb-2">{step.day}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Guarantee Section */}
      <SectionWrapper className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
              <Shield className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">30-dagers garanti</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Etter at vi har satt opp din AI på 10 dager, får du 30 dager gratis prøveperiode. 
              Hvis du ikke ser verdi, kan du avslutte uten kostnad. Ingen spørsmål. Ingen binding.
            </p>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Includes Section */}
      <SectionWrapper className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hva er inkludert?</h2>
            <p className="text-gray-400 text-lg">Alt du trenger for å komme i gang</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'AI telefon & chat',
              '24/7 tilgjengelighet',
              'Kalender-integrasjon',
              'CRM-tilkobling',
              'Norsk stemme',
              'Månedlig rapport',
              '30 dager support',
              'Ingen binding',
              'Full opplæring'
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 p-6 rounded-xl bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-lg">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Klar til å starte?</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Book en gratis avklaringssamtale. Vi kartlegger dine behov og starter innen 48 timer.
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
