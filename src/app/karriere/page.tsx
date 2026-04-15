'use client'

import Career from "@/components/Career"
import { NavBar } from "@/components/ui/tube-light-navbar"
import { Footer } from "@/components/ui/footer-section"
import { navItems } from "@/lib/nav-items"
import { useLang } from "@/lib/lang-context"

export default function KarrierePage() {
  const { lang: currentLang, setLang: setCurrentLang } = useLang()
  const items = navItems[currentLang]

  return (
    <main className="bg-black min-h-screen text-white">
      <NavBar 
        items={items} 
        currentLang={currentLang}
        onLangChange={setCurrentLang}
      />
      
      <div className="pt-32">
        <Career lang={currentLang} />
      </div>
      
      <Footer />
    </main>
  )
}