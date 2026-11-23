"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { projects, type Project } from "@/content/projects";

const MotionLink = motion.create(Link);

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

// Apple-style motion (Designing Fluid Interfaces): critically damped springs by
// default, so nothing overshoots; motion always starts from the live value.
const SPRING = { type: "spring", bounce: 0, duration: 0.4 } as const; // response 0.4, damping 1.0
const ENTER = { type: "spring", bounce: 0, duration: 0.9 } as const;
// critically damped follow for the pointer tilt (response ≈ 0.6s)
const TILT_SPRING = { stiffness: 110, damping: 21, mass: 1 };

// cards evenly spaced on an ellipse around the title (works for any count)
const RX = 374;
const RY = 260;
function slotFor(i: number, n: number) {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
  const px = Math.round(Math.cos(a) * RX);
  const py = Math.round(Math.sin(a) * RY);
  // a gentle lean towards the centre, as in the moodboard
  return { px, py, ry: (-px / RX) * 16, rx: (py / RY) * 12 };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Projects() {
  const [active, setActive] = useState<number | null>(null);
  const reduce = useSafeReducedMotion();
  const p = active !== null ? projects[active] : null;

  // The whole ring leans a few degrees toward the pointer: motion that hints
  // where your attention is going. Springs make it interruptible at any instant.
  const ringRef = useRef<HTMLDivElement>(null);
  const tiltX = useSpring(0, TILT_SPRING);
  const tiltY = useSpring(0, TILT_SPRING);

  const onRingMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ringRef.current) return;
    const r = ringRef.current.getBoundingClientRect();
    const nx = (e.clientX - (r.left + r.width / 2)) / r.width; // -0.5 … 0.5
    const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
    tiltY.set(nx * 10);
    tiltX.set(-ny * 8);
  };
  const resetRing = () => {
    tiltX.set(0);
    tiltY.set(0);
    setActive(null);
  };

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative overflow-hidden border-t border-line bg-black py-24 md:py-28">
      {/* floor light */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(255,255,255,.07),transparent)]" />

      <div className="container-x relative">
        <div className="flex items-baseline justify-between gap-4">
          <p className="kicker text-muted">04 — Selected works</p>
          <p className="hidden font-mono text-[11px] text-faint lg:block">
            {pad(projects.length)} case studies · hover to preview
          </p>
        </div>

        {/* desktop: the ring */}
        <div
          className="relative mx-auto mt-4 hidden h-[740px] max-w-[1100px] [perspective:1600px] lg:block"
          onPointerMove={onRingMove}
          onPointerLeave={resetRing}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) resetRing();
          }}
        >
          <motion.div
            ref={ringRef}
            className="absolute inset-0 [transform-style:preserve-3d]"
            style={{ rotateX: tiltX, rotateY: tiltY }}
          >
            {projects.map((proj, i) => {
              const s = slotFor(i, projects.length);
              const on = active === i;
              const dim = active !== null && !on;
              return (
                <motion.div
                  key={proj.slug}
                  className="absolute h-[170px] w-[260px] [transform-style:preserve-3d]"
                  style={{
                    zIndex: on ? 20 : 1,
                    left: `calc(50% + ${s.px - 130}px)`,
                    top: `calc(50% + ${s.py - 85}px)`,
                  }}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: -s.px * 0.6, y: -s.py * 0.6, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ ...ENTER, delay: 0.05 + i * 0.06 }}
                >
                  <MotionLink
                    href={`/projects/${proj.slug}`}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-label={`${proj.title}: view case study`}
                    className="block h-full w-full rounded-2xl outline-offset-4"
                    animate={{
                      rotateY: on || reduce ? 0 : s.ry,
                      rotateX: on || reduce ? 0 : s.rx,
                      // focus pulls forward; the rest step back instead of looking disabled
                      scale: on ? 1.1 : dim ? 0.96 : 1,
                      z: on && !reduce ? 40 : 0,
                      opacity: dim ? 0.5 : 1,
                      filter: dim ? "saturate(0.35) brightness(0.8)" : "saturate(1) brightness(1)",
                    }}
                    whileTap={reduce ? undefined : { scale: on ? 1.06 : 0.97 }}
                    transition={SPRING}
                  >
                    <WorkCard p={proj} index={i} className="h-full w-full" />
                  </MotionLink>
                </motion.div>
              );
            })}
          </motion.div>

          {/* centre: the title, or the focused project (cross-fade, never a blank frame) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[380px] -translate-x-1/2 -translate-y-1/2">
            <AnimatePresence initial={false}>
              {p ? (
                <motion.div
                  key={p.slug}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.02, filter: "blur(6px)" }}
                  transition={SPRING}
                >
                  <p className="font-mono text-[11px] tabular-nums text-faint">
                    {pad((active ?? 0) + 1)} / {pad(projects.length)}
                  </p>
                  <p className="mt-2 text-[30px] font-semibold leading-[1.05] tracking-[-0.025em] text-fg">{p.title}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: `hsl(${p.hue} 85% 65%)` }}>
                    {p.category}
                  </p>
                  <p className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-muted">{p.short}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="title"
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={SPRING}
                >
                  <h2
                    id="projects-title"
                    className="font-display text-[56px] font-extrabold uppercase leading-none tracking-[-0.02em] [text-shadow:0_0_50px_rgba(255,255,255,.25)]"
                  >
                    Works &apos;26
                  </h2>
                  <p className="mt-3 text-[13px] text-faint">Hover a project to preview</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* below lg: a plain grid */}
        <div className="lg:hidden">
          <h2 className="mt-6 font-display text-[48px] font-extrabold uppercase leading-none tracking-[-0.02em] md:text-[72px]">Works &apos;26</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {projects.map((proj, i) => (
              <motion.li
                key={proj.slug}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...ENTER, delay: (i % 2) * 0.06 }}
              >
                <MotionLink href={`/projects/${proj.slug}`} className="group block" whileTap={reduce ? undefined : { scale: 0.98 }} transition={SPRING}>
                  <WorkCard p={proj} index={i} className="aspect-[260/170]" />
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] tabular-nums text-faint">
                        {pad(i + 1)} · {proj.category}
                      </p>
                      <p className="mt-1 text-[17px] font-semibold tracking-[-0.01em]">{proj.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{proj.short}</p>
                    </div>
                    <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </MotionLink>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
