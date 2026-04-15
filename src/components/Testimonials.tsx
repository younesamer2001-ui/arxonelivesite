'use client'

import { Star } from 'lucide-react'
import ScrollPang from './ScrollPang'

interface TestimonialsProps {
  lang?: 'no' | 'en'
}

const content = {
  no: {
    heading: 'Resultatene snakker for seg.',
    subtext:
      'Bedrifter som bruker Arxon fanger opp flere kunder, booker mer og bruker mindre tid på telefonen. Her er noen av historiene.',
    testimonials: [
      {
        id: 1,
        name: 'Thomas Eriksen',
        role: 'Daglig leder, FixFlow Services',
        image: '/fixflow-logo.png',
        rating: 5,
        quote:
          'Arxon har revolusjonert hvordan vi håndterer kundehenvendelser. Vi mister ikke lenger anrop, og kundene er imponert over den profesjonelle opplevelsen.',
      },
      {
        id: 2,
        name: 'Anders Bakke',
        role: 'Tannlege, Nordic Smiles Dental',
        image: '/nordic-smiles-logo.png',        rating: 5,
        quote:
          'Pasientene våre setter pris på at de alltid får svar. Arxon håndterer avbestillinger og ombookinger helt sømløst.',
      },
      {
        id: 3,
        name: 'Maria Olsen',
        role: 'Eier, Strand Frisør',
        image: '/strand-frisor-logo.png',
        rating: 5,
        quote:
          'Bookingene våre har økt med 40% siden vi begynte med Arxon. AI-resepsjonisten booker timer døgnet rundt, selv når vi har stengt.',
      },
    ],
  },
  en: {
    heading: 'The results speak for themselves.',
    subtext:
      'Businesses using Arxon capture more customers, book more appointments and spend less time on the phone. Here are some of their stories.',
    testimonials: [
      {
        id: 1,
        name: 'Thomas Eriksen',
        role: 'CEO, FixFlow Services',
        image: '/fixflow-logo.png',
        rating: 5,
        quote:
          'Arxon has revolutionized how we handle customer inquiries. We no longer miss calls, and customers are impressed by the professional experience.',
      },      {
        id: 2,
        name: 'Anders Bakke',
        role: 'Dentist, Nordic Smiles Dental',
        image: '/nordic-smiles-logo.png',
        rating: 5,
        quote:
          'Our patients appreciate always getting an answer. Arxon handles cancellations and rebookings completely seamlessly.',
      },
      {
        id: 3,
        name: 'Maria Olsen',
        role: 'Owner, Strand Hair Salon',
        image: '/strand-frisor-logo.png',
        rating: 5,
        quote:
          'Our bookings have increased 40% since we started with Arxon. The AI receptionist books appointments around the clock.',
      },
    ],
  },
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"          fill={i < rating ? 'currentColor' : 'none'}
          strokeWidth={1.5}
          color="#facc15"
        />
      ))}
    </div>
  )
}

export default function Testimonials({ lang = 'no' }: TestimonialsProps) {
  const t = content[lang]

  return (
    <section className="py-24 md:py-36 bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <ScrollPang>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              {t.heading}
            </h2>
            <p className="text-sm md:text-base text-zinc-400 mt-3 max-w-xl leading-relaxed">
              {t.subtext}
            </p>
          </div>
        </ScrollPang>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 mt-16">
          {t.testimonials.map((testimonial, i) => (            <ScrollPang key={testimonial.id} offset={i}>
              <div className="w-full sm:max-w-80 bg-zinc-900 text-white rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300">
                <div className="relative -mt-px overflow-hidden rounded-t-2xl bg-black">
                  <img
                    src={testimonial.image}
                    alt={testimonial.role}
                    className="h-[270px] w-full rounded-t-2xl object-contain p-8"
                  />
                  <div className="absolute bottom-0 z-10 h-32 w-full bg-gradient-to-t pointer-events-none from-zinc-900 to-transparent" />
                </div>
                <div className="px-5 pb-5">
                  <p className="font-medium border-b border-zinc-700 pb-4 leading-relaxed text-zinc-200">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-zinc-500">{testimonial.role}</p>
                    </div>
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
              </div>
            </ScrollPang>
          ))}
        </div>
      </div>
    </section>
  )
}