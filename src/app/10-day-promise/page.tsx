import { NavBar } from '@/components/ui/tube-light-navbar'
import { Footer } from '@/components/ui/footer-section'
import { Home, Briefcase, Users, FileText, Mail, Check, Clock, Shield, Rocket } from 'lucide-react'

const navItems = [
  { name: 'Hjem', url: '/', icon: Home },
  { name: 'Tjenester', url: '/#ai-resepsjonister', icon: Briefcase },
  { name: 'Prosess', url: '/#prosess', icon: FileText },
  { name: 'Priser', url: '/#priser', icon: Users },
  { name: 'Kontakt', url: '/#kontakt', icon: Mail },
]

const content = {
  no: {
    hero: {
      badge: '10-Day Promise',
      title: 'Din AI er klar på 10 dager',
      subtitle: 'Ellers betaler du ingenting. Ingen binding. Ingen risiko.',
    },
    what: {
      title: 'Hva er 10-Day Promise?',
      text: 'Vi lover å sette opp din første AI-resepsjonist på 10 dager. Fra første samtale til ferdig løsning. Hvis vi ikke klarer det, betaler du ingenting.',
    },
    steps: [
      {
        icon: 'clock',
        day: 'Dag 1-2',
        title: 'Avklaring',
        description: '30-minutters samtale om dine behov. Vi setter opp kalender og CRM-integrasjon.',
      },
      {
        icon: 'rocket',
        day: 'Dag 3-10',
        title: 'Oppsett',
        description: 'Vi bygger og trener din AI-resepsjonist. Du får teste underveis.',
      },
      {
        icon: 'check',
        day: 'Dag 11-30',
        title: 'Testing',
        description: '30 dager med justeringer og support. Ser du ikke verdi? Betal ingenting.',
      },
    ],
    guarantee: {
      title: '30-dagers garanti',
      text: 'Du betaler ingenting de første 30 dagene. Hvis du ikke ser verdi i løsningen, kan du avslutte uten kostnad.',
    },
    includes: {
      title: 'Hva er inkludert?',
      items: [
        'AI telefon & chat',
        '24/7 tilgjengelighet',
        'Kalender-integrasjon',
        'CRM-tilkobling',
        'Norsk stemme',
        'Månedlig rapport',
        '30 dager support',
      ],
    },
    cta: {
      title: 'Klar til å starte?',
      text: 'Book en gratis avklaringssamtale. Vi kartlegger dine behov og starter innen 48 timer.',
      button: 'Book gratis samtale',
    },
  },
  en: {
    hero: {
      badge: '10-Day Promise',
      title: 'Your AI is ready in 10 days',
      subtitle: 'Or you pay nothing. No commitment. No risk.',
    },
    what: {
      title: 'What is 10-Day Promise?',
      text: 'We promise to set up your first AI receptionist in 10 days. From first call to finished solution. If we don\'t make it, you pay nothing.',
    },
    steps: [
      {
        icon: Clock,
        day: 'Day 1-2',
        title: 'Clarification',
        description: '30-minute call about your needs. We set up calendar and CRM integration.',
      },
      {
        icon: Rocket,
        day: 'Day 3-10',
        title: 'Setup',
        description: 'We build and train your AI receptionist. You test along the way.',
      },
      {
        icon: Check,
        day: 'Day 11-30',
        title: 'Testing',
        description: '30 days of adjustments and support. No value seen? Pay nothing.',
      },
    ],
    guarantee: {
      title: '30-day guarantee',
      text: 'You pay nothing for the first 30 days. If you don\'t see value in the solution, you can cancel at no cost.',
    },
    includes: {
      title: 'What is included?',
      items: [
        'AI phone & chat',
        '24/7 availability',
        'Calendar integration',
        'CRM connection',
        'Norwegian voice',
        'Monthly report',
        '30 days support',
      ],
    },
    cta: {
      title: 'Ready to start?',
      text: 'Book a free clarification call. We map your needs and start within 48 hours.',
      button: 'Book free call',
    },
  },
}

export default function TenDayPromisePage() {
  const t = content.no

  return (
    <main className="bg-black min-h-screen text-white">
      <NavBar items={navItems} currentLang="no" onLangChange={() => {}} />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-full mb-6">
            {t.hero.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.hero.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t.hero.subtitle}</p>
        </div>
      </section>

      {/* What is */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t.what.title}</h2>
          <p className="text-lg text-gray-400">{t.what.text}</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Slik fungerer det</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {t.steps.map((step, i) => {
              const IconComponent = step.icon === 'clock' ? Clock : step.icon === 'rocket' ? Rocket : Check;
              return (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-emerald-400 text-sm font-medium mb-2">{step.day}</div>
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">{t.guarantee.title}</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">{t.guarantee.text}</p>
        </div>
      </section>

      {/* Includes */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{t.includes.title}</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {t.includes.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-lg text-gray-400 mb-8">{t.cta.text}</p>
          <a
            href="/#kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
          >
            {t.cta.button}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
