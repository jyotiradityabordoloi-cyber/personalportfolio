"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { teardowns } from "@/content/teardowns";


export function Teardowns() {
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0);

  const update = () => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 20), behavior: "smooth" });
  };

  // drag-to-scroll with the mouse (touch uses native scrolling)
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { down: true, x: e.clientX, left: track.current.scrollLeft, moved: false };
    track.current.style.scrollBehavior = "auto";
    track.current.style.scrollSnapType = "none";
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    track.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    if (!drag.current.down) return;
    drag.current.down = false;
    if (track.current) {
      track.current.style.scrollBehavior = "";
      track.current.style.scrollSnapType = "";
    }
  };

  return (
    <section id="teardowns" aria-labelledby="teardowns-title" className="relative overflow-hidden border-t border-line bg-black py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker text-muted">05 — Explorations</p>
            <h2
              id="teardowns-title"
              className="mt-6 font-display text-[48px] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] md:text-[80px]"
            >
              Product
              <br />
              Teardowns
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              Eight products taken apart: who they serve, how they make money, where the journey breaks, and what I&apos;d ship next.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              aria-label="Previous teardowns"
              className="grid size-11 place-items-center rounded-full border border-line-strong transition-all hover:bg-fg hover:text-bg disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              aria-label="Next teardowns"
              className="grid size-11 place-items-center rounded-full border border-line-strong transition-all hover:bg-fg hover:text-bg disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={track}
        onScroll={update}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-4 md:px-[max(32px,calc((100vw_-_1200px)/2_+_32px))] md:scroll-pl-[max(32px,calc((100vw_-_1200px)/2_+_32px))]"
        role="list"
        aria-label="Product teardowns"
      >
        {teardowns.map((t, i) => (
          <motion.div
            key={t.slug}
            data-card
            role="listitem"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: Math.min(i, 4) * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-[82vw] shrink-0 snap-start sm:w-[360px]"
          >
            <Link
              href={`/teardowns/${t.slug}`}
              draggable={false}
              className="group relative flex h-[440px] flex-col overflow-hidden rounded-3xl border border-line bg-[#0c0c0c] p-6 grayscale transition-[transform,filter,border-color] duration-500 hover:-translate-y-0.5 hover:border-white/25 hover:grayscale-0 focus-visible:grayscale-0"
            >
              <div
                aria-hidden
                className="absolute inset-0 -z-0 opacity-50 transition-opacity duration-500 group-hover:opacity-90"
                style={{
                  background: `radial-gradient(90% 60% at 100% 0%, ${t.color}40, transparent 70%)`,
                }}
              />
              <div className="relative flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                  Teardown {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-muted">{t.category}</span>
              </div>

              <div className="relative mt-auto">
                <span
                  aria-hidden
                  className="mb-6 block size-12 rounded-2xl shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}
                />
                <h3 className="font-serif text-5xl leading-none tracking-tight">{t.name}</h3>
                <p className="mt-3 text-base text-muted">{t.tagline}</p>
                <div className="mt-6 grid grid-cols-2 gap-2 border-t border-line pt-4 text-xs">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-faint">Model</p>
                    <p className="mt-1 line-clamp-2 text-muted">{t.businessModel[0]}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-faint">Loop</p>
                    <p className="mt-1 line-clamp-2 text-muted">{t.loop.name}</p>
                  </div>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                  Read teardown
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
        <div aria-hidden className="w-1 shrink-0" />
      </div>

      <div className="container-x mt-6">
        <div className="h-px w-full bg-line">
          <motion.div className="h-px bg-fg" style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
      </div>
    </section>
  );
}
