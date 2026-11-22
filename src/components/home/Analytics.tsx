"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, FlaskConical, Filter, Users } from "lucide-react";
import clsx from "clsx";
import { analytics } from "@/content/analytics";
import { Reveal, SectionHeader } from "@/components/ui/primitives";
import { ABDailyChart, CohortHeatmap, FunnelBars, SyntheticBadge } from "@/components/charts/Charts";
import { KpiStrip } from "@/components/charts/KpiStrip";

const icons = { funnel: Filter, cohort: Users, abtest: FlaskConical };

export function Analytics() {
  const [tab, setTab] = useState(0);
  const a = analytics[tab];

  return (
    <section id="analytics" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeader
          index="06"
          eyebrow="Product analytics"
          title={
            <>
              Decisions backed by <span className="font-serif italic text-muted">data</span>, not opinions.
            </>
          }
          lead="Three analytical case studies with the business question, the SQL, the dashboard and the recommendation."
        />

        <Reveal className="mt-14">
          <div className="glass overflow-hidden rounded-3xl">
            {/* window chrome + tabs */}
            <div className="flex flex-col gap-3 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 font-mono text-[11px] text-faint">analytics / {a.slug}</span>
              </div>
              <div role="tablist" aria-label="Analytics case studies" className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-fg/[0.04] p-1">
                {analytics.map((item, i) => {
                  const Icon = icons[item.kind];
                  return (
                    <button
                      key={item.slug}
                      role="tab"
                      id={`tab-${item.slug}`}
                      aria-selected={i === tab}
                      aria-controls="analytics-panel"
                      onClick={() => setTab(i)}
                      className={clsx(
                        "relative flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors",
                        i === tab ? "text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {i === tab && (
                        <motion.span
                          layoutId="analytics-tab"
                          className="absolute inset-0 rounded-full border border-line-strong bg-card-solid shadow-sm"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      <Icon className="relative size-3.5" />
                      <span className="relative">{item.title.split(" & ")[0].replace(" Analysis", "")}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={a.slug}
                id="analytics-panel"
                role="tabpanel"
                aria-labelledby={`tab-${a.slug}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="grid gap-8 p-5 md:p-8 lg:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="flex flex-col">
                  <h3 className="text-2xl font-medium tracking-tight md:text-3xl">{a.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{a.problem}</p>
                  <div className="mt-6 rounded-2xl border border-line bg-accent-soft/50 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">Hypothesis</p>
                    <p className="mt-1.5 text-sm leading-relaxed">{a.hypothesis}</p>
                  </div>
                  <div className="mt-6">
                    <KpiStrip kind={a.kind} />
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-6">
                    <Link
                      href={`/analytics/${a.slug}`}
                      className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-fg px-4 text-sm font-medium text-bg"
                    >
                      Open full analysis
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                    <span className="font-mono text-[11px] text-faint">SQL · KPIs · insights · recommendations</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-line bg-bg/40 p-4 md:p-5">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      {a.kind === "funnel" ? "Sign-up funnel" : a.kind === "cohort" ? "Weekly retention cohorts" : "Daily conversion by variant"}
                    </p>
                    <SyntheticBadge />
                  </div>
                  {a.kind === "funnel" && <FunnelBars />}
                  {a.kind === "cohort" && <CohortHeatmap />}
                  {a.kind === "abtest" && <ABDailyChart />}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
