'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ArrowRight, Loader2, CheckCircle } from 'lucide-react'

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
    phoneLabel: 'Telefon',
    phonePlaceholder: '+47 xxx xx xxx',
    messageLabel: 'Melding',
    messagePlaceholder: 'Fortell oss om dine behov...',
    submitButton: 'Send melding',
    sending: 'Sender...',
    successTitle: 'Melding sendt!',
    successText: 'Takk for din henvendelse. Vi tar kontakt innen 24 timer.',
    sendNewMessage: 'Send ny melding',
    errorText: 'Noe gikk galt. Prøv igjen eller send e-post direkte til Kontakt@arxon.no'
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
    phoneLabel: 'Phone',
    phonePlaceholder: '+47 xxx xx xxx',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell us about your needs...',
    submitButton: 'Send message',
    sending: 'Sending...',
    successTitle: 'Message sent!',
    successText: 'Thank you for your inquiry. We\'ll get back to you within 24 hours.',
    sendNewMessage: 'Send new message',
    errorText: 'Something went wrong. Try again or email us directly at Kontakt@arxon.no'
  }
}

interface ContactProps {
  lang?: 'no' | 'en'
}

export default function Contact({ lang = 'no' }: ContactProps) {
  const t = content[lang]
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          message: formData.message,
        }),
      })

      if (!response.ok) throw new Error('Failed to send')

      setStatus('success')
      setFormData({ name: '', email: '', company: '', phone: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="relative py-16 md:py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">{t.title}</h2>
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
              <a href="mailto:kontakt@arxon.no" className="flex items-center text-gray-300 hover:text-white transition-colors">
                <Mail className="w-5 h-5 mr-4 text-white/50" />
                kontakt@arxon.no
              </a>
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 mr-4 text-white/50" />
                +47 993 53 596
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
            className="p-4 md:p-8 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-lg md:text-xl font-semibold mb-6">{t.formTitle}</h3>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mb-4" />
                <h4 className="text-xl font-semibold mb-2">{t.successTitle}</h4>
                <p className="text-gray-400">{t.successText}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2 text-sm border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {t.sendNewMessage}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.nameLabel}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                    placeholder={t.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.emailLabel}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                    placeholder={t.emailPlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.companyLabel}</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                    placeholder={t.companyPlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
                    placeholder={t.phonePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">{t.messageLabel}</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 resize-none"
                    placeholder={t.messagePlaceholder}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-sm">{t.errorText}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t.sending}
                    </>
                  ) : (
                    <>
                      {t.submitButton} <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
