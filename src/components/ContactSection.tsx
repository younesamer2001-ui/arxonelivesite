'use client'

import { useRef, useState } from 'react'
import ScrollPang from './ScrollPang'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'

interface ContactSectionProps {
  lang?: 'no' | 'en'
}

const content = {
  no: {
    label: 'Kom i gang',
    heading: 'Klar til å fange opp',
    headingAccent: 'hver eneste kunde?',
    subtext: 'Book en gratis 15-minutters konsultasjon. Vi viser deg nøyaktig hvor mye verdi du går glipp av i dag — og hvordan Arxon løser det.',
    form: {
      name: 'Navn',
      namePh: 'Ditt navn',
      email: 'E-post',
      emailPh: 'din@epost.no',
      phone: 'Telefon (valgfritt)',
      phonePh: '+47 000 00 000',
      message: 'Melding',      messagePh: 'Fortell oss litt om bedriften din og hva du trenger hjelp med',
      submit: 'Send melding',
      sending: 'Sender...',
      success: 'Melding sendt! Vi svarer innen 24 timer.',
      error: 'Noe gikk galt. Prøv igjen eller send e-post til kontakt@arxon.no',
    },
    info: [
      { icon: Mail, label: 'E-post', value: 'kontakt@arxon.no' },
      { icon: Phone, label: 'Telefon', value: '+47 78 89 63 86' },
      { icon: MapPin, label: 'Org.nr', value: '837 230 012' },
    ],
    trust: ['Gratis konsultasjon', 'Ingen bindingstid', '30 dagers pengene-tilbake'],
  },
  en: {
    label: 'Get started',
    heading: 'Ready to capture',
    headingAccent: 'every single customer?',
    subtext: "Book a free 15-minute consultation. We'll show you exactly how much value you're missing today — and how Arxon solves it.",
    form: {
      name: 'Name',
      namePh: 'Your name',
      email: 'Email',
      emailPh: 'you@example.com',
      phone: 'Phone (optional)',
      phonePh: '+47 000 00 000',
      message: 'Message',
      messagePh: 'Tell us about your business and what you need help with',
      submit: 'Send message',
      sending: 'Sending...',      success: "Message sent! We'll reply within 24 hours.",
      error: 'Something went wrong. Try again or email kontakt@arxon.no',
    },
    info: [
      { icon: Mail, label: 'Email', value: 'kontakt@arxon.no' },
      { icon: Phone, label: 'Phone', value: '+47 78 89 63 86' },
      { icon: MapPin, label: 'Org no.', value: '837 230 012' },
    ],
    trust: ['Free consultation', 'No lock-in', '30-day money-back guarantee'],
  },
}

export default function ContactSection({ lang = 'no' }: ContactSectionProps) {
  const t = content[lang]
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')

    const formData = new FormData(formRef.current!)
    const name = formData.get('from_name') as string
    const email = formData.get('from_email') as string
    const phone = formData.get('phone') as string
    const message = formData.get('message') as string

    try {
      // Go through server-side API so service-role writes bypass RLS + notify via Resend
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || null, message }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error('Contact API error:', err)
        setStatus('error')
        return
      }

      setStatus('success')
      formRef.current?.reset()
    } catch (err) {
      console.error('Contact submit error:', err)
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="kontakt" className="relative py-16 md:py-36 bg-black overflow-hidden">
      <div className="section-divider absolute top-0 left-1/2 -translate-x-1/2 w-2/3" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-zinc-800/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Info */}
          <ScrollPang>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
                <span className="w-6 h-px bg-zinc-900" />
                {t.label}
              </span>

              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                {t.heading}
                <br />
                <span className="gradient-text-accent">{t.headingAccent}</span>
              </h2>

              <p className="mt-5 text-lg text-zinc-300 leading-relaxed max-w-md">
                {t.subtext}
              </p>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap gap-3">
                {t.trust.map((item, i) => (
                  <div key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 text-sm text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
              {/* Contact info */}
              <div className="mt-12 space-y-4">
                {t.info.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-zinc-700 flex items-center justify-center group-hover:bg-zinc-600 transition-colors duration-300">
                      <item.icon className="w-4 h-4 text-zinc-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-300 uppercase tracking-wider font-medium">{item.label}</div>
                      <div className="text-white font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
          </ScrollPang>

          {/* Right: Form */}
          <ScrollPang offset={1}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="relative p-5 sm:p-8 md:p-10 rounded-2xl bg-zinc-900/80 border border-zinc-700 backdrop-blur-sm"
            >
              <div className="space-y-5">
                <div>
                  <Label htmlFor="from_name" className="text-zinc-300 text-sm font-medium">{t.form.name}</Label>
                  <Input
                    id="from_name"                    name="from_name"
                    type="text"
                    placeholder={t.form.namePh}
                    required
                    className="mt-2 h-12 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 rounded-xl focus:border-zinc-500 focus:ring-zinc-800"
                  />
                </div>
                <div>
                  <Label htmlFor="from_email" className="text-zinc-300 text-sm font-medium">{t.form.email}</Label>
                  <Input
                    id="from_email"
                    name="from_email"
                    type="email"
                    placeholder={t.form.emailPh}
                    required
                    className="mt-2 h-12 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 rounded-xl focus:border-zinc-500 focus:ring-zinc-800"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-zinc-300 text-sm font-medium">{t.form.phone}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={t.form.phonePh}
                    className="mt-2 h-12 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 rounded-xl focus:border-zinc-500 focus:ring-zinc-800"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-zinc-300 text-sm font-medium">{t.form.message}</Label>                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t.form.messagePh}
                    required
                    rows={4}
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 resize-none rounded-xl focus:border-zinc-500 focus:ring-zinc-800"
                  />
                </div>
              </div>

              {status === 'success' && (
                <div className="mt-5 flex items-center gap-2.5 p-4 rounded-xl bg-emerald-900/40 border border-emerald-700 text-emerald-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  {t.form.success}
                </div>
              )}
              {status === 'error' && (
                <div className="mt-5 flex items-center gap-2.5 p-4 rounded-xl bg-red-900/40 border border-red-700 text-red-300 text-sm">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  {t.form.error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl h-12 text-base font-medium disabled:opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-900/10"
              >
                {isSubmitting ? t.form.sending : t.form.submit}                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </ScrollPang>
        </div>
      </div>
    </section>
  )
}