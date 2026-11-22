"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

// Page transition between routes (home ↔ case studies).
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useSafeReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
