"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface SlideUpProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function SlideUp({
  children,
  delay = 0,
  duration = 0.3,
  className,
}: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
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
