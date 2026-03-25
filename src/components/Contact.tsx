'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

const content = {
  no: {
    title: 'Kontakt',
    subtitle: 'Klar til å automatisere? Book en gratis konsultasjon.',
    infoTitle: 'Kontaktinformasjon',
    guaranteeTitle: '30-dagers garanti',
    guaranteeText: 'Vi bygger løsningen din på 10 dager. Du betaler ingenting de første 30 dagene. Hvis du ikke ser verdi — betaler du ingenting.',
    formTitle: 'Book gratis konsultasjon',
    nameLabel: 'Navn',
    namePlaceholder: 'Ditt navn',
    emailLabel: 'E-post',
    emailPlaceholder: 'din@epost.no',
    companyLabel: 'Bedrift',
    companyPlaceholder: 'Din bedrift',
    messageLabel: 'Melding',
    messagePlaceholder: 'Fortell oss om dine behov...',
    submitButton: 'Send melding'
  },
  en: {
    title: 'Contact',
    subtitle: 'Ready to automate? Book a free consultation.',
    infoTitle: 'Contact Information',
    guaranteeTitle: '30-day guarantee',
    guaranteeText: 'We build your solution in 10 days. You pay nothing for the first 30 days. If you don\'t see value — you pay nothing.',
    formTitle: 'Book free consultation',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    companyLabel: 'Company',
    companyPlaceholder: 'Your company',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell us about your needs...',
    submitButton: 'Send message'
  }
}

interface ContactProps {
  lang?: 'no' | 'en'
}

export default function Contact({ lang = 'no' }: ContactProps) {
  const t = content[lang]
  
  return (
    <section className="relative py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-6">{t.infoTitle}</h3>
            
            <div className="space-y-4">
              <a href="mailto:younes@arxon.no" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Mail className="w-5 h-5 mr-4 text-white/50" />
                younes@arxon.no
              </a>
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 mr-4 text-white/50" />
                +47 XXX XX XXX
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 mr-4 text-white/50" />
                Oslo, Norge
              </div>
            </div>

            <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-semibold mb-2">{t.guaranteeTitle}</h4>
              <p className="text-sm text-gray-400">
                {t.guaranteeText}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-xl font-semibold mb-6">{t.formTitle}</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.nameLabel}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                  placeholder={t.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.emailLabel}</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                  placeholder={t.emailPlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.companyLabel}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                  placeholder={t.companyPlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.messageLabel}</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 resize-none"
                  placeholder={t.messagePlaceholder}
                />
              </div>
              <button className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center">
                {t.submitButton} <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
