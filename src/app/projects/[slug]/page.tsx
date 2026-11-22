import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppWindow, ArrowUpRight, Globe, ImageIcon } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { Accordion, BackLink, Block, BulletList, NextCase, Toc } from "@/components/case/CaseLayout";
import { FlowDiagram, ProjectCover } from "@/components/case/FlowDiagram";
import { Counter, PlaceholderTag } from "@/components/ui/primitives";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return { title: p ? `${p.title} — ${site.name}` : "Project" };
}

const toc = [
  { id: "problem", label: "Problem" },
  { id: "role", label: "My role" },
  { id: "challenges", label: "Key challenges" },
  { id: "approach", label: "Solution approach" },
  { id: "decisions", label: "Product decisions" },
  { id: "outcomes", label: "Outcomes" },
  { id: "screens", label: "Screens" },
  { id: "stack", label: "Tools" },
];

function buildToc(p: NonNullable<ReturnType<typeof getProject>>) {
  return toc.flatMap((t) => {
    const extra: { id: string; label: string }[] = [];
    if (t.id === "problem" && p.audience) extra.push({ id: "audience", label: "Who it's for" });
    if (t.id === "approach" && p.features) extra.push({ id: "features", label: "What makes it different" });
    if (t.id === "approach" && p.principles) extra.push({ id: "principles", label: p.principlesTitle ?? "Principles" });
    if (t.id === "outcomes" && p.learning) extra.push({ id: "learning", label: "Product learning" });
    if (t.id === "outcomes" && p.next) extra.push({ id: "next", label: p.nextTitle ?? "What's next" });
    return [t, ...extra];
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.findIndex((x) => x.slug === slug);
  const next = projects[(idx + 1) % projects.length];
  const accent = `hsl(${p.hue} 75% 55%)`;

  return (
    <article className="pb-24 pt-28 md:pt-32">
      <div className="container-x">
        <BackLink href="/#projects" label="All projects" />

        {/* hero */}
        <header className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em]" style={{ color: accent }}>
              Case study {String(idx + 1).padStart(2, "0")} · {p.category}
            </p>
            <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.04em] md:text-6xl">{p.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{p.short}</p>
            {(p.links?.live || p.links?.app || p.links?.repo) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {p.links?.live && (
                  <a
                    href={p.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black transition-transform hover:-translate-y-px active:scale-[0.97]"
                  >
                    <Globe className="size-4" /> {p.links.app ? "Visit the site" : "Try the live app"}
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
                {p.links?.app && (
                  <a
                    href={p.links.app}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm transition-[background-color,transform] hover:bg-white/10 active:scale-[0.97]"
                  >
                    <AppWindow className="size-4" /> Open the app
                  </a>
                )}
                {p.links?.repo && (
                  <a
                    href={p.links.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm transition-[background-color,transform] hover:bg-white/10 active:scale-[0.97]"
                  >
                    <GithubIcon /> View code on GitHub
                  </a>
                )}
              </div>
            )}
            {p.note && <p className="mt-5 max-w-xl text-[12.5px] leading-relaxed text-faint">{p.note}</p>}
          </div>
          {p.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.cover}
              alt={`${p.title}: product overview`}
              width={1600}
              height={900}
              className="aspect-[16/9] w-full rounded-2xl border border-line object-cover"
            />
          ) : (
            <ProjectCover hue={p.hue} label={p.category} steps={p.flow} className="h-64" />
          )}
        </header>

        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {[
            { k: "Role", v: p.role.split(":")[0] },
            { k: "Timeline", v: p.year },
            { k: "Category", v: p.category },
            { k: "Tools", v: p.tools.slice(0, 3).join(", ") },
          ].map((m) => (
            <div key={m.k} className="bg-bg p-4 md:p-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{m.k}</dt>
              <dd className="mt-1.5 text-sm">{m.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-12 lg:grid-cols-[200px_1fr] lg:gap-16">
          <div>
            <Toc items={buildToc(p)} />
          </div>

          <div className="min-w-0">
            <Block id="problem" label="Problem statement">
              <p className="font-serif text-2xl leading-snug md:text-[32px]">{p.problem}</p>
            </Block>

            {p.audience && (
              <Block id="audience" label="Who it's for">
                <div className="grid gap-3 md:grid-cols-2">
                  {p.audience.map((a) => (
                    <p key={a} className="rounded-2xl border border-line bg-card p-5 text-[15px] leading-relaxed text-fg/85">
                      {a}
                    </p>
                  ))}
                </div>
              </Block>
            )}

            <Block id="role" label="My role">
              <p className="max-w-2xl text-[15px] leading-relaxed text-fg/85">{p.role}</p>
            </Block>

            <Block id="challenges" label="Key challenges" title="What made this hard">
              <div className="grid gap-3 md:grid-cols-3">
                {p.challenges.map((c, i) => (
                  <div key={c} className="rounded-2xl border border-line bg-card p-5">
                    <span className="font-mono text-xs" style={{ color: accent }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed">{c}</p>
                  </div>
                ))}
              </div>
            </Block>

            <Block id="approach" label="Solution approach" title="How I approached it">
              <BulletList items={p.approach} numbered />
              <div className="mt-10 rounded-3xl border border-line bg-bg-2 p-4 md:p-6">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">Product flow</p>
                <FlowDiagram steps={p.flow} hue={p.hue} />
              </div>
            </Block>

            {p.features && (
              <Block id="features" label="What makes it different" title="Built differently">
                <div className="grid gap-3 md:grid-cols-2">
                  {p.features.map((ft, i) => (
                    <div
                      key={ft.title}
                      className={`rounded-2xl border bg-card p-5 ${i === 0 ? "border-line-strong md:col-span-2" : "border-line"}`}
                    >
                      <span className="font-mono text-xs" style={{ color: accent }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className={`mt-2 font-medium ${i === 0 ? "text-xl" : ""}`}>{ft.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{ft.body}</p>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {p.principles && (
              <Block id="principles" label="Product thinking" title={p.principlesTitle ?? "Product principles"}>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {p.principles.map((pr, i) => (
                    <div key={pr.title} className="rounded-2xl border border-line bg-card p-5">
                      <span className="font-mono text-xs" style={{ color: accent }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-2 font-medium">{pr.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{pr.body}</p>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            <Block id="decisions" label="Product decisions" title="Key calls and their trade-offs">
              <Accordion
                items={p.decisions.map((d) => ({
                  title: d.decision,
                  body: (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-accent-2">Why</p>
                        <p>{d.why}</p>
                      </div>
                      <div>
                        <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-amber-500">Trade-off</p>
                        <p>{d.tradeoff}</p>
                      </div>
                    </div>
                  ),
                }))}
              />
            </Block>

            <Block id="outcomes" label="Outcome & impact" title="How success is measured">
              <p className="mb-6 max-w-2xl text-sm text-muted">
                {p.outcomesNote ??
                  "Each number says whether it was measured or estimated. Metrics without data yet are marked as placeholders."}
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {p.outcomes.map((o) => (
                  <div key={o.label} className="rounded-2xl border border-line bg-card p-5">
                    <p className="text-xs text-muted">{o.label}</p>
                    {o.display ? (
                      <p className="mt-3 text-4xl font-medium tracking-tight">{o.display}</p>
                    ) : o.value !== null ? (
                      <Counter to={o.value} decimals={o.decimals} prefix={o.prefix} suffix={o.suffix} className="mt-3 block text-4xl font-medium tracking-tight" />
                    ) : (
                      <p className="mt-3 text-4xl font-medium tracking-tight text-faint">—</p>
                    )}
                    <div className="mt-3">{o.value === null ? <PlaceholderTag>{o.note}</PlaceholderTag> : <span className="text-xs text-faint">{o.note}</span>}</div>
                  </div>
                ))}
              </div>
              {p.metrics && (
                <div className="mt-8">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">Metrics to track</p>
                  <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
                    {p.metrics.map((m, i) => (
                      <div key={m.type} className="grid gap-1 bg-card px-5 py-3.5 sm:grid-cols-[160px_1fr] sm:gap-6">
                        <dt className={`text-[13px] ${i === 0 ? "font-semibold" : "text-muted"}`} style={i === 0 ? { color: accent } : undefined}>
                          {m.type}
                        </dt>
                        <dd className={`text-[14.5px] leading-relaxed ${i === 0 ? "font-medium text-fg" : "text-fg/85"}`}>{m.metric}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </Block>

            {p.learning && (
              <Block id="learning" label="Product learning">
                <p className="max-w-3xl border-l-2 pl-6 font-serif text-2xl leading-snug md:text-[30px]" style={{ borderColor: accent }}>
                  {p.learning}
                </p>
              </Block>
            )}

            {p.next && (
              <Block id="next" label={p.nextTitle ?? "What's next"}>
                <BulletList items={p.next} numbered />
              </Block>
            )}

            <Block id="screens" label="Screens & artefacts" title="Product screenshots">
              <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
                {["Main product screen", "Detail / flow"].map((s, i) =>
                  i === 0 && p.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={s} src={p.cover} alt={`${p.title}: main product screen`} className="aspect-[16/10] w-full rounded-2xl border border-line object-cover object-left" loading="lazy" />
                  ) : (
                  <div
                    key={s}
                    className={`grid place-items-center rounded-2xl border border-dashed border-line-strong bg-bg-2 ${i === 0 ? "aspect-[16/10]" : "aspect-[4/5] md:aspect-auto"}`}
                  >
                    <div className="text-center">
                      <ImageIcon className="mx-auto size-6 text-faint" />
                      <p className="mt-2 text-sm text-muted">{s}</p>
                      <div className="mt-2">
                        <PlaceholderTag>Add screenshot</PlaceholderTag>
                      </div>
                    </div>
                  </div>
                  ),
                )}
              </div>
            </Block>

            <Block id="stack" label="Technologies & tools" title={p.stack ? "Tech stack" : undefined}>
              {p.stack && (
                <dl className="mb-6 divide-y divide-line overflow-hidden rounded-2xl border border-line">
                  {p.stack.map((row) => (
                    <div key={row.layer} className="grid gap-1 bg-card px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: accent }}>
                        {row.layer}
                      </dt>
                      <dd className="text-[14.5px] leading-relaxed text-fg/85">{row.items}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="flex flex-wrap gap-2">
                {p.tools.map((t) => (
                  <span key={t} className="rounded-full border border-line bg-card px-3.5 py-1.5 text-sm">
                    {t}
                  </span>
                ))}
              </div>
            </Block>

            <NextCase href={`/projects/${next.slug}`} eyebrow="Next case study" title={next.title} />
          </div>
        </div>
      </div>
    </article>
  );
}
