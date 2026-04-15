"use client";
import React from "react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { ShoppingCart, PhoneCall, Wrench, Zap } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "@/components/ui/interfaces-carousel";

const i18n = {
  no: {
    heading: "Slik kommer du",
    accent: "i gang.",
    subtext: "Du kjøper — vi tar det derfra. Slik ser prosessen ut etter du har valgt en pakke.",
    steps: [
      { number: "01", title: "Velg pakke", description: "Finn pakken som passer din bedrift. Betal trygt online — ingen skjulte kostnader.", icon: ShoppingCart, glow: "blue" as const },
      { number: "02", title: "Kartleggingscall", description: "Vi booker en samtale der vi kartlegger dine ønsker, åpningstider, tjenester og vanlige kundespørsmål.", icon: PhoneCall, glow: "purple" as const },
      { number: "03", title: "Vi setter opp alt", description: "Basert på samtalen bygger vi din AI-resepsjonist — skreddersydd for din bedrift, klar til bruk.", icon: Wrench, glow: "green" as const },
      { number: "04", title: "Live + optimalisering", description: "AI-en går live og svarer på kundene dine. Vi følger opp og forbedrer løpende basert på ekte samtaledata.", icon: Zap, glow: "orange" as const },
    ],
  },  en: {
    heading: "How to get",
    accent: "started.",
    subtext: "You buy — we take it from there. Here's what happens after you choose a plan.",
    steps: [
      { number: "01", title: "Choose a plan", description: "Find the plan that fits your business. Pay securely online — no hidden costs.", icon: ShoppingCart, glow: "blue" as const },
      { number: "02", title: "Discovery call", description: "We book a call to map out your needs, opening hours, services, and common customer questions.", icon: PhoneCall, glow: "purple" as const },
      { number: "03", title: "We set up everything", description: "Based on the call, we build your AI receptionist — tailored to your business, ready to go.", icon: Wrench, glow: "green" as const },
      { number: "04", title: "Live + optimization", description: "Your AI goes live and handles customer calls. We follow up and improve continuously based on real data.", icon: Zap, glow: "orange" as const },
    ],
  },
};

interface ProcessStepsProps {
  lang?: "no" | "en";
}

function StepCard({ step }: { step: typeof i18n.no.steps[0] }) {
  return (
    <GlowCard glowColor={step.glow} customSize className="!grid-rows-none !aspect-auto h-full">
      <div className="flex flex-col justify-between h-full p-6">
        <div>
          <span className="block text-[11px] font-medium text-zinc-500 tracking-[0.2em] uppercase mb-6">{step.number}</span>
          <div className="w-11 h-11 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mb-6">
            <step.icon className="w-[18px] h-[18px] text-zinc-300" />
          </div>
        </div>
        <div>
          <h3 className="text-[17px] font-semibold text-white mb-2 tracking-tight leading-tight">{step.title}</h3>
          <p className="text-[13px] text-zinc-500 leading-relaxed">{step.description}</p>
        </div>
      </div>
    </GlowCard>
  );
}
export default function ProcessSteps({ lang = "no" }: ProcessStepsProps) {
  const t = i18n[lang];

  return (
    <section className="relative py-14 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-grift), sans-serif' }}>
          {t.heading}{" "}
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">{t.accent}</span>
        </h2>
        <p className="mt-4 text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">{t.subtext}</p>
      </div>

      {/* Mobile: Embla Carousel */}
      <div className="lg:hidden px-4 sm:px-6">
        <Carousel opts={{ align: 'start', loop: false }}>
          <CarouselContent className="-ml-3">
            {t.steps.map((step) => (
              <CarouselItem key={step.number} className="pl-3 basis-[75%] sm:basis-[45%]">
                <StepCard step={step} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots />
        </Carousel>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 gap-5">
          {t.steps.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}