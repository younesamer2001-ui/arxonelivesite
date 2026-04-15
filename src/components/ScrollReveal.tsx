'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
  blur?: boolean
  scale?: boolean
  stagger?: number
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  y = 40,
  duration = 0.8,
  blur = false,
  scale = false,
  stagger = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current
    const targets = stagger > 0 ? el.children : el

    // Set initial state immediately to prevent flash
    gsap.set(targets, {
      opacity: 0,
      y,
      ...(scale && { scale: 0.97 }),
      willChange: 'transform, opacity',
    })

    tweenRef.current = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power2.out',
      ...(scale && { scale: 1 }),
      ...(stagger > 0 && { stagger }),
      clearProps: 'willChange',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true,
      },
    })

    return () => {
      tweenRef.current?.scrollTrigger?.kill()
      tweenRef.current?.kill()
    }
  }, [delay, y, duration, scale, stagger])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
