# Shunn Labs — website

Marketing site for Shunn Labs: the landing page and the investor page.

React 19 · TypeScript · Vite · Tailwind v4 · React Router

## Running locally

```bash
npm install && npm run dev                    # → http://localhost:5174
```

Scripts: `npm run dev` · `npm run build` (typechecks first) · `npm run lint`

## Routes

| Path | What it is |
| --- | --- |
| `/` | Landing page — problem, solution, why us, team, contact |
| `/invest` | Investor page — demo video and contact |

## Layout

```
public/         logo, icons, videos, team photos
src/
  components/   page sections, header, footer, shared icons
  data/         nav links and team members
  hooks/        document title, scroll lock, reveal-on-scroll
  pages/        Landing, Invest, 404
```

## Deployment

Vercel builds and deploys on every push to `main`; `vercel.json` rewrites
every path to `index.html` so client-side routes work. GitHub Actions
runs lint, typecheck and build as a gate — `vite build` alone does not fail
on type errors, so Vercel would happily ship one.

