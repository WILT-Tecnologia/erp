"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface SlideLeftProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function SlideLeft({
  children,
  delay = 0,
  duration = 0.3,
  className,
}: SlideLeftProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
