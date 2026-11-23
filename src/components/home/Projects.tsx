"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { projects, type Project } from "@/content/projects";

const ease = [0.22, 1, 0.36, 1] as const;

/* A project card in its own colour: the one place (with skills) colour lives. */
function WorkCard({ p, index, className }: { p: Project; index: number; className?: string }) {
  const c1 = `hsl(${p.hue} 85% 58%)`;
  const c2 = `hsl(${(p.hue + 35) % 360} 90% 52% / 0.8)`;

  // A dedicated card image already carries the title, so show it clean.
  if (p.card) {
    return (
      <div className={clsx("relative isolate overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-2xl shadow-black/60", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.card} alt="" className="absolute inset-0 h-full w-full object-cover object-left" loading="lazy" />
        <span className="sr-only">
          {String(index + 1).padStart(2, "0")} {p.title}, {p.category}
        </span>
      </div>
    );
  }

  return (
    <div
      className={clsx("relative isolate overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60", className)}
      style={{
        background: `radial-gradient(90% 90% at 15% 10%, ${c1}, transparent 60%), radial-gradient(80% 90% at 100% 100%, ${c2}, transparent 65%), #0c0c0c`,
      }}
    >
      {p.cover && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.cover} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-left-top" loading="lazy" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        </>
      )}
      <svg aria-hidden viewBox="0 0 260 170" className={clsx("absolute inset-0 -z-10 h-full w-full opacity-40", p.cover && "hidden")} preserveAspectRatio="none">
        <path d="M0 130 C 60 120, 90 60, 140 75 S 220 30, 260 40" fill="none" stroke="white" strokeWidth="1.2" />
        <path d="M0 150 C 70 145, 110 110, 160 115 S 230 85, 260 92" fill="none" stroke="white" strokeOpacity=".6" strokeWidth="1" strokeDasharray="3 5" />
      </svg>
      <div className="flex h-full flex-col justify-between p-4 text-white">
        <div className={clsx("flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-white/80", p.cover && "[&>span]:rounded [&>span]:bg-black/55 [&>span]:px-1.5 [&>span]:py-0.5")}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="truncate pl-3">{p.category}</span>
        </div>
        <p className="text-balance text-[15px] font-semibold leading-tight [text-shadow:0_1px_12px_rgba(0,0,0,.35)]">{p.title}</p>
      </div>
    </div>
  );
}

// cards evenly spaced on an ellipse around the title (works for any count)
const RX = 374;
const RY = 260;
function slotFor(i: number, n: number) {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
  const px = Math.round(Math.cos(a) * RX);
  const py = Math.round(Math.sin(a) * RY);
  // tilt each card towards the centre, as in the moodboard
  return { px, py, ry: (-px / RX) * 28, rx: (py / RY) * 22 };
}

export function Projects() {
  const [hover, setHover] = useState<number | null>(null);
  const reduce = useSafeReducedMotion();
  const p = hover !== null ? projects[hover] : null;

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative overflow-hidden border-t border-line bg-black py-24 md:py-28">
      {/* floor light */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(255,255,255,.07),transparent)]" />

      <div className="container-x relative">
        <p className="kicker text-muted">04 — Selected works</p>

        {/* desktop: the ring */}
        <div className="relative mx-auto mt-4 hidden h-[760px] max-w-[1100px] [perspective:1400px] lg:block">
          {projects.map((proj, i) => {
            const s = slotFor(i, projects.length);
            const active = hover === i;
            const dim = hover !== null && !active;
            return (
              <motion.div
                key={proj.slug}
                className="absolute h-[170px] w-[260px]"
                style={{
                  zIndex: active ? 20 : 1,
                  left: `calc(50% + ${s.px - 130}px)`,
                  top: `calc(50% + ${s.py - 85}px)`,
                }}
                initial={{ opacity: 0, x: reduce ? 0 : -s.px, y: reduce ? 0 : -s.py, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 1.1, delay: 0.1 + i * 0.08, ease }}
              >
                <Link
                  href={`/projects/${proj.slug}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={`${proj.title}: view case study`}
                  className="block h-full w-full"
                >
                  <motion.div
                    className="h-full w-full"
                    animate={{
                      rotateY: active || reduce ? 0 : s.ry,
                      rotateX: active || reduce ? 0 : s.rx,
                      scale: active ? 1.12 : 1,
                      opacity: dim ? 0.35 : 1,
                      filter: dim ? "grayscale(1)" : "grayscale(0)",
                    }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                  >
                    <WorkCard p={proj} index={i} className="h-full w-full" />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}

          {/* centre: the title, or the hovered project */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 w-[360px] -translate-x-1/2 -translate-y-1/2 text-center">
            <AnimatePresence mode="wait">
              {p ? (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: `hsl(${p.hue} 85% 65%)` }}>
                    {p.category}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.short}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-[13px] text-fg">
                    View case study <ArrowUpRight className="size-3.5" />
                  </p>
                </motion.div>
              ) : (
                <motion.h2
                  key="title"
                  id="projects-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-display text-[56px] font-extrabold uppercase leading-none tracking-[-0.02em] [text-shadow:0_0_50px_rgba(255,255,255,.25)]"
                >
                  Works &apos;26
                </motion.h2>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* below lg: a plain grid */}
        <div className="lg:hidden">
          <h2 className="mt-6 font-display text-[48px] font-extrabold uppercase leading-none tracking-[-0.02em] md:text-[72px]">Works &apos;26</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {projects.map((proj, i) => (
              <motion.li
                key={proj.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.08, duration: 0.6, ease }}
              >
                <Link href={`/projects/${proj.slug}`} className="group block">
                  <WorkCard p={proj} index={i} className="aspect-[260/170] transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <p className="mt-3 text-sm text-muted">{proj.short}</p>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
