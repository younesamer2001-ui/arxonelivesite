'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const content = {
  no: {
    title: 'Priser som vokser med deg',
    subtitle: '30 dager gratis prøveperiode på alle pakker. Setup faktureres ved oppstart.',
    trialBadge: '30 dager gratis',
    bindingNote: 'Spar med binding:',
    plans: [
      {
        name: 'P1: AI Resepsjonist',
        price: '4 990',
        period: 'kr/mnd',
        description: 'Per bedrift',
        priceYearly: '3 990',
        priceHalf: '4 490',
        features: [
          'AI telefon & chat',
          '24/7 tilgjengelig',
          'Kalender-integrasjon',
          'CRM-tilkobling',
          'Norsk stemme',
          'Månedlig rapport',
          '30 dagers prøveperiode'
        ],
        cta: 'Start gratis prøveperiode',
        popular: false
      },
      {
        name: 'P2: Custom AI',
        price: 'Fra 8 000',
        period: 'kr/mnd',
        description: 'Per prosjekt',
        priceYearly: 'Fra 6 400',
        priceHalf: 'Fra 7 200',
        features: [
          'Alt fra P1',
          'Custom workflows',
          'Flere integrasjoner',
          'Prioritet support',
          'Utvikler-tilgang',
          'Workshops',
          '30 dagers prøveperiode'
        ],
        cta: 'Book konsultasjon',
        popular: true
      },
      {
        name: 'P3: Enterprise',
        price: 'Custom',
        period: '',
        description: 'For store organisasjoner',
        priceYearly: '',
        priceHalf: '',
        features: [
          'Alt fra P2',
          'Dedikert utvikler',
          'SLA-garanti',
          'Strategisk rådgivning',
          'På-site support',
          'Custom avtale'
        ],
        cta: 'Book møte',
        popular: false
      }
    ]
  },
  en: {
    title: 'Pricing that scales with you',
    subtitle: '30-day free trial on all plans. Setup fee billed at start.',
    trialBadge: '30 days free',
    bindingNote: 'Save with commitment:',
    plans: [
      {
        name: 'P1: AI Receptionist',
        price: '4 990',
        period: 'NOK/mo',
        description: 'Per company',
        priceYearly: '3 990',
        priceHalf: '4 490',
        features: [
          'AI phone & chat',
          '24/7 available',
          'Calendar integration',
          'CRM connection',
          'Norwegian voice',
          'Monthly report',
          '30-day free trial'
        ],
        cta: 'Start free trial',
        popular: false
      },
      {
        name: 'P2: Custom AI',
        price: 'From 8 000',
        period: 'NOK/mo',
        description: 'Per project',
        priceYearly: 'From 6 400',
        priceHalf: 'From 7 200',
        features: [
          'Everything in P1',
          'Custom workflows',
          'More integrations',
          'Priority support',
          'Developer access',
          'Workshops',
          '30-day free trial'
        ],
        cta: 'Book consultation',
        popular: true
      },
      {
        name: 'P3: Enterprise',
        price: 'Custom',
        period: '',
        description: 'For large organizations',
        priceYearly: '',
        priceHalf: '',
        features: [
          'Everything in P2',
          'Dedicated developer',
          'SLA guarantee',
          'Strategic consulting',
          'On-site support',
          'Custom agreement'
        ],
        cta: 'Book meeting',
        popular: false
      }
    ]
  }
};

interface PricingProps {
  lang?: 'no' | 'en';
}

export default function Pricing({ lang = 'no' }: PricingProps) {
  const t = content[lang];

  return (
    <section className="py-16 md:py-32 bg-black" id="priser">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl space-y-6 text-center mb-16"
        >
          <h2 className="text-center text-2xl md:text-4xl font-semibold lg:text-5xl text-white">{t.title}</h2>
          <p className="text-gray-400">{t.subtitle}</p>
        </motion.div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          {t.plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`flex flex-col bg-white/5 border-white/10 rounded-2xl md:rounded-3xl transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10 ${plan.popular ? 'relative' : ''}`}>
                {plan.popular && (
                  <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                    Mest populær
                  </span>
                )}

                <CardHeader>
                  <CardTitle className="font-medium text-white">{plan.name}</CardTitle>
                  <span className="my-3 block text-2xl font-semibold text-white">{plan.price} <span className="text-lg text-gray-400">{plan.period}</span></span>
                  <CardDescription className="text-sm text-gray-500">{plan.description}</CardDescription>
                  {plan.priceHalf && (
                    <div className="mt-3 space-y-1 text-xs text-gray-500">
                      <p>6 mnd: <span className="text-gray-300">{plan.priceHalf} {plan.period}</span></p>
                      <p>12 mnd: <span className="text-gray-300">{plan.priceYearly} {plan.period}</span></p>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <hr className="border-dashed border-white/10" />

                  <ul className="list-outside space-y-3 text-sm">
                    {plan.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <Check className="size-4 text-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-auto">
                  <Button
                    asChild
                    variant={plan.popular ? 'default' : 'outline'}
                    className={`w-full ${plan.popular ? 'bg-white text-black hover:bg-gray-200' : 'border-white/20 text-white hover:bg-white/10'}`}
                  >
                    <a href="https://cal.com/arxon/30min" target="_blank" rel="noopener noreferrer">{plan.cta}</a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
