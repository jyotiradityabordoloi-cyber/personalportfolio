"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import clsx from "clsx";

/** Horizontal (desktop) / vertical (mobile) product-flow diagram with animated connectors. */
export function FlowDiagram({
  steps,
  hue,
  compact = false,
}: {
  steps: string[];
  hue: number;
  compact?: boolean;
}) {
  const reduce = useSafeReducedMotion();
  const accent = `hsl(${hue} 75% 55%)`;
  return (
    <ol
      className={clsx(
        "relative grid gap-3",
        compact ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3 lg:grid-cols-6",
      )}
      aria-label="Product flow"
    >
      {steps.map((step, i) => (
        <motion.li
          key={step}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: reduce ? 0 : i * 0.08, duration: 0.5 }}
          className="relative"
        >
          <div
            className={clsx(
              "relative h-full rounded-xl border border-line bg-card-solid/70 backdrop-blur",
              compact ? "px-2.5 py-2" : "px-3.5 py-3",
            )}
          >
            <span className="font-mono text-[10px] tabular-nums" style={{ color: accent }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className={clsx("mt-1 leading-snug", compact ? "text-[11px]" : "text-sm")}>{step}</p>
            {i < steps.length - 1 && !compact && (
              <svg
                aria-hidden
                className="absolute -right-3 top-1/2 hidden h-3 w-3 -translate-y-1/2 lg:block"
                viewBox="0 0 12 12"
              >
                <path d="M0 6h10M7 3l3 3-3 3" fill="none" stroke={accent} strokeWidth="1.4" className="animate-dash" strokeDasharray="3 3" />
              </svg>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

/** Abstract generated "cover" artwork for a project, driven by its hue. */
export function ProjectCover({
  hue,
  label,
  steps,
  className,
}: {
  hue: number;
  label: string;
  steps: string[];
  className?: string;
}) {
  const c1 = `hsl(${hue} 80% 60%)`;
  const c2 = `hsl(${(hue + 50) % 360} 80% 55%)`;
  return (
    <div
      className={clsx("relative isolate overflow-hidden rounded-2xl border border-line", className)}
      style={{
        background: `radial-gradient(120% 90% at 0% 0%, hsl(${hue} 80% 60% / 0.35), transparent 60%), radial-gradient(100% 80% at 100% 100%, hsl(${(hue + 50) % 360} 80% 55% / 0.3), transparent 60%), var(--bg-2)`,
      }}
    >
      <div className="dot-grid absolute inset-0 -z-10 opacity-60" />
      <svg aria-hidden className="absolute inset-0 -z-10 h-full w-full opacity-70" viewBox="0 0 400 260" preserveAspectRatio="none">
        <path d="M0 200 C 80 180, 120 90, 200 110 S 320 40, 400 60" fill="none" stroke={c1} strokeOpacity=".5" strokeWidth="1.5" />
        <path d="M0 230 C 90 220, 150 160, 230 170 S 340 120, 400 130" fill="none" stroke={c2} strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="4 6" />
      </svg>
      <div className="flex h-full flex-col justify-between p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{label}</p>
        <div className="grid grid-cols-3 gap-2">
          {steps.slice(0, 6).map((s, i) => (
            <div key={s} className="rounded-lg border border-line bg-bg/60 px-2 py-1.5 backdrop-blur">
              <span className="font-mono text-[9px]" style={{ color: c1 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="truncate text-[11px]">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
