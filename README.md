# Selim Koç — Portfolio OS

A macOS-inspired desktop experience built as a personal portfolio, live at [selimkoc.dev](https://selimkoc.dev).

Instead of a traditional scrolling page, the site simulates a desktop environment: draggable windows, a dock, a top bar, wallpaper switching, and a few hidden easter eggs.

## Features

- **Desktop UI** — draggable/minimizable windows (`DraggableWindow`), dock with running-app indicators (`Dock`), top bar, desktop shortcuts
- **Wallpaper selector** — switch between gradients and image wallpapers, persisted in `localStorage` and applied pre-paint to avoid flash
- **About / Experience / Education / Skills / Projects** windows, each its own component
- **Contact form** via EmailJS
- **Mini game** — a sliding puzzle (`SlidingPuzzle`)
- **`/sleep` easter egg** — a Three.js starfield scene with a Pisces constellation
- **Admin area** (`/tedi`) protected by bcrypt password auth, DB-backed login lockout (survives redeploys/serverless cold starts), and httpOnly/secure/sameSite session cookies — enforced server-side via TanStack Start server functions, not just client-side gating
- **i18n** — Turkish/English via i18next
- **Mobile gate** — the desktop UI only renders above the `xl` breakpoint; smaller screens see a dedicated mobile notice
- **SEO** — sitemap, robots, Open Graph/Twitter card image, JSON-LD `Person` schema

## Tech Stack

- [TanStack Start](https://tanstack.com/start) (React 19, SSR) + [TanStack Router](https://tanstack.com/router)
- Tailwind CSS 4
- Prisma + Neon (serverless Postgres) for admin auth state
- Framer Motion, Three.js
- Vercel (hosting, Analytics, Speed Insights)

## Development

```bash
npm install
npm run dev
```

Requires a `.env` with `DATABASE_URL` and `SESSION_SECRET` for the admin auth flow to work locally.

```bash
npm run build      # production build (runs prisma generate first)
npm run test       # vitest
npm run check       # prettier --write + eslint --fix
```
