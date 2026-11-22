# Jyotiraditya Bordoloi — Product Portfolio

A black-and-white, motion-rich product portfolio built with Next.js, TypeScript, Tailwind CSS, Framer Motion and Recharts.

## Run it locally

Requires **Node.js 22+** and **Git**.

```bash
git clone https://github.com/jyotiradityabordoloi-cyber/personalportfolio.git
cd personalportfolio
npm install
npm run dev        # http://localhost:3000
```

Production build: `npm run build`, then `npm start`.

## Edit the content

Almost everything you'd want to change is plain text in `src/content/`:

| File | What it holds |
| --- | --- |
| `src/content/site.ts` | Name, links, email, hero note, About copy and tags, the toolkit (skills + logos), the Experience journey |
| `src/content/projects.ts` | All project case studies (order here = order on the site) |
| `src/content/teardowns.ts` | The 8 product teardowns |
| `src/content/analytics.ts` | The 3 analytics case studies and their sample data |

Images live in `public/images/` (project thumbnails in `public/images/projects/`), tool logos in `public/icons/`.

### Add or replace a project

1. Put the thumbnail in `public/images/projects/` (1600×900 `.webp` works well).
2. In `src/content/projects.ts`, copy an existing entry (MeetPoint is a good template) and change the fields.
3. Optional fields add sections to the case page automatically: `links` (live / app / repo buttons), `audience`, `features`, `principles`, `metrics`, `next`, `stack`, `learning`, `note`.
4. Outcome numbers: give `value` (animated counter) or `display` (text like "Same day"). Say in `note` whether a number is measured or an estimate.

### Quick edits without installing anything

On github.com, open this repo and press <kbd>.</kbd> to open the web editor. Edit a file in `src/content/`, commit, and the site redeploys automatically.

## Deploy

Hosted on Vercel, connected to this GitHub repo: every push to `main` redeploys the live site.
