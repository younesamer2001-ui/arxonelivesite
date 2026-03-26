'use client'

import { useState } from 'react'
import { Home, Briefcase, Users, FileText, Mail, Phone, MapPin } from 'lucide-react'
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
  const items = navItems[currentLang]

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
              action="https://formspree.io/f/xnnjvekj" 
              method="POST"
              className="w-full space-y-4"
            >
              <input type="hidden" name="_to" value="kontakt@arxon.no" />
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  {currentLang === 'no' ? 'Navn' : 'Name'}
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={currentLang === 'no' ? 'Ditt navn' : 'Your name'}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  {currentLang === 'no' ? 'E-post' : 'Email'}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={currentLang === 'no' ? 'din@epost.no' : 'you@example.com'}
                  required
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
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
              >
                {currentLang === 'no' ? 'Send melding' : 'Send message'}
              </Button>
            </form>
          </ContactCard>
        </section>
      </SectionWrapper>

      <Footer />
    </main>
  )
}
