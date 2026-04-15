"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { CheckCheck } from "lucide-react";
import { useState } from "react";
import ScrollPang from "./ScrollPang";

interface PricingProps {
  lang?: "no" | "en";
}

const content = {
  no: {
    label: "PRISER",
    heading: "Invester i vekst,",
    headingAccent: "ikke kostnader.",
    subtext: "Forutsigbar pris. Ingen bindingstid. De fleste tjener inn investeringen i løpet av første måned.",
    monthly: "Månedlig",
    yearly: "Årlig",
    save: "Spar 20%",
    perMonth: "/mnd",
    perYear: "/år",
    cta: "Start i dag",
    ctaEnterprise: "Kontakt oss",
    vat: "Alle priser eks. mva.",
    setupLabel: "Oppsett",
    setupFree: "Gratis oppsett",
    plans: [
      {
        name: "Starter",
        description: "For bedrifter som vil automatisere kundebehandling",
        price: 2990, yearlyPrice: 28700,
        setupFee: 5000,
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
        price: 4990, yearlyPrice: 47900,
        setupFee: 15000,
        popular: true,
        includes: [
          "Alt i Starter, pluss:",
          "Ubegrenset samtaler",
          "Sanntids-dashboard",
          "Samtaleanalyse",
          "Automatisk Google Reviews-melding",
          "Prioritert support",
          "Dedikert kontaktperson",          "Integrasjoner (CRM, kalender)",
        ],
      },
      {
        name: "Enterprise",
        description: "For kjeder med flere lokasjoner",
        price: 0, yearlyPrice: 0,
        setupFee: 0,
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
    label: "PRICING",
    heading: "Invest in growth,",
    headingAccent: "not costs.",
    subtext: "Predictable pricing. No lock-in. Most clients earn back the investment within their first month.",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save 20%",
    perMonth: "/mo",
    perYear: "/yr",    cta: "Start today",
    ctaEnterprise: "Contact us",
    vat: "All prices excl. VAT.",
    setupLabel: "Setup",
    setupFree: "Free setup",
    plans: [
      {
        name: "Starter",
        description: "For businesses looking to automate customer service",
        price: 2990, yearlyPrice: 28700,
        setupFee: 5000,
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
        price: 4990, yearlyPrice: 47900,
        setupFee: 15000,
        popular: true,
        includes: [
          "Everything in Starter, plus:",
          "Unlimited calls",
          "Real-time dashboard",
          "Call analytics",
          "Automatic Google Reviews message",          "Priority support",
          "Dedicated contact person",
          "Integrations (CRM, calendar)",
        ],
      },
      {
        name: "Enterprise",
        description: "For chains with multiple locations",
        price: 0, yearlyPrice: 0,
        setupFee: 0,
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
function PricingSwitch({
  isYearly,
  onToggle,
  labels,
  save,
}: {
  isYearly: boolean;
  onToggle: () => void;
  labels: { monthly: string; yearly: string };
  save: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <span className={cn("text-sm font-medium transition-colors", !isYearly ? "text-white" : "text-zinc-500")}>
        {labels.monthly}
      </span>
      <button
        onClick={onToggle}
        className={cn(
          "relative h-7 w-12 rounded-full transition-colors duration-300",
          isYearly ? "bg-white" : "bg-zinc-600"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-black transition-transform duration-300 shadow-sm",
            isYearly && "translate-x-5"
          )}
        />
      </button>      <span className={cn("text-sm font-medium transition-colors", isYearly ? "text-white" : "text-zinc-500")}>
        {labels.yearly}
      </span>
      {isYearly && (
        <span className="text-xs font-semibold text-green-400 bg-green-900/40 px-2 py-0.5 rounded-full">
          {save}
        </span>
      )}
    </div>
  );
}

export default function Pricing({ lang = "no" }: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);
  const t = content[lang];

  return (
    <section
      id="priser"
      className="pt-10 md:pt-14 pb-16 md:pb-24 bg-black"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <ScrollPang className="text-center mb-8">
          <span className="inline-block text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-3">
            {t.label}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">            {t.heading}{" "}
            <span className="text-zinc-400">{t.headingAccent}</span>
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-md mx-auto">
            {t.subtext}
          </p>
        </ScrollPang>

        {/* Toggle */}
        <ScrollPang offset={1}>
          <PricingSwitch
            isYearly={isYearly}
            onToggle={() => setIsYearly(!isYearly)}
            labels={{ monthly: t.monthly, yearly: t.yearly }}
            save={t.save}
          />
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
              >                {plan.popular && (
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
                  <div className="flex items-baseline gap-1 mb-4">
                    {plan.price > 0 ? (
                      <>
                        <span className="text-3xl font-bold text-white">
                          <NumberFlow
                            value={isYearly ? plan.yearlyPrice : plan.price}
                            format={{ style: "currency", currency: "NOK", maximumFractionDigits: 0 }}
                          />
                        </span>
                        <span className="text-xs text-zinc-500">
                          {isYearly ? t.perYear : t.perMonth}
                        </span>
                      </>
                    ) : (                      <span className="text-2xl font-bold text-white">
                        {t.ctaEnterprise}
                      </span>
                    )}
                  </div>

                  {plan.setupFee > 0 && (
                    <div className="mb-4 text-xs">
                      {isYearly ? (
                        <span className="text-green-400 font-semibold">{t.setupFree} ✓</span>
                      ) : (
                        <span className="text-zinc-500">{t.setupLabel}: <span className="text-zinc-300 font-medium">{plan.setupFee.toLocaleString("nb-NO")} kr</span></span>
                      )}
                    </div>
                  )}

                  <a
                    href={plan.name === "Enterprise" ? "#kontakt" : "https://cal.com/arxon/30min"}
                    target={plan.name === "Enterprise" ? undefined : "_blank"}
                    rel={plan.name === "Enterprise" ? undefined : "noopener noreferrer"}
                    className={cn(
                      "block w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200",
                      plan.popular
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                    )}
                  >
                    {plan.name === "Enterprise" ? t.ctaEnterprise : t.cta}
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
                      </div>                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollPang>
          ))}
        </div>

        {/* VAT note */}
        <ScrollPang offset={2} className="text-center mt-6">
          <p className="text-xs text-neutral-400">{t.vat}</p>
        </ScrollPang>
      </div>
    </section>
  );
}