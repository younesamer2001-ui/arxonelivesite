'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Scroll-driven "pang" animation.
 * opacity, y, and scale are tied directly to scroll position
 * so they follow the user's scroll speed exactly.
 *
 * @param offset — stagger index (0, 1, 2…) to offset the animation
 *   slightly for elements at the same vertical position.
 */
export default function ScrollPang({
  children,
  className,
  offset = 0,
}: {
  children: ReactNode
  className?: string
  offset?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'start 55%'],
    // 0 → element's top is at 95% of viewport (just entering)
    // 1 → element's top is at 55% of viewport (comfortably in view)
  })

  const stagger = offset * 0.08
  const opacity = useTransform(scrollYProgress, [stagger, 0.6 + stagger], [0, 1])
  const y = useTransform(scrollYProgress, [stagger, 0.6 + stagger], [50, 0])
  const scale = useTransform(scrollYProgress, [stagger, 0.6 + stagger], [0.88, 1])

  return (
    <motion.div ref={ref} style={{ opacity, y, scale }} className={className}>
      {children}
    </motion.div>
  )
}
