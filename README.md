# Channel Infinity — Frontend

This is the web frontend for **Channel Infinity**, a streaming platform for independent animation. It is built from the approved Figma designs in `../website image/`.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS v4 · react-hook-form + zod · lucide-react

## Getting started

```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server |
| `npm run build` / `npm start` | Builds for production and serves the build |
| `npm run lint` | Runs ESLint (flat config) |
| `npm run typecheck` | Runs `tsc --noEmit` |
| `npm run qa:overflow` | Visits every route at 360/768/1024/1280px and reports horizontal overflow and console errors. The dev server must be running; set `BASE_URL` if it isn't on :3000 |
| `npm run qa:shot -- <path> <out.png> [width] [signedIn]` | Takes a full-page screenshot, used for pixel comparison against the Figma exports |

**Demo login:** use any email and a password of 8+ characters, or "Continue with Google". For the OTP screens, any 6 digits work.

## Routes → designs

| Route | Design file | Notes |
| --- | --- | --- |
| `/` | Desktop - 1 | Landing page. The FAQ is an accordion and the category carousel pages through |
| `/creators` | Desktop - 14 | Creator program, with a perk carousel |
| `/creators/apply` | Desktop - 11 | Submission form with validation, drag-and-drop uploads and an autosaved draft |
| `/creators/apply/submitted` | Desktop - 12 | Confirmation screen |
| `/login` `/signup` `/verify` `/forgot-password` `/reset-password` | web5, web3, wev1, web2, web | Full auth flow, with OTP paste support and a resend cooldown |
| `/home` | Desktop - 2 | Rotating hero, genre chips, Continue Watching, paged Trending, Spotlight |
| `/title/[slug]` (series) | Desktop - 13 | Episodes / Details / More-like-this tabs, donation, Follow |
| `/title/[slug]` (film) | Desktop - 17 | Watchlist, TipJar, Report and star rating |
| `/title/[slug]/support` + TipJar modal | Support the Artist | Donation presets and a custom amount |
| `/watch/[slug]` | Now Playing - NebulaStream | Real `<video>` player: scrubbing, volume, quality, fullscreen, keyboard shortcuts, progress saved |
| `/profile` | Desktop - 5 (Follow creator) | Searchable creator grid with follow/unfollow |
| `/profile?tab=watchlist` | Desktop - 6 | Watchlist, Continue Watching and Clear History |
| `/profile/edit`, `/profile/avatar` | Desktop - 15, 16 | Edit display name; accessible avatar radio grid |
| `/pricing` | Desktop - 7 | Free and Premium plans (updates the plan in the store) |
| `/settings` | Settings | Settings hub |
| `/settings/password` | Desktop - 8 | Change password |
| `/settings/verify-email` | Desktop - 9 | Email OTP |
| `error.tsx` / `not-found.tsx` | Frame 2147239893 | "Oops! Something Went Wrong" screen |

These routes have no artboard and are built from the same design system: `/categories`, `/categories/[genre]`, `/search`, `/support` (FAQ and contact form), and `/legal/[doc]`.

## Architecture

```
src/
  app/
    (marketing)/   public pages: PublicHeader + Footer
    (auth)/        split-screen auth, no chrome
    (app)/         signed-in app: AppHeader + Footer, plus loading and error boundaries
    (focus)/       full-screen black editors (profile edit/avatar)
    (player)/      full-bleed video player
    (standalone)/  creator submission flow
  components/      ui/ primitives (Button, Dialog, Carousel…) and feature folders
  lib/
    api/catalog.ts  async data service (the mock today; swap in HTTP calls)
    data/           seed catalog, legal copy
    store.ts        persisted client store (session, watchlist, follows, ratings, progress)
  proxy.ts          route protection (Next 16 "proxy", formerly middleware)
```

**Design tokens** live in `src/app/globals.css` under `@theme`. The colours were sampled from the exported PNGs. The glossy violet buttons, plum secondary buttons and gradient hairline borders are the `surface-*` and `border-glow` utilities.

**Assets:** artwork, avatars and thumbnails were cut from the high-resolution Figma exports into `public/images`. Baked-in text, duration pills and play icons were painted out so that those elements render as live UI. When real media is available, replace these files with the originals.

## Connecting the backend

Every UI-facing data call goes through `src/lib/api/*`, which is async and typed with `src/lib/types.ts`, or through the actions in `src/lib/store.ts`. Search the code for `TODO:` to find each integration point:

- auth (sign in/up, OTP, reset)
- password change
- tips
- plan checkout
- support tickets
- creator submission
- the stream URL

Once the API issues its own session, it should set the `ci_session` cookie as `httpOnly`.

## Interaction layer

Everything below sits on top of the approved designs. At rest, every page renders exactly as the artboards; the motion and feedback play only in response to scrolling, hovering and actions.

- **Live search.** The header search is an ARIA combobox. It suggests titles (with thumbnails), creators and genres, keeps recent searches, and supports ↑/↓ and Enter. Focus it from anywhere with ⌘K, Ctrl+K or `/`. The code is in `components/layout/search-field.tsx`.
- **Toasts.** Watchlist, follow, rating and history changes show a toast with **Undo**. Sign-in, profile and avatar saves, password and email verification, tips, plan upgrades and the contact form also confirm with a toast. See `lib/toast.ts` and `components/ui/toaster.tsx`.
- **Confetti** plays on a tip or a Premium upgrade. It has no dependencies and is disabled under reduced motion (`lib/confetti.ts`).
- **Shared-element morph.** Card artwork morphs into the title page's key art using React `<ViewTransition>` (`MorphArt` in `cards/explore-card.tsx`).
- **Scroll reveal, staggered in groups.** Add `data-reveal` to an element, or `data-reveal-group` to its parent. It is a pure-CSS scroll-driven animation (`animation-timeline: view()`) with no JavaScript and no DOM writes. Browsers without support show the content straight away.
- **Cursor spotlight** on cards: add `data-spotlight`. It runs from a single delegated listener in `components/ui/effects.tsx`.
- **Home hero.** The active slide has a Ken Burns drift. Its pager dot fills while the slide plays and drives the rotation itself, so pausing on hover or focus keeps the two in sync. Auto-rotation is off under reduced motion.

`node tools/e2e-awesome.mjs` smoke-tests this layer. It needs the dev server running, with `BASE_URL` set.

## Quality notes

- **Accessibility:** WCAG-minded throughout.
  - Labelled fields, `aria-invalid` and linked error text.
  - Keyboard-operable tabs, radios, OTP boxes and player.
  - Native `<dialog>` modals.
  - Skip link, visible focus and `prefers-reduced-motion` support.
- **Responsive:** 360px and up with no horizontal scroll (checked with `qa:overflow`).
- **SEO:**
  - Per-page metadata, OpenGraph, `sitemap.xml`, `robots.txt` and a web manifest.
  - JSON-LD for titles.
- **Performance:** `next/image` with AVIF/WebP, static generation for catalog pages, and minimal client JS on server-rendered routes.

## Intentional deviations from the artboards

- Obvious copy typos are fixed. For example, the signup button reads "Create Account" rather than "Log In", "Animatiom" is spelled "Animation", and the "Primmum" badge reads "Premium".
- The profile "Premium" badge reflects the user's actual plan.
- Elements that were a few pixels off-centre in Figma are centred.
- The red "+" Figma artifact on the Settings artboard is omitted.
- `image 4.png` is an early low-fidelity draft of the series page. Desktop - 13 supersedes it.
"# web_kappa" 
