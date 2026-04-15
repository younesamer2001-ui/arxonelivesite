'use client'

import About from "@/components/About"
import { NavBar } from "@/components/ui/tube-light-navbar"
import { Footer } from "@/components/ui/footer-section"
import { navItems } from "@/lib/nav-items"
import { useLang } from "@/lib/lang-context"

export default function OmOssPage() {
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
        <About lang={currentLang} />
      </div>
      
      <Footer />
    </main>
  )
}
