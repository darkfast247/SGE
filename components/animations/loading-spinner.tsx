"use client"

import { motion } from "framer-motion"

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <motion.div
      className="inline-block"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      <div
        className="border-2 border-current border-t-transparent rounded-full"
        style={{ width: size, height: size }}
      />
    </motion.div>
  )
}
