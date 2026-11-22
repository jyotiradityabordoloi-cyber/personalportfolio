"use client";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import clsx from "clsx";

export const ease = [0.22, 1, 0.36, 1] as const;

/* ── Reveal on scroll ─────────────────────────────────────── */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduce = useSafeReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </Comp>
  );
}

/* Staggered children container */
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
export const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

/* ── Section header ───────────────────────────────────────── */
export function SectionHeader({
  index,
  eyebrow,
  title,
  lead,
  align = "left",
  children,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
      )}
    >
      <div className={clsx("max-w-2xl", align === "center" && "mx-auto")}>
        <Reveal>
          <p className="kicker mb-6 text-muted">
            {index} — {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-balance font-display text-4xl font-bold leading-[1.02] tracking-[-0.03em] md:text-6xl">{title}</h2>
        </Reveal>
        {lead && (
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted md:text-lg">{lead}</p>
          </Reveal>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Magnetic wrapper for CTAs ────────────────────────────── */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className={clsx("inline-block", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Buttons ──────────────────────────────────────────────── */
type BtnProps = HTMLMotionProps<"a"> & { variant?: "primary" | "ghost" | "soft" };
export function ButtonLink({ variant = "primary", className, children, ...rest }: BtnProps) {
  return (
    <motion.a
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full px-5 text-sm font-medium transition-colors",
        variant === "primary" && "bg-fg text-bg hover:bg-fg/90",
        variant === "ghost" && "border border-line-strong text-fg hover:bg-fg/5",
        variant === "soft" && "bg-accent-soft text-accent hover:bg-accent/20",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

/* ── Animated counter (only for real numbers) ─────────────── */
export function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useSafeReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, reduce]);

  return (
    <span ref={ref} className={clsx("tabular-nums", className)}>
      {prefix}
      {val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ── Chips ────────────────────────────────────────────────── */
export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border border-line bg-card px-2.5 py-1 font-mono text-[11px] text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* Clearly-labelled placeholder marker */
export function PlaceholderTag({ children = "Placeholder" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-amber-500/50 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400">
      {children}
    </span>
  );
}
