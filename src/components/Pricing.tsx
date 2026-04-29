"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCheck } from "lucide-react";
import { useState } from "react";
import ScrollPang from "./ScrollPang";

interface PricingProps {
  lang?: "no" | "en";
}

type BillingPeriod = "monthly" | "annual";

type PlanKey = "lite" | "pro" | "scale" | "enterprise";

interface PlanCopy {
  key: PlanKey;
  name: string;
  tagline: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  setupMonthly: string;
  setupAnnual: string;
  popular: boolean;
  custom: boolean;
  includes: string[];
}

const planData = {
  no: {
    label: "PAKKER",
    heading: "Tre pakker for SMB-er,",
    headingAccent: "én skreddersydd for kjeder.",
    subtext:
      "Faste priser. Ingen bindingstid. Velg månedlig eller årlig — årlig gir 16-20 % rabatt og gratis oppsett på Lite og Pro.",
    toggle: { monthly: "Månedlig", annual: "Årlig" },
    saveBadge: "Spar 16-20 %",
    perMonth: "kr/mnd",
    annualSuffix: "kr/år",
    annualEquivPrefix: "tilsv.",
    setupHint: "Oppsett:",
    setupFree: "GRATIS",
    cta: "Kjøp nå",
    ctaDemo: "Book demo",
    ctaEnterprise: "Snakk med oss",
    ctaError: "Kunne ikke starte betaling. Prøv igjen eller send e-post til kontakt@arxon.no",
    note: "Alle priser eks. mva. Ingen bindingstid på noen pakker. Volum-overskridelse varsles ved 80 % av grensen — du velger oppgradering, ekstra-pakke eller pause.",
    plans: [
      {
        key: "lite",
        name: "Lite",
        tagline: "Mottak",
        description: "Telefonen tatt 24/7 for enkeltmannsforetak og små bedrifter.",
        monthlyPrice: 990,
        annualPrice: 9990,
        setupMonthly: "Oppsett 4 990 kr",
        setupAnnual: "Oppsett: GRATIS",
        popular: false,
        custom: false,
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
        key: "pro",
        name: "Pro",
        tagline: "Vekst",
        description: "Mest valgt — full innsikt, integrasjoner og web-chat.",
        monthlyPrice: 2990,
        annualPrice: 28704,
        setupMonthly: "Oppsett 9 990 kr",
        setupAnnual: "Oppsett: GRATIS",
        popular: true,
        custom: false,
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
        key: "scale",
        name: "Scale",
        tagline: "Digital partner",
        description: "Hele den digitale stacken under ett tak — slipp 4 leverandører.",
        monthlyPrice: 7990,
        annualPrice: 76704,
        setupMonthly: "Oppsett 49 990 kr",
        setupAnnual: "Oppsett 24 990 kr (50 % rabatt)",
        popular: false,
        custom: false,
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
        key: "enterprise",
        name: "Enterprise",
        tagline: "Skreddersydd",
        description: "Kjeder, franchise og bedrifter med 5+ lokasjoner.",
        monthlyPrice: null,
        annualPrice: null,
        setupMonthly: "Oppsett: 25 000 – 150 000 kr",
        setupAnnual: "Oppsett: 25 000 – 150 000 kr",
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
    ] as PlanCopy[],
  },
  en: {
    label: "PACKAGES",
    heading: "Three packages for SMBs,",
    headingAccent: "one tailored for chains.",
    subtext:
      "Fixed pricing. No lock-in. Pick monthly or annual — annual saves 16-20 % and includes free setup on Lite and Pro.",
    toggle: { monthly: "Monthly", annual: "Annual" },
    saveBadge: "Save 16-20 %",
    perMonth: "kr/mo",
    annualSuffix: "kr/yr",
    annualEquivPrefix: "≈",
    setupHint: "Setup:",
    setupFree: "FREE",
    cta: "Buy now",
    ctaDemo: "Book demo",
    ctaEnterprise: "Talk to us",
    ctaError: "Could not start checkout. Try again or email kontakt@arxon.no",
    note: "All prices excl. VAT. No lock-in on any plan. Volume overage is signalled at 80 % — you choose upgrade, top-up pack, or pause.",
    plans: [
      {
        key: "lite",
        name: "Lite",
        tagline: "Reception",
        description: "Phone covered 24/7 for sole proprietors and small businesses.",
        monthlyPrice: 990,
        annualPrice: 9990,
        setupMonthly: "Setup 4 990 kr",
        setupAnnual: "Setup: FREE",
        popular: false,
        custom: false,
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
        key: "pro",
        name: "Pro",
        tagline: "Growth",
        description: "Most chosen — full insight, integrations, and web chat.",
        monthlyPrice: 2990,
        annualPrice: 28704,
        setupMonthly: "Setup 9 990 kr",
        setupAnnual: "Setup: FREE",
        popular: true,
        custom: false,
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
        key: "scale",
        name: "Scale",
        tagline: "Digital partner",
        description: "The whole digital stack under one roof — skip 4 vendors.",
        monthlyPrice: 7990,
        annualPrice: 76704,
        setupMonthly: "Setup 49 990 kr",
        setupAnnual: "Setup 24 990 kr (50 % off)",
        popular: false,
        custom: false,
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
        key: "enterprise",
        name: "Enterprise",
        tagline: "Bespoke",
        description: "Chains, franchises, and businesses with 5+ locations.",
        monthlyPrice: null,
        annualPrice: null,
        setupMonthly: "Setup: 25 000 – 150 000 kr",
        setupAnnual: "Setup: 25 000 – 150 000 kr",
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
    ] as PlanCopy[],
  },
};

function formatNok(amount: number): string {
  return new Intl.NumberFormat("nb-NO").format(amount);
}

export default function Pricing({ lang = "no" }: PricingProps) {
  const t = planData[lang];
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [loadingKey, setLoadingKey] = useState<PlanKey | null>(null);

  async function handleCheckout(plan: PlanCopy) {
    if (plan.custom) {
      // Enterprise: route til kontaktskjema
      window.location.hash = "kontakt";
      return;
    }
    setLoadingKey(plan.key);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.key,
          cycle: period === "annual" ? "yearly" : "monthly",
        }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url as string;
        return;
      }
      // Fallback: hvis Stripe ikke er konfigurert, gå til kontaktskjema
      console.warn("Checkout returned no URL, falling back to demo:", data);
      window.location.hash = "kontakt";
    } catch (err) {
      console.error("Checkout failed:", err);
      window.location.hash = "kontakt";
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <section id="priser" className="pt-10 md:pt-14 pb-16 md:pb-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <ScrollPang className="text-center mb-8">
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

        {/* Billing-period toggle */}
        <ScrollPang className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-zinc-900 border border-zinc-800">
            <button
              type="button"
              onClick={() => setPeriod("monthly")}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                period === "monthly"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {t.toggle.monthly}
            </button>
            <button
              type="button"
              onClick={() => setPeriod("annual")}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 inline-flex items-center gap-2",
                period === "annual"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {t.toggle.annual}
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full",
                  period === "annual"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-emerald-500/20 text-emerald-400"
                )}
              >
                {t.saveBadge}
              </span>
            </button>
          </div>
        </ScrollPang>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {t.plans.map((plan, i) => {
            const showAnnual = period === "annual" && plan.annualPrice !== null;
            const monthlyEquivalent =
              showAnnual && plan.annualPrice
                ? Math.round(plan.annualPrice / 12)
                : null;

            return (
              <ScrollPang key={plan.key} offset={i}>
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
                    <div className="mb-4 min-h-[88px]">
                      {plan.custom ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-bold text-white">
                            {lang === "no" ? "Forhandlet" : "Custom"}
                          </span>
                        </div>
                      ) : showAnnual && monthlyEquivalent && plan.annualPrice ? (
                        <>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-bold text-white tabular-nums">
                              {formatNok(monthlyEquivalent)}
                            </span>
                            <span className="text-sm text-zinc-500">
                              {t.perMonth}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-1">
                            <span className="text-zinc-600">
                              {t.annualEquivPrefix}{" "}
                            </span>
                            {formatNok(plan.annualPrice)} {t.annualSuffix}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-bold text-white tabular-nums">
                              {plan.monthlyPrice
                                ? formatNok(plan.monthlyPrice)
                                : "—"}
                            </span>
                            <span className="text-sm text-zinc-500">
                              {t.perMonth}
                            </span>
                          </div>
                          {plan.annualPrice && (
                            <p className="text-[11px] text-zinc-500 mt-1">
                              <span className="text-zinc-600">
                                {lang === "no" ? "Årlig:" : "Annual:"}{" "}
                              </span>
                              {formatNok(plan.annualPrice)} {t.annualSuffix}
                            </p>
                          )}
                        </>
                      )}
                      <p className="text-[11px] text-zinc-500 mt-1">
                        {showAnnual ? plan.setupAnnual : plan.setupMonthly}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCheckout(plan)}
                      disabled={loadingKey === plan.key}
                      className={cn(
                        "block w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200 mb-5 disabled:opacity-60 disabled:cursor-not-allowed",
                        plan.popular
                          ? "bg-white text-black hover:bg-zinc-200"
                          : "bg-zinc-800 text-white hover:bg-zinc-700"
                      )}
                    >
                      {loadingKey === plan.key
                        ? lang === "no"
                          ? "Sender deg…"
                          : "Redirecting…"
                        : plan.custom
                          ? t.ctaEnterprise
                          : t.cta}
                    </button>

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
            );
          })}
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
