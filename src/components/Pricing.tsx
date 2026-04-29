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
    heading: "Tre pakker for SMB-er,",
    headingAccent: "én skreddersydd for kjeder.",
    subtext:
      "Faste priser. Ingen bindingstid. Velg månedlig eller årlig — årlig gir 16-20 % rabatt og gratis oppsett på Lite og Pro.",
    perMonth: "kr/mnd",
    yearlyHint: "Årlig:",
    setupHint: "Oppsett:",
    setupFree: "GRATIS",
    setupAnnualHint: "ved årlig betaling",
    cta: "Book en gratis demo",
    ctaEnterprise: "Snakk med oss",
    note: "Alle priser eks. mva. Ingen bindingstid på noen pakker. Volum-overskridelse varsles ved 80 % av grensen — du velger oppgradering, ekstra-pakke eller pause.",
    plans: [
      {
        name: "Lite",
        tagline: "Mottak",
        description: "Telefonen tatt 24/7 for enkeltmannsforetak og små bedrifter.",
        price: "990",
        yearly: "9 990 kr/år",
        setup: "4 990 kr",
        setupAnnualFree: true,
        popular: false,
        includes: [
          "AI-resepsjonist 24/7 på flytende norsk",
          "Booking direkte i Cal.com",
          "SMS-bekreftelse + påminnelse",
          "E-post-varsel ved hver booking",
          "Ukentlig sammendrag på e-post",
          "Tilgang til samtale-opptak (30 dager)",
          "300 minutter telefon + 200 SMS / mnd",
          "1 telefonnummer",
          "E-post-support",
        ],
      },
      {
        name: "Pro",
        tagline: "Vekst",
        description: "Mest valgt — full innsikt, integrasjoner og web-chat.",
        price: "2 990",
        yearly: "28 704 kr/år",
        setup: "9 990 kr",
        setupAnnualFree: true,
        popular: true,
        includes: [
          "Alt i Lite, pluss:",
          "Sanntids-dashboard (transcripts, søk, tagging)",
          "Integrasjoner: Google Calendar, Outlook, HubSpot, Timely",
          "Branded web-chat-widget på nettsiden",
          "Multi-agent: telefon + chat + SMS-agent",
          "Dedikert kontaktperson + telefon-support",
          "Månedlig optimalisering-sesjon (30 min)",
          "1 200 min telefon + 1 000 SMS / mnd",
          "Inntil 3 telefonnumre + 3 booking-typer",
        ],
      },
      {
        name: "Scale",
        tagline: "Digital partner",
        description: "Hele den digitale stacken under ett tak — slipp 4 leverandører.",
        price: "7 990",
        yearly: "76 704 kr/år",
        setup: "49 990 kr",
        setupAnnualHalf: true,
        popular: false,
        includes: [
          "Alt i Pro, pluss:",
          "Branded Next.js-nettside med drift inkludert",
          "Aktiv SEO + vekst-pakke (kvartalsvis)",
          "Bransje-tilpasset AI-modell trent på din nisje",
          "3 custom n8n-automatiseringer",
          "1 nisje-solutions-pakke",
          "2 500 min telefon + ubegrenset SMS",
          "Multi-agent (5) + opptil 3 lokasjoner",
          "Onboarding 4-6 uker",
        ],
      },
      {
        name: "Enterprise",
        tagline: "Skreddersydd",
        description: "Kjeder, franchise og bedrifter med 5+ lokasjoner.",
        price: "Forhandlet",
        yearly: "Volumrabatt",
        setup: "25 000 – 150 000 kr",
        popular: false,
        custom: true,
        includes: [
          "Alt i Scale, pluss:",
          "Multi-lokasjon-styring (sentral konsoll)",
          "Custom ERP- og bransje-integrasjoner",
          "API-tilgang",
          "Mobilapp (kunde- og/eller ansatt-app)",
          "E-post-bot med tråd-håndtering",
          "SLA-garanti",
          "Dedikert team",
        ],
      },
    ],
  },
  en: {
    label: "PACKAGES",
    heading: "Three packages for SMBs,",
    headingAccent: "one tailored for chains.",
    subtext:
      "Fixed pricing. No lock-in. Pick monthly or annual — annual saves 16-20 % and includes free setup on Lite and Pro.",
    perMonth: "kr/mo",
    yearlyHint: "Annual:",
    setupHint: "Setup:",
    setupFree: "FREE",
    setupAnnualHint: "with annual billing",
    cta: "Book a free demo",
    ctaEnterprise: "Talk to us",
    note: "All prices excl. VAT. No lock-in on any plan. Volume overage is signalled at 80 % — you choose upgrade, top-up pack, or pause.",
    plans: [
      {
        name: "Lite",
        tagline: "Reception",
        description: "Phone covered 24/7 for sole proprietors and small businesses.",
        price: "990",
        yearly: "9 990 kr/yr",
        setup: "4 990 kr",
        setupAnnualFree: true,
        popular: false,
        includes: [
          "AI receptionist 24/7 in fluent Norwegian",
          "Booking directly in Cal.com",
          "SMS confirmation + reminder",
          "Email alert on every booking",
          "Weekly summary by email",
          "Call recording access (30 days)",
          "300 phone min + 200 SMS / mo",
          "1 phone number",
          "Email support",
        ],
      },
      {
        name: "Pro",
        tagline: "Growth",
        description: "Most chosen — full insight, integrations, and web chat.",
        price: "2 990",
        yearly: "28 704 kr/yr",
        setup: "9 990 kr",
        setupAnnualFree: true,
        popular: true,
        includes: [
          "Everything in Lite, plus:",
          "Real-time dashboard (transcripts, search, tagging)",
          "Integrations: Google Calendar, Outlook, HubSpot, Timely",
          "Branded web chat widget on your website",
          "Multi-agent: phone + chat + SMS agent",
          "Dedicated contact + phone support",
          "Monthly optimisation session (30 min)",
          "1 200 phone min + 1 000 SMS / mo",
          "Up to 3 phone numbers + 3 booking types",
        ],
      },
      {
        name: "Scale",
        tagline: "Digital partner",
        description: "The whole digital stack under one roof — skip 4 vendors.",
        price: "7 990",
        yearly: "76 704 kr/yr",
        setup: "49 990 kr",
        setupAnnualHalf: true,
        popular: false,
        includes: [
          "Everything in Pro, plus:",
          "Branded Next.js website with hosting included",
          "Active SEO + growth pack (quarterly)",
          "Industry-tuned AI model trained on your niche",
          "3 custom n8n automations",
          "1 niche solutions pack",
          "2 500 phone min + unlimited SMS",
          "Multi-agent (5) + up to 3 locations",
          "Onboarding 4-6 weeks",
        ],
      },
      {
        name: "Enterprise",
        tagline: "Bespoke",
        description: "Chains, franchises, and businesses with 5+ locations.",
        price: "Custom",
        yearly: "Volume discount",
        setup: "25 000 – 150 000 kr",
        popular: false,
        custom: true,
        includes: [
          "Everything in Scale, plus:",
          "Multi-location management (central console)",
          "Custom ERP & industry integrations",
          "API access",
          "Mobile app (customer and/or staff)",
          "Email bot with thread handling",
          "SLA guarantee",
          "Dedicated team",
        ],
      },
    ],
  },
};

export default function Pricing({ lang = "no" }: PricingProps) {
  const t = content[lang];

  return (
    <section id="priser" className="pt-10 md:pt-14 pb-16 md:pb-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <ScrollPang className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-3">
            {t.label}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            {t.heading}{" "}
            <span className="text-zinc-400">{t.headingAccent}</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 max-w-xl mx-auto">
            {t.subtext}
          </p>
        </ScrollPang>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {t.plans.map((plan, i) => (
            <ScrollPang key={plan.name} offset={i}>
              <Card
                className={cn(
                  "relative rounded-2xl border bg-zinc-900 transition-shadow duration-300 h-full flex flex-col",
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
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {plan.name}
                      </h3>
                      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-0.5">
                        {plan.tagline}
                      </p>
                    </div>
                    {plan.popular && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-white text-black px-2 py-0.5 rounded-full">
                        Populær
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent className="px-5 pb-5 flex-1 flex flex-col">
                  {/* Price block */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1.5">
                      {plan.custom ? (
                        <span className="text-2xl font-bold text-white">
                          {plan.price}
                        </span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-white tabular-nums">
                            {plan.price}
                          </span>
                          <span className="text-sm text-zinc-500">
                            {t.perMonth}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-[11px] text-zinc-500">
                        <span className="text-zinc-600">{t.yearlyHint}</span>{" "}
                        {plan.yearly}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        <span className="text-zinc-600">{t.setupHint}</span>{" "}
                        {plan.setupAnnualFree ? (
                          <>
                            {plan.setup} ·{" "}
                            <span className="text-emerald-400 font-medium">
                              {t.setupFree}
                            </span>{" "}
                            <span className="text-zinc-600">
                              {t.setupAnnualHint}
                            </span>
                          </>
                        ) : plan.setupAnnualHalf ? (
                          <>
                            {plan.setup} · 50 % rabatt årlig
                          </>
                        ) : (
                          plan.setup
                        )}
                      </p>
                    </div>
                  </div>

                  <a
                    href="#kontakt"
                    className={cn(
                      "block w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200 mb-5",
                      plan.popular
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                    )}
                  >
                    {plan.custom ? t.ctaEnterprise : t.cta}
                  </a>

                  <div className="space-y-2 flex-1">
                    {plan.includes.map((item, j) => {
                      const isHeader =
                        item.startsWith("Alt i") ||
                        item.startsWith("Everything in");
                      return (
                        <div key={j} className="flex items-start gap-2">
                          {isHeader ? (
                            <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wide">
                              {item}
                            </span>
                          ) : (
                            <>
                              <CheckCheck className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0" />
                              <span className="text-xs text-zinc-400 leading-snug">
                                {item}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </ScrollPang>
          ))}
        </div>

        {/* Footer note */}
        <ScrollPang offset={2} className="text-center mt-8">
          <p className="text-xs text-neutral-400 max-w-2xl mx-auto">
            {t.note}
          </p>
        </ScrollPang>
      </div>
    </section>
  );
}
