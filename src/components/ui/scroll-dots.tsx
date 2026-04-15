'use client'

import { useEffect, useState, useRef, useCallback, type RefObject } from 'react'

interface ScrollDotsProps {
  scrollRef: RefObject<HTMLDivElement | null>
  count: number
  className?: string
}

export default function ScrollDots({ scrollRef, count, className = '' }: ScrollDotsProps) {
  const [active, setActive] = useState(0)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const maxScroll = scrollWidth - clientWidth
    if (maxScroll <= 0) return
    const ratio = scrollLeft / maxScroll
    const idx = Math.round(ratio * (count - 1))
    setActive(idx)
  }, [scrollRef, count])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [scrollRef, handleScroll])

  return (
    <div className={`flex justify-center gap-1.5 mt-4 md:hidden ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
            i === active ? 'bg-white' : 'bg-zinc-600'
          }`}
        />
      ))}
    </div>
  )
}
