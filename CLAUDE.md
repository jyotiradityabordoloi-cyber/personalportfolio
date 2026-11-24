# Notes for Claude (and anyone editing this portfolio)

Personal product portfolio of Jyotiraditya Bordoloi. Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion + Recharts. Run with `npm run dev`; check with `npx tsc --noEmit -p .` and `npm run build`.

## Where things live

- **Content is data, not markup.** Edit text in `src/content/` (`site.ts`, `projects.ts`, `teardowns.ts`, `analytics.ts`), not in components.
- Home page sections, in order: `src/app/page.tsx` → Hero, AboutJourney (pinned scroll sequence), Identity (pinned → Toolkit), Experience (journey timeline), Projects (Works '26 ring), Teardowns, Analytics, Contact.
- Case pages: `src/app/projects/[slug]/page.tsx`, `src/app/teardowns/[slug]/page.tsx`, `src/app/analytics/[slug]/page.tsx`.
- Resume: `public/Jyotiraditya_Bordoloi_Resume.pdf` (replace the file to update it; `/resume` forwards there).
- Project thumbnails: `public/images/projects/`. Tool logos: `public/icons/` (real brand SVGs; never draw look-alikes).
- Animation plans: `plans/`.

## Design rules (keep these)

- Black and white everywhere. **Colour only on project cards and skill/tool logos.**
- Fonts: Montserrat (big uppercase statements), Cormorant Garamond (serif accents), Geist (body), Geist Mono (labels).
- Section kickers read like `03 — Experience & Journey`; keep the numbering in page order.
- Respect reduced motion: use `useSafeReducedMotion` from `src/lib/useSafeReducedMotion.ts` (not framer's hook directly) to avoid hydration mismatches.

## Content rules

- Never invent results. Numbers must come from the owner; label each as measured or estimated in its `note`, or use `outcomesNote` for hypotheses.
- The owner is not a PM yet: the identity is "Product Builder", looking for a first APM role. Don't say "Aspiring" or "Product Manager" as a title.
- Experience highlights use Google's XYZ format: accomplished X, measured by Y, by doing Z.
- Don't name client companies (e.g. at PropVR) unless the owner adds them.
- Placeholders still to fill: project `year: "[Year]"` fields; the About-sequence castle art and transition video (`site.aboutVideo`) are stand-ins/optional.

## Before pushing

`npx tsc --noEmit -p .` and `npm run build` must pass. Vercel redeploys `main` automatically.
