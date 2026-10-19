<div align="center">

# Knock'ls Boxing Gym

**Boxing, Muay Thai and private coaching in Mactan, Cebu.**

[**Visit the site**](https://knockles.vercel.app) · [Programs](https://knockles.vercel.app/programs) · [Book a trial](https://knockles.vercel.app/book)

[![Knock'ls Boxing Gym](screenshots/preview.png)](https://knockles.vercel.app)

<sub>Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Neon Postgres · Zod</sub>
</div>

A conversion-focused gym site with the plumbing a real gym needs: a public site that
answers "what is this, what does it cost, and what happens on my first visit", plus a
small CMS so the owner can change all of it without a developer.

## Public site

- **Programs** — Boxing Training, Muay Thai, Private Training and a First-Timers track,
  each with its own page.
- **Pricing & schedule** — trial session, membership and private coaching tiers, plus the
  weekly class schedule.
- **First visit** — a step-by-step "what to bring / what to expect" guide that removes the
  anxiety of walking in for the first time.
- **Proof** — coaches, testimonials, reviews and a photo gallery.
- **Book a trial / contact** — a validated lead form (rate-limited, Zod-checked) that
  writes straight into the admin inbox, with Messenger and click-to-call alongside it.
- **Details that matter** — announcement bar, sticky mobile CTA, map embed, FAQ, and SEO
  extras: sitemap, robots, Open Graph image and structured data.

## Admin CMS (`/admin`)

- **Signed sessions** — HMAC-signed, HTTP-only cookie with a 7-day expiry.
- **Content editor** — edit each page section (hero, programs, pricing, coaches, FAQ,
  testimonials) and publish instantly.
- **Leads inbox** — every trial booking and enquiry, with status tracking.
- **Media library** — upload images and attach them to content sections.
- **Settings** — gym details, links and contact information.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, route handlers, server components) |
| UI | React 19, TypeScript, Tailwind CSS 4, lucide-react |
| Data | Pluggable store: Neon Postgres in production, JSON file store for local dev |
| Validation | Zod schemas on every public mutation + in-memory rate limiting |
| SEO | Metadata, sitemap, robots, OG image, JSON-LD |

## Getting started

```bash
git clone https://github.com/Jorayyy/knockles.git
cd knockles
npm install
npm run dev
```

Open http://localhost:3000. With no `DATABASE_URL`, content is persisted to a local JSON
file, so you can run the whole thing — CMS included — with zero infrastructure.

To run the production-style setup, add a `.env.local`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
NEXT_PUBLIC_SITE_URL="https://knockles.vercel.app"

ADMIN_USERNAME="your-admin"
ADMIN_PASSWORD="a-long-password"
SESSION_SECRET="a-long-random-string"
```

Then sign in at `/admin`. Default copy and imagery live in
`src/lib/content/defaults.ts`; edit them from the CMS or in code.

## Project layout

```
src/app/(site)/     public pages: home, programs, pricing, schedule, coaches, book…
src/app/admin/      dashboard, content sections, leads, media, settings, login
src/app/api/        leads, media and upload endpoints
src/components/     site chrome and sections, admin UI, shadcn-style primitives
src/lib/db/         store interface with Postgres and JSON implementations
src/lib/content/    content types, defaults and access helpers
```

## Deploy

Import the repo on Vercel, add a Neon `DATABASE_URL` plus the admin credentials and
`SESSION_SECRET`, and deploy. The store creates its tables on first use, so the CMS is
ready as soon as the first page loads.
