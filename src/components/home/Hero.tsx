"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { Mail } from "lucide-react";
import { site } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

const ease = [0.22, 1, 0.36, 1] as const;

/*
  Hero = the "Explore my portfolio" image, rebuilt live:
  real text on a paper ground, the silhouette cut out of the image and laid
  in front of PORTFOLIO. Scrolling away turns the lights out: the paper
  fades to black and the page continues in the dark.

  Sizes are tied to the silhouette width (--sw) so the head always overlaps
  the lower half of PORTFOLIO, as in the artwork.
*/

function Line({ text, delay, className }: { text: string; delay: number; className?: string }) {
  const reduce = useSafeReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.04em]">
      <motion.span
        className={`block ${className ?? ""}`}
        initial={reduce ? { opacity: 0 } : { y: "105%" }}
        animate={reduce ? { opacity: 1 } : { y: "0%" }}
        transition={{ duration: 1.1, delay, ease }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bg = useTransform(scrollYProgress, [0, 0.85], ["#ebebeb", "#050505"]);
  const ySil = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <motion.section
      id="home"
      ref={ref}
      aria-label="Introduction"
      className="hero-art relative isolate h-[100svh] min-h-[560px] overflow-hidden text-[#0a0a0a]"
      style={{ backgroundColor: bg }}
    >
      {/* soft studio light behind the figure */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 55% at 50% 42%, rgba(255,255,255,.75), transparent 70%)" }}
      />

      <h1 className="sr-only">
        {site.name}, {site.role}. Explore my portfolio.
      </h1>

      {/* the words, anchored to the silhouette */}
      <motion.div
        aria-hidden
        style={{ y: yText, opacity: fade }}
        className="hero-words absolute inset-x-0 z-0 whitespace-nowrap text-center font-display font-extrabold uppercase leading-[0.8] tracking-[-0.02em]"
      >
        <Line text="Explore my" delay={0.15} />
        <Line text="Portfolio" delay={0.3} className="hero-fade-text" />
      </motion.div>

      {/* the figure */}
      <motion.div style={{ y: ySil }} className="hero-figure absolute bottom-0 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.45, ease }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/silhouette.webp"
            alt="Silhouette portrait of Jyotiraditya"
            width={780}
            height={527}
            fetchPriority="high"
            className="block h-auto w-full select-none"
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* note + links: top on phones (the figure fills the bottom), bottom row on wider screens */}
      <motion.div style={{ opacity: fade }} className="absolute inset-x-0 top-20 z-20 md:top-auto md:bottom-20">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9, ease }}
          className="container-x flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-[300px] text-[14px] leading-relaxed text-[#3a3a3a]">
            <span className="font-semibold text-[#0a0a0a]">Hi, I&apos;m {site.shortName}.</span> {site.passion}
          </p>
          <ul className="flex gap-2" aria-label="Find me online">
            {[
              { href: site.links.github, label: "GitHub", icon: <GithubIcon className="size-[18px]" />, external: true },
              { href: site.links.linkedin, label: "LinkedIn", icon: <LinkedinIcon className="size-[17px]" />, external: true },
              { href: `mailto:${site.email}`, label: `Email ${site.email}`, icon: <Mail className="size-[18px]" strokeWidth={1.8} /> },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noreferrer" : undefined}
                  aria-label={l.label}
                  title={l.label}
                  className="grid size-11 place-items-center rounded-full border border-black/15 bg-white/55 text-[#0a0a0a] backdrop-blur transition-[transform,background-color,color] duration-200 hover:-translate-y-0.5 hover:bg-[#0a0a0a] hover:text-white active:translate-y-0"
                >
                  {l.icon}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* bottom rail */}
      <motion.div style={{ opacity: fade }} className="absolute inset-x-0 bottom-0 z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="container-x flex items-end justify-between gap-4 pb-6 text-[12px] md:pb-8"
        >
          <span className="flex items-center gap-2">
            <span className="relative grid size-2 place-items-center">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[#0a0a0a]" />
              <span className="relative size-2 rounded-full bg-[#0a0a0a]" />
            </span>
            {site.status}
          </span>
          <a href="#intro" className="group hidden items-center gap-2 sm:flex">
            Scroll
            <span className="inline-block transition-transform group-hover:translate-y-0.5">↓</span>
          </a>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
