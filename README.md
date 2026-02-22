# Quietly Cursed

A dark, minimalist static website for the **Quietly Cursed** YouTube channel — a psychological atlas of the traps that silently shape your mind.

## Tech Stack

- **Next.js 16** (App Router, static export)
- **TypeScript**
- **Tailwind CSS v4**
- Static generation for SEO (OpenGraph + JSON-LD on every page)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (header, footer, grain, UTM)
│   ├── page.tsx            # Home — animated hero + "Enter the Atlas" CTA
│   ├── not-found.tsx       # Custom 404
│   ├── atlas/
│   │   ├── page.tsx        # Atlas — card grid of psychological traps
│   │   └── [slug]/
│   │       └── page.tsx    # Episode template — video, essay, JSON-LD
│   └── mascot/
│       └── page.tsx        # Mascot gallery + brand lore
├── components/
│   ├── BrainIcon.tsx       # Purple brain SVG icon
│   ├── EyeGlow.tsx         # Cyan eye-glow pulse animation
│   ├── Footer.tsx
│   ├── GrainOverlay.tsx    # Subtle film grain texture
│   ├── Header.tsx          # Fixed nav with mobile menu
│   ├── ParallaxSection.tsx # Lightweight scroll parallax
│   ├── TrapCard.tsx        # Card component for Atlas grid
│   ├── UtmCapture.tsx      # UTM param capture on mount
│   └── YouTubeEmbed.tsx    # Lazy-loaded YouTube embed
├── data/
│   ├── traps.ts            # Trap entries (slug, essay, video, metadata)
│   └── mascot.ts           # Mascot lore + gallery data
└── lib/
    ├── seo.ts              # OpenGraph, JSON-LD builders
    └── utm.ts              # UTM capture + sessionStorage
```

## Pages

| Route | Description |
|---|---|
| `/` | Home — animated hero with glowing eyes and "Enter the Atlas" CTA |
| `/atlas` | Atlas — directory grid of all psychological traps |
| `/atlas/[slug]` | Episode — essay, embedded YouTube video, related traps, JSON-LD |
| `/mascot` | The Watcher — mascot gallery and brand lore |

## Design

- **Dark theme** — `#0a0a0a` background, high-contrast white text
- **Cyan accent** (`#22d3ee`) — eye glow, CTAs, interactive elements
- **Purple accent** (`#a855f7`) — brain icon, intellectual/mind elements
- **Animations** — grain overlay, eye-glow pulse, parallax, fade-in-up
- **Mobile-first** — responsive grid, collapsible nav

## UTM Tracking

The site captures UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) from the URL on page load and stores them in `sessionStorage` under the key `qc_utm`. This data is available for analytics integration.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repository at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js — no extra configuration needed
4. Deploy

Or use the Vercel CLI:

```bash
npx vercel
```

## Adding New Traps

Edit `src/data/traps.ts` — add a new entry to the `traps` array with:
- `slug` — URL-safe identifier
- `title` — display name
- `tagline` — short hook
- `summary` — 300–800 word essay
- `youtubeId` — YouTube video ID
- `publishedAt` — ISO date string
- `relatedSlugs` — array of related trap slugs

The new trap automatically appears on the Atlas page and gets its own statically generated route.
