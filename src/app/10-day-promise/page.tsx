'use client';

import { motion } from 'framer-motion';
import { NavBar } from '@/components/ui/tube-light-navbar';
import { Footer } from '@/components/ui/footer-section';
import { Home, Briefcase, Users, FileText, Mail, Check, Clock, Shield, Rocket, Sparkles, ArrowRight } from 'lucide-react';

const navItems = [
  { name: 'Hjem', url: '/', icon: Home },
  { name: 'Tjenester', url: '/#ai-resepsjonister', icon: Briefcase },
  { name: 'Prosess', url: '/#prosess', icon: FileText },
  { name: 'Priser', url: '/#priser', icon: Users },
  { name: 'Kontakt', url: '/#kontakt', icon: Mail },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function TenDayPromisePage() {
  return (
    <main className="bg-black min-h-screen text-white overflow-x-hidden">
      <NavBar items={navItems} currentLang="no" onLangChange={() => {}} />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-32 pb-20 px-6">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <motion.div 
          className="relative max-w-5xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30 text-blue-400 text-sm font-semibold rounded-full">
              <Sparkles className="w-4 h-4" />
              10-Day Promise
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            Din AI er klar på{' '}
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              10 dager
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12"
          >
            10 dager oppsett + 30 dager gratis prøveperiode. Ingen binding. Ingen risiko.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#kontakt"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25"
            >
              Start nå
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#hvordan"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Se hvordan det fungerer
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* What is Section */}
      <section id="hvordan" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Hva er{' '}
                <span className="text-blue-400">10-Day Promise?</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed mb-6">
                Vi lover å sette opp og integrere din AI-resepsjonist på kun 10 dager. Fra første samtale til ferdig løsning i din bedrift.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Etter oppsettet får du 30 dager gratis prøveperiode. Hvis du ikke ser verdi, betaler du ingenting.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl blur-2xl" />
              <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">10</div>
                    <div className="text-gray-400">dager</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Ingen binding</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Ingen risiko</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Full refusjon hvis ikke fornøyd</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Slik fungerer det</h2>
            <p className="text-gray-400 text-lg">Tre enkle steg til din AI-resepsjonist</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                day: 'Dag 1-2',
                title: 'Avklaring',
                description: '30-minutters samtale om dine behov. Vi setter opp kalender og CRM-integrasjon.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Rocket,
                day: 'Dag 3-10',
                title: 'Oppsett',
                description: 'Vi bygger og trener din AI-resepsjonist. Du får teste underveis.',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: Check,
                day: 'Dag 11-30',
                title: 'Testing',
                description: '30 dager med justeringer og support. Ser du ikke verdi? Betal ingenting.',
                color: 'from-emerald-500 to-emerald-600'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-500 mb-2">{step.day}</div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="relative p-12 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 border border-emerald-500/20 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-3xl" />
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/25">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4">30-dagers garanti</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Etter at vi har satt opp din AI på 10 dager, får du 30 dager gratis prøveperiode. 
                Hvis du ikke ser verdi, kan du avslutte uten kostnad. Ingen spørsmål. Ingen binding.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Includes Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Hva er inkludert?</h2>
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
                className="flex items-center gap-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-lg font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Klar til å starte?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Book en gratis avklaringssamtale. Vi kartlegger dine behov og starter innen 48 timer.
            </p>
            <a
              href="/#kontakt"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25"
            >
              Book gratis samtale
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
