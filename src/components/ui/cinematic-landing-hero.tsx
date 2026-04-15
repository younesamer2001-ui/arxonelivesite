// src/components/ui/cinematic-landing-hero.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }
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
  }  .brand-watermark {
      font-family: var(--font-grift), sans-serif;
      font-weight: 900;
      font-size: clamp(8rem, 20vw, 22rem);
      line-height: 1;
      letter-spacing: -0.04em;
      color: transparent;
      -webkit-text-stroke: 1px rgba(255,255,255,0.06);
      user-select: none;
      pointer-events: none;
      white-space: nowrap;
  }
  .intro-heading {
      font-family: var(--font-grift), sans-serif;
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
          inset -1px 0 1px rgba(255,255,255,0.15),          inset 1px 0 2px rgba(0,0,0,0.8);
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
  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;  }
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
      introHeading: "Kundeservice,\npå autopilot.",
      introDescription: "Arxon fanger opp det kundene dine faktisk sier — og gjør det om til bookinger, innsikt og vekst. Automatisk, døgnet rundt.",
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
      introHeading: "Customer service,\non autopilot.",      introDescription: "Arxon captures what your customers actually say — and turns it into bookings, insights and growth. Automatically, around the clock.",
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
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  /* ── subtle mouse-follow tilt on the phone ── */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mockupRef.current) {
          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(mockupRef.current, {
            rotationY: xVal * 12,
            rotationX: -yVal * 12,            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  /* ── GSAP scroll animation ── */
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      /* ── initial states ── */
      gsap.set(".text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".phone-scene", { autoAlpha: 0, y: "110vh", scale: 0.6, rotationX: 45, rotationY: -15 });
      gsap.set([".floating-badge", ".phone-widget"], { autoAlpha: 0 });
      gsap.set(".brand-watermark", { autoAlpha: 0, scale: 0.8, filter: "blur(40px)" });
      gsap.set(".intro-block", { autoAlpha: 0, x: -80, filter: "blur(20px)" });
      gsap.set(".cta-wrapper", { autoAlpha: 0, y: 60, filter: "blur(20px)" });
      /* ── intro text animation ── */
      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".text-days", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      /* ── scroll timeline ── */
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: isMobile ? "+=3000" : "+=5000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        /* Phase 1: hero text fades up & out, phone rises from below */
        .to(".hero-text-wrapper", {
          y: -120,
          scale: 1.1,
          filter: "blur(30px)",
          opacity: 0,
          ease: "power2.inOut",
          duration: 2,
        }, 0)
        .to(".phone-scene", {          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          ease: "expo.out",
          duration: 3,
        }, 0.3)
        .to(".brand-watermark", {
          autoAlpha: 1,
          scale: 1,
          filter: "blur(0px)",
          ease: "expo.out",
          duration: 2.5,
        }, 0.8)
        .to(".intro-block", {
          autoAlpha: 1,
          x: 0,
          filter: "blur(0px)",
          ease: "expo.out",
          duration: 2,
        }, 1.2)

        /* Phase 2: widgets & badges fly in, counter animates */
        .fromTo(".phone-widget",
          { y: 30, autoAlpha: 0, scale: 0.95 },
          { y: 0, autoAlpha: 1, scale: 1, stagger: 0.12, ease: "back.out(1.2)", duration: 1.2 },
          "-=1.2"
        )        .to(".progress-ring", { strokeDashoffset: 60, duration: 1.8, ease: "power3.inOut" }, "-=1.0")
        .to(".counter-val", { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 1.8, ease: "expo.out" }, "-=1.8")
        .fromTo(".floating-badge",
          { y: 80, autoAlpha: 0, scale: 0.7, rotationZ: -8 },
          { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.2, stagger: 0.15 },
          "-=1.5"
        )

        /* Phase 3: hold — let the user admire */
        .to({}, { duration: 2.5 })

        /* Phase 4: everything drifts up & out, CTA fades in */
        .to([".phone-scene", ".floating-badge", ".brand-watermark", ".intro-block"], {
          y: -200,
          scale: 0.7,
          autoAlpha: 0,
          ease: "power3.inOut",
          duration: 1.5,
          stagger: 0.05,
        })
        .to(".cta-wrapper", {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "expo.out",
          duration: 1.5,
        }, "-=1.0")

        /* Phase 5: hold CTA, then scroll away */
        .to({}, { duration: 2 });
    }, containerRef);
    return () => ctx.revert();
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black text-white font-sans antialiased",
        className,
      )}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />

      {/* ═══ Hero Text ═══ */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform">
        <h1 className="text-track gsap-reveal text-3d-matte text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-2">
          {t.tagline1}
        </h1>
        <h1 className="text-days gsap-reveal text-silver-matte text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter">
          {t.tagline2}
        </h1>
      </div>
      {/* ═══ CTA (appears after phone exits) ═══ */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-silver-matte">
          {t.ctaHeading}
        </h2>
        <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
          {t.ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <LiquidMetalButton label={t.ctaPrimary} href="#kontakt" width={240} height={56} />
          <LiquidMetalButton label={t.ctaSecondary} href="#priser" width={200} height={56} />
        </div>
      </div>

      {/* ═══ Brand Watermark — large ARXON behind the phone ═══ */}
      <div className="brand-watermark absolute z-[15] flex items-center justify-end pr-[5vw] w-screen will-change-transform" aria-hidden="true">
        ARXON
      </div>

      {/* ═══ Intro Text Block — left side ═══ */}
      <div className="intro-block absolute z-[25] left-[5vw] md:left-[8vw] top-1/2 -translate-y-1/2 max-w-[340px] lg:max-w-[420px] hidden lg:block will-change-transform">
        <h2 className="intro-heading text-3xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.1] whitespace-pre-line">
          {t.introHeading}
        </h2>
        <p className="text-zinc-400 text-base lg:text-lg leading-relaxed font-light">
          <span className="text-white font-semibold">Arxon</span> {t.introDescription.replace('Arxon ', '')}
        </p>
      </div>
      {/* ═══ Phone Scene — rises directly, no card wrapper ═══ */}
      <div
        className="phone-scene absolute z-20 flex items-center justify-center will-change-transform lg:translate-x-[10vw]"
        style={{ perspective: "1000px" }}
      >
        <div className="relative flex items-center justify-center transform scale-[0.65] md:scale-85 lg:scale-100">
          {/* iPhone Mockup */}
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
              </div>              {/* App Interface */}
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
                    <circle className="progress-ring" cx="88" cy="88" r="64" fill="none" stroke="#10b981" strokeWidth="12" />
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
                  </div>                  <div className="phone-widget widget-depth rounded-2xl p-3 flex items-center">
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
          <div className="floating-badge absolute flex top-6 lg:top-12 left-[-15px] lg:left-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-900/10 flex items-center justify-center border border-emerald-400/30 shadow-inner">
              <span className="text-base lg:text-xl drop-shadow-lg">📅</span>
            </div>
            <div>
              <p className="text-white text-xs lg:text-sm font-bold tracking-tight">{t.badge1}</p>
              <p className="text-emerald-200/50 text-[10px] lg:text-xs font-medium">{t.badge1Sub}</p>
            </div>
          </div>          <div className="floating-badge absolute flex bottom-12 lg:bottom-20 right-[-15px] lg:right-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
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
    </div>
  );
}