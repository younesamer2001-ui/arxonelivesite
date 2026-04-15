'use client'

import { NavBar } from "@/components/ui/tube-light-navbar"
import { navItems } from "@/lib/nav-items"
import { useLang } from "@/lib/lang-context"
import { CinematicHero } from "@/components/ui/cinematic-landing-hero"
// LiquidGlassHero removed
import Analytics from "@/components/Analytics"
import Integrations from "@/components/Integrations"
import MeetAgents from "@/components/MeetAgents"
import Pricing from "@/components/Pricing"
import ProcessSteps from "@/components/ProcessSteps"
import FAQ from "@/components/FAQ"
import ContactSection from "@/components/ContactSection"
import { Footer } from "@/components/ui/footer-section"
// import ComparisonSection from "@/components/ComparisonSection"
// import LiveActivityTicker from "@/components/LiveActivityTicker"
// CTASection removed



export default function HomePage() {
  const { lang: currentLang, setLang: setCurrentLang } = useLang()
  const items = navItems[currentLang]


  return (
    <main className="bg-black min-h-screen text-white">

      <NavBar
        items={items}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
      />

      {/* ===== HERO: CinematicHero ===== */}
      <section id="hjem">
        <CinematicHero lang={currentLang} />
      </section>

      <div className="bg-black">

        {/* Integrasjoner */}
        <Integrations lang={currentLang} />

        {/* Analyse og innsikt */}
        <Analytics lang={currentLang} />

        {/* Prøv AI-en */}
        <section id="prov-ai">
          <MeetAgents lang={currentLang} />
        </section>

        {/* Priser */}
        <section id="priser">
          <Pricing lang={currentLang} />
        </section>

        {/* Slik kommer du i gang — steg for steg */}
        <ProcessSteps lang={currentLang} />

        {/* FAQ */}
        <FAQ lang={currentLang} />

        {/* Kontakt */}
        <section id="kontakt">
          <ContactSection lang={currentLang} />
        </section>

        <Footer />
      </div>
    </main>
  )
}
