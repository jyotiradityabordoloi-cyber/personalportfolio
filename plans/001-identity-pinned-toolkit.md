# 001 — Pin the Identity section and transition to the Toolkit in place

- **Status**: DONE
- **Commit**: n/a (project is not a git repository)
- **Severity**: MEDIUM
- **Category**: Missed opportunities (jarring layout: content the visitor must scroll past)
- **Estimated scope**: 1 file (`src/components/home/Identity.tsx`), ~80 lines changed

## Problem

The Identity section is one tall block: the "PRODUCT BUILDER" title and focus list fill the
first screen, and the colour Toolkit grid sits below it (`mt-24`), so on a 1880×876 screen the
visitor scrolls the whole page down to reach it and the title leaves the screen. The owner wants
the screen to stay put while the Toolkit arrives in place.

```tsx
// src/components/home/Identity.tsx:46 — current
<section ref={ref} id="identity" aria-labelledby="identity-title" className="relative overflow-hidden border-t border-line bg-black py-28 md:py-36">
  …
  <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end"> {/* identity block */} </div>
  {/* toolkit in colour */}
  <div className="mt-24"> … skills.map(…) with whileInView per group … </div>
```

## Target

On screens ≥1024px wide with motion allowed: a pinned, scroll-linked sequence (no autoplay, no
scroll-jacking; native scrolling drives it).

- Section height `300svh`; inner wrapper `sticky top-0 h-[100svh] overflow-hidden`.
- Progress `p` from `useScroll({ target: sectionRef, offset: ["start start", "end end"] })`.
- 0.00–0.28: identity block shown as today.
- 0.28–0.46: identity block exits: `opacity 1→0`, `y 0→-56px`, `filter blur(0px)→blur(6px)`.
- 0.34–0.56: toolkit header enters: `opacity 0→1`, `y 48px→0`.
- Group columns enter staggered by 0.04 of progress each (`start = 0.38 + i*0.04`, window 0.16):
  `opacity 0→1`, `y 40px→0`.
- 0.56–1.00: hold the toolkit (tiles keep their hover lift).
- Ghost word "SELF-DRIVEN" stays for continuity; it drifts `x 6%→-10%` across the whole range.
- `pointer-events`: identity block `auto` while `p < 0.46`, toolkit `auto` once `p > 0.4`.
- Under 1024px or with `prefers-reduced-motion: reduce`: render the existing stacked layout
  unchanged (13 tiles do not fit one phone screen; reduced motion gets no position changes).

All values are scroll-mapped (linear `useTransform`), so no duration/easing applies to the pinned
part; the project easing `[0.22, 1, 0.36, 1]` stays on the existing `whileInView` entrances of the
fallback layout.

## Repo conventions to follow

- Exemplar for the pinned pattern: `src/components/home/AboutJourney.tsx` — `useScroll` with
  `offset: ["start start", "end end"]`, a `sticky top-0 h-[100svh] overflow-hidden` stage,
  `useTransform` per phase, and a `StaticJourney` fallback when `useReducedMotion()` is true.
- Breakpoint detection: use `window.matchMedia("(min-width: 1024px)")` in an effect (SSR renders
  the fallback first).

## Steps

1. Extract the identity block (kicker, `h2#identity-title`, paragraph, focus `ul`) into
   `IdentityBlock` and the toolkit (header + groups grid) into `ToolkitBlock` inside the same file,
   unchanged markup.
2. Keep the current section as `IdentityStatic` (identity + `mt-24` toolkit) for phones/reduced motion.
3. Add `IdentityPinned`: `<section id="identity" className="relative h-[300svh] border-t border-line bg-black">`
   containing the sticky stage, the ghost word, and two absolutely-positioned layers (identity, toolkit)
   centred vertically inside `.container-x` with `pt-20` so nothing runs under the 80px nav.
4. Wire the transforms listed in Target; groups receive per-index `opacity`/`y` motion values.
5. `export function Identity()` picks `IdentityPinned` when `isDesktop && !reduce`, else `IdentityStatic`.

## Boundaries

- Do NOT change copy, icons, skill data or tile styling.
- Do NOT touch other sections or `globals.css`.
- Do NOT add dependencies.
- If the file differs from the excerpt above, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit -p .` passes; `npx next build` succeeds.
- **Feel check** at 1440×900 and 1880×876:
  - Scrolling into Identity, the title holds still; continuing to scroll, it lifts and blurs away
    while the Toolkit rises in its place, columns arriving left to right.
  - Scrolling back up reverses exactly (scroll-linked, never "replays").
  - Nothing overlaps the nav; the whole toolkit fits on one screen.
  - Reduced motion (DevTools → Rendering) and a 390px phone show the stacked layout, no pinning.
- **Done when**: the toolkit is fully visible without the section moving, at both desktop sizes.
