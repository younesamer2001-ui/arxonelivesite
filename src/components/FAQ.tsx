'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

interface FAQProps {
  lang?: 'no' | 'en'
}

const content = {
  no: {
    label: 'FAQ',
    heading: 'Lurer du på noe?',
    subtext: 'Her finner du svar på de vanligste spørsmålene om Arxon. Finner du ikke svaret? Ta kontakt.',
    items: [
      {
        question: 'Hvordan fungerer AI-resepsjonisten?',
        answer: 'Når noen ringer bedriften din, svarer Arxon sin AI automatisk. Den forstår hva kunden trenger, booker timer i kalenderen din, sender SMS-bekreftelse og logger alt i dashboardet ditt. Alt skjer på norsk, og kunden merker knapt at det er en AI.',
      },

      {
        question: 'Hva koster det?',
        answer: 'Vi har tre planer: Starter fra 2 990 kr/mnd og Pro fra 4 990 kr/mnd. Ved månedlig betaling kommer et engangs oppsettsgebyr (5 000 kr for Starter, 15 000 kr for Pro) som dekker kartlegging og skreddersydd oppsett. Velger du årlig betaling er oppsettet helt gratis. Enterprise har tilpasset pris for kjeder. Ingen skjulte kostnader.',
      },
      {
        question: 'Hva skjer etter jeg har kjøpt?',
        answer: 'Når du har valgt en pakke, booker vi en kartleggingscall med deg. Der går vi gjennom åpningstider, tjenester, vanlige kundespørsmål og alt annet AI-en trenger å vite. Så bygger vi din skreddersydde AI-resepsjonist og setter den live — du trenger ikke gjøre noe teknisk selv.',
      },

      {
        question: 'Kan jeg prøve før jeg bestemmer meg?',
        answer: 'Absolutt! Du kan ringe og teste AI-en selv akkurat nå — helt gratis. Vi tilbyr også 30 dagers full refusjon hvis du ikke er fornøyd.',
      },
      {
        question: 'Hvordan håndterer dere persondata og GDPR?',
        answer: 'Vi tar personvern på alvor. All samtaledata behandles i henhold til GDPR, og vi lagrer kun det som er nødvendig for å levere tjenesten. Data lagres på sikre servere i Europa, og du kan når som helst be om innsyn eller sletting. Vi har databehandleravtale (DPA) klar for alle kunder.',
      },
      {
        question: 'Hva skjer hvis AI-en ikke kan svare på et spørsmål?',
        answer: 'Hvis AI-en møter et spørsmål den ikke kan håndtere, eskalerer den automatisk — enten ved å sende samtalen videre til en ansatt, ta en beskjed med kontaktinfo, eller booke et tidspunkt for tilbakering. Du bestemmer selv hvordan eskaleringen skal fungere under kartleggingscallen.',
      },
      {
        question: 'Kan jeg avslutte abonnementet når som helst?',
        answer: 'Ja. Månedlige abonnementer kan avsluttes når som helst uten binding. Årlige abonnementer løper ut perioden, men fornyes ikke automatisk med mindre du ønsker det. Vi tror på å beholde kunder fordi de er fornøyde — ikke fordi de er låst inn.',
      },
      {
        question: 'Støtter AI-en flere språk?',
        answer: 'Ja, AI-resepsjonisten støtter over 30 språk — inkludert norsk, engelsk, arabisk, spansk, polsk og mange flere. Hun kan også bytte språk midt i en samtale basert på hva innringeren snakker. Perfekt for bedrifter med et flerspråklig kundegrunnlag.',
      },
    ],
    footerText: 'Fant du ikke svaret?',
    footerCta: 'Kontakt oss',
  },
  en: {
    label: 'FAQ',
    heading: 'Got questions?',
    subtext: 'Here are the most common questions about Arxon. Can\'t find your answer? Get in touch.',
    items: [
      {
        question: 'How does the AI receptionist work?',
        answer: 'When someone calls your business, Arxon\'s AI answers automatically. It understands what the customer needs, books appointments in your calendar, sends SMS confirmation and logs everything in your dashboard. Everything happens in Norwegian, and the customer barely notices it\'s an AI.',
      },

      {
        question: 'What does it cost?',
        answer: 'We have three plans: Starter from NOK 2,990/mo and Pro from NOK 4,990/mo. Monthly billing includes a one-time setup fee (NOK 5,000 for Starter, NOK 15,000 for Pro) covering discovery and custom setup. Choose annual billing and setup is completely free. Enterprise has custom pricing for chains. No hidden costs.',
      },
      {
        question: 'What happens after I buy?',
        answer: 'Once you choose a plan, we book a discovery call with you. We go through your opening hours, services, common customer questions and everything else the AI needs to know. Then we build your custom AI receptionist and take it live — you don\'t need to do anything technical yourself.',
      },

      {
        question: 'Can I try before I decide?',
        answer: 'Absolutely! You can call and test the AI yourself right now — completely free. We also offer a 30-day full refund if you\'re not satisfied.',
      },
      {
        question: 'How do you handle personal data and GDPR?',
        answer: 'We take privacy seriously. All call data is processed in accordance with GDPR, and we only store what is necessary to deliver the service. Data is stored on secure servers in Europe, and you can request access or deletion at any time. We have a Data Processing Agreement (DPA) ready for all customers.',
      },
      {
        question: 'What happens if the AI can\'t answer a question?',
        answer: 'If the AI encounters a question it can\'t handle, it escalates automatically — either by forwarding the call to an employee, taking a message with contact info, or booking a callback time. You decide how escalation works during the discovery call.',
      },
      {
        question: 'Can I cancel my subscription at any time?',
        answer: 'Yes. Monthly subscriptions can be cancelled at any time with no commitment. Annual subscriptions run their term but don\'t auto-renew unless you choose to. We believe in keeping customers because they\'re happy — not because they\'re locked in.',
      },
      {
        question: 'Does the AI support multiple languages?',
        answer: 'Yes, the AI receptionist supports over 30 languages — including Norwegian, English, Arabic, Spanish, Polish and many more. It can also switch languages mid-conversation based on what the caller speaks. Perfect for businesses with a multilingual customer base.',
      },
    ],
    footerText: 'Didn\'t find your answer?',
    footerCta: 'Contact us',
  },
}

export default function FAQ({ lang = 'no' }: FAQProps) {
  const t = content[lang]
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative py-20 md:py-32 bg-black">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="w-full">
          <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider">{t.label}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">{t.heading}</h2>
          <p className="text-sm text-zinc-400 mt-3 pb-6 max-w-lg">{t.subtext}</p>
          {t.items.map((item, index) => (
            <div
              key={index}
              className="border-b border-zinc-800 py-5 cursor-pointer"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-white pr-4">{item.question}</h3>
                <svg
                  width="18" height="18" viewBox="0 0 18 18" fill="none"
                  className={`shrink-0 transition-transform duration-500 ease-in-out ${openIndex === index ? 'rotate-180' : ''}`}
                >
                  <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className={`text-sm text-zinc-500 transition-all duration-500 ease-in-out overflow-hidden ${openIndex === index ? 'opacity-100 max-h-[300px] translate-y-0 pt-4' : 'opacity-0 max-h-0 -translate-y-2'}`}>
                {item.answer}
              </div>
            </div>
          ))}

          {/* Footer CTA */}
          <div className="mt-10 flex items-center gap-2">
            <span className="text-zinc-400 text-sm">{t.footerText}</span>
            <a href="#kontakt" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-emerald-400 transition-colors group">
              {t.footerCta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
