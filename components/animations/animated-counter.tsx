"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({ value, duration = 1, prefix = "", suffix = "" }: AnimatedCounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, value, { duration })
    return controls.stop
  }, [count, value, duration])

  return (
    <motion.span>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  )
}
