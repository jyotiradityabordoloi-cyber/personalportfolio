import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Minus, Plus } from "lucide-react";
import { getTeardown, teardowns } from "@/content/teardowns";
import { site } from "@/content/site";
import { Accordion, BackLink, Block, BulletList, NextCase, Toc } from "@/components/case/CaseLayout";
import { JourneyMap, LoopDiagram, PriorityMatrix } from "@/components/case/TeardownVisuals";

export function generateStaticParams() {
  return teardowns.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTeardown(slug);
  return { title: t ? `${t.name} teardown — ${site.name}` : "Teardown" };
}

const toc = [
  { id: "overview", label: "Overview" },
  { id: "audience", label: "Audience & personas" },
  { id: "problems", label: "User problems" },
  { id: "value", label: "Value proposition" },
  { id: "business", label: "Business model" },
  { id: "strategy", label: "Product strategy" },
  { id: "journey", label: "User journey" },
  { id: "features", label: "Feature breakdown" },
  { id: "loops", label: "Growth loops" },
  { id: "monetization", label: "Monetization" },
  { id: "swot", label: "Strengths & weaknesses" },
  { id: "opportunities", label: "Opportunities" },
  { id: "improvements", label: "My improvements" },
  { id: "roadmap", label: "Roadmap" },
  { id: "kpis", label: "Success metrics" },
];

export default async function TeardownPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTeardown(slug);
  if (!t) notFound();
  const idx = teardowns.findIndex((x) => x.slug === slug);
  const next = teardowns[(idx + 1) % teardowns.length];

  return (
    <article className="pb-24">
      {/* editorial masthead */}
      <header className="relative isolate overflow-hidden border-b border-line pb-16 pt-28 md:pb-24 md:pt-36">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ background: `radial-gradient(70% 60% at 85% 0%, ${t.color}38, transparent 70%)` }}
        />
        <div className="hairline-grid absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(black,transparent)]" aria-hidden />
        <div className="container-x">
          <BackLink href="/#teardowns" label="All teardowns" />
          <div className="mt-12 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-faint">
            <span>Teardown {String(idx + 1).padStart(2, "0")}</span>
            <span className="h-px w-6 bg-line-strong" />
            <span>{t.category}</span>
          </div>
          <h1 className="mt-5 font-serif text-7xl leading-[0.9] tracking-tight md:text-[150px]">{t.name}</h1>
          <p className="mt-6 max-w-2xl text-xl text-muted md:text-2xl">{t.tagline}</p>
        </div>
      </header>

      <div className="container-x mt-6 grid gap-12 lg:grid-cols-[200px_1fr] lg:gap-16">
        <div>
          <Toc items={toc} />
        </div>
        <div className="min-w-0">
          <Block id="overview" label="Product overview">
            <p className="font-serif text-2xl leading-snug first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] md:text-[30px]">
              {t.overview}
            </p>
          </Block>

          <Block id="audience" label="Target audience & personas" title={t.audience}>
            <div className="grid gap-3 md:grid-cols-3">
              {t.personas.map((p, i) => (
                <div key={p.name} className="rounded-2xl border border-line bg-card p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full font-serif text-lg italic text-white" style={{ background: t.color }}>
                      {p.name.replace("The ", "")[0]}
                    </span>
                    <span className="font-mono text-[10px] text-faint">Persona {i + 1}</span>
                  </div>
                  <p className="mt-4 font-medium">{p.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{p.need}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block id="problems" label="Core user problems">
            <BulletList items={t.problems} numbered />
          </Block>

          <Block id="value" label="Value proposition">
            <blockquote className="border-l-2 pl-6 font-serif text-3xl italic leading-snug md:text-4xl" style={{ borderColor: t.color }}>
              &ldquo;{t.valueProp}&rdquo;
            </blockquote>
          </Block>

          <Block id="business" label="Business model">
            <div className="grid gap-3 sm:grid-cols-3">
              {t.businessModel.map((b, i) => (
                <div key={b} className="rounded-2xl border border-line bg-card p-5">
                  <p className="font-mono text-[10px] text-faint">Revenue stream {i + 1}</p>
                  <p className="mt-2 text-sm">{b}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block id="strategy" label="Product strategy">
            <p className="max-w-2xl text-lg leading-relaxed text-fg/90">{t.strategy}</p>
          </Block>

          <Block id="journey" label="User journey & UX analysis" title="Where it delights, where it breaks">
            <JourneyMap journey={t.journey} color={t.color} />
          </Block>

          <Block id="features" label="Feature breakdown">
            <div className="overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead className="bg-bg-2 text-left">
                  <tr>
                    <th className="px-5 py-3 font-mono text-[10px] font-normal uppercase tracking-wider text-faint">Feature</th>
                    <th className="px-5 py-3 font-mono text-[10px] font-normal uppercase tracking-wider text-faint">Strategic role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {t.features.map((f) => (
                    <tr key={f.name} className="transition-colors hover:bg-fg/[0.03]">
                      <td className="px-5 py-3.5 font-medium">{f.name}</td>
                      <td className="px-5 py-3.5 text-muted">{f.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>

          <Block id="loops" label="Growth loops">
            <LoopDiagram loop={t.loop} color={t.color} />
          </Block>

          <Block id="monetization" label="Monetization strategy">
            <BulletList items={t.monetization} />
          </Block>

          <Block id="swot" label="Strengths & weaknesses">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-line bg-card p-5">
                <p className="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-500">
                  <Plus className="size-4" /> Strengths
                </p>
                <ul className="space-y-2.5 text-sm">
                  {t.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-card p-5">
                <p className="mb-4 flex items-center gap-2 text-sm font-medium text-amber-500">
                  <Minus className="size-4" /> Weaknesses
                </p>
                <ul className="space-y-2.5 text-sm">
                  {t.weaknesses.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Block>

          <Block id="opportunities" label="Identified opportunities">
            <div className="flex flex-wrap gap-2">
              {t.opportunities.map((o) => (
                <span key={o} className="rounded-full border border-line bg-card px-4 py-2 text-sm">
                  {o}
                </span>
              ))}
            </div>
          </Block>

          <Block id="improvements" label="My proposed improvements" title="What I'd build">
            <Accordion items={t.improvements.map((im) => ({ title: im.title, body: im.detail }))} />
          </Block>

          <Block id="roadmap" label="Prioritized feature roadmap" title="Impact vs. effort">
            <PriorityMatrix roadmap={t.roadmap} color={t.color} />
          </Block>

          <Block id="kpis" label="Success metrics & KPIs">
            <div className="grid gap-3 sm:grid-cols-2">
              {t.kpis.map((k, i) => (
                <div key={k.name} className="flex items-start gap-4 rounded-2xl border border-line bg-card p-5">
                  <span className="font-mono text-xs" style={{ color: t.color }}>
                    {i === 0 ? "★" : String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-medium">{k.name}</p>
                    <p className="mt-1 text-sm text-muted">{k.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <NextCase href={`/teardowns/${next.slug}`} eyebrow="Next teardown" title={next.name} />
        </div>
      </div>
    </article>
  );
}
