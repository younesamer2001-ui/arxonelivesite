'use client'

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon, ChevronDown, Globe } from "lucide-react"
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

const ctaText = {
  no: 'Book konsultasjon',
  en: 'Book a Consultation'
}

export function NavBar({ items, currentLang, onLangChange, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const cta = ctaText[currentLang]

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[200] pt-6 px-6",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - Levende med subtil glow */}
        <Link href="#" className="flex items-center group">
          <motion.span 
            className="text-4xl text-white relative"
            style={{
              fontWeight: 700,
              letterSpacing: '0.08em',
              fontFamily: '"SF Pro Rounded", "Nunito", "Quicksand", ui-rounded, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            ARXON
            {/* Subtil glow effekt på hover */}
            <span className="absolute inset-0 blur-xl bg-white/0 group-hover:bg-white/20 transition-all duration-500 rounded-lg -z-10" />
          </motion.span>
        </Link>

        {/* Center - Tube Light Nav */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-3 bg-black/80 border border-white/10 backdrop-blur-lg py-2 px-2 rounded-full shadow-lg">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.name

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "relative cursor-pointer text-base font-semibold px-6 py-2.5 rounded-full transition-colors",
                    "text-white/80 hover:text-white",
                    isActive && "bg-white/10 text-white",
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={20} strokeWidth={2.5} />
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full">
                        <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-white/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right Side - CTA + Language */}
        <div className="flex items-center space-x-4">
          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full text-sm font-semibold transition-all"
          >
            {cta}
          </motion.button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1 text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang.toUpperCase()}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-black/95 border border-white/10 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    onLangChange('no')
                    setIsLangOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                    currentLang === 'no' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  Norsk
                </button>
                <button
                  onClick={() => {
                    onLangChange('en')
                    setIsLangOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                    currentLang === 'en' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  English
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
