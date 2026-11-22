"use client";

/*
  Experience & Journey.
  A rising path from college to today. Every step is a button: choosing one
  lights the path up to it and swaps the story + XYZ highlights below.
*/

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Briefcase,
  Check,
  Factory,
  GraduationCap,
  Layers,
  Link2,
  Rocket,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { journey, journeyStats, type JourneyStep } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;
const stepIcons = { cap: GraduationCap, factory: Factory, layers: Layers, link: Link2 };
const statIcons = [Briefcase, Layers, GraduationCap, BookOpen];

/* ── mountain with a lit path to the flag ───────────────────── */
function Summit() {
  const reduce = useSafeReducedMotion();
  const trail = "M70 395 C 170 380, 210 330, 300 318 S 420 300, 455 250 S 520 190, 560 175 S 600 120, 640 92";
  return (
    <svg viewBox="0 0 720 420" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="mt-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a2a" />
          <stop offset="1" stopColor="#060606" />
        </linearGradient>
        <linearGradient id="mt-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3a" />
          <stop offset=".45" stopColor="#141414" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <radialGradient id="mt-glow" cx=".86" cy=".32" r=".38">
          <stop offset="0" stopColor="#fff" stopOpacity=".16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="mt-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <rect width="720" height="420" fill="url(#mt-glow)" />
      <path d="M0 420 L120 300 L210 330 L330 220 L420 260 L520 170 L600 210 L720 140 L720 420 Z" fill="url(#mt-far)" opacity=".7" />
      <path d="M40 420 L260 300 L360 320 L470 220 L560 160 L640 80 L690 130 L720 120 L720 420 Z" fill="url(#mt-near)" />
      {/* snow light on the ridge */}
      <path d="M560 160 L640 80 L690 130" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" />
      {/* the trail */}
      <path d={trail} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="6" filter="url(#mt-blur)" />
      <motion.path
        d={trail}
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease }}
      />
      {[
        [300, 318],
        [455, 250],
        [560, 175],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="#fff" opacity=".18" />
          <circle cx={x} cy={y} r="3.5" fill="#fff" />
        </g>
      ))}
      {/* flag */}
      <line x1="640" y1="92" x2="640" y2="58" stroke="#fff" strokeWidth="1.5" />
      <path d="M640 58 L664 64 L640 72 Z" fill="#fff" />
      <circle cx="640" cy="92" r="14" fill="#fff" opacity=".12" />
    </svg>
  );
}

/* ── the rising timeline ────────────────────────────────────── */
// node coordinates in the 1200×260 drawing; the wave passes through them
const NODES = [
  { x: 110, y: 205 },
  { x: 420, y: 178 },
  { x: 730, y: 158 },
  { x: 1020, y: 112 },
];
const WAVE =
  "M0 225 C 60 215, 80 205, 110 205 S 250 190, 300 196 S 380 182, 420 178 S 560 150, 620 164 S 700 160, 730 158 S 880 132, 940 124 S 990 116, 1020 112 S 1130 80, 1190 40";

function Timeline({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const reduce = useSafeReducedMotion();
  const fill = (NODES[active].x + 4) / 1190;
  return (
    <div className="relative mt-6 hidden h-[300px] lg:block">
      <svg viewBox="0 0 1200 260" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[260px] w-full" aria-hidden>
        <defs>
          <linearGradient id="wave-fade" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".05" />
            <stop offset=".15" stopColor="#fff" stopOpacity=".35" />
            <stop offset="1" stopColor="#fff" stopOpacity=".35" />
          </linearGradient>
        </defs>
        <path d={WAVE} fill="none" stroke="url(#wave-fade)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        {/* lit part: up to the chosen step */}
        <motion.path
          d={WAVE}
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,.8))" }}
          initial={false}
          animate={{ pathLength: fill }}
          transition={{ duration: reduce ? 0 : 0.9, ease }}
        />
        {/* arrow head */}
        <path d="M1170 38 L1192 39 L1180 58" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>

      {journey.map((j, i) => {
        const n = NODES[i];
        const left = `${(n.x / 1200) * 100}%`;
        const top = 300 - 260 + n.y; // px from the container top
        const Icon = stepIcons[j.icon];
        const on = i === active;
        return (
          <div key={j.id}>
            {/* card above the node */}
            <motion.button
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={on}
              aria-label={`${j.step} ${j.phase}: ${j.title}, ${j.org}, ${j.period}`}
              className={clsx(
                "absolute w-[220px] -translate-x-1/2 rounded-2xl border p-3 text-left backdrop-blur transition-[border-color,background-color,box-shadow] duration-300",
                on
                  ? "border-white/40 bg-white/[0.07] shadow-[0_0_40px_-8px_rgba(255,255,255,.35)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/25",
              )}
              style={{ left, bottom: 300 - top + 26 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-start gap-3">
                <span className={clsx("grid size-10 shrink-0 place-items-center rounded-xl border", on ? "border-white/30 bg-white text-black" : "border-white/15 bg-white/[0.06]")}>
                  <Icon className="size-[18px]" strokeWidth={1.7} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold leading-tight">{j.title}</span>
                  <span className="mt-0.5 block text-[12px] text-muted">{j.org}</span>
                  <span className="mt-0.5 block text-[11.5px] text-faint">{j.period}</span>
                </span>
              </span>
            </motion.button>

            {/* node */}
            <button
              type="button"
              onClick={() => onSelect(i)}
              tabIndex={-1}
              aria-hidden
              className="absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ left, top }}
            >
              <span className={clsx("absolute inset-0 rounded-full bg-white/20 transition-transform duration-300", on ? "scale-150" : "scale-75")} />
              <span className={clsx("relative size-3 rounded-full border-2 border-black transition-colors", on || i < active ? "bg-white" : "bg-white/40")} />
            </button>

            {/* label below */}
            <div className="absolute -translate-x-1/2 text-center" style={{ left, top: top + 18 }}>
              <span className={clsx("block font-mono text-[13px]", on ? "text-fg" : "text-faint")}>{j.step}</span>
              <span className={clsx("block whitespace-nowrap text-[12.5px]", on ? "text-fg" : "text-muted")}>{j.phase}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* phones/tablets: the steps as a selectable list */
function StepPicker({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <ol className="mt-8 grid gap-2 sm:grid-cols-2 lg:hidden">
      {journey.map((j, i) => {
        const on = i === active;
        const Icon = stepIcons[j.icon];
        return (
          <li key={j.id}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-pressed={on}
              className={clsx(
                "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors active:scale-[0.99]",
                on ? "border-white/40 bg-white/[0.07]" : "border-white/10 bg-white/[0.02]",
              )}
            >
              <span className={clsx("grid size-10 shrink-0 place-items-center rounded-xl border", on ? "border-white/30 bg-white text-black" : "border-white/15")}>
                <Icon className="size-[18px]" strokeWidth={1.7} />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] text-faint">
                  {j.step} · {j.phase}
                </span>
                <span className="block truncate text-[14px] font-semibold">{j.title}</span>
                <span className="block text-[12px] text-muted">
                  {j.org} · {j.period}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ── the chosen step, told properly ─────────────────────────── */
function StepDetail({ j }: { j: JourneyStep }) {
  const Icon = stepIcons[j.icon];
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr]">
      <div>
        <p className="kicker text-muted">{j.current ? "Current role" : `Step ${j.step} — ${j.phase}`}</p>
        <div className="mt-5 flex items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white text-black">
            <Icon className="size-6" strokeWidth={1.7} />
          </span>
          <div>
            <h3 className="text-[24px] font-semibold leading-tight tracking-tight md:text-[28px]">{j.title}</h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-muted">
              {j.org} <span className="text-faint">·</span> {j.period}
              {j.current && (
                <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[11px] font-medium text-fg">Current</span>
              )}
            </p>
            <p className="text-[12.5px] text-faint">{j.location}</p>
          </div>
        </div>
        <p className="mt-6 max-w-md font-serif text-[22px] leading-snug text-fg/90">&ldquo;{j.story}&rdquo;</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {j.tags.map((t) => (
            <li key={t} className="rounded-full border border-white/15 px-3 py-1 text-[12px] text-muted">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="kicker text-muted">Key highlights</p>
        <ul className="mt-5 space-y-4">
          {j.highlights.map((h, i) => (
            <motion.li
              key={h}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease }}
              className="flex gap-3 text-[14.5px] leading-relaxed text-fg/85"
            >
              <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full border border-white/25">
                <Check className="size-3" strokeWidth={2.5} />
              </span>
              {h}
            </motion.li>
          ))}
        </ul>
        {j.links?.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="group mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black transition-transform hover:-translate-y-px active:scale-[0.97]"
          >
            {l.label}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ))}
      </div>
    </div>
  );
}

const learning = [
  { label: "Product", Icon: Layers },
  { label: "Analytics", Icon: BarChart3 },
  { label: "AI / LLMs", Icon: Sparkles },
  { label: "Leadership", Icon: Rocket },
];

export function Experience() {
  const [active, setActive] = useState(0); // college first
  const j = journey[active];

  return (
    <section id="experience" aria-labelledby="journey-title" className="relative overflow-hidden border-t border-line bg-black py-24 md:py-28">
      {/* header + summit */}
      <div className="container-x relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="relative z-10">
            <p className="kicker text-muted">03 — Experience &amp; Journey</p>
            <h2 id="journey-title" className="mt-5 text-[clamp(40px,4.6vw,68px)] font-medium leading-[1.02] tracking-[-0.035em]">
              My Journey
              <br />
              from Engineering
              <br />
              to <em className="font-serif text-[1.12em] font-normal italic">Product</em>
            </h2>
            <p className="mt-6 max-w-lg text-[15.5px] leading-relaxed text-muted">
              How I grew from an Electronics &amp; Communication engineer into product work: through research, internships,
              hands-on delivery and constant learning. Choose a step to see what I learned there.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {journeyStats.map((s, i) => {
                const Icon = statIcons[i];
                return (
                  <li key={s.label} className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 size-[18px] shrink-0 text-muted" strokeWidth={1.6} />
                    <span>
                      <span className="block text-[16px] font-semibold leading-tight">{s.value}</span>
                      <span className="block text-[11.5px] leading-tight text-faint">{s.label}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div
            className="pointer-events-none relative -mr-8 hidden aspect-[720/420] lg:block"
            style={{ maskImage: "radial-gradient(70% 78% at 60% 58%, black 40%, transparent 92%)", WebkitMaskImage: "radial-gradient(70% 78% at 60% 58%, black 40%, transparent 92%)" }}
          >
            <Summit />
          </div>
        </div>

        {/* the journey line */}
        <div className="mt-16 flex items-center gap-4">
          <p className="kicker text-muted">The journey</p>
          <span className="h-px w-24 bg-line-strong" />
        </div>
        <Timeline active={active} onSelect={setActive} />
        <StepPicker active={active} onSelect={setActive} />

        {/* details */}
        <div className="mt-14 grid gap-12 border-t border-line pt-12 lg:grid-cols-[1fr_300px] lg:gap-16">
          <div aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={j.id}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease }}
              >
                <StepDetail j={j} />
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="lg:border-l lg:border-line lg:pl-12">
            <p className="kicker text-muted">Education</p>
            <button
              type="button"
              onClick={() => setActive(0)}
              className="group mt-5 flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-white/25"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-black">
                <GraduationCap className="size-5" strokeWidth={1.7} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold leading-snug">B.Tech in Electronics &amp; Communication Engineering</span>
                <span className="mt-1 block text-[12.5px] text-muted">VIT Vellore</span>
                <span className="block text-[12px] text-faint">Sep 2021 – May 2025</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>

            <p className="kicker mt-10 text-muted">Continuous learning</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {learning.map(({ label, Icon }) => (
                <li key={label} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[12.5px]">
                  <Icon className="size-4 text-muted" strokeWidth={1.6} />
                  {label}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
