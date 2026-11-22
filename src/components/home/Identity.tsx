"use client";

/*
  Identity → Toolkit.
  Desktop (≥1024px, motion allowed): the section pins; scrolling lifts the
  "PRODUCT BUILDER" block away and the toolkit cards rise in its place.
  Phones and reduced motion: the plain stacked layout.
  Plan: plans/001-identity-pinned-toolkit.md
*/

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  Repeat,
  Sparkle,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { skills, type Skill, type SkillGroup } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;

const focus = [
  { label: "Product Management", Icon: Layers },
  { label: "AI & Automation", Icon: Sparkle },
  { label: "Data & Analytics", Icon: BarChart3 },
  { label: "Digital Products", Icon: LayoutGrid },
];

const glyphs = { file: FileText, users: Users, chart: BarChart3, repeat: Repeat, layout: LayoutTemplate };
const groupIcons = { layers: Layers, chart: BarChart3, bolt: Zap, sparkles: Sparkles };
const toolCount = skills.reduce((n, g) => n + g.items.length, 0);

function GhostWord({ x, className = "" }: { x: MotionValue<string>; className?: string }) {
  return (
    <motion.p
      aria-hidden
      style={{ x }}
      className={`pointer-events-none absolute left-0 whitespace-nowrap font-display text-[22vw] font-extrabold uppercase leading-none tracking-[-0.03em] text-white/[0.035] md:text-[15vw] ${className}`}
    >
      Self-driven
    </motion.p>
  );
}

/* soft light streak behind the toolkit, as in the design */
function LightCurve() {
  return (
    <svg aria-hidden viewBox="0 0 1000 600" preserveAspectRatio="none" className="pointer-events-none absolute right-0 top-0 h-[70%] w-[65%] opacity-80">
      <defs>
        <linearGradient id="curve-stroke" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.05" />
        </linearGradient>
        <filter id="curve-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <path d="M80 600 C 380 520, 560 120, 1000 70" fill="none" stroke="url(#curve-stroke)" strokeWidth="18" filter="url(#curve-glow)" opacity=".55" />
      <path d="M80 600 C 380 520, 560 120, 1000 70" fill="none" stroke="url(#curve-stroke)" strokeWidth="1.5" />
      <path d="M200 600 C 470 540, 620 210, 1000 150" fill="none" stroke="url(#curve-stroke)" strokeWidth="1" opacity=".35" />
    </svg>
  );
}

/* ── identity block ─────────────────────────────────────────── */
function IdentityBlock({ animateList = false }: { animateList?: boolean }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
      <div>
        <p className="kicker text-muted">02 — Identity</p>
        <h2
          id="identity-title"
          className="mt-6 font-display text-[48px] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] [text-shadow:0_0_40px_rgba(255,255,255,.18)] md:text-[88px]"
        >
          Product
          <br />
          Builder
        </h2>
        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted">
          I practise product management by doing it: product teardowns, analytics case studies and AI projects shipped
          with engineers. Now looking for <span className="text-fg">my first APM role</span>.
        </p>
      </div>
      <ul className="grid gap-1">
        {focus.map(({ label, Icon }, i) => (
          <motion.li
            key={label}
            initial={animateList ? { opacity: 0, x: 16 } : false}
            whileInView={animateList ? { opacity: 1, x: 0 } : undefined}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.7, ease }}
            className="flex items-center gap-4 border-b border-line py-4 text-[17px]"
          >
            <Icon className="size-5 text-muted" strokeWidth={1.6} />
            {label}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ── toolkit ────────────────────────────────────────────────── */
function ToolTile({ s }: { s: Skill }) {
  const Glyph = s.glyph ? glyphs[s.glyph] : null;
  return (
    <li className="group/tool flex flex-col items-center gap-2 text-center">
      <span className="grid size-12 place-items-center rounded-[13px] border border-white/10 bg-[linear-gradient(160deg,#1c1c1c,#0b0b0b)] shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition-[transform,border-color] duration-200 group-hover/tool:-translate-y-0.5 group-hover/tool:border-white/25">
        {s.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.logo} alt="" className={`max-h-[26px] max-w-[30px] object-contain ${s.ink ? "invert" : ""}`} loading="lazy" />
        ) : Glyph ? (
          <Glyph className="size-[22px] text-white" strokeWidth={1.6} />
        ) : null}
      </span>
      <span className="text-[11.5px] leading-tight text-fg/85">{s.name}</span>
    </li>
  );
}

function ToolCard({ g }: { g: SkillGroup }) {
  const Icon = groupIcons[g.icon];
  return (
    <article className="group relative flex h-full flex-col rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.01))] p-6 backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:shadow-[0_0_0_1px_rgba(255,255,255,.08),0_20px_60px_-20px_rgba(255,255,255,.18)]">
      <span className="grid size-12 place-items-center rounded-[13px] border border-white/10 bg-white/[0.06]">
        <Icon className="size-[22px] text-white" strokeWidth={1.6} />
      </span>
      <h3 className="mt-5 text-[22px] font-semibold tracking-tight">{g.group}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{g.blurb}</p>
      <ul className="mt-6 grid grid-cols-4 gap-x-2 gap-y-4">
        {g.items.map((s) => (
          <ToolTile key={s.name} s={s} />
        ))}
      </ul>
      <a
        href={g.href}
        className="mt-auto flex items-center justify-between gap-3 pt-6 text-[12.5px] text-muted transition-colors hover:text-fg"
        aria-label={`${g.group}: ${g.tags}. See related work`}
      >
        <span className="truncate">{g.tags}</span>
        <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>
    </article>
  );
}

function ToolkitHeading() {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="kicker text-muted">02 — Toolkit</p>
        <h2 className="mt-4 text-[clamp(44px,min(5.2vw,8.6svh),84px)] font-medium leading-[1] tracking-[-0.04em]">
          My Product <em className="font-normal italic text-white/80">Toolkit</em>
        </h2>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
          A practical stack of product, data, design and automation tools I use to go from problem discovery to shipped impact.
        </p>
      </div>
      <span className="inline-flex h-11 w-fit shrink-0 items-center gap-2 rounded-full border border-white/15 px-5 text-[14px]">
        <Layers className="size-4 text-muted" strokeWidth={1.6} />
        {toolCount}+ tools
      </span>
    </div>
  );
}

/* ── phones / reduced motion: stacked ───────────────────────── */
function IdentityStatic() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ghostX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["8%", "-12%"]);

  return (
    <section ref={ref} id="identity" aria-labelledby="identity-title" className="relative overflow-hidden border-t border-line bg-black py-28 md:py-36">
      <GhostWord x={ghostX} className="top-16 md:top-20" />
      <div className="container-x relative">
        <IdentityBlock animateList={!reduce} />
        <div className="relative mt-28">
          <ToolkitHeading />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {skills.map((g, gi) => (
              <motion.div
                key={g.group}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (gi % 2) * 0.08, duration: 0.7, ease }}
              >
                <ToolCard g={g} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── desktop: pinned, toolkit arrives in place ──────────────── */
function PinnedCard({ g, i, p }: { g: SkillGroup; i: number; p: MotionValue<number> }) {
  const start = 0.38 + i * 0.04;
  const opacity = useTransform(p, [start, start + 0.16], [0, 1]);
  const y = useTransform(p, [start, start + 0.16], [48, 0]);
  return (
    <motion.div style={{ opacity, y }} className="h-full">
      <ToolCard g={g} />
    </motion.div>
  );
}

function IdentityPinned() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const ghostX = useTransform(p, [0, 1], ["6%", "-10%"]);
  const ghostOpacity = useTransform(p, [0.3, 0.5], [1, 0]);
  const idOpacity = useTransform(p, [0.28, 0.46], [1, 0]);
  const idY = useTransform(p, [0.28, 0.46], [0, -56]);
  const idBlur = useTransform(p, [0.28, 0.46], ["blur(0px)", "blur(6px)"]);
  const idEvents = useTransform(p, (v) => (v < 0.46 ? "auto" : "none"));
  const tkOpacity = useTransform(p, [0.34, 0.56], [0, 1]);
  const tkY = useTransform(p, [0.34, 0.56], [48, 0]);
  const tkEvents = useTransform(p, (v) => (v > 0.4 ? "auto" : "none"));

  return (
    <section ref={ref} id="identity" aria-labelledby="identity-title" className="relative h-[300svh] border-t border-line bg-black">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ opacity: ghostOpacity }}>
          <GhostWord x={ghostX} className="top-[12%]" />
        </motion.div>
        <motion.div style={{ opacity: tkOpacity }}>
          <LightCurve />
        </motion.div>

        {/* identity: lifts and blurs away */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: idOpacity, y: idY, filter: idBlur, pointerEvents: idEvents }}
        >
          <div className="container-x pt-20">
            <IdentityBlock />
          </div>
        </motion.div>

        {/* toolkit: rises into the same screen */}
        <motion.div className="absolute inset-0 flex items-center" style={{ pointerEvents: tkEvents }}>
          <div className="container-x pt-20">
            <motion.div style={{ opacity: tkOpacity, y: tkY }}>
              <ToolkitHeading />
            </motion.div>
            <div className="mt-[clamp(20px,4svh,40px)] grid grid-cols-4 gap-4">
              {skills.map((g, i) => (
                <PinnedCard key={g.group} g={g} i={i} p={p} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Identity() {
  const reduce = useSafeReducedMotion();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return desktop && !reduce ? <IdentityPinned /> : <IdentityStatic />;
}
