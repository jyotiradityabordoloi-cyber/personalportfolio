"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { Teardown } from "@/content/teardowns";

/* Journey map with an emotion curve */
export function JourneyMap({ journey, color }: { journey: Teardown["journey"]; color: string }) {
  const n = journey.length;
  const W = 1000;
  const H = 160;
  const pts = journey.map((j, i) => ({ x: (W / (n - 1)) * i, y: H - ((j.mood - 1) / 4) * (H - 30) - 15 }));
  const d = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  return (
    <div className="rounded-3xl border border-line bg-bg-2 p-5 md:p-7">
      <div className="relative">
        <svg viewBox={`-20 0 ${W + 40} ${H}`} className="h-36 w-full overflow-visible md:h-44" preserveAspectRatio="none" aria-hidden>
          <line x1="-20" x2={W + 20} y1={H / 2} y2={H / 2} stroke="var(--line-strong)" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
          <motion.path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        {pts.map((p, i) => (
          <span
            key={i}
            className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg"
            style={{ left: `${((p.x + 20) / (W + 40)) * 100}%`, top: `${(p.y / H) * 100}%`, background: journey[i].mood <= 2 ? "#f59e0b" : color }}
          />
        ))}
        <span className="absolute -left-1 top-0 font-mono text-[9px] text-faint">delight</span>
        <span className="absolute -left-1 bottom-0 font-mono text-[9px] text-faint">friction</span>
      </div>
      <ol className="mt-4 grid gap-3" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
        {journey.map((j) => (
          <li key={j.stage} className="min-w-0">
            <p className="text-xs font-medium md:text-sm">{j.stage}</p>
            <p className="mt-1 hidden text-xs leading-snug text-muted sm:block">{j.note}</p>
          </li>
        ))}
      </ol>
      <ul className="mt-4 space-y-1 sm:hidden">
        {journey.map((j) => (
          <li key={j.stage} className="text-xs text-muted">
            <span className="text-fg">{j.stage}:</span> {j.note}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Circular growth loop */
export function LoopDiagram({ loop, color }: { loop: Teardown["loop"]; color: string }) {
  const r = 110;
  const steps = loop.steps;
  return (
    <div className="grid items-center gap-8 rounded-3xl border border-line bg-bg-2 p-6 md:grid-cols-[300px_1fr]">
      <div className="relative mx-auto aspect-square w-full max-w-[300px]">
        <svg viewBox="-150 -150 300 300" className="absolute inset-0 h-full w-full" aria-hidden>
          <circle r={r} fill="none" stroke="var(--line-strong)" strokeDasharray="3 6" />
          <motion.circle
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, rotate: -90 }}
            whileInView={{ pathLength: 0.92, rotate: -90 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        {steps.map((s, i) => {
          const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + (Math.cos(a) * r * 100) / 300;
          const y = 50 + (Math.sin(a) * r * 100) / 300;
          return (
            <motion.div
              key={s}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="absolute w-[108px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line bg-card-solid px-2 py-1.5 text-center text-[11px] leading-tight shadow-sm"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {s}
            </motion.div>
          );
        })}
        <div className="absolute inset-0 grid place-items-center">
          <p className="max-w-[90px] text-center font-mono text-[10px] uppercase tracking-wider text-faint">{loop.name}</p>
        </div>
      </div>
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-3 text-sm">
            <span className="grid size-6 place-items-center rounded-full font-mono text-[10px] text-white" style={{ background: color }}>
              {i + 1}
            </span>
            {s}
            {i === steps.length - 1 && <span className="font-mono text-[10px] text-faint">↺ back to 1</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* Impact vs effort prioritisation matrix */
export function PriorityMatrix({ roadmap, color }: { roadmap: Teardown["roadmap"]; color: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const sorted = [...roadmap].sort((a, b) => a.priority.localeCompare(b.priority) || b.impact - a.impact);
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
      <div className="relative aspect-square rounded-3xl border border-line bg-bg-2 p-4">
        <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-px overflow-hidden rounded-2xl bg-line">
          {["Quick wins", "Big bets", "Fill-ins", "Money pits"].map((q) => (
            <div key={q} className="bg-bg-2 p-2.5 font-mono text-[10px] uppercase tracking-wider text-faint">
              {q}
            </div>
          ))}
        </div>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] text-faint">effort →</span>
        <span className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 font-mono text-[9px] text-faint">impact →</span>
        {roadmap.map((r, i) => {
          const x = 4 + ((r.effort - 0.5) / 5) * 92;
          const y = 96 - ((r.impact - 0.5) / 5) * 92;
          return (
            <motion.button
              key={r.item}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 300, damping: 18 }}
              className={clsx(
                "absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-mono text-[10px] font-semibold text-white shadow-lg transition-shadow",
                hover === i && "ring-4 ring-fg/20",
              )}
              style={{ left: `${x}%`, top: `${y}%`, background: color }}
              aria-label={`${r.item}: impact ${r.impact}, effort ${r.effort}, ${r.priority}`}
            >
              {r.priority}
            </motion.button>
          );
        })}
      </div>
      <ol className="space-y-2">
        {sorted.map((r) => {
          const i = roadmap.indexOf(r);
          return (
            <li
              key={r.item}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={clsx(
                "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                hover === i ? "border-line-strong bg-fg/[0.04]" : "border-line bg-card",
              )}
            >
              <span
                className={clsx(
                  "rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold",
                  r.priority === "P0" ? "bg-fg text-bg" : r.priority === "P1" ? "bg-accent-soft text-accent" : "bg-fg/5 text-muted",
                )}
              >
                {r.priority}
              </span>
              <span className="flex-1 text-sm">{r.item}</span>
              <span className="font-mono text-[10px] text-faint">
                I{r.impact} · E{r.effort}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
