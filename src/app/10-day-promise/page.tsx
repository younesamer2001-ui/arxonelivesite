'use client';

import { motion } from 'framer-motion';
import { NavBar } from '@/components/ui/tube-light-navbar';
import { Footer } from '@/components/ui/footer-section';
import { Home, Briefcase, Users, FileText, Mail, Check, Clock, Shield, Rocket, ArrowRight, CreditCard, Percent } from 'lucide-react';
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
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        
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
              50/50 Depositum + 20-Dagers Garanti
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
            50% depositum ved oppstart. 50% etter 20 dager. 
            Full refusjon hvis du ikke ser verdi.
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

      {/* Payment Model Section */}
      <SectionWrapper className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">50/50 Depositum-modell</h2>
            <p className="text-gray-400 text-lg">Delt risiko. Delt tillit.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
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
                  <div className="text-3xl font-bold">50%</div>
                  <div className="text-gray-400">Ved oppstart</div>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Etter avklaringssamtale</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Starter 20-dagers garanti</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Vi begynner oppsettet</span>
                </li>
              </ul>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="p-8 rounded-2xl bg-white/5 border border-white/10"
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
                  <div className="text-3xl font-bold">50%</div>
                  <div className="text-gray-400">Etter 20 dager</div>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Kun hvis du ser verdi</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Ikke fornøyd? Full refusjon</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Ingen spørsmål</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

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
                Med 50/50 depositum-modellen deler vi risikoen. Du betaler halvparten ved oppstart, 
                resten etter 20 dager - kun hvis du ser verdi.
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
                  <div className="text-5xl font-bold text-white">20</div>
                  <div className="text-gray-400">dager pengene-tilbake</div>
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
            <p className="text-gray-400 text-lg">Fra samtale til ferdig AI på 10 dager</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                day: 'Dag 1-2',
                title: 'Avklaring',
                description: 'Gratis 30-minutters samtale. Vi kartlegger dine behov og setter opp avtale.',
                color: 'bg-blue-500/20 text-blue-400'
              },
              {
                icon: Percent,
                day: 'Dag 3',
                title: '50% Depositum',
                description: 'Du betaler 50% ved oppstart. Nå starter 20-dagers garantiperioden.',
                color: 'bg-purple-500/20 text-purple-400'
              },
              {
                icon: Rocket,
                day: 'Dag 3-10',
                title: 'Oppsett',
                description: 'Vi bygger og integrerer din AI. Du får teste underveis.',
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
            className="p-12 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 border border-emerald-500/20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
              <Shield className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">20-dagers pengene-tilbake-garanti</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
              Du betaler 50% ved oppstart. Etter 20 dager betaler du resten - 
              kun hvis du ser verdi. Hvis ikke, får du full refusjon av depositumet.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
                <Check className="w-4 h-4 text-emerald-400" />
                Full refusjon av 50%
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
                <Check className="w-4 h-4 text-emerald-400" />
                Ingen spørsmål
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
                <Check className="w-4 h-4 text-emerald-400" />
                Ingen binding
              </span>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Timeline Section */}
      <SectionWrapper className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tidslinje</h2>
            <p className="text-gray-400 text-lg">Slik ser de første 20 dagene ut</p>
          </motion.div>

          <div className="space-y-6">
            {[
              { day: 'Dag 1-2', text: 'Gratis avklaringssamtale', highlight: false },
              { day: 'Dag 3', text: '50% depositum + oppstart', highlight: true },
              { day: 'Dag 3-10', text: 'Oppsett og integrasjon', highlight: false },
              { day: 'Dag 10', text: 'AI går live', highlight: false },
              { day: 'Dag 11-20', text: 'Testing og evaluering', highlight: false },
              { day: 'Dag 20', text: 'Restbetaling (eller full refusjon)', highlight: true },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`flex items-center gap-6 p-6 rounded-2xl ${item.highlight ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5 border border-white/10'}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className={`w-20 text-right font-bold ${item.highlight ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {item.day}
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className={`text-lg ${item.highlight ? 'text-white font-medium' : 'text-gray-300'}`}>
                  {item.text}
                </div>
              </motion.div>
            ))}
          </div>
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
              '20 dager support',
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
