# Yuktiness: Breath Alignment Masterclass landing page

The public landing page for the 2-hour live Breath Alignment Masterclass. It is a
**separate app** from the CRM ([yuktikul/yuktiness-crm](https://github.com/yuktikul/yuktiness-crm)) and has **no database**: signups are
handed to the CRM server-to-server, then the visitor goes straight to the academy checkout.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · next/font (Cormorant Garamond + Montserrat). No UI libraries.

## Run it

```bash
git clone https://github.com/yuktikul/yuktiness-landing.git && cd yuktiness-landing
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
| `CHECKOUT_URL` | `https://wahacademy.yuktiness.com/web/checkout/6a719e2e03959b96644a66dc?purchaseNow=true`. Empty → "Payment link coming soon" screen. |
| `CHECKOUT_PREFILL_PARAMS` | Optional, e.g. `name=name,email=email,phone=phone`. Empty = plain URL (see "Checkout" below). |
| `SIGNUP_QUEUE_FILE` | Where signups are saved if the CRM is unreachable. Default `.data/signup-queue.jsonl`. |

Scripts: `npm run build`, `npm start`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run queue:replay`.

## Editing the page

- **All copy** lives in [`content/landing.ts`](content/landing.ts): headline, sections, FAQ, footer, the session schedule, stats, and client stories. Session times are shown in IST only (ads target India).
  - Stories: toggle `featured: true/false` to show or hide a story. The quotes are verbatim, so please don't edit their wording.
  - Portrait: put the photo in `public/` and set `guide.portraitSrc` (e.g. `"/yukti-portrait.jpg"`).
  - Contact: `site.contactPhone` (tap-to-call) and `site.contactEmail` in the footer.
  - Logo: `public/brand/logo-full.png` (light backgrounds: signup card, terms page) and `public/brand/logo-mark.png` (tree emblem on an off-white badge in the top bar, footer and share image). Browser icons: `src/app/icon.png`, `src/app/apple-icon.png`.
- **Brand colours and fonts** are in [`tailwind.config.ts`](tailwind.config.ts).
  `teal.deep` (#1B6F6A) is used for teal *text* on light backgrounds, because #4ECDC4 on off-white is only 1.8:1 contrast. The bright teal stays for accents and dark sections.

## How the truthful urgency works

- **Session dates**: `schedule` in `content/landing.ts` (Wednesday 19:00 and 11:00 IST). `src/lib/schedule.ts` computes the next real occurrence of each slot in IST.
- **Countdown**: counts down to the real start of the soonest upcoming session, ticking every second on the client from one shared clock. At zero it moves to the next session. It's the same for every visitor and never resets. Shown in the hero, under the video, in the signup card, and in the sticky mobile bar.
- **Seats**: no numbers are shown. Each session shows one line, and the wording follows the real bookings in the CRM so it stays truthful:
  - "Limited seats for Wednesday 7 PM": the default, and also what shows if the CRM can't be reached (sessions are genuinely capped).
  - "Seats closing fast for…": only once 30% or fewer of that session's seats remain (`urgency.closingFastShareLeft`).
  - "This session is full": at 0 seats. That slot is disabled and the other slot is selected by default.
  The browser calls this app's `/api/seats`, which calls the CRM's `GET /api/public/seats` with the API key (cached 30 seconds).

## Signup → checkout flow

1. **Every "Reserve my seat" button** opens the form: as a bottom sheet below 1024px wide, and by focusing the form in the hero's right column on desktop. The same form is also in the `#signup` section. All copies share one state, so nothing typed is lost. Without JavaScript the buttons are plain links to `#signup`.
2. **One screen, no steps.** Name → WhatsApp (+91 default) → email → session pills (soonest session with seats pre-selected) → "How did you first hear…" → optional collapsed section (chips, free text, health note) → consent checkbox. No OTP, account, password or captcha.
3. **Errors appear on blur**, in plain words. What the visitor typed is always kept. On submit, focus jumps to the first problem and screen readers hear "Please check the highlighted fields."
4. **Partial save.** As soon as name, phone and email are all valid (on leaving any of those fields), `POST /api/signup/partial` creates the lead in the CRM (`isComplete=false`), so drop-offs are captured.
5. **Submit.** The button disables and shows a spinner. `POST /api/signup/complete` saves everything (`isComplete=true`, session slot and date) and returns the checkout URL, and the browser goes there immediately, with no thank-you page. `<link rel="preconnect">` and `dns-prefetch` to the checkout domain are in the page head.

**Server side** (`src/app/api/signup/*`): Zod validation plus the same plain-word rules the browser uses, a hidden honeypot field (`website`; bots that fill it get a normal-looking response and nothing is saved), and per-IP rate limits (20 partial / 10 complete per 10 minutes). The routes call the CRM's `POST /api/public/leads` with `x-api-key: CRM_API_KEY`.

**If the CRM is down**: each call is retried once. If that fails, the full CRM request bodies are written to the server log and to `SIGNUP_QUEUE_FILE`, and the visitor still goes to checkout with no error shown. Run `npm run queue:replay` to send queued signups once the CRM is back. On hosts with a read-only or temporary disk (e.g. Vercel), the log line is the safety net: search the logs for `[signup-queue]`.

**Health notes**: the optional free text is stored in the CRM's `issuesNote` as `What they're working on: …`, and the medical / pregnancy box as `HEALTH NOTE (medical condition / pregnancy): …`, so staff can spot it.

## Checkout

After the complete call, the visitor goes to `CHECKOUT_URL` (the Rs 51 masterclass checkout on the academy platform, which uses Razorpay).

The checkout is hosted by **TagMango** (the academy platform) and paid through Razorpay.

**Prefill: on, and confirmed.** The checkout fills its Billing information from `name`, `email` and `phone` in the link, so the visitor arrives with everything already typed. `CHECKOUT_PREFILL_PARAMS="name=name,email=email,phone=phone"`.
- `phone` is sent as the **national number without the country code** (e.g. `9876543210`), because the checkout has its own country picker.
- That picker is **set from the visitor's location**: +91 in India, +61 in Australia, and so on. A visitor abroad with an Indian number would need to switch it to +91 themselves.
- Visitors outside India see the price in **USD** (Rs 51 showed as USD 1 from Australia). The CRM records the currency on CSV imports.
- The checkout also offers an optional **add-on** ("Life Alignment 121 Call"), so an order can be more than Rs 51.

Because payments are matched to leads by **email or phone**, the form tells visitors: "Please use the same email or phone number on the payment page."

## Attribution (first touch)

On the first page load, the browser stores these URL parameters, plus the landing URL and `document.referrer`:
`utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, campaign_id, campaign_name, adset_id, adset_name, ad_id, ad_name, placement`.
The **first touch is kept**: later visits never overwrite it. The Meta cookies `_fbp` and `_fbc` are read if present. If there is no `_fbc` but there is an `fbclid`, `fbc` is built in Meta's documented format `fb.1.<click time>.<fbclid>`. Everything is sent with the form to the CRM, which derives `trackedSource` (rules in the CRM README).

### Meta Ads Manager: URL parameters

Paste this into **Ad → Tracking → URL parameters** (the same for every ad):

```
utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}&placement={{placement}}
```

The CRM fills its Meta name fields from these UTMs (campaign name ← `utm_campaign`, ad name ← `utm_content`, ad set name ← `utm_term`) and stores the ids and placement directly.

## Meta Pixel and Conversions API (optional)

Nothing loads or is sent unless the environment variables are set, and then only for visitors who **accepted** the cookie notice.
- **Browser Pixel** (`NEXT_PUBLIC_META_PIXEL_ID`): loads after Accept and fires `PageView`. When the signup completes it fires `Lead` with an `eventID`.
- **Server event** (`META_PIXEL_ID` + `META_CAPI_TOKEN`): the complete route sends the same `Lead` to the Conversions API with the **same `event_id`**, so Meta de-duplicates the two. It runs after the response is sent, so the redirect to checkout is never slowed down.
- **What the server event carries:** the email (trimmed, lowercased) and the phone (E.164 without `+`, e.g. `919876543210`), each SHA-256 hashed, plus `fbp`, `fbc` (built from `fbclid` when there's no `_fbc` cookie), the visitor's IP and user agent, and the landing URL. Raw contact details are never sent.
- **When something is missing:** if the variables aren't set, everything is skipped silently. A failed call is logged without personal data.
- **Testing:** set `META_TEST_EVENT_CODE`, then watch **Events Manager → Test events**.

`GET /api/health` returns `{"status":"ok"}` for uptime monitors.

## Privacy

- **Security headers**: a Content-Security-Policy that allows only Meta, YouTube / Vimeo and this site, plus `X-Frame-Options: DENY`, `Referrer-Policy`, `nosniff` and HSTS in production. The signup routes reject cross-site posts.
- **Cookie notice**: a slim bar in the normal page flow at the very top. It never overlays anything, so it can't cover the form or a button. It is hidden before first paint once a choice exists, so there's no layout jump. It links to https://yuktiness.com/privacy-policy/ (new tab), as do the form's consent line and the footer.
- **My choice on storage**:
  - **Before the visitor chooses**, attribution is kept in `sessionStorage` only. That is first-party, limited to this tab, deleted when the tab closes, and used only to attach the source to a signup the visitor makes in this visit. Nothing persistent is written and nothing is sent anywhere until they submit the form (which has its own consent checkbox). I consider this acceptable as minimal, session-only storage, and it means visitors who ignore the bar are still attributed.
  - **Accept** → also stored in a first-party cookie (`yk_ft`) for 90 days.
  - **No thanks** → stored data is deleted and **no** marketing parameters are sent with the form.
  - The choice itself is remembered in a strictly-necessary cookie (`yk_consent`, 180 days).
  - If you'd rather store nothing at all before Accept, remove the `sessionStorage` write in `captureFirstTouch()` in `src/lib/attribution.ts`. The trade-off is losing the source for people who never tap the bar.

## Sections

Cookie notice → Top bar → Hero (desktop: the form; mobile: dates, countdown, seats) → Video (`<VslPlayer/>`) → Does this sound like you? → What you will learn → How the 2 hours work → Meet your guide → Credibility strip → Stories carousel → FAQ → Signup (`#signup`, the full form) → Footer. `/terms` is a placeholder page.

The YouTube/Vimeo player loads only after the visitor taps play (a lightweight preview first), so nothing autoplays and the page stays fast.

## Quality checks (last run)

- Lighthouse mobile (3 runs, with the form): Performance 98 · Accessibility 100 · Best Practices 100 · SEO 100 · CLS 0.
- End-to-end on a 390px phone, from `/?utm_source=facebook&utm_medium=paid&utm_campaign=TestCampaign&utm_content=Video1&fbclid=abc123`: **7 taps, 14.4 s** from landing to the checkout redirect with simulated human typing (about 5 characters a second), and 0.1 s from tapping the button to the redirect. Taps: Reserve → phone → email → "How did you hear" picker → choose → consent → submit. The name field is focused automatically.
- Keyboard: the tab order follows the visual order, and submitting with a missing field moves focus to it and announces the error. Every tap target in the mobile sheet is at least 48px tall.
