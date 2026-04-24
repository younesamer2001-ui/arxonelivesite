'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface ROICalculatorProps {
  lang: 'no' | 'en';
}

const content = {
  no: {
    label: 'Kostnadskalkulator',
    heading: 'Hvor mye taper du',
    headingAccent: 'på ubesvarte anrop?',
    callsPerDayLabel: 'Anrop per dag',
    missedCallsPercentLabel: 'Ubesvarte anrop (%)',
    avgOrderValueLabel: 'Gjennomsnittlig ordreverdi (kr)',
    missedCallsPerMonthLabel: 'Tapte anrop per måned',
    lostRevenuePerMonthLabel: 'Tapt omsetning per måned',
    withArxonSaveLabel: 'Med Arxon kan du berge',
    basedOnText: 'Estimat basert på en typisk fangstrate på 85%. Kontakt oss for pris tilpasset ditt volum.',
    ctaText: 'Kontakt oss for pris',
  },
  en: {
    label: 'Cost Calculator',
    heading: 'How much are you losing',
    headingAccent: 'on missed calls?',
    callsPerDayLabel: 'Calls per day',
    missedCallsPercentLabel: 'Missed calls (%)',
    avgOrderValueLabel: 'Average order value (NOK)',
    missedCallsPerMonthLabel: 'Missed calls per month',
    lostRevenuePerMonthLabel: 'Lost revenue per month',
    withArxonSaveLabel: 'With Arxon you can recover',
    basedOnText: 'Estimate based on a typical 85% capture rate. Contact us for pricing tailored to your volume.',
    ctaText: 'Contact us for pricing',
  },
};

const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export default function ROICalculator({ lang = 'no' }: ROICalculatorProps) {
  const t = content[lang];
  const [callsPerDay, setCallsPerDay] = useState(15);
  const [missedCallsPercent, setMissedCallsPercent] = useState(30);
  const [avgOrderValue, setAvgOrderValue] = useState(800);

  // Calculate metrics
  const missedCallsPerMonth = callsPerDay * (missedCallsPercent / 100) * 30;
  const lostRevenuePerMonth = missedCallsPerMonth * avgOrderValue * 0.3;
  const savedRevenueWithArxon = lostRevenuePerMonth * 0.85;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal y={30} delay={0}>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 uppercase tracking-wider mb-4">
              <span className="w-6 h-px bg-zinc-900" />
              {t.label}
              <span className="w-6 h-px bg-zinc-900" />
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900">
              {t.heading}{' '}
              <span className="gradient-text-accent">{t.headingAccent}</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Main Content */}
        <ScrollReveal y={40} delay={0.1} stagger={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Sliders */}
            <div className="space-y-8">
              {/* Calls Per Day */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-zinc-700">
                    {t.callsPerDayLabel}
                  </label>
                  <span className="text-2xl font-bold text-zinc-700">
                    {callsPerDay}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={callsPerDay}
                  onChange={(e) => setCallsPerDay(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-800"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-2">
                  <span>5</span>
                  <span>50</span>
                </div>
              </div>

              {/* Missed Calls Percent */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-zinc-700">
                    {t.missedCallsPercentLabel}
                  </label>
                  <span className="text-2xl font-bold text-zinc-700">
                    {missedCallsPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="1"
                  value={missedCallsPercent}
                  onChange={(e) => setMissedCallsPercent(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-800"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-2">
                  <span>10%</span>
                  <span>80%</span>
                </div>
              </div>

              {/* Average Order Value */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-zinc-700">
                    {t.avgOrderValueLabel}
                  </label>
                  <span className="text-2xl font-bold text-zinc-700">
                    {formatNumber(avgOrderValue)} kr
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={avgOrderValue}
                  onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-800"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-2">
                  <span>200 kr</span>
                  <span>5 000 kr</span>
                </div>
              </div>
            </div>

            {/* Right: Results Card */}
            <div>
              <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-8 sticky top-8">
                <div className="space-y-6">
                  {/* Missed Calls Per Month */}
                  <div className="border-b border-zinc-700 pb-6">
                    <p className="text-sm text-zinc-400 mb-2">
                      {t.missedCallsPerMonthLabel}
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {Math.round(missedCallsPerMonth)}
                    </p>
                  </div>

                  {/* Lost Revenue Per Month */}
                  <div className="border-b border-zinc-700 pb-6">
                    <p className="text-sm text-zinc-400 mb-2">
                      {t.lostRevenuePerMonthLabel}
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {formatNumber(Math.round(lostRevenuePerMonth))} kr
                    </p>
                  </div>

                  {/* With Arxon Save */}
                  <div className="border-b border-zinc-700 pb-6">
                    <p className="text-sm text-zinc-400 mb-2">
                      {t.withArxonSaveLabel}
                    </p>
                    <p className="text-4xl font-bold text-emerald-400">
                      {formatNumber(Math.round(savedRevenueWithArxon))} kr
                    </p>
                  </div>

                  {/* Based On Text */}
                  <p className="text-xs text-zinc-500 pt-2">
                    {t.basedOnText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* CTA Button */}
        <ScrollReveal y={30} delay={0.2}>
          <div className="mt-12 flex justify-center">
            <a
              href="#kontakt"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-zinc-900 text-white rounded-full text-base font-medium hover:bg-zinc-800 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/20 hover:-translate-y-0.5"
            >
              {t.ctaText}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
