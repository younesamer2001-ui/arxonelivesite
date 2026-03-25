'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface TimelineContentProps {
  [key: string]: unknown;
  children: ReactNode;
  as?: React.ElementType;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: Variants;
  className?: string;
}

export function TimelineContent({
  children,
  as: Component = 'div',
  animationNum = 0,
  timelineRef,
  customVariants,
  className = ''
}: TimelineContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef || ref, { once: true, margin: "-100px" });

  const defaultVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        delay: animationNum * 0.15
      }
    }
  };

  const variants = customVariants || defaultVariants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={animationNum}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
