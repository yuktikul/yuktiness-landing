# Yuktiness: Breath Alignment Masterclass landing page

The public landing page for the 2-hour live Breath Alignment Masterclass. It is a
**separate app** from the CRM (`../yuktiness-crm`) and has **no database**.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · next/font (Cormorant Garamond + Montserrat). No UI libraries.

## Run it

```bash
cd yuktiness-landing
npm install
cp .env.example .env.local   # fill in the values below
npm run dev                  # http://localhost:3000
```

| Variable | What it is |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site (Open Graph / canonical). |
| `NEXT_PUBLIC_VSL_URL` | The video. YouTube or Vimeo link, or a direct `https://…mp4` URL. Empty → elegant placeholder. Baked in at build time, so rebuild after changing it. |
| `CRM_API_URL` | Base URL of the CRM, e.g. `https://crm.yuktiness.com`. Server-side only. |
| `CRM_API_KEY` | Same value as `LANDING_API_KEY` in the CRM. Server-side only, never sent to the browser. |

Scripts: `npm run build`, `npm start`, `npm test`, `npm run typecheck`, `npm run lint`.

## Editing the page

- **All copy** lives in [`content/landing.ts`](content/landing.ts): headline, sections, FAQ, footer, the session schedule, stats, and client stories.
  - Stories: toggle `featured: true/false` to show or hide a story. The quotes are verbatim, so please don't edit their wording.
  - Portrait: put the photo in `public/` and set `guide.portraitSrc` (e.g. `"/yukti-portrait.jpg"`).
  - Contact: `site.contactPhone` (tap-to-call in the footer); `site.contactEmail` is optional and hidden when empty.
- **Brand colours and fonts** are in [`tailwind.config.ts`](tailwind.config.ts).
  `teal.deep` (#1B6F6A) is used for teal *text* on light backgrounds, because #4ECDC4 on off-white is only 1.8:1 contrast. The bright teal stays for accents and dark sections.

## How the truthful urgency works

- **Session dates**: `schedule` in `content/landing.ts` (Wednesday 19:00 and 11:00 IST). `src/lib/schedule.ts` computes the next real occurrence of each slot in IST, and the visitor's local time is shown underneath.
- **Countdown**: counts down to the real start of the soonest upcoming session, ticking every second on the client from one shared clock. At zero it moves to the next session. It's the same for every visitor and never resets. Shown in the hero, under the video, in the signup card, and in the sticky mobile bar.
- **Seats**: the browser calls this app's `/api/seats`, which calls the CRM's `GET /api/public/seats` with the API key and caches the result for 30 seconds. Counts are only used if they match the session date shown on the page. If the CRM can't be reached, or anything looks wrong, the seat lines are simply hidden. No number is ever invented.
  - ≤ 20 seats → "Very few seats left…" (threshold: `urgency.veryFewThreshold`)
  - 0 seats → "This session is full", that slot is disabled, and the other slot is selected by default.

## Sections

Top bar → Hero (dates, countdown, seats) → Video (`<VslPlayer/>`) → Does this sound like you? → What you will learn → How the 2 hours work → Meet your guide → Credibility strip → Stories carousel → FAQ → Signup (`#signup`, placeholder card with session choice; the form is built next) → Footer. `/terms` is a placeholder page.

The YouTube/Vimeo player loads only after the visitor taps play (a lightweight preview first), so nothing autoplays and the page stays fast.

## Quality checks (last run)

Lighthouse, mobile (3 runs): Performance 94–97 · Accessibility 100 · Best Practices 100 · SEO 100 · CLS 0.
No horizontal scroll at 390px or 1440px. Fade-ins respect "reduce motion" and never hide content when JavaScript is off.
