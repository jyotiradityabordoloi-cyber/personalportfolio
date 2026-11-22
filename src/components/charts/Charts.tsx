"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import clsx from "clsx";
import {
  abDaily,
  abSummary,
  cohortWeeks,
  cohorts,
  funnelByDevice,
  funnelData,
  retentionCurves,
} from "@/content/analytics";

const tooltipStyle = {
  contentStyle: {
    background: "var(--card-solid)",
    border: "1px solid var(--line-strong)",
    borderRadius: 12,
    fontSize: 12,
    color: "var(--fg)",
    boxShadow: "0 10px 30px rgba(0,0,0,.15)",
  },
  labelStyle: { color: "var(--muted)", marginBottom: 4 },
  itemStyle: { color: "var(--fg)" },
};

export function SyntheticBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-line-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint">
      <span className="size-1.5 rounded-full bg-amber-400" />
      Synthetic sample data
    </span>
  );
}

/* ── Funnel ─────────────────────────────────────────────────── */
export function FunnelBars() {
  const [hover, setHover] = useState<number | null>(null);
  const max = funnelData[0].users;
  return (
    <div className="space-y-2.5" role="img" aria-label="Conversion funnel from landing visit to paid plan">
      {funnelData.map((d, i) => {
        const pct = (d.users / max) * 100;
        const step = i === 0 ? 100 : (d.users / funnelData[i - 1].users) * 100;
        const isBiggestDrop = i === 3;
        return (
          <div
            key={d.step}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="group grid grid-cols-[96px_1fr_48px_36px] items-center gap-2.5 text-xs sm:grid-cols-[130px_1fr_56px_44px]"
          >
            <span className={clsx("truncate", hover === i ? "text-fg" : "text-muted")}>{d.step}</span>
            <div className="relative h-8 overflow-hidden rounded-lg bg-fg/[0.04]">
              <motion.div
                className={clsx(
                  "absolute inset-y-0 left-0 rounded-lg",
                  isBiggestDrop ? "bg-white" : "bg-white/30",
                )}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="text-right font-mono tabular-nums text-fg/80">{d.users.toLocaleString()}</span>
            <span className={clsx("text-right font-mono tabular-nums", isBiggestDrop ? "text-fg" : "text-faint")}>
              {i === 0 ? "—" : `${step.toFixed(0)}%`}
            </span>
          </div>
        );
      })}
      <p className="pt-1 text-right font-mono text-[10px] text-faint">step conversion →</p>
    </div>
  );
}

export function DeviceFunnel() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={funnelByDevice} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="gDesk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gMob" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-2)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--accent-2)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="step" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} unit="%" />
          <Tooltip {...tooltipStyle} formatter={(v) => `${v}%`} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="desktop" name="Desktop" stroke="var(--accent)" strokeWidth={2} fill="url(#gDesk)" />
          <Area type="monotone" dataKey="mobile" name="Mobile" stroke="var(--accent-2)" strokeWidth={2} fill="url(#gMob)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Cohorts ────────────────────────────────────────────────── */
export function CohortHeatmap() {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-separate border-spacing-1 text-[11px]">
        <caption className="sr-only">Weekly retention by sign-up cohort, percent</caption>
        <thead>
          <tr>
            <th className="text-left font-mono font-normal text-faint">Cohort</th>
            <th className="text-left font-mono font-normal text-faint">Users</th>
            {cohortWeeks.map((w) => (
              <th key={w} className="font-mono font-normal text-faint">
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((row, r) => (
            <tr key={row.cohort}>
              <td className="whitespace-nowrap pr-2 font-mono text-muted">
                {row.cohort}
                {r === 3 && <span className="ml-1.5 text-accent">◆</span>}
              </td>
              <td className="pr-2 font-mono tabular-nums text-faint">{row.size.toLocaleString()}</td>
              {row.retention.map((v, c) => {
                const isHover = hover?.r === r || hover?.c === c;
                return (
                  <td key={c} className="p-0">
                    {v === null ? (
                      <div className="h-8 rounded-md border border-dashed border-line" />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: (r + c) * 0.025 }}
                        onMouseEnter={() => setHover({ r, c })}
                        onMouseLeave={() => setHover(null)}
                        className={clsx(
                          "grid h-8 place-items-center rounded-md font-mono tabular-nums transition-[outline] duration-150",
                          isHover && "outline outline-1 outline-fg/40",
                        )}
                        style={{
                          background: `color-mix(in oklab, var(--accent) ${Math.round(v * 0.9)}%, transparent)`,
                          color: v > 55 ? "#050505" : "var(--fg)",
                        }}
                        title={`${row.cohort}, ${cohortWeeks[c]}: ${v}%`}
                      >
                        {v}
                      </motion.div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 font-mono text-[10px] text-faint">
        <span className="text-accent">◆</span> onboarding change shipped. Cells show % of cohort active that week.
      </p>
    </div>
  );
}

export function RetentionCurves() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={retentionCurves} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="week" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
          <Tooltip {...tooltipStyle} formatter={(v) => `${v}%`} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="Before onboarding change" stroke="var(--faint)" strokeWidth={2} dot={false} strokeDasharray="5 4" />
          <Line type="monotone" dataKey="After onboarding change" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── A/B test ───────────────────────────────────────────────── */
export function ABDailyChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={abDaily} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} interval={1} />
          <YAxis tickLine={false} axisLine={false} unit="%" domain={[3, 5.5]} ticks={[3, 3.5, 4, 4.5, 5, 5.5]} />
          <Tooltip {...tooltipStyle} formatter={(v) => `${v}%`} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="control" name="Control" stroke="var(--faint)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="variant" name="Variant" stroke="var(--accent-2)" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ABResultBars() {
  const data = [
    { name: "Control", rate: abSummary.control.rate },
    { name: "Variant", rate: abSummary.variant.rate },
  ];
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
          <XAxis type="number" hide domain={[0, 5.5]} />
          <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={60} />
          <Tooltip {...tooltipStyle} formatter={(v) => `${v}%`} cursor={false} />
          <Bar dataKey="rate" radius={[0, 8, 8, 0]} barSize={26} label={{ position: "right", fill: "var(--fg)", fontSize: 12, formatter: (v: unknown) => `${v}%` }}>
            <Cell fill="var(--faint)" />
            <Cell fill="var(--accent-2)" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Confidence interval strip for relative lift. */
export function LiftInterval() {
  const [lo, hi] = abSummary.ci;
  const min = -10;
  const max = 30;
  const pos = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div>
      <div className="relative h-12">
        <div className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />
        <div className="absolute top-1/2 h-6 w-px -translate-y-1/2 bg-faint" style={{ left: `${pos(0)}%` }} />
        <span className="absolute top-0 -translate-x-1/2 font-mono text-[10px] text-faint" style={{ left: `${pos(0)}%` }}>
          0
        </span>
        <motion.div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-accent-2/40"
          initial={{ left: `${pos(abSummary.liftPct)}%`, width: 0 }}
          whileInView={{ left: `${pos(lo)}%`, width: `${pos(hi) - pos(lo)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        <div
          className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg bg-accent-2"
          style={{ left: `${pos(abSummary.liftPct)}%` }}
        />
      </div>
      <div className="flex justify-between font-mono text-[10px] text-faint">
        <span>{min}%</span>
        <span>
          95% CI on relative lift: {lo}% to {hi}%
        </span>
        <span>+{max}%</span>
      </div>
    </div>
  );
}
