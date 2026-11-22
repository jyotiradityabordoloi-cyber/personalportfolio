"use client";

/*
  Peelable sticker board.

  Each sticker is folded along the perpendicular bisector between the
  point you grabbed (G) and where your pointer is now (P). The part of
  the sticker on G's side of that line is mirrored across it and shows
  its adhesive back; the rest stays stuck. Pull far enough that the whole
  shape is past the fold and the sticker comes off: then it follows the
  pointer and sticks wherever you drop it.

  All motion is applied imperatively (refs + rAF) so React doesn't
  re-render on every pointer move.
*/

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { Star, MousePointer2 } from "lucide-react";

type Vec = { x: number; y: number };
type Shape = "rect" | "circle";

type StickerDef = {
  id: string;
  label: string;
  x: number; // % of board
  y: number; // % of board
  rot: number; // deg
  w: number;
  h: number;
  shape: Shape;
  radius: string; // CSS border-radius
  back: string; // adhesive backing colour
  face: React.ReactNode;
};

const STICKERS: StickerDef[] = [
  {
    id: "ship",
    label: "Ship it",
    x: 30,
    y: 16,
    rot: -8,
    w: 172,
    h: 58,
    shape: "rect",
    radius: "999px",
    back: "#eef3e2",
    face: (
      <div className="flex h-full items-center justify-center gap-2 rounded-full bg-[#c8f560] text-[#0d0f08] shadow-[inset_0_0_0_3px_rgba(255,255,255,.55)]">
        <span className="text-lg font-semibold tracking-tight">Ship it</span>
        <span className="grid size-7 place-items-center rounded-full bg-[#0d0f08] text-sm text-[#c8f560]">→</span>
      </div>
    ),
  },
  {
    id: "ai",
    label: "AI and LLMs",
    x: 76,
    y: 20,
    rot: 10,
    w: 132,
    h: 132,
    shape: "circle",
    radius: "50%",
    back: "#efedf6",
    face: (
      <div className="relative flex h-full flex-col items-center justify-center rounded-full bg-[conic-gradient(from_200deg,#6d5dfc,#a78bfa,#38bdf8,#6d5dfc)] text-white shadow-[inset_0_0_0_4px_rgba(255,255,255,.6)]">
        <svg viewBox="0 0 100 100" className="absolute inset-3 opacity-60" aria-hidden>
          <ellipse cx="50" cy="50" rx="44" ry="16" fill="none" stroke="white" strokeWidth="1.2" transform="rotate(-25 50 50)" />
          <circle cx="88" cy="38" r="3" fill="white" />
        </svg>
        <span className="font-serif text-5xl italic leading-none">AI</span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em]">LLMs · RAG</span>
      </div>
    ),
  },
  {
    id: "ab",
    label: "A/B test",
    x: 17,
    y: 47,
    rot: 6,
    w: 118,
    h: 118,
    shape: "rect",
    radius: "24px",
    back: "#f3efe9",
    face: (
      <div className="grid h-full grid-cols-2 overflow-hidden rounded-[24px] shadow-[inset_0_0_0_4px_rgba(255,255,255,.6)]">
        <div className="flex flex-col items-center justify-center bg-[#ff8a4c] text-[#1b0d05]">
          <span className="text-4xl font-semibold">A</span>
          <span className="font-mono text-[9px]">CONTROL</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#16161a] text-white">
          <span className="text-4xl font-semibold">B</span>
          <span className="font-mono text-[9px] text-[#ff8a4c]">VARIANT</span>
        </div>
      </div>
    ),
  },
  {
    id: "sql",
    label: "SQL",
    x: 57,
    y: 47,
    rot: -4,
    w: 196,
    h: 78,
    shape: "rect",
    radius: "12px",
    back: "#f2efe6",
    face: (
      <div className="flex h-full items-center gap-3 rounded-[12px] bg-[#fffaf0] px-3 text-[#1a1a1a] shadow-[inset_0_0_0_3px_rgba(0,0,0,.04)]">
        <div className="h-[calc(100%-16px)] w-px border-l-2 border-dashed border-[#e2d9c4]" />
        <div className="font-mono text-[11px] leading-snug">
          <p>
            <span className="text-[#6d5dfc]">SELECT</span> insight
          </p>
          <p>
            <span className="text-[#6d5dfc]">FROM</span> users
          </p>
          <p>
            <span className="text-[#6d5dfc]">WHERE</span> it_matters;
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "north",
    label: "North Star metric",
    x: 84,
    y: 62,
    rot: -12,
    w: 114,
    h: 114,
    shape: "circle",
    radius: "50%",
    back: "#f5f0de",
    face: (
      <div className="flex h-full flex-col items-center justify-center rounded-full bg-[#ffd84d] text-[#2a2200] shadow-[inset_0_0_0_4px_rgba(255,255,255,.55)]">
        <Star className="size-7 fill-current" strokeWidth={1.5} />
        <span className="mt-1 text-center font-mono text-[9px] font-semibold uppercase leading-tight tracking-[0.14em]">
          North
          <br />
          Star
        </span>
      </div>
    ),
  },
  {
    id: "prd",
    label: "PRD",
    x: 31,
    y: 78,
    rot: -9,
    w: 124,
    h: 148,
    shape: "rect",
    radius: "14px",
    back: "#efede8",
    face: (
      <div className="flex h-full flex-col rounded-[14px] bg-white p-3 text-[#18181b] shadow-[inset_0_0_0_1px_rgba(0,0,0,.06)]">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold">PRD</span>
          <span className="rounded bg-[#e9e6ff] px-1 font-mono text-[9px] text-[#5b4bff]">v1.0</span>
        </div>
        <div className="mt-2 space-y-1.5">
          {["Problem", "Users", "Metrics", "Scope"].map((t, i) => (
            <div key={t} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-[3px] border ${i < 3 ? "border-[#0b9d8b] bg-[#0b9d8b]" : "border-[#c8c8cf]"}`} />
              <span className="font-mono text-[9px] text-[#55555d]">{t}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto space-y-1">
          <div className="h-1 w-full rounded bg-[#ececef]" />
          <div className="h-1 w-3/4 rounded bg-[#ececef]" />
        </div>
      </div>
    ),
  },
  {
    id: "users",
    label: "Talk to users",
    x: 66,
    y: 83,
    rot: 5,
    w: 160,
    h: 66,
    shape: "rect",
    radius: "22px 22px 22px 6px",
    back: "#e7f3f1",
    face: (
      <div className="flex h-full items-center justify-center gap-2 rounded-[22px_22px_22px_6px] bg-[#3fd0bd] text-[#04201c] shadow-[inset_0_0_0_3px_rgba(255,255,255,.5)]">
        <span className="flex gap-0.5">
          <span className="size-1.5 rounded-full bg-current" />
          <span className="size-1.5 rounded-full bg-current opacity-70" />
          <span className="size-1.5 rounded-full bg-current opacity-40" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight">Talk to users</span>
      </div>
    ),
  },
];

/* ── geometry helpers ───────────────────────────────────────── */
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;
const rotate = (v: Vec, deg: number): Vec => {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
};

// Clip a convex polygon to the half-plane where sign*(p·u − c) ≤ 0.
function clipHalfPlane(poly: Vec[], u: Vec, c: number, sign: 1 | -1): Vec[] {
  const out: Vec[] = [];
  const f = (p: Vec) => sign * (dot(p, u) - c);
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const fa = f(a);
    const fb = f(b);
    if (fa <= 0) out.push(a);
    if (fa * fb < 0) {
      const t = fa / (fa - fb);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return out;
}
const toPolygon = (pts: Vec[]) =>
  pts.length < 3 ? "polygon(0 0, 0 0, 0 0)" : `polygon(${pts.map((p) => `${p.x.toFixed(1)}px ${p.y.toFixed(1)}px`).join(", ")})`;

/* ── single sticker ─────────────────────────────────────────── */
type Phase = "idle" | "peeling" | "returning" | "lifted";

function Sticker({
  def,
  boardRef,
  scale,
  z,
  index,
  onFront,
  onInteract,
}: {
  def: StickerDef;
  boardRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
  z: number;
  index: number;
  onFront: (id: string) => void;
  onInteract: () => void;
}) {
  const reduce = useSafeReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);

  const s = useRef({
    phase: "idle" as Phase,
    pos: { x: def.x, y: def.y }, // % of board
    G: { x: 0, y: 0 },
    P: { x: 0, y: 0 },
    tilt: 0,
    lastX: 0,
    lastT: 0,
    raf: 0,
    pointerId: -1,
    scale,
  });

  const { w, h } = def;
  const C = { x: w / 2, y: h / 2 };
  const box: Vec[] = [
    { x: -1, y: -1 },
    { x: w + 1, y: -1 },
    { x: w + 1, y: h + 1 },
    { x: -1, y: h + 1 },
  ];

  const applyTransform = useCallback(
    (lift = 1, tilt = 0) => {
      const el = rootRef.current;
      const st = s.current;
      if (!el) return;
      el.style.left = `${st.pos.x}%`;
      el.style.top = `${st.pos.y}%`;
      el.style.transform = `translate(-50%, -50%) rotate(${def.rot + tilt}deg) scale(${st.scale * lift})`;
    },
    [def.rot],
  );

  // keep transform in sync with board scale
  useLayoutEffect(() => {
    s.current.scale = scale;
    if (s.current.phase !== "lifted") applyTransform();
  }, [scale, applyTransform]);

  const clearFold = useCallback(() => {
    if (faceRef.current) faceRef.current.style.clipPath = "";
    if (flapRef.current) flapRef.current.style.visibility = "hidden";
  }, []);

  /** Render fold for grip G → pointer P. Returns true if fully peeled. */
  const renderFold = useCallback(
    (G: Vec, P: Vec) => {
      const face = faceRef.current;
      const flap = flapRef.current;
      if (!face || !flap) return false;
      const dx = G.x - P.x;
      const dy = G.y - P.y;
      const len = Math.hypot(dx, dy);
      if (len < 0.75) {
        clearFold();
        return false;
      }
      const u = { x: dx / len, y: dy / len };
      const M = { x: (G.x + P.x) / 2, y: (G.y + P.y) / 2 };
      const c = dot(M, u);

      // lowest point of the shape along u: if it's past the fold, everything is peeled
      const minSupport =
        def.shape === "circle" ? dot(C, u) - Math.min(w, h) / 2 : Math.min(...box.map((p) => dot(p, u)));
      if (minSupport > c) return true;

      face.style.clipPath = toPolygon(clipHalfPlane(box, u, c, 1));
      flap.style.clipPath = toPolygon(clipHalfPlane(box, u, c, -1));

      // reflection across the fold line: x' = (I − 2uuᵀ)x + 2c·u
      const a = 1 - 2 * u.x * u.x;
      const b = -2 * u.x * u.y;
      const d = 1 - 2 * u.y * u.y;
      flap.style.transform = `matrix(${a}, ${b}, ${b}, ${d}, ${2 * c * u.x}, ${2 * c * u.y})`;

      // curl shading on the backing, measured along u from the fold
      const angle = (Math.atan2(u.x, -u.y) * 180) / Math.PI;
      const L = Math.abs(w * u.x) + Math.abs(h * u.y);
      const tf = ((c - dot(C, u)) / L + 0.5) * 100;
      const px = (n: number) => (n / L) * 100;
      flap.style.backgroundImage = `linear-gradient(${angle}deg,
        transparent ${tf - 0.01}%,
        rgba(0,0,0,.22) ${tf}%,
        rgba(255,255,255,.75) ${tf + px(5)}%,
        rgba(255,255,255,.15) ${tf + px(22)}%,
        rgba(0,0,0,.06) ${tf + px(60)}%)`;
      flap.style.visibility = "visible";
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [def.shape, w, h, clearFold],
  );

  const toBoard = (clientX: number, clientY: number): Vec => {
    const r = boardRef.current!.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };
  const centerPx = (): Vec => {
    const r = boardRef.current!.getBoundingClientRect();
    return { x: (s.current.pos.x / 100) * r.width, y: (s.current.pos.y / 100) * r.height };
  };
  const toLocal = (clientX: number, clientY: number): Vec => {
    const b = toBoard(clientX, clientY);
    const cpx = centerPx();
    const v = rotate({ x: b.x - cpx.x, y: b.y - cpx.y }, -def.rot);
    return { x: v.x / s.current.scale + C.x, y: v.y / s.current.scale + C.y };
  };

  const setShadow = (lifted: boolean) => {
    const el = rootRef.current;
    if (!el) return;
    el.style.filter = lifted
      ? "drop-shadow(0 18px 22px rgba(0,0,0,.28)) drop-shadow(0 4px 6px rgba(0,0,0,.18))"
      : "drop-shadow(0 1px 1.5px rgba(0,0,0,.25)) drop-shadow(0 3px 6px rgba(0,0,0,.08))";
  };

  const lift = (clientX: number, clientY: number) => {
    const st = s.current;
    st.phase = "lifted";
    clearFold();
    setShadow(true);
    // keep the grabbed point under the pointer
    const off = rotate({ x: (st.G.x - C.x) * st.scale, y: (st.G.y - C.y) * st.scale }, def.rot);
    const b = toBoard(clientX, clientY);
    const r = boardRef.current!.getBoundingClientRect();
    st.pos = { x: ((b.x - off.x) / r.width) * 100, y: ((b.y - off.y) / r.height) * 100 };
    if (rootRef.current) rootRef.current.style.transition = "transform 180ms cubic-bezier(.2,.8,.2,1)";
    applyTransform(1.06, 0);
    window.setTimeout(() => rootRef.current && (rootRef.current.style.transition = ""), 180);
  };

  const followPointer = (clientX: number, clientY: number) => {
    const st = s.current;
    const off = rotate({ x: (st.G.x - C.x) * st.scale, y: (st.G.y - C.y) * st.scale }, def.rot);
    const b = toBoard(clientX, clientY);
    const r = boardRef.current!.getBoundingClientRect();
    st.pos = { x: ((b.x - off.x) / r.width) * 100, y: ((b.y - off.y) / r.height) * 100 };
    const now = performance.now();
    const dt = Math.max(1, now - st.lastT);
    const vx = (clientX - st.lastX) / dt;
    st.lastX = clientX;
    st.lastT = now;
    const targetTilt = reduce ? 0 : Math.max(-10, Math.min(10, vx * 6));
    st.tilt += (targetTilt - st.tilt) * 0.35;
    applyTransform(1.06, st.tilt);
  };

  const drop = () => {
    const st = s.current;
    st.phase = "idle";
    st.pos = { x: Math.max(6, Math.min(94, st.pos.x)), y: Math.max(6, Math.min(94, st.pos.y)) };
    st.tilt = 0;
    const el = rootRef.current;
    if (el) el.style.transition = "transform 260ms cubic-bezier(.3,1.4,.5,1), left 260ms ease, top 260ms ease, filter 260ms";
    applyTransform(1, 0);
    setShadow(false);
    window.setTimeout(() => el && (el.style.transition = ""), 280);
  };

  const animateReturn = () => {
    const st = s.current;
    st.phase = "returning";
    cancelAnimationFrame(st.raf);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const k = 1 - Math.exp(-dt * (reduce ? 0.03 : 0.014));
      st.P = { x: st.P.x + (st.G.x - st.P.x) * k, y: st.P.y + (st.G.y - st.P.y) * k };
      if (Math.hypot(st.P.x - st.G.x, st.P.y - st.G.y) < 0.6) {
        clearFold();
        st.phase = "idle";
        return;
      }
      renderFold(st.G, st.P);
      st.raf = requestAnimationFrame(tick);
    };
    st.raf = requestAnimationFrame(tick);
  };

  /* pointer handlers */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const st = s.current;
    if (st.phase === "lifted") return;
    cancelAnimationFrame(st.raf);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    st.pointerId = e.pointerId;
    st.phase = "peeling";
    st.G = toLocal(e.clientX, e.clientY);
    st.P = { ...st.G };
    st.lastX = e.clientX;
    st.lastT = performance.now();
    onFront(def.id);
    onInteract();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const st = s.current;
    if (e.pointerId !== st.pointerId) return;
    if (st.phase === "peeling") {
      const P = toLocal(e.clientX, e.clientY);
      if (Math.hypot(P.x - st.G.x, P.y - st.G.y) < 3 / st.scale) return;
      st.P = P;
      const done = renderFold(st.G, P);
      if (done) lift(e.clientX, e.clientY);
    } else if (st.phase === "lifted") {
      followPointer(e.clientX, e.clientY);
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    const st = s.current;
    if (e.pointerId !== st.pointerId) return;
    st.pointerId = -1;
    if (st.phase === "peeling") animateReturn();
    else if (st.phase === "lifted") drop();
  };

  /* keyboard: Enter/Space to pick up & drop, arrows to move, Esc to drop */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const st = s.current;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFront(def.id);
      onInteract();
      if (st.phase === "lifted") drop();
      else {
        st.phase = "lifted";
        setShadow(true);
        applyTransform(1.06, 0);
      }
      return;
    }
    if (e.key === "Escape" && st.phase === "lifted") return drop();
    const step = e.shiftKey ? 5 : 1.5;
    const moves: Record<string, Vec> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    const m = moves[e.key];
    if (m && st.phase === "lifted") {
      e.preventDefault();
      st.pos = { x: Math.max(6, Math.min(94, st.pos.x + m.x)), y: Math.max(6, Math.min(94, st.pos.y + m.y)) };
      applyTransform(1.06, 0);
    }
  };

  useEffect(() => {
    setShadow(false);
    const raf = s.current.raf;
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-label={`${def.label} sticker. Drag to peel it off and move it. Keyboard: Enter to pick up, arrow keys to move, Enter to drop.`}
      className="sticker absolute"
      style={{ width: w, height: h, zIndex: z }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onLostPointerCapture={endPointer}
      onKeyDown={onKeyDown}
    >
      <motion.div
        className="absolute inset-0"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.35, y: -24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5 + index * 0.08, type: "spring", stiffness: 260, damping: 20 }}
      >
        <div ref={faceRef} className="sticker-face" style={{ borderRadius: def.radius }}>
          {def.face}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ filter: "drop-shadow(0 6px 8px rgba(0,0,0,.22))" }}
        >
          <div ref={flapRef} className="sticker-flap" style={{ borderRadius: def.radius, backgroundColor: def.back }} />
        </div>
      </motion.div>
    </div>
  );
}

/* ── board ──────────────────────────────────────────────────── */
export function StickerBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [order, setOrder] = useState(() => STICKERS.map((s) => s.id));
  const [touched, setTouched] = useState(false);

  useLayoutEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const wdt = entry.contentRect.width;
      setScale(Math.max(0.58, Math.min(1, wdt / 540)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onFront = useCallback((id: string) => {
    setOrder((o) => (o[o.length - 1] === id ? o : [...o.filter((x) => x !== id), id]));
  }, []);
  const onInteract = useCallback(() => setTouched(true), []);

  return (
    <div className="relative">
      <div
        ref={boardRef}
        className="dot-grid relative aspect-[1/1] w-full overflow-hidden rounded-[28px] border border-line sm:aspect-[540/500]"
        style={{ backgroundColor: "var(--board)" }}
      >
        <div className="pointer-events-none absolute left-5 top-4 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          Product toolkit
        </div>
        <div className="pointer-events-none absolute right-5 top-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          <span className="size-1.5 rounded-full bg-accent-2" />
          Interactive
        </div>
        {STICKERS.map((def, i) => (
          <Sticker
            key={def.id}
            def={def}
            index={i}
            boardRef={boardRef}
            scale={scale}
            z={order.indexOf(def.id) + 1}
            onFront={onFront}
            onInteract={onInteract}
          />
        ))}
      </div>
      <motion.p
        className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-faint"
        animate={{ opacity: touched ? 0.5 : 1 }}
      >
        <MousePointer2 className="size-3.5" />
        Grab a sticker and pull to peel it. Pull it all the way off to move it.
      </motion.p>
    </div>
  );
}
