"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCheck } from "lucide-react";
import ScrollPang from "./ScrollPang";

interface PricingProps {
  lang?: "no" | "en";
}

const content = {
  no: {
    label: "PAKKER",
    heading: "Tilpasset din bedrift,",
    headingAccent: "ikke omvendt.",
    subtext:
      "Vi skreddersyr løsningen etter bedriftens størrelse, volum og hvilke integrasjoner du trenger. Ingen bindingstid.",
    priceText: "Kontakt for pris",
    cta: "Kontakt oss",
    note: "Alle pakker inkluderer oppsett, trening og norsk språkstøtte.",
    plans: [
      {
        name: "Starter",
        description: "For bedrifter som vil automatisere kundebehandling",
        popular: false,
        includes: [
          "Starter inkluderer:",
          "AI-resepsjonist 24/7",
          "Chatbot",
          "Automatiske workflows",
          "SMS-bekreftelser",
          "Norsk språkstøtte",
          "E-post support",
        ],
      },
      {
        name: "Pro",
        description: "Mest populær — full innsikt og kontroll",
        popular: true,
        includes: [
          "Alt i Starter, pluss:",
          "Ubegrenset samtaler",
          "Sanntids-dashboard",
          "Samtaleanalyse",
          "Automatisk Google Reviews-melding",
          "Prioritert support",
          "Dedikert kontaktperson",
          "Integrasjoner (CRM, kalender)",
        ],
      },
      {
        name: "Enterprise",
        description: "For kjeder med flere lokasjoner",
        popular: false,
        includes: [
          "Alt i Pro, pluss:",
          "Multi-lokasjon styring",
          "Tilpassede rapporter",
          "API-tilgang",
          "SLA-garanti",
          "Dedikert onboarding",
          "Skreddersydd oppsett",
        ],
      },
    ],
  },
  en: {
    label: "PACKAGES",
    heading: "Tailored to your business,",
    headingAccent: "not the other way around.",
    subtext:
      "We shape the solution around your size, call volume, and required integrations. No lock-in.",
    priceText: "Contact for pricing",
    cta: "Contact us",
    note: "All packages include setup, training, and Norwegian language support.",
    plans: [
      {
        name: "Starter",
        description: "For businesses looking to automate customer service",
        popular: false,
        includes: [
          "Starter includes:",
          "AI receptionist 24/7",
          "Chatbot",
          "Automated workflows",
          "SMS confirmations",
          "Norwegian language support",
          "Email support",
        ],
      },
      {
        name: "Pro",
        description: "Most popular — full insight and control",
        popular: true,
        includes: [
          "Everything in Starter, plus:",
          "Unlimited calls",
          "Real-time dashboard",
          "Call analytics",
          "Automatic Google Reviews message",
          "Priority support",
          "Dedicated contact person",
          "Integrations (CRM, calendar)",
        ],
      },
      {
        name: "Enterprise",
        description: "For chains with multiple locations",
        popular: false,
        includes: [
          "Everything in Pro, plus:",
          "Multi-location management",
          "Custom reports",
          "API access",
          "SLA guarantee",
          "Dedicated onboarding",
          "Custom setup",
        ],
      },
    ],
  },
};

export default function Pricing({ lang = "no" }: PricingProps) {
  const t = content[lang];

  return (
    <section id="priser" className="pt-10 md:pt-14 pb-16 md:pb-24 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <ScrollPang className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-3">
            {t.label}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {t.heading}{" "}
            <span className="text-zinc-400">{t.headingAccent}</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 max-w-md mx-auto">
            {t.subtext}
          </p>
        </ScrollPang>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {t.plans.map((plan, i) => (
            <ScrollPang key={plan.name} offset={i}>
              <Card
                className={cn(
                  "relative rounded-2xl border bg-zinc-900 transition-shadow duration-300 h-full",
                  plan.popular
                    ? "border-white/30 shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]"
                    : "border-zinc-800 hover:shadow-md hover:border-zinc-700"
                )}
              >
                {plan.popular && (
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent" />
                )}
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    {plan.popular && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-white text-black px-2 py-0.5 rounded-full">
                        Populær
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{plan.description}</p>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-2xl font-bold text-white">
                      {t.priceText}
                    </span>
                  </div>

                  <a
                    href="#kontakt"
                    className={cn(
                      "block w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200",
                      plan.popular
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                    )}
                  >
                    {t.cta}
                  </a>

                  <div className="mt-5 space-y-2.5">
                    {plan.includes.map((item, j) => (
                      <div key={j} className="flex items-start gap-2">
                        {j === 0 ? (
                          <span className="text-xs font-semibold text-zinc-300">{item}</span>
                        ) : (
                          <>
                            <CheckCheck className="w-3.5 h-3.5 mt-0.5 text-green-500 shrink-0" />
                            <span className="text-xs text-zinc-400">{item}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollPang>
          ))}
        </div>

        {/* Footer note */}
        <ScrollPang offset={2} className="text-center mt-6">
          <p className="text-xs text-neutral-400">{t.note}</p>
        </ScrollPang>
      </div>
    </section>
  );
}
