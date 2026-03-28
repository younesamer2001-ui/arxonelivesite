'use client';

import { motion } from 'framer-motion';
import VoiceTestimonial from './ui/voice-testimonial';
import { Heart, Home, Calculator, Target, Car, Zap } from 'lucide-react';

// Demo AI receptionists
const aiReceptionists: Record<string, Array<{
  name: string;
  jobtitle: string;
  text: string;
  phoneNumber: string;
  audio: string;
  icon: React.ComponentType<{ className?: string }>;
  assistantId: string;
}>> = {
  no: [
    {
      name: 'Lisa',
      jobtitle: 'Helse & Klinikk',
      text: 'Jeg hjelper klinikker med timebooking, påminnelser og pasienthenvendelser. Jeg kan snakke om behandlinger og tilgjengelighet.',
      phoneNumber: '+47 123 45 678',
      audio: '/audio/lisa-demo.mp3',
      icon: Heart,
      assistantId: '3e6bee7b-00b2-41e9-8225-f314800d8e5e'
    },
    {
      name: 'Marcus',
      jobtitle: 'Eiendom',
      text: 'Jeg hjelper eiendomsmeglere med visningsbooking, salgsspørsmål og kundeoppfølging. Jeg kjenner alle eiendommene.',
      phoneNumber: '+47 123 45 679',
      audio: '/audio/marcus-demo.mp3',
      icon: Home,
      assistantId: '4b2b63e9-eabf-4662-9dc0-05948413103f'
    },
    {
      name: 'Emma',
      jobtitle: 'Regnskap & Økonomi',
      text: 'Jeg hjelper regnskapsførere med kundehenvendelser, fakturaspørsmål og booking av møter.',
      phoneNumber: '+47 123 45 680',
      audio: '/audio/emma-demo.mp3',
      icon: Calculator,
      assistantId: 'f0739e18-7732-4a69-93ea-7645b0e22a31'
    },
    {
      name: 'Leo',
      jobtitle: 'Lead Generation',
      text: 'Jeg kvalifiserer leads og booker møter for salgsteamet. Jeg stiller de riktige spørsmålene for å finne de beste kundene.',
      phoneNumber: '+47 123 45 681',
      audio: '/audio/leo-demo.mp3',
      icon: Target,
      assistantId: '0ee55cd5-bdf3-46d7-be9f-fd7c695a2a66'
    },
    {
      name: 'Max',
      jobtitle: 'Bilverksted',
      text: 'Jeg tar imot henvendelser for verkstedet – service, EU-kontroll, dekkskift og reparasjoner. Rask og effektiv booking.',
      phoneNumber: '+47 123 45 682',
      audio: '/audio/max-demo.mp3',
      icon: Car,
      assistantId: '178f4aeb-80e9-4d2b-b9c2-0678f9aacc37'
    },
    {
      name: 'Ella',
      jobtitle: 'Elektriker',
      text: 'Jeg hjelper elektrikerfirmaer med kundehenvendelser, feilmelding og booking av oppdrag.',
      phoneNumber: '+47 123 45 683',
      audio: '/audio/ella-demo.mp3',
      icon: Zap,
      assistantId: '7ed59a22-0a03-4ca0-a818-610f0584da6a'
    },
  ],
  en: [
    {
      name: 'Lisa',
      jobtitle: 'Health & Clinic',
      text: 'I help clinics with appointment booking, reminders and patient inquiries. I can discuss treatments and availability.',
      phoneNumber: '+47 123 45 678',
      audio: '/audio/lisa-demo.mp3',
      icon: Heart,
      assistantId: '3e6bee7b-00b2-41e9-8225-f314800d8e5e'
    },
    {
      name: 'Marcus',
      jobtitle: 'Real Estate',
      text: 'I help real estate agents with viewing bookings, sales questions and customer follow-up. I know all the properties.',
      phoneNumber: '+47 123 45 679',
      audio: '/audio/marcus-demo.mp3',
      icon: Home,
      assistantId: '4b2b63e9-eabf-4662-9dc0-05948413103f'
    },
    {
      name: 'Emma',
      jobtitle: 'Accounting & Finance',
      text: 'I help accountants with customer inquiries, invoice questions and meeting bookings.',
      phoneNumber: '+47 123 45 680',
      audio: '/audio/emma-demo.mp3',
      icon: Calculator,
      assistantId: 'f0739e18-7732-4a69-93ea-7645b0e22a31'
    },
    {
      name: 'Leo',
      jobtitle: 'Lead Generation',
      text: 'I qualify leads and book meetings for the sales team. I ask the right questions to find the best customers.',
      phoneNumber: '+47 123 45 681',
      audio: '/audio/leo-demo.mp3',
      icon: Target,
      assistantId: '0ee55cd5-bdf3-46d7-be9f-fd7c695a2a66'
    },
    {
      name: 'Max',
      jobtitle: 'Auto Workshop',
      text: 'I handle inquiries for the workshop – service, inspections, tire changes and repairs. Fast and efficient booking.',
      phoneNumber: '+47 123 45 682',
      audio: '/audio/max-demo.mp3',
      icon: Car,
      assistantId: '178f4aeb-80e9-4d2b-b9c2-0678f9aacc37'
    },
    {
      name: 'Ella',
      jobtitle: 'Electrician',
      text: 'I help electrician companies with customer inquiries, fault reporting and job bookings.',
      phoneNumber: '+47 123 45 683',
      audio: '/audio/ella-demo.mp3',
      icon: Zap,
      assistantId: '7ed59a22-0a03-4ca0-a818-610f0584da6a'
    },
  ],
};

const sectionText: Record<string, { title: string; subtitle: string }> = {
  no: {
    title: 'Møt våre AI-resepsjonister',
    subtitle: 'Hver bransje har sin egen AI – trent på relevante scenarier. Trykk «Ring nå» for å teste direkte i nettleseren.',
  },
  en: {
    title: 'Meet our AI Receptionists',
    subtitle: 'Each industry has its own AI – trained on relevant scenarios. Press "Call now" to test directly in your browser.',
  },
};

export default function Services({ lang = 'no' }: { lang?: string }) {
  const receptionists = aiReceptionists[lang] || aiReceptionists.no;
  const text = sectionText[lang] || sectionText.no;
  const testimonials = receptionists.map((r) => ({
    name: r.name,
    jobtitle: r.jobtitle,
    text: r.text,
    phoneNumber: r.phoneNumber,
    audio: r.audio,
    icon: <r.icon className="w-6 h-6 text-white" />,
    assistantId: r.assistantId,
  }));

  return (
    <section id="ai-resepsjonister" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          {text.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/60 max-w-2xl mx-auto"
        >
          {text.subtitle}
        </motion.p>
      </div>
      <VoiceTestimonial testimonials={testimonials} lang={lang} />
    </section>
  );
}
