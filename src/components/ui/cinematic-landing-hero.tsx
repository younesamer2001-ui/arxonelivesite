// src/components/ui/cinematic-landing-hero.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

/*
 * GSAP + ScrollTrigger lastes dynamisk (lazy) i useEffect nedenfor.
 * Grunn: ~80KB gzip — statisk import presset dem inn i main-bundle og
 * blokkerte parsing på mobil CPU → LCP >5s. Dynamic import splitter dem
 * ut i eget chunk som hentes parallelt med render.
 */
const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /*
   * Intro-animasjon for hero-tekst (LCP-element).
   * Drevet av CSS @keyframes i stedet for GSAP slik at teksten males ved
   * første paint — compositor-thread tar opacity/transform, ingen JS-parse
   * blokkerer LCP. Visuelt identisk med den gamle GSAP-timelinen.
   * Respekterer prefers-reduced-motion.
   */
  @keyframes heroTextTrackIn {
    0% {
      opacity: 0;
      transform: translateY(60px) scale(0.85) rotateX(-20deg);
      filter: blur(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1) rotateX(0);
      filter: blur(0);
    }
  }
  @keyframes heroTextDaysIn {
    0% { clip-path: inset(0 100% 0 0); -webkit-clip-path: inset(0 100% 0 0); }
    100% { clip-path: inset(0 0% 0 0); -webkit-clip-path: inset(0 0% 0 0); }
  }
  .text-track {
    animation: heroTextTrackIn 1.8s cubic-bezier(0.19, 1, 0.22, 1) 0.15s both;
    transform-style: preserve-3d;
    will-change: opacity, transform, filter;
  }
  .text-days {
    animation: heroTextDaysIn 1.4s cubic-bezier(0.77, 0, 0.175, 1) 0.6s both;
    will-change: clip-path;
  }
  @media (prefers-reduced-motion: reduce) {
    .text-track, .text-days {
      animation: none;
    }
    .text-track { opacity: 1; transform: none; filter: none; }
    .text-days { clip-path: none; -webkit-clip-path: none; }
  }

  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }
  .bg-grid-theme {
      background-size: 60px 60px;
      background-image:
          linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }
  .text-3d-matte {
      color: #fff;
      text-shadow:
          0 10px 30px rgba(255,255,255,0.15),
          0 2px 4px rgba(255,255,255,0.08);
  }
  .text-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.4) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter:
          drop-shadow(0px 10px 20px rgba(255,255,255,0.1))
          drop-shadow(0px 2px 4px rgba(255,255,255,0.06));
  }
  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter:
          drop-shadow(0px 12px 24px rgba(0,0,0,0.8))
          drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }
  .premium-depth-card {
      background: transparent;
      box-shadow: none;
      border: none;
      position: relative;
  }
  .iphone-bezel {
      background-color: #111;
      box-shadow:
          inset 0 0 0 2px #52525B,
          inset 0 0 0 7px #000,
          0 40px 80px -15px rgba(0,0,0,0.9),
          0 15px 25px -5px rgba(0,0,0,0.7);
      transform-style: preserve-3d;
  }
  .hardware-btn {
      background: linear-gradient(90deg, #404040 0%, #171717 100%);
      box-shadow:
          -2px 0 5px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.15),
          inset 1px 0 2px rgba(0,0,0,0.8);
      border-left: 1px solid rgba(255,255,255,0.05);
  }
  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%);
  }
  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow:
          0 10px 20px rgba(0,0,0,0.3),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.03);
  }
  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.1),
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          inset 0 1px 1px rgba(255,255,255,0.2),
          inset 0 -1px 1px rgba(0,0,0,0.5);
  }
  .btn-modern-light, .btn-modern-dark {
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-modern-light {
      background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
      color: #0F172A;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px -2px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:active {
      transform: translateY(1px);
      background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.02);
  }
  .btn-modern-dark {
      background: linear-gradient(180deg, #27272A 0%, #18181B 100%);
      color: #FFFFFF;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:hover {
      transform: translateY(-3px);
      background: linear-gradient(180deg, #3F3F46 0%, #27272A 100%);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.15), 0 6px 12px -2px rgba(0,0,0,0.7), 0 20px 32px -6px rgba(0,0,0,1), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:active {
      transform: translateY(1px);
      background: #18181B;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.05), inset 0 3px 8px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(0,0,0,0.5);
  }
  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;
  }
`;
export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  lang?: "no" | "en";
}
export function CinematicHero({
  lang = "no",
  className,
  ...props
}: CinematicHeroProps) {
  const content = {
    no: {
      tagline1: "Din AI-resepsjonist",
      tagline2: "for smartere drift.",
      cardHeading: "Informasjon som jobber for deg.",
      cardDescription: (<><span className="text-white font-semibold">Arxon</span> fanger opp det kundene dine faktisk sier — og gjør det om til bookinger, innsikt og vekst. Automatisk, døgnet rundt.</>),
      metricLabel: "Samtaler",
      ctaHeading: "Klar til å starte?",
      ctaDescription: "Book en konsultasjon og se hvordan Arxon kan håndtere dine kundesamtaler fra dag én.",
      ctaPrimary: "Book konsultasjon",
      ctaSecondary: "Se priser",
      badge1: "Ny booking",
      badge1Sub: "Klipp & Vask — 14:00",
      badge2: "SMS sendt",
      badge2Sub: "Bekreftelse levert ✅",
    },
    en: {
      tagline1: "Your AI receptionist",
      tagline2: "for smarter operations.",
      cardHeading: "Information that works for you.",
      cardDescription: (<><span className="text-white font-semibold">Arxon</span> captures what your customers actually say — and turns it into bookings, insights and growth. Automatically, around the clock.</>),
      metricLabel: "Calls",
      ctaHeading: "Ready to start?",
      ctaDescription: "Book a consultation and see how Arxon can handle your customer calls from day one.",
      ctaPrimary: "Book consultation",
      ctaSecondary: "See pricing",
      badge1: "New booking",
      badge1Sub: "Cut & Wash — 14:00",
      badge2: "SMS sent",
      badge2Sub: "Confirmation delivered ✅",
    },
  };
  const t = content[lang];
  const metricValue = 47;
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    /*
     * Pointer-tilt på iPhone-mockup. Tidligere brukte vi `gsap.to` med
     * `power3.out`-ease; nå gjør CSS-transition jobben. Samme visuell
     * opplevelse uten å kreve at GSAP er lastet før brukeren flytter
     * musen — det gjør første hover responsiv selv om GSAP-chunken
     * fortsatt er under nedlasting.
     */
    const mockup = mockupRef.current;
    if (mockup) {
      mockup.style.transition = "transform 1.2s cubic-bezier(0.215, 0.61, 0.355, 1)";
    }
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          mockupRef.current.style.transform = `rotateY(${xVal * 12}deg) rotateX(${-yVal * 12}deg)`;
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      // Lazy-importer GSAP + ScrollTrigger etter mount → ikke i main-bundle.
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const isMobile = window.innerWidth < 768;
      ctx = gsap.context(() => {
      // Intro-animasjon for .text-track og .text-days drives nå av CSS
      // @keyframes (se INJECTED_STYLES). GSAP trenger ikke sette opp eller
      // animere intro-staten for tekstene lenger — det frigjør main-thread
      // for LCP og fjerner GSAP-delay på 0.3s + 1.8s fra kritisk render-path.
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".mockup-scroll-wrapper", ".floating-badge", ".phone-widget", ".card-left-text", ".card-right-text"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: isMobile ? "+=1470" : "+=7000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
      scrollTl
        .to([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        .fromTo(".mockup-scroll-wrapper",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8"
        )
        .fromTo(".phone-widget", { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "-=1.5")
        .fromTo(".card-left-text", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5")
        .fromTo(".card-right-text", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")
        .to(".progress-ring", { strokeDashoffset: 60, duration: 2, ease: "power3.inOut" }, "-=1.2")
        .to(".counter-val", { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 2, ease: "expo.out" }, "-=2.0")
        .fromTo(".floating-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=2.0")

        .to({}, { duration: 2.5 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: 1.5 })
        .to([".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05,
        })
        .to(".main-card", {
          width: isMobile ? "92vw" : "85vw",
          height: isMobile ? "92vh" : "85vh",
          borderRadius: isMobile ? "32px" : "40px",
          ease: "expo.inOut",
          duration: 1.8
        }, "pullback")
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });
      }, containerRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black text-white font-sans antialiased", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden="true" />
      {/* Hero Texts */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform">
        <h1 className="text-track text-3d-matte text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-2">
          {t.tagline1}
        </h1>
        <h1 className="text-days text-silver-matte text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter">
          {t.tagline2}
        </h1>
      </div>
      {/* CTA Buttons */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-silver-matte">
          {t.ctaHeading}
        </h2>
        <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
          {t.ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <LiquidMetalButton label={t.ctaPrimary} href="https://cal.com/arxon" width={240} height={56} />
          <LiquidMetalButton label={t.ctaSecondary} href="#priser" width={200} height={56} />
        </div>
      </div>
      {/* The Physical Deep Blue Card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="relative w-full h-full mx-auto flex flex-col justify-evenly lg:grid lg:grid-cols-[1fr_auto_1fr] items-center gap-4 lg:gap-6 z-10 px-4 sm:px-6 lg:px-12 py-6 lg:py-0 overflow-hidden">
            {/* Left Text Block */}
            <div className="card-left-text order-3 lg:order-1 text-center lg:text-left max-w-md lg:justify-self-end px-2 lg:px-0">
              <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-silver-matte mb-2 lg:mb-4 leading-[1.15]">
                {t.cardHeading}
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base md:text-lg font-light leading-relaxed">
                {t.cardDescription}
              </p>
            </div>
            {/* iPhone Mockup */}
            <div className="mockup-scroll-wrapper order-2 relative h-[300px] sm:h-[360px] lg:h-[600px] flex items-center justify-center z-10" style={{ perspective: "1000px" }}>
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.65] md:scale-85 lg:scale-100">
                <div
                  ref={mockupRef}
                  className="relative w-[280px] h-[580px] rounded-[3rem] iphone-bezel flex flex-col will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Hardware Buttons */}
                  <div className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn rounded-l-md z-0" />
                  <div className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" />
                  <div className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" />
                  <div className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn rounded-r-md z-0 scale-x-[-1]" />
                  {/* Screen */}
                  <div className="absolute inset-[7px] bg-[#050914] rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,1)] text-white z-10">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" />
                    {/* Dynamic Island */}
                    <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50 flex items-center justify-end px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                    </div>
                    {/* App Interface */}
                    <div className="relative w-full h-full pt-12 px-5 pb-8 flex flex-col">
                      <div className="phone-widget flex justify-between items-center mb-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">I dag</span>
                          <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">Oversikt</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white/5 text-neutral-200 flex items-center justify-center font-bold text-sm border border-white/10 shadow-lg shadow-black/50">A</div>
                      </div>
                      <div className="phone-widget relative w-44 h-44 mx-auto flex items-center justify-center mb-8 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                          <circle cx="88" cy="88" r="64" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                          <circle className="progress-ring" cx="88" cy="88" r="64" fill="none" stroke="#8B5CF6" strokeWidth="12" />
                        </svg>
                        <div className="text-center z-10 flex flex-col items-center">
                          <span className="counter-val text-4xl font-extrabold tracking-tighter text-white">0</span>
                          <span className="text-[8px] text-emerald-200/50 uppercase tracking-[0.1em] font-bold mt-0.5">{t.metricLabel}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 flex items-center justify-center mr-3 border border-emerald-400/20 shadow-inner">
                            <svg className="w-4 h-4 text-emerald-400 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-white">Ny booking</div>
                            <div className="text-[10px] text-neutral-500">Ola Nordmann — 14:30</div>
                          </div>
                        </div>
                        <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center mr-3 border border-blue-400/20 shadow-inner">
                            <svg className="w-4 h-4 text-blue-400 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-white">SMS sendt</div>
                            <div className="text-[10px] text-neutral-500">Bekreftelse levert ✅</div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>
                {/* Floating Badges */}
                <div className="floating-badge absolute flex top-4 lg:top-12 left-[10px] lg:left-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-2 lg:p-4 items-center gap-2 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-900/10 flex items-center justify-center border border-emerald-400/30 shadow-inner">
                    <span className="text-base lg:text-xl drop-shadow-lg">📅</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">{t.badge1}</p>
                    <p className="text-emerald-200/50 text-[10px] lg:text-xs font-medium">{t.badge1Sub}</p>
                  </div>
                </div>
                <div className="floating-badge absolute flex bottom-8 lg:bottom-20 right-[10px] lg:right-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-2 lg:p-4 items-center gap-2 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-blue-500/20 to-blue-900/10 flex items-center justify-center border border-blue-400/30 shadow-inner">
                    <span className="text-base lg:text-lg drop-shadow-lg">💬</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">{t.badge2}</p>
                    <p className="text-blue-200/50 text-[10px] lg:text-xs font-medium">{t.badge2Sub}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Right ARXON Wordmark */}
            <div className="card-right-text order-1 lg:order-3 text-center lg:text-left w-full lg:justify-self-start">
              <h2 className="text-5xl sm:text-6xl md:text-[6rem] lg:text-[7rem] xl:text-[8rem] font-black uppercase tracking-tighter text-card-silver-matte leading-none whitespace-nowrap">
                ARXON
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
