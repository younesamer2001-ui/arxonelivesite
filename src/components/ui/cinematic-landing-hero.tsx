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
  }  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter:
          drop-shadow(0px 12px 24px rgba(0,0,0,0.8))
          drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }
  .main-card {
      background: transparent;
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
  }  .screen-glare {
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
      stroke-linecap: round;
  }
`;export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
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
      cardHeading: "Kundeservice,\npå autopilot.",
      cardDescription: "fanger opp det kundene dine faktisk sier — og gjør det om til bookinger, innsikt og vekst. Automatisk, døgnet rundt.",
      metricLabel: "Samtaler",
      ctaHeading: "Klar til å starte?",
      ctaDescription: "Book en konsultasjon og se hvordan Arxon kan håndtere dine kundesamtaler fra dag én.",
      ctaPrimary: "Book konsultasjon",
      ctaSecondary: "Se priser",
      badge1: "Ny booking",
      badge1Sub: "Klipp & Vask — 14:00",
      badge2: "SMS sendt",
      badge2Sub: "Bekreftelse levert ✅",
    },    en: {
      tagline1: "Your AI receptionist",
      tagline2: "for smarter operations.",
      cardHeading: "Customer service,\non autopilot.",
      cardDescription: "captures what your customers actually say — and turns it into bookings, insights and growth. Automatically, around the clock.",
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
  // Mouse interaction
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
            rotationX: -yVal * 12,
            ease: "power3.out",
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
  // Cinematic scroll timeline — matches reference structure
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      gsap.set(".text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".text-days", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=7000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
      scrollTl
        // Phase 1: text fades, card rises
        .to([".hero-text-wrapper"], { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        // Phase 2: card expands to fullscreen
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        // Phase 3: phone rises with 3D entrance
        .fromTo(".mockup-scroll-wrapper",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8"
        )
        // Phase 4: widgets + counter + badges animate in
        .fromTo(".phone-widget", { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "-=1.5")
        .to(".progress-ring", { strokeDashoffset: 60, duration: 2, ease: "power3.inOut" }, "-=1.2")
        .to(".counter-val", { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 2, ease: "expo.out" }, "-=2.0")
        .fromTo(".floating-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=2.0")
        // Phase 5: left text + right brand slide in
        .fromTo(".card-left-text", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5")
        .fromTo(".card-right-text", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")        // Phase 6: hold
        .to({}, { duration: 2.5 })
        // Phase 7: prepare CTA
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: 1.5 })
        // Phase 8: everything exits, card shrinks back
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
        // Phase 9: card exits up
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });

    }, containerRef);
    return () => ctx.revert();
  }, [metricValue]);
  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black text-white font-sans antialiased", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />

      {/* Hero text — fades out as card rises */}
      <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform">
        <h1 className="text-track gsap-reveal text-3d-matte text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tight mb-2">
          {t.tagline1}
        </h1>
        <h1 className="text-days gsap-reveal text-silver-matte text-5xl md:text-7xl lg:text-[6rem] font-extrabold tracking-tighter">
          {t.tagline2}
        </h1>
      </div>
      {/* CTA — hidden initially, revealed in Phase 7 */}
      <div className="cta-wrapper absolute z-20 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform" style={{ visibility: "hidden" }}>
        <h2 className="text-3d-matte text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
          {t.ctaHeading}
        </h2>
        <p className="text-zinc-400 text-base md:text-lg max-w-md mb-8">
          {t.ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <LiquidMetalButton label={t.ctaPrimary} href="#kontakt" width={220} height={56} />
          <LiquidMetalButton label={t.ctaSecondary} href="#priser" width={180} height={48} />
        </div>
      </div>

      {/* Main card — rises from below, expands, then exits */}
      <div
        className="main-card absolute z-30 flex items-center justify-center overflow-hidden"
        style={{
          width: "85vw",
          height: "85vh",
          borderRadius: "40px",
          transform: "translateY(120vh)",
          background: "transparent",
        }}
      >
        {/* 3-column grid: left text | phone | right brand */}
        <div className="relative w-full h-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 px-4 lg:px-12">

          {/* Left column: heading + description */}
          <div className="card-left-text flex flex-col items-center lg:items-start text-center lg:text-left order-3 lg:order-1 lg:flex-1 max-w-sm" style={{ visibility: "hidden" }}>
            <h2 className="text-3d-matte text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight whitespace-pre-line mb-3">
              {t.cardHeading}
            </h2>
            <p className="text-zinc-400 text-sm md:text-base lg:text-lg leading-relaxed">
              <span className="text-white font-semibold">Arxon</span> {t.cardDescription}
            </p>
          </div>

          {/* Center column: iPhone mockup */}
          <div className="mockup-scroll-wrapper order-2 lg:order-2 flex-shrink-0" style={{ perspective: "1200px", transformStyle: "preserve-3d", visibility: "hidden" }}>
            <div
              className="iphone-bezel relative"
              style={{
                width: "clamp(220px, 28vw, 320px)",
                height: "clamp(440px, 56vw, 640px)",
                borderRadius: "44px",
                border: "4px solid #2a2a2e",
                background: "linear-gradient(145deg, #1c1c1e 0%, #0d0d0d 100%)",
                boxShadow: "0 0 0 2px #3a3a3c, inset 0 0 30px rgba(0,0,0,0.6), 0 40px 80px rgba(0,0,0,0.8)",
                overflow: "hidden",
                transformStyle: "preserve-3d",
              }}
            >

              {/* Hardware buttons */}
              <div className="hardware-btn" style={{ position: "absolute", right: "-6px", top: "120px", width: "3px", height: "60px", background: "#3a3a3c", borderRadius: "2px" }} />
              <div className="hardware-btn" style={{ position: "absolute", left: "-6px", top: "100px", width: "3px", height: "30px", background: "#3a3a3c", borderRadius: "2px" }} />
              <div className="hardware-btn" style={{ position: "absolute", left: "-6px", top: "150px", width: "3px", height: "50px", background: "#3a3a3c", borderRadius: "2px" }} />
              <div className="hardware-btn" style={{ position: "absolute", left: "-6px", top: "210px", width: "3px", height: "50px", background: "#3a3a3c", borderRadius: "2px" }} />

              {/* Dynamic Island */}
              <div style={{ position: "absolute", top: "12px", left: "50%", transform: "translateX(-50%)", width: "90px", height: "28px", background: "#000", borderRadius: "20px", zIndex: 20 }} />

              {/* Screen glare */}
              <div className="screen-glare" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)", zIndex: 15, pointerEvents: "none", borderRadius: "40px" }} />

              {/* Phone screen content */}
              <div style={{ position: "absolute", inset: "8px", borderRadius: "36px", overflow: "hidden", background: "linear-gradient(180deg, #111113 0%, #0a0a0b 100%)" }}>
                {/* Status bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px 8px", fontSize: "12px", fontWeight: 600, color: "#fff" }}>
                  <span>9:41</span>
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <div style={{ width: "16px", height: "10px", border: "1px solid #fff", borderRadius: "2px", position: "relative" }}>
                      <div style={{ position: "absolute", inset: "1px", right: "3px", background: "#34c759", borderRadius: "1px" }} />
                    </div>
                  </div>
                </div>

                {/* App header */}
                <div style={{ padding: "4px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Arxon</div>
                  <div style={{ fontSize: "11px", color: "#71717a", marginTop: "2px" }}>Dashboard</div>
                </div>

                {/* Metric widget with progress ring */}
                <div className="phone-widget widget-depth" style={{ margin: "16px 16px 12px", padding: "16px", background: "rgba(255,255,255,0.04)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)", visibility: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <svg width="56" height="56" viewBox="0 0 56 56" style={{ flexShrink: 0 }}>
                      <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                      <circle className="progress-ring" cx="28" cy="28" r="24" fill="none" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round"
                        strokeDasharray="150.8" strokeDashoffset="150.8"
                        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
                    </svg>
                    <div>
                      <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                        <span className="counter-val">0</span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "4px" }}>{t.metricLabel}</div>
                    </div>
                  </div>
                </div>

                {/* Booking widget */}
                <div className="phone-widget widget-depth" style={{ margin: "0 16px 10px", padding: "14px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "12px", visibility: "hidden" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📅</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{t.badge1}</div>
                    <div style={{ fontSize: "11px", color: "#71717a" }}>{t.badge1Sub}</div>
                  </div>
                </div>

                {/* SMS widget */}
                <div className="phone-widget widget-depth" style={{ margin: "0 16px 10px", padding: "14px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "12px", visibility: "hidden" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #059669 0%, #34d399 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>💬</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>{t.badge2}</div>
                    <div style={{ fontSize: "11px", color: "#71717a" }}>{t.badge2Sub}</div>
                  </div>
                </div>

              </div>{/* end phone screen */}
            </div>{/* end iphone-bezel */}
          </div>{/* end mockup-scroll-wrapper */}

          {/* Right column: ARXON brand name */}
          <div className="card-right-text flex items-center justify-center order-1 lg:order-3 lg:flex-1" style={{ visibility: "hidden" }}>
            <span
              className="text-card-silver-matte font-bold tracking-tighter select-none"
              style={{
                fontSize: "clamp(3rem, 8vw, 7rem)",
                lineHeight: 0.9,
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                letterSpacing: "-0.04em",
              }}
            >
              ARXON
            </span>
          </div>

        </div>{/* end 3-column grid */}

        {/* Floating badges — animate in from sides */}
        <div className="floating-badge floating-ui-badge" style={{ position: "absolute", top: "18%", left: "4%", visibility: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ fontSize: "14px" }}>📅</span>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>{t.badge1}</div>
              <div style={{ fontSize: "10px", color: "#71717a" }}>{t.badge1Sub}</div>
            </div>
          </div>
        </div>

        <div className="floating-badge floating-ui-badge" style={{ position: "absolute", bottom: "22%", right: "4%", visibility: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ fontSize: "14px" }}>💬</span>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#fff" }}>{t.badge2}</div>
              <div style={{ fontSize: "10px", color: "#71717a" }}>{t.badge2Sub}</div>
            </div>
          </div>
        </div>

      </div>{/* end main-card */}
    </div>
  );
}
