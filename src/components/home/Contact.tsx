"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { Check, Copy, FileText, Mail } from "lucide-react";
import { site } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { Magnetic } from "@/components/ui/primitives";

const ease = [0.22, 1, 0.36, 1] as const;

/* Layered mountain ridges, drawn in greys (the closing horizon from the moodboard). */
function Ridges() {
  return (
    <svg aria-hidden viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[42%] w-full">
      <defs>
        <linearGradient id="r1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="r2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#030303" />
        </linearGradient>
      </defs>
      <path d="M0 170 L120 120 L210 150 L330 70 L430 135 L560 95 L650 140 L780 60 L900 130 L1010 90 L1120 140 L1250 80 L1340 120 L1440 100 L1440 320 L0 320 Z" fill="url(#r1)" opacity=".7" />
      <path d="M0 230 L140 175 L260 215 L380 160 L520 225 L640 185 L760 230 L900 170 L1030 220 L1160 180 L1300 225 L1440 190 L1440 320 L0 320 Z" fill="url(#r2)" />
    </svg>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const reduce = useSafeReducedMotion();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const pill =
    "inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-5 text-sm transition-[background-color,color,transform] duration-200 hover:-translate-y-px hover:bg-white/10 active:translate-y-px";

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden border-t border-line bg-black py-28">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_70%,rgba(255,255,255,.06),transparent)]" />
      <div aria-hidden className="absolute inset-0 -z-10">
        <Ridges />
      </div>

      <div className="container-x w-full">
        <p className="kicker text-muted">07 — Contact</p>
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[auto_1px_1fr] lg:gap-14">
          <h2
            id="contact-title"
            className="font-display text-[64px] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] md:text-[120px] lg:text-[136px]"
          >
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={reduce ? { opacity: 0 } : { y: "100%" }}
                whileInView={reduce ? { opacity: 1 } : { y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease }}
              >
                Let&apos;s talk
              </motion.span>
            </span>
          </h2>
          <span aria-hidden className="hidden h-24 w-px bg-white/25 lg:block" />
          <div>
            <p className="max-w-sm text-[17px] leading-relaxed text-muted">
              Hiring for an APM or PM role, or have a product idea to pressure-test? I&apos;d love to hear from you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={site.links.linkedin} target="_blank" rel="noreferrer" className={pill}>
                <LinkedinIcon /> LinkedIn
              </a>
              <a href={site.links.github} target="_blank" rel="noreferrer" className={pill}>
                <GithubIcon /> GitHub
              </a>
              <a href={site.links.resume} className={pill}>
                <FileText className="size-4" /> Resume
              </a>
              <Magnetic>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-black transition-transform hover:-translate-y-px active:translate-y-px"
                >
                  <Mail className="size-4" /> Email
                </a>
              </Magnetic>
            </div>
            <button
              onClick={copy}
              className="mt-6 inline-flex h-11 items-center gap-2 text-[13px] text-muted transition-colors hover:text-fg"
              aria-live="polite"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-fg">
                    <Check className="size-4" /> Copied {site.email}
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Copy className="size-4" /> {site.email}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
