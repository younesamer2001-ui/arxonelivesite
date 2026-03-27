'use client';

import { motion } from 'framer-motion';
import { VoiceTestimonial } from './ui/voice-testimonial';
import { Heart, Home, Calculator, Target, Car, Zap } from 'lucide-react';

// Demo AI receptionists
const aiReceptionists = {
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
      text: 'Jeg ringer opp leads fra Facebook Ads og andre kanaler. Jeg kvalifiserer leads, booker møter og oppdaterer CRM automatisk.',
      phoneNumber: '+47 123 45 681',
      audio: '/audio/leo-demo.mp3',
      icon: Target,
      assistantId: '0ee55cd5-bdf3-46d7-be9f-fd7c695a2a66'
    },
    {
      name: 'Max',
      jobtitle: 'Bilverksted',
      text: 'Jeg hjelper bilverksteder med timebooking, påminnelser, henting/levering og kundeoppfølging. Jeg kan snakke om reparasjoner og priser.',
      phoneNumber: '+47 123 45 682',
      audio: '/audio/max-demo.mp3',
      icon: Car,
      assistantId: '178f4aeb-80e9-4d2b-b9c2-0678f9aacc37'
    },
    {
      name: 'Ella',
      jobtitle: 'Elektriker',
      text: 'Jeg hjelper elektrikere med henvendelser, befaringer, tilbud og timebooking. Jeg kan svare på tekniske spørsmål og hasteoppdrag.',
      phoneNumber: '+47 123 45 683',
      audio: '/audio/ella-demo.mp3',
      icon: Zap,
      assistantId: '7ed59a22-0a03-4ca0-a818-610f0584da6a'
    }
  ],
  en: [
    {
      name: 'Lisa',
      jobtitle: 'Health & Clinic',
      text: 'I help clinics with appointment booking, reminders, and patient inquiries. I can talk about treatments and availability.',
      phoneNumber: '+47 123 45 678',
      audio: '/audio/lisa-demo.mp3',
      icon: Heart,
      assistantId: '3e6bee7b-00b2-41e9-8225-f314800d8e5e'
    },
    {
      name: 'Marcus',
      jobtitle: 'Real Estate',
      text: 'I help real estate agents with viewing bookings, sales questions, and customer follow-up. I know all the properties.',
      phoneNumber: '+47 123 45 679',
      audio: '/audio/marcus-demo.mp3',
      icon: Home,
      assistantId: '4b2b63e9-eabf-4662-9dc0-05948413103f'
    },
    {
      name: 'Emma',
      jobtitle: 'Accounting & Finance',
      text: 'I help accountants with customer inquiries, invoice questions, and meeting bookings.',
      phoneNumber: '+47 123 45 680',
      audio: '/audio/emma-demo.mp3',
      icon: Calculator,
      assistantId: 'f0739e18-7732-4a69-93ea-7645b0e22a31'
    },
    {
      name: 'Leo',
      jobtitle: 'Lead Generation',
      text: 'I call leads from Facebook Ads and other channels. I qualify leads, book meetings and update CRM automatically.',
      phoneNumber: '+47 123 45 681',
      audio: '/audio/leo-demo.mp3',
      icon: Target,
      assistantId: '0ee55cd5-bdf3-46d7-be9f-fd7c695a2a66'
    },
    {
      name: 'Max',
      jobtitle: 'Auto Repair Shop',
      text: 'I help auto repair shops with booking, reminders, pickup/delivery and customer follow-up. I can talk about repairs and prices.',
      phoneNumber: '+47 123 45 682',
      audio: '/audio/max-demo.mp3',
      icon: Car,
      assistantId: '178f4aeb-80e9-4d2b-b9c2-0678f9aacc37'
    },
    {
      name: 'Ella',
      jobtitle: 'Electrician',
      text: 'I help electricians with inquiries, inspections, quotes and booking. I can answer technical questions and urgent requests.',
      phoneNumber: '+47 123 45 683',
      audio: '/audio/ella-demo.mp3',
      icon: Zap,
      assistantId: '7ed59a22-0a03-4ca0-a818-610f0584da6a'
    }
  ]
};

interface ServicesProps {
  lang?: 'no' | 'en';
}

export default function Services({ lang = 'no' }: ServicesProps) {
  const receptionists = aiReceptionists[lang];

  return (
    <section id="tjenester" className="relative py-16 md:py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <VoiceTestimonial 
          mode="dark" 
          testimonials={receptionists}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            {lang === 'no' 
              ? 'Dette er demo-versjoner. I produksjon tilpasses de dine systemer.'
              : 'These are demo versions. In production, they are adapted to your systems.'
            }
          </p>
        </motion.div>
      </div>
    </section>
  );
}
