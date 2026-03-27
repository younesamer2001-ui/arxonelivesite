'use client'

import { useState, useRef, useEffect } from 'react'
import { Home, Briefcase, Users, FileText, Mail, Phone, MapPin } from 'lucide-react'
import emailjs from 'emailjs-com'
import { NavBar } from "@/components/ui/tube-light-navbar"
import Hero from "@/components/Hero"
import Services from "@/components/Services"
import WorkflowExplainer from "@/components/WorkflowExplainer"
import DashboardShowcase from "@/components/DashboardShowcase"
import Process from "@/components/Process"
import Pricing from "@/components/Pricing"
import { Footer } from "@/components/ui/footer-section"
import { SectionWrapper } from "@/components/SectionWrapper"
import { ContactCard } from "@/components/ui/contact-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const navItems = {
  no: [
    { name: 'Hjem', url: '#hjem', icon: Home },
    { name: 'Tjenester', url: '#tjenester', icon: Briefcase },
    { name: 'Prosess', url: '#prosess', icon: FileText },
    { name: 'Priser', url: '#priser', icon: Users },
    { name: 'Kontakt', url: '#kontakt', icon: Mail }
  ],
  en: [
    { name: 'Home', url: '#hjem', icon: Home },
    { name: 'Services', url: '#tjenester', icon: Briefcase },
    { name: 'Process', url: '#prosess', icon: FileText },
    { name: 'Pricing', url: '#priser', icon: Users },
    { name: 'Contact', url: '#kontakt', icon: Mail }
  ]
}

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<'no' | 'en'>('no')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const items = navItems[currentLang]

  useEffect(() => {
    emailjs.init('Vy-evp6-E8wcwwLf1')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await emailjs.sendForm(
        'service_f79wkms',
        'template_qbt6k52',
        formRef.current!,
        'Vy-evp6-E8wcwwLf1'
      )
      setSubmitStatus('success')
      formRef.current?.reset()
    } catch (error) {
      console.error('EmailJS error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-black min-h-screen text-white">
      <NavBar 
        items={items} 
        currentLang={currentLang} 
        onLangChange={setCurrentLang}
      />
      
      <section id="hjem">
        <Hero lang={currentLang} />
      </section>
      
      <SectionWrapper className="py-12 md:py-28">
        <section id="ai-resepsjonister">
          <Services lang={currentLang} />
        </section>
      </SectionWrapper>

      <SectionWrapper className="py-12 md:py-28" delay={0.1}>
        <WorkflowExplainer lang={currentLang} />
      </SectionWrapper>

      <SectionWrapper className="py-12 md:py-28" delay={0.1}>
        <DashboardShowcase lang={currentLang} />
      </SectionWrapper>
      
      <SectionWrapper className="py-12 md:py-28" delay={0.1}>
        <section id="prosess">
          <Process />
        </section>
      </SectionWrapper>
      
      <SectionWrapper className="py-12 md:py-28" delay={0.1}>
        <section id="priser">
          <Pricing lang={currentLang} />
        </section>
      </SectionWrapper>

      <SectionWrapper className="py-12 md:py-28" delay={0.1}>
        <section id="kontakt" className="max-w-6xl mx-auto px-4">
          <ContactCard
            title={currentLang === 'no' ? 'Kontakt oss' : 'Contact Us'}
            description={currentLang === 'no' 
              ? 'Har du spørsmål om våre tjenester eller trenger hjelp? Fyll ut skjemaet under. Vi svarer innen 1 virkedag.'
              : 'Have questions about our services or need help? Fill out the form below. We respond within 1 business day.'
            }
            contactInfo={[
              {
                icon: Mail,
                label: currentLang === 'no' ? 'E-post' : 'Email',
                value: 'kontakt@arxon.no',
              },
              {
                icon: Phone,
                label: currentLang === 'no' ? 'Telefon' : 'Phone',
                value: '+47 993 53 596',
              },
              {
                icon: MapPin,
                label: currentLang === 'no' ? 'Organisasjon' : 'Organization',
                value: 'Org: 837 230 012',
              },
            ]}
            className="bg-white/5 border-white/10 text-white"
            formSectionClassName="bg-white/5 border-white/10"
          >
            <form 
              ref={formRef}
              onSubmit={handleSubmit}
              className="w-full space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="from_name" className="text-white">
                  {currentLang === 'no' ? 'Navn' : 'Name'}
                </Label>
                <Input
                  id="from_name"
                  name="from_name"
                  type="text"
                  placeholder={currentLang === 'no' ? 'Ditt navn' : 'Your name'}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from_email" className="text-white">
                  {currentLang === 'no' ? 'E-post' : 'Email'}
                </Label>
                <Input
                  id="from_email"
                  name="from_email"
                  type="email"
                  placeholder={currentLang === 'no' ? 'din@epost.no' : 'you@example.com'}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  {currentLang === 'no' ? 'Telefon (valgfritt)' : 'Phone (optional)'}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={currentLang === 'no' ? '+47 000 00 000' : '+1 000 000 0000'}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">
                  {currentLang === 'no' ? 'Melding' : 'Message'}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder={currentLang === 'no' ? 'Hva kan vi hjelpe deg med?' : 'How can we help you?'}
                  required
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
                />
              </div>
              {submitStatus === 'success' && (
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm">
                  {currentLang === 'no' ? 'Melding sendt! Vi svarer innen 24 timer.' : 'Message sent! We will reply within 24 hours.'}
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-sm">
                  {currentLang === 'no' ? 'Noe gikk galt. Prøv igjen eller send e-post direkte til kontakt@arxon.no' : 'Something went wrong. Please try again or email us directly at kontakt@arxon.no'}
                </div>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
              >
                {isSubmitting 
                  ? (currentLang === 'no' ? 'Sender...' : 'Sending...')
                  : (currentLang === 'no' ? 'Send melding' : 'Send message')
                }
              </Button>
            </form>
          </ContactCard>
        </section>
      </SectionWrapper>

      <Footer />
    </main>
  )
}
