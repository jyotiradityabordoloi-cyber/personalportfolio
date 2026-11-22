import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Database, Lightbulb, Target } from "lucide-react";
import { analytics, getAnalytics } from "@/content/analytics";
import { site } from "@/content/site";
import { BackLink, Block, BulletList, NextCase, Toc } from "@/components/case/CaseLayout";
import { CodeBlock } from "@/components/case/CodeBlock";
import {
  ABDailyChart,
  ABResultBars,
  CohortHeatmap,
  DeviceFunnel,
  FunnelBars,
  LiftInterval,
  RetentionCurves,
  SyntheticBadge,
} from "@/components/charts/Charts";
import { KpiStrip } from "@/components/charts/KpiStrip";
import { PlaceholderTag } from "@/components/ui/primitives";

export function generateStaticParams() {
  return analytics.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getAnalytics(slug);
  return { title: a ? `${a.title} — ${site.name}` : "Analytics" };
}

const toc = [
  { id: "problem", label: "Business problem" },
  { id: "hypothesis", label: "Hypothesis" },
  { id: "dataset", label: "Dataset" },
  { id: "method", label: "Methodology" },
  { id: "sql", label: "SQL queries" },
  { id: "kpis", label: "KPI definitions" },
  { id: "dashboard", label: "Dashboard" },
  { id: "insights", label: "Key insights" },
  { id: "recommendations", label: "Recommendations" },
  { id: "impact", label: "Expected impact" },
];

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4 md:p-5">
      <p className="mb-4 text-sm font-medium">{title}</p>
      {children}
    </div>
  );
}

export default async function AnalyticsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getAnalytics(slug);
  if (!a) notFound();
  const idx = analytics.findIndex((x) => x.slug === slug);
  const next = analytics[(idx + 1) % analytics.length];

  return (
    <article className="pb-24 pt-28 md:pt-32">
      <div className="container-x">
        <BackLink href="/#analytics" label="All analytics" />
        <header className="mt-10 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Analytics {String(idx + 1).padStart(2, "0")}</p>
          <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.04em] md:text-6xl">{a.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">{a.short}</p>
          <div className="mt-6">
            <SyntheticBadge />
          </div>
        </header>

        <div className="mt-12">
          <KpiStrip kind={a.kind} size="lg" />
        </div>

        <div className="mt-6 grid gap-12 lg:grid-cols-[200px_1fr] lg:gap-16">
          <div>
            <Toc items={toc} />
          </div>
          <div className="min-w-0">
            <Block id="problem" label="Business problem">
              <p className="font-serif text-2xl leading-snug md:text-[30px]">{a.problem}</p>
            </Block>

            <Block id="hypothesis" label="Hypothesis">
              <div className="flex gap-4 rounded-2xl border border-line bg-accent-soft/60 p-5 md:p-6">
                <Target className="mt-0.5 size-5 shrink-0 text-accent" />
                <p className="text-[15px] leading-relaxed">{a.hypothesis}</p>
              </div>
            </Block>

            <Block id="dataset" label="Dataset">
              <div className="rounded-2xl border border-line bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="flex items-center gap-2 font-medium">
                    <Database className="size-4 text-accent-2" /> {a.dataset.name}
                  </p>
                  <span className="font-mono text-xs text-faint">{a.dataset.rows}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {a.dataset.fields.map((f) => (
                    <code key={f} className="rounded-md bg-fg/[0.05] px-2 py-1 font-mono text-xs text-muted">
                      {f}
                    </code>
                  ))}
                </div>
                <p className="mt-4 text-xs text-faint">{a.dataset.note}</p>
              </div>
            </Block>

            <Block id="method" label="Analytical methodology">
              <ol className="relative space-y-4 border-l border-line pl-6">
                {a.methodology.map((m, i) => (
                  <li key={m} className="relative text-[15px] leading-relaxed">
                    <span className="absolute -left-[31px] top-0.5 grid size-[13px] place-items-center rounded-full border border-accent bg-bg">
                      <span className="size-[5px] rounded-full bg-accent" />
                    </span>
                    <span className="mr-2 font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                    {m}
                  </li>
                ))}
              </ol>
            </Block>

            <Block id="sql" label="SQL queries">
              <div className="space-y-4">
                {a.sql.map((q) => (
                  <CodeBlock key={q.title} title={q.title} code={q.code} />
                ))}
              </div>
            </Block>

            <Block id="kpis" label="KPI definitions">
              <div className="overflow-hidden rounded-2xl border border-line">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-line">
                    {a.kpis.map((k) => (
                      <tr key={k.name}>
                        <th scope="row" className="w-1/3 bg-bg-2 px-5 py-3.5 text-left font-medium">
                          {k.name}
                        </th>
                        <td className="px-5 py-3.5 text-muted">{k.definition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Block>

            <Block id="dashboard" label="Visual dashboard" title="The dashboard">
              <div className="rounded-3xl border border-line bg-bg-2 p-3 md:p-4">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="font-mono text-[11px] text-faint">dashboard / {a.slug}</span>
                  <SyntheticBadge />
                </div>
                {a.kind === "funnel" && (
                  <div className="grid gap-3 xl:grid-cols-2">
                    <Panel title="Funnel: users per step">
                      <FunnelBars />
                    </Panel>
                    <Panel title="Funnel by device (% of visitors)">
                      <DeviceFunnel />
                    </Panel>
                  </div>
                )}
                {a.kind === "cohort" && (
                  <div className="grid gap-3">
                    <Panel title="Retention matrix">
                      <CohortHeatmap />
                    </Panel>
                    <Panel title="Average retention curve">
                      <RetentionCurves />
                    </Panel>
                  </div>
                )}
                {a.kind === "abtest" && (
                  <div className="grid gap-3 xl:grid-cols-2">
                    <Panel title="Daily conversion rate">
                      <ABDailyChart />
                    </Panel>
                    <div className="grid gap-3">
                      <Panel title="Overall conversion">
                        <ABResultBars />
                      </Panel>
                      <Panel title="Relative lift with 95% CI">
                        <LiftInterval />
                      </Panel>
                    </div>
                  </div>
                )}
              </div>
            </Block>

            <Block id="insights" label="Key insights">
              <div className="grid gap-3">
                {a.insights.map((ins) => (
                  <div key={ins} className="flex gap-4 rounded-2xl border border-line bg-card p-5">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
                    <p className="text-[15px] leading-relaxed">{ins}</p>
                  </div>
                ))}
              </div>
            </Block>

            <Block id="recommendations" label="Recommendations">
              <BulletList items={a.recommendations} numbered />
            </Block>

            <Block id="impact" label="Expected business impact">
              <div className="rounded-2xl border border-dashed border-line-strong p-5">
                <PlaceholderTag>To be validated</PlaceholderTag>
                <p className="mt-3 text-[15px] leading-relaxed text-fg/85">{a.impact}</p>
              </div>
            </Block>

            <NextCase href={`/analytics/${next.slug}`} eyebrow="Next analysis" title={next.title} />
          </div>
        </div>
      </div>
    </article>
  );
}
