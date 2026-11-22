import type { Metadata } from "next";
import { journey, site, skills } from "@/content/site";
import { projects } from "@/content/projects";
import { BackLink } from "@/components/case/CaseLayout";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = { title: `Resume — ${site.name}` };

export default function ResumePage() {
  return (
    <div className="pb-24 pt-28 md:pt-32 print:p-0">
      <div className="container-x max-w-[860px]">
        <div className="flex items-center justify-between print:hidden">
          <BackLink href="/" label="Back to portfolio" />
          <PrintButton />
        </div>

        <div className="mt-8 rounded-3xl border border-line bg-card-solid p-8 md:p-12 print:rounded-none print:border-0 print:p-0">
          <header className="border-b border-line pb-6">
            <h1 className="text-4xl font-medium tracking-tight">{site.name}</h1>
            <p className="mt-1 text-muted">{site.role}</p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              <a href={`mailto:${site.email}`} className="hover:text-fg">{site.email}</a>
              <a href={site.links.linkedin} className="hover:text-fg">LinkedIn</a>
              <a href={site.links.github} className="hover:text-fg">GitHub</a>
            </p>
          </header>

          <section className="mt-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Summary</h2>
            <p className="mt-2 text-sm leading-relaxed">{site.intro}</p>
          </section>

          <section className="mt-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Experience & education</h2>
            <ul className="mt-3 space-y-4">
              {[...journey].reverse().map((t) => (
                <li key={t.title}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">
                      {t.title} <span className="font-normal text-muted">· {t.org}</span>
                    </p>
                    <p className="font-mono text-xs text-faint">{t.period}</p>
                  </div>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-muted">
                    {t.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Projects</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {projects.map((p) => (
                <li key={p.slug}>
                  <span className="font-medium">{p.title}</span> <span className="text-muted">· {p.short}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Skills</h2>
            <dl className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
              {skills.map((g) => (
                <div key={g.group} className="flex gap-2">
                  <dt className="w-20 shrink-0 text-faint">{g.group}</dt>
                  <dd>{g.items.map((s) => s.name).join(", ")}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="mt-8 rounded-xl border border-dashed border-amber-500/50 bg-amber-500/10 p-3 text-xs text-amber-600 print:hidden dark:text-amber-400">
            This page is generated from the site content. Replace the [placeholders] in src/content/site.ts, or drop your own
            PDF at public/resume.pdf and point site.links.resume to it.
          </p>
        </div>
      </div>
    </div>
  );
}
