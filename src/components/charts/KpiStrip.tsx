"use client";

import { Counter } from "@/components/ui/primitives";
import { abSummary, cohorts, funnelData, type AnalyticsKind } from "@/content/analytics";

type Kpi = { label: string; to: number; decimals?: number; prefix?: string; suffix?: string };

export function kpisFor(kind: AnalyticsKind): Kpi[] {
  if (kind === "funnel") {
    const top = funnelData[0].users;
    const paid = funnelData[funnelData.length - 1].users;
    return [
      { label: "Visitors", to: top },
      { label: "Visit → paid", to: (paid / top) * 100, decimals: 1, suffix: "%" },
      { label: "Biggest step drop", to: (1 - funnelData[3].users / funnelData[2].users) * 100, decimals: 0, suffix: "%" },
    ];
  }
  if (kind === "cohort") {
    const pre = cohorts.slice(0, 3).map((c) => c.retention[1] ?? 0);
    const post = cohorts.slice(4, 7).map((c) => c.retention[1] ?? 0);
    const avg = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
    return [
      { label: "Weekly cohorts", to: cohorts.length },
      { label: "W1 before", to: avg(pre), decimals: 0, suffix: "%" },
      { label: "W1 after", to: avg(post), decimals: 0, suffix: "%" },
    ];
  }
  return [
    { label: "Users in test", to: abSummary.control.users + abSummary.variant.users },
    { label: "Relative lift", to: abSummary.liftPct, decimals: 1, prefix: "+", suffix: "%" },
    { label: "p-value", to: abSummary.pValue, decimals: 3 },
  ];
}

export function KpiStrip({ kind, size = "sm" }: { kind: AnalyticsKind; size?: "sm" | "lg" }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {kpisFor(kind).map((k) => (
        <div key={k.label} className="rounded-xl border border-line bg-card px-3 py-3">
          <p className="truncate font-mono text-[10px] uppercase tracking-wider text-faint">{k.label}</p>
          <Counter
            to={k.to}
            decimals={k.decimals}
            prefix={k.prefix}
            suffix={k.suffix}
            className={size === "lg" ? "mt-1 block text-3xl font-medium tracking-tight" : "mt-1 block text-xl font-medium tracking-tight"}
          />
        </div>
      ))}
    </div>
  );
}
