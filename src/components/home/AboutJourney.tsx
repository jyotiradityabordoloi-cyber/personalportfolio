"use client";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/*
  Page two: one pinned scroll sequence.

  A  "A bit about me": the light-room photograph with the intro line and buttons.
  B  The light room shrinks into a window over the Starry Night castle
     (or, once supplied, /videos/about-transition.mp4 plays, scrubbed by scroll).
  C  The window turns into the glass "ABOUT ME" card.
  D  The card splits: its halves leave left and right.
  E  The About content arrives from the left and the right.

  Timeline values are fractions of the section's scroll (0 → 1).
*/

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { about, aboutPoints, site } from "@/content/site";
import { Magnetic } from "@/components/ui/primitives";

const ease = [0.22, 1, 0.36, 1] as const;

// The card (and the window it grows from) is centred and sized to the screen.
const cardSize = (vw: number, vh: number) => {
  const w = vw < 768 ? vw * 0.74 : Math.min(vw * 0.36, vh * 0.62, 540);
  return { w, h: Math.min(w * 0.95, vh * 0.6) };
};

const T = {
  textOut: [0.08, 0.17],
  shrink: [0.15, 0.42],
  castleIn: [0.15, 0.3],
  card: [0.42, 0.52],
  split: [0.6, 0.72],
  dim: [0.58, 0.74],
  content: [0.68, 0.84],
  video: [0.14, 0.5],
};

type Rect = { l: number; t: number; w: number; h: number; vw: number; vh: number };

function usePanelRect(ref: React.RefObject<HTMLDivElement | null>) {
  const [rect, setRect] = useState<Rect>({ l: 0, t: 0, w: 1, h: 1, vw: 1, vh: 1 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const vw = el.clientWidth;
      const vh = el.clientHeight;
      const { w, h } = cardSize(vw, vh);
      setRect({ l: (vw - w) / 2, t: (vh - h) / 2, w, h, vw, vh });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return rect;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const prog = (p: number, [a, b]: number[]) => clamp01((p - a) / (b - a));
// smooth in-out for the shrink, so the window settles onto the panel
const smooth = (t: number) => t * t * (3 - 2 * t);

function useWindowBox(p: MotionValue<number>, r: Rect) {
  const k = (v: number) => smooth(prog(v, T.shrink));
  const left = useTransform(p, (v) => lerp(0, r.l, k(v)));
  const top = useTransform(p, (v) => lerp(0, r.t, k(v)));
  const width = useTransform(p, (v) => lerp(r.vw, r.w, k(v)));
  const height = useTransform(p, (v) => lerp(r.vh, r.h, k(v)));
  const radius = useTransform(p, (v) => lerp(0, 20, k(v)));
  const objPos = useTransform(p, (v) => `${lerp(r.vw >= 768 ? 0 : 38, 40, k(v))}% center`);
  return { left, top, width, height, borderRadius: radius, objPos };
}

/* ── the glass ABOUT ME card ─────────────────────────────────── */
function CardFace({ textY }: { textY?: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[20px]">
      <div className="absolute inset-0 rounded-[20px] border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,.18),rgba(255,255,255,.04)_45%,rgba(0,0,0,.35))] backdrop-blur-md" />
      <div className="absolute -left-1/4 -top-1/3 h-2/3 w-3/4 rotate-12 bg-white/25 blur-3xl" />
      <motion.div className="absolute inset-0 grid place-items-center" style={{ y: textY }}>
        <p className="text-center font-display text-[clamp(40px,4.6vw,76px)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-white [text-shadow:0_0_30px_rgba(255,255,255,.5)]">
          About
          <br />
          Me
        </p>
      </motion.div>
    </div>
  );
}

/* ── the About content that lands at the end ─────────────────── */
// "Curious about **people**." → muted text with the starred word set bright
function Emph({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith("**") ? (
          <span key={i} className="font-semibold text-fg">
            {part.slice(2, -2)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

const portraitMask = {
  maskImage: "radial-gradient(70% 62% at 52% 42%, black 45%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(70% 62% at 52% 42%, black 45%, transparent 100%)",
};

function AboutContent({ leftX, rightX, opacity }: { leftX?: MotionValue<number>; rightX?: MotionValue<number>; opacity?: MotionValue<number> }) {
  return (
    <div className="relative h-full w-full">
      {/* phones and tablets: the portrait sits behind the words */}
      <motion.div aria-hidden className="pointer-events-none absolute bottom-0 right-[-12%] h-[62%] lg:hidden" style={{ opacity }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/portrait.webp" alt="" className="h-full w-auto object-contain opacity-35" style={portraitMask} />
      </motion.div>

      <div className="container-x grid h-full content-center gap-8 pb-10 pt-24 md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.25fr_0.8fr_0.72fr] lg:items-center lg:gap-6">
        {/* left: who I am */}
        <motion.div style={{ x: leftX, opacity }} className="relative z-10">
          <h2 className="max-w-[600px] text-[clamp(28px,min(2.5vw,4.6svh),40px)] font-normal leading-[1.2] tracking-[-0.02em] text-muted">
            <Emph text={about.headline} />
          </h2>
          <p className="mt-6 max-w-[460px] text-[15px] leading-relaxed text-muted">{about.body}</p>
          <ul className="mt-7 flex max-w-[520px] flex-wrap gap-2" aria-label="How I work">
            {about.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-[12.5px] tracking-tight backdrop-blur transition-colors duration-200 hover:border-white hover:bg-white hover:text-black"
              >
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* centre-left: the portrait (desktop) */}
        <motion.div style={{ x: rightX, opacity }} className="relative hidden min-w-0 justify-center lg:-ml-8 lg:flex">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/portrait.webp"
            alt={`Portrait of ${site.name} in profile, lit from behind`}
            width={1100}
            height={1204}
            className="h-[min(68svh,660px)] w-auto max-w-none shrink-0 object-contain"
            style={portraitMask}
          />
        </motion.div>

        {/* right: what I bring */}
        <motion.ol style={{ x: rightX, opacity }} className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-1">
          {aboutPoints.map((pt, i) => (
            <li key={pt.title} className="border-t border-white/15 pt-3">
              <span className="font-mono text-[10px] text-faint">0{i + 1}</span>
              <h3 className="mt-1 text-[14px] font-semibold">{pt.title}</h3>
              <p className="mt-1 hidden text-[12.5px] leading-relaxed text-muted md:block">{pt.body}</p>
            </li>
          ))}
        </motion.ol>
      </div>
    </div>
  );
}

/* ── the intro line + buttons (phase A) ─────────────────────── */
function IntroCopy() {
  const reduce = useSafeReducedMotion();
  const words = site.headline.split(" ");
  return (
    <div className="max-w-xl">
      <p className="kicker text-muted">A bit about me</p>
      <motion.h2
        id="intro-title"
        className="mt-5 font-serif text-[40px] font-normal leading-[1.02] tracking-[-0.01em] md:text-[64px]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
      >
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: reduce ? { opacity: 0 } : { y: "100%" },
                show: reduce ? { opacity: 1 } : { y: "0%", transition: { duration: 0.9, ease } },
              }}
            >
              {w}&nbsp;
            </motion.span>
          </span>
        ))}
      </motion.h2>
      <span aria-hidden className="mt-7 block h-px w-12 bg-fg" />
      <p className="mt-7 max-w-md text-[15px] leading-relaxed text-muted">{site.intro}</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Magnetic>
          <a
            href="#projects"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black transition-transform hover:-translate-y-px active:scale-[0.97]"
          >
            Explore my work <ArrowDown className="size-4" />
          </a>
        </Magnetic>
        <Magnetic>
          <a
            href={site.links.resume}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-sm transition-[background-color,transform] hover:bg-white/10 active:scale-[0.97]"
          >
            View resume
          </a>
        </Magnetic>
        <a href="#contact" className="group inline-flex h-11 items-center gap-1.5 px-2 text-sm text-muted transition-colors hover:text-fg">
          Let&apos;s connect
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}

/* ── reduced motion: two plain screens, no pinning ──────────── */
function StaticJourney() {
  return (
    <>
      <section id="intro" aria-labelledby="intro-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-black py-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/light-room.webp" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-[38%_center] md:object-[0%_center]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        <div className="container-x">
          <IntroCopy />
        </div>
      </section>
      <section id="about" aria-label="About me" className="relative isolate min-h-[100svh] overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/castle-standin.webp" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-black/80" />
        <AboutContent />
      </section>
    </>
  );
}

export function AboutJourney() {
  const reduce = useSafeReducedMotion();
  // the server cannot know the motion setting: match it on first render, then switch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && reduce ? <StaticJourney /> : <PinnedJourney />;
}

function PinnedJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const rect = usePanelRect(stageRef);

  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const box = useWindowBox(p, rect);

  const textOpacity = useTransform(p, T.textOut, [1, 0]);
  const textY = useTransform(p, T.textOut, [0, -40]);
  const textEvents = useTransform(p, (v) => (v < T.textOut[1] ? "auto" : "none"));
  const castleOpacity = useTransform(p, T.castleIn, [0, 1]);
  const castleScale = useTransform(p, [T.shrink[0], T.shrink[1] + 0.05], [1.15, 1]);
  const photoOpacity = useTransform(p, T.card, [1, 0]);
  const cardTextY = useTransform(p, T.card, [24, 0]);
  const splitL = useTransform(p, (v) => -rect.w * 0.9 * smooth(prog(v, T.split)));
  const splitR = useTransform(p, (v) => rect.w * 0.9 * smooth(prog(v, T.split)));
  // one whole card until the split starts, then two halves that part
  const wholeOpacity = useTransform(p, [T.card[0], T.card[1], T.split[0] - 0.002, T.split[0]], [0, 1, 1, 0]);
  const halvesOpacity = useTransform(p, [T.split[0] - 0.002, T.split[0], T.split[1]], [0, 1, 0]);
  const dim = useTransform(p, T.dim, [0, 0.86]);
  const contentOpacity = useTransform(p, T.content, [0, 1]);
  const contentL = useTransform(p, T.content, [-90, 0]);
  const contentR = useTransform(p, T.content, [90, 0]);
  const contentEvents = useTransform(p, (v) => (v > T.content[0] ? "auto" : "none"));
  const videoOpacity = useTransform(p, [T.video[0] - 0.02, T.video[0], T.video[1], T.card[1]], [0, 1, 1, 0]);

  // scrub the supplied transition video with the scroll
  useMotionValueEvent(p, "change", (v) => {
    const vid = videoRef.current;
    if (!hasVideo || !vid || !vid.duration) return;
    vid.currentTime = prog(v, T.video) * (vid.duration - 0.05);
  });

  useEffect(() => {
    // pause any autoplay: the video is driven by scroll only
    videoRef.current?.pause();
  }, [hasVideo]);


  return (
    <section id="intro" ref={sectionRef} aria-labelledby="intro-title" className="relative h-[520svh] bg-black">
      {/* nav anchor for "About": the last part of the sequence */}
      <div id="about" aria-hidden className="pointer-events-none absolute inset-x-0 top-[60%] bottom-0" />

      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* castle: revealed behind the shrinking window */}
        <motion.div className="absolute inset-0" style={{ opacity: castleOpacity }}>
          <motion.div
            className="absolute left-1/2 top-1/2 aspect-[1600/666] w-[max(100vw,calc(100svh*2.4024))] -translate-x-1/2 -translate-y-1/2"
            style={{ scale: castleScale }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/castle-standin.webp" alt="" className="h-full w-full object-cover" loading="lazy" />
          </motion.div>
        </motion.div>

        {/* the light-room window */}
        {!hasVideo && (
          <motion.div
            className="absolute overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,.7)]"
            style={{ left: box.left, top: box.top, width: box.width, height: box.height, borderRadius: box.borderRadius }}
          >
            <motion.img
              src="/images/light-room.webp"
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: box.objPos, opacity: photoOpacity }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />
          </motion.div>
        )}

        {/* the supplied transition video, once site.aboutVideo is set */}
        {site.aboutVideo && (
        <motion.video
          ref={videoRef}
          src={site.aboutVideo}
          muted
          playsInline
          preload="auto"
          aria-hidden
          onLoadedMetadata={() => setHasVideo(true)}
          onError={() => setHasVideo(false)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: hasVideo ? videoOpacity : 0 }}
        />
        )}

        {/* glass ABOUT ME card: whole, then two halves that part left and right */}
        <motion.div aria-hidden className="absolute" style={{ left: rect.l, top: rect.t, width: rect.w, height: rect.h, opacity: wholeOpacity }}>
          <CardFace textY={cardTextY} />
        </motion.div>
        {(["l", "r"] as const).map((side) => (
          <motion.div
            key={side}
            aria-hidden
            className="absolute"
            style={{
              left: rect.l,
              top: rect.t,
              width: rect.w,
              height: rect.h,
              opacity: halvesOpacity,
              x: side === "l" ? splitL : splitR,
              clipPath: side === "l" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
            }}
          >
            <CardFace />
          </motion.div>
        ))}

        {/* darken for reading */}
        <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />

        {/* A: intro copy */}
        <motion.div className="absolute inset-0 flex items-center" style={{ opacity: textOpacity, y: textY, pointerEvents: textEvents }}>
          <div className="container-x pt-16">
            <IntroCopy />
          </div>
        </motion.div>

        {/* E: about content, arriving from left and right */}
        <motion.div className="absolute inset-0" style={{ pointerEvents: contentEvents }}>
          <AboutContent leftX={contentL} rightX={contentR} opacity={contentOpacity} />
        </motion.div>
      </div>
    </section>
  );
}
