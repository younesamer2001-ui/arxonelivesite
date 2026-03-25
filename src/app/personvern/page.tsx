'use client'

import Privacy from "@/components/Privacy"
import { NavBar } from "@/components/ui/tube-light-navbar"
import { Footer } from "@/components/ui/footer-section"
import { Home, Briefcase, Users, FileText, Mail } from 'lucide-react'

const navItems = [
  { name: 'Hjem', url: '/', icon: Home },
  { name: 'Tjenester', url: '/#ai-resepsjonister', icon: Briefcase },
  { name: 'Prosess', url: '/#prosess', icon: FileText },
  { name: 'Priser', url: '/#priser', icon: Users },
  { name: 'Kontakt', url: '/#kontakt', icon: Mail }
]

export default function PersonvernPage() {
  return (
    <main className="bg-black min-h-screen text-white">
      <NavBar items={navItems} currentLang="no" onLangChange={() => {}} />
      <div className="pt-32">
        <Privacy />
      </div>
      <Footer />
    </main>
  )
}
