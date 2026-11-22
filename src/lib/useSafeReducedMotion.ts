"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * useReducedMotion, but always `false` on the first render so the browser's
 * first paint matches the server HTML (no hydration mismatch). The real
 * preference applies right after mount.
 */
export function useSafeReducedMotion() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? Boolean(reduce) : false;
}
