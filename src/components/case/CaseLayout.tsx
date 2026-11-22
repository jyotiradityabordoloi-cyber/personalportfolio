"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import clsx from "clsx";

/* Sticky table of contents with animated active indicator */
export function Toc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-28 hidden lg:block">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">On this page</p>
      <ul className="relative space-y-0.5 border-l border-line">
        {items.map((i) => (
          <li key={i.id} className="relative">
            {active === i.id && (
              <motion.span layoutId="toc-indicator" className="absolute -left-px inset-y-1 w-px bg-accent" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
            )}
            <a
              href={`#${i.id}`}
              className={clsx("block py-1.5 pl-4 text-[13px] transition-colors", active === i.id ? "text-fg" : "text-faint hover:text-muted")}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Block({
  id,
  label,
  title,
  children,
  className,
}: {
  id: string;
  label: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={clsx("scroll-mt-28 border-t border-line py-12 md:py-16", className)}
    >
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{label}</p>
      {title && <h2 className="mb-6 text-balance text-2xl font-medium tracking-tight md:text-3xl">{title}</h2>}
      {children}
    </motion.section>
  );
}

export function Accordion({ items }: { items: { title: string; body: React.ReactNode; meta?: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`acc-${i}`}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-fg/[0.03]"
              >
                <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-[15px] font-medium">{it.title}</span>
                {it.meta && <span className="hidden font-mono text-[10px] text-faint sm:block">{it.meta}</span>}
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown className="size-4 text-muted" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`acc-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pl-[52px] text-sm leading-relaxed text-muted">{it.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
      {label}
    </Link>
  );
}

export function NextCase({ href, eyebrow, title }: { href: string; eyebrow: string; title: string }) {
  return (
    <Link
      href={href}
      className="group mt-10 flex items-center justify-between gap-6 rounded-3xl border border-line bg-card p-6 transition-colors hover:border-line-strong md:p-10"
    >
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{eyebrow}</p>
        <p className="mt-2 text-2xl font-medium tracking-tight md:text-4xl">{title}</p>
      </div>
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-fg text-bg transition-transform duration-300 group-hover:translate-x-1">
        <ArrowRight className="size-5" />
      </span>
    </Link>
  );
}

export function BulletList({ items, numbered = false }: { items: string[]; numbered?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((t, i) => (
        <li key={t} className="flex gap-4 text-[15px] leading-relaxed text-fg/85">
          {numbered ? (
            <span className="mt-0.5 font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
          ) : (
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
          )}
          {t}
        </li>
      ))}
    </ul>
  );
}
