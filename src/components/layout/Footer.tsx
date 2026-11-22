import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { nav, site } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-fg font-mono text-[11px] font-semibold text-bg">
              {site.initials}
            </span>
            <span className="text-sm font-medium">{site.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {site.role}. Researching, building and measuring products that matter.
          </p>
        </div>
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-faint">Sitemap</p>
          <ul className="grid grid-cols-2 gap-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.id}>
                <Link href={`/#${n.id}`} className="text-muted transition-colors hover:text-fg">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-faint">Elsewhere</p>
          <ul className="grid gap-2 text-sm">
            <li>
              <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-fg">
                <LinkedinIcon className="size-3.5" /> LinkedIn
              </a>
            </li>
            <li>
              <a href={site.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-fg">
                <GithubIcon className="size-3.5" /> GitHub
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="text-muted hover:text-fg">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col items-start justify-between gap-4 border-t border-line py-6 text-xs text-faint sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} {site.name}. Designed and built with Next.js, Tailwind and Framer Motion.
        </p>
        <a href="#main" className="group inline-flex items-center gap-1.5 text-muted hover:text-fg">
          Back to top
          <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  );
}
