'use client'

import Terms from "@/components/Terms"
import { NavBar } from "@/components/ui/tube-light-navbar"
import { Footer } from "@/components/ui/footer-section"
import { navItems as sharedNavItems } from '@/lib/nav-items'
import { useLang } from '@/lib/lang-context'

export default function VilkarPage() {
  const { lang: currentLang, setLang: setCurrentLang } = useLang()
  const items = sharedNavItems[currentLang]

  return (
    <main className="bg-black min-h-screen text-white">
      <NavBar items={items} currentLang={currentLang} onLangChange={setCurrentLang} />
      <div className="pt-32">
        <Terms />
      </div>
      <Footer />
    </main>
  )
}
