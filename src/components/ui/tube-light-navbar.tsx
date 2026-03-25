'use client'

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LucideIcon, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  currentLang: 'no' | 'en'
  onLangChange: (lang: 'no' | 'en') => void
  className?: string
}

export function NavBar({ items, currentLang, onLangChange, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [menuOpen, setMenuOpen] = useState(false)

  /* lock body scroll when menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);
  return (
    <>
      {/* ── top bar ── */}
      <div className={cn("fixed top-0 left-0 right-0 z-[200] pt-4 px-4 md:pt-6 md:px-6", className)}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl md:text-4xl text-white font-bold tracking-[0.08em]"
              style={{ fontFamily: '"SF Pro Rounded","Nunito","Quicksand",ui-rounded,sans-serif' }}>
              ARXON
            </span>
          </Link>

          {/* desktop nav — hidden on mobile */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center gap-2 bg-black/80 border border-white/10 backdrop-blur-lg py-1.5 px-2 rounded-full">
              {items.map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <Link key={item.name} href={item.url}
                    onClick={() => setActiveTab(item.name)}
                    className={cn(
                      "relative text-sm font-semibold px-5 py-2 rounded-full transition-colors",
                      "text-white/80 hover:text-white",
                      isActive && "bg-white/10 text-white",
                    )}>
                    {item.name}
                    {isActive && (
                      <motion.div layoutId="lamp"
                        className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full">
                          <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                        </div>
                      </motion.div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          {/* desktop CTA — hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/#kontakt"
              className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full text-sm font-semibold transition-all">
              Book konsultasjon
            </Link>
          </div>

          {/* mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Meny">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── mobile fullscreen menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[199] bg-black/98 backdrop-blur-lg pt-20 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.url}
                    onClick={() => { setActiveTab(item.name); setMenuOpen(false); }}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium transition-colors",
                      activeTab === item.name ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5",
                    )}>
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
              <Link href="/#kontakt" onClick={() => setMenuOpen(false)}
                className="block w-full text-center py-3 bg-white text-black rounded-full font-semibold text-base">
                Book konsultasjon
              </Link>
              <div className="flex justify-center gap-4 text-sm">
                <button onClick={() => { onLangChange('no'); setMenuOpen(false); }}
                  className={cn("px-3 py-1.5 rounded-full", currentLang === 'no' ? 'bg-white/10 text-white' : 'text-white/50')}>
                  Norsk
                </button>
                <button onClick={() => { onLangChange('en'); setMenuOpen(false); }}
                  className={cn("px-3 py-1.5 rounded-full", currentLang === 'en' ? 'bg-white/10 text-white' : 'text-white/50')}>
                  English
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}