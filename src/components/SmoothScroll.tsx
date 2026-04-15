'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Refresh ScrollTrigger after all content is loaded
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      clearTimeout(timeout)
      ScrollTrigger.killAll()
    }
  }, [])

  return <>{children}</>
}
