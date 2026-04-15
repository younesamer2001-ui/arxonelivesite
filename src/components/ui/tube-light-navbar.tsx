'use client'

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  /* derive active tab from current URL */
  const activeTab = (() => {
    /* exact match first (e.g. /om-oss, /priser, /blogg, /karriere) */
    const match = items.find((item) => {
      const url = item.url;
      if (url === '/') return pathname === '/';
      /* strip hash fragments for comparison */
      const base = url.replace(/#.*$/, '');
      if (!base) return false;
      return pathname === base || pathname.startsWith(base + '/');
    });
    if (match) return match.name;
    /* fallback: if on root with hash, match home */
    if (pathname === '/') return items[0].name;
    return items[0].name;
  })()

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Desktop navbar */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-[200] hidden md:flex items-center justify-between px-6 lg:px-10 pt-5 transition-all duration-300",
        className
      )}>
        {/* Left: Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/" className="flex items-center">
            <span
              className="text-xl lg:text-2xl text-white font-bold tracking-[0.14em]"
              style={{ fontFamily: 'var(--font-grift), sans-serif' }}
            >
              ARXON
            </span>
          </Link>
        </motion.div>

        {/* Center: Nav pill */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "absolute left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 rounded-full border transition-all duration-300",
            scrolled
              ? "bg-black/80 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/40"
              : "bg-white/[0.04] border-white/[0.06]"
          )}
        >
          {items.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <Link
                key={item.name}
                href={item.url}
                className={cn(
                  "relative text-sm font-medium px-4 py-2 rounded-full transition-all duration-200",
                  isActive ? "text-white" : "text-white/50 hover:text-white/80"
                )}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </motion.nav>

        {/* Right: Lang + CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-white/[0.06] bg-white/[0.04]">
            <button
              onClick={() => onLangChange('no')}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold transition-all",
                currentLang === 'no' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'
              )}
            >
              NO
            </button>
            <button
              onClick={() => onLangChange('en')}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-semibold transition-all",
                currentLang === 'en' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'
              )}
            >
              EN
            </button>
          </div>
          <a
            href="https://cal.com/arxon/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-white hover:bg-white/90 text-black rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-white/10"
          >
            Book konsultasjon
          </a>
        </motion.div>
      </div>

      {/* Mobile navbar */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-[200] flex md:hidden items-center justify-between px-4 pt-3",
        className
      )}>
        <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
          <span
            className="text-lg text-white font-bold tracking-[0.14em]"
            style={{ fontFamily: 'var(--font-grift), sans-serif' }}
          >
            ARXON
          </span>
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-white/80 hover:text-white transition-colors"
          aria-label="Meny"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
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
                  <Link
                    key={item.name}
                    href={item.url}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium transition-colors",
                      activeTab === item.name
                        ? "text-white bg-white/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
              <a
                href="https://cal.com/arxon/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center py-3.5 bg-white text-black rounded-full font-semibold text-base"
              >
                Book konsultasjon
              </a>
              <div className="flex justify-center gap-4 text-sm">
                <button
                  onClick={() => { onLangChange('no'); setMenuOpen(false); }}
                  className={cn("px-3 py-1.5 rounded-full", currentLang === 'no' ? 'bg-white/10 text-white' : 'text-white/50')}
                >
                  Norsk
                </button>
                <button
                  onClick={() => { onLangChange('en'); setMenuOpen(false); }}
                  className={cn("px-3 py-1.5 rounded-full", currentLang === 'en' ? 'bg-white/10 text-white' : 'text-white/50')}
                >
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
