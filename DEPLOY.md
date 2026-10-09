# Deploying the landing page (`masterclass.yuktiness.com`)

The landing page has **no database**. Signups go server-to-server to the CRM
([`yuktikul/yuktiness-crm`](https://github.com/yuktikul/yuktiness-crm), at `team.yuktiness.com`), then the visitor goes to the
TagMango checkout. Visitors' browsers never see the CRM's address or the API key.

**Production setup:** Vercel project `yuktiness-landing`, function region Mumbai (`bom1`). Every push to `main` deploys.
Deploy the CRM first, because this app needs its URL and API key.

## Environment variables (Vercel → Settings → Environment Variables, Production)

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://masterclass.yuktiness.com` |
| `NEXT_PUBLIC_VSL_URL` | your YouTube / Vimeo / `.mp4` link (empty = placeholder) |
| `CRM_API_URL` | `https://team.yuktiness.com` |
| `CRM_API_KEY` | the same value as the CRM's `LANDING_API_KEY` |
| `CHECKOUT_URL` | `https://wahacademy.yuktiness.com/web/checkout/6a719e2e03959b96644a66dc?purchaseNow=true` |
| `CHECKOUT_PREFILL_PARAMS` | `name=name,email=email,phone=phone` |
| `SIGNUP_QUEUE_FILE` | `/tmp/signup-queue.jsonl` (Vercel's only writable folder) |
| `NEXT_PUBLIC_META_PIXEL_ID` | *(optional)* your Pixel ID |
| `META_PIXEL_ID` | *(optional)* the same Pixel ID |
| `META_CAPI_TOKEN` | *(optional)* Events Manager → your Pixel → Settings → Conversions API → Generate access token |
| `META_TEST_EVENT_CODE` | *(optional, only while testing)* Events Manager → Test events code |

`NEXT_PUBLIC_*` values are baked in at build time, so **redeploy** after changing them (Deployments → ⋯ → Redeploy).

## Domain and DNS

Settings → Domains → add `masterclass.yuktiness.com`. Then, where the DNS for `yuktiness.com` is managed:

| Type | Name / Host | Value / Target |
| --- | --- | --- |
| `CNAME` | `masterclass` | the value Vercel shows for the domain (e.g. `cname.vercel-dns.com`) |

Leave the existing records for `yuktiness.com` and `wahacademy.yuktiness.com` alone. HTTPS is issued automatically and
forced, and production responses send HSTS.

## Checks

- `https://masterclass.yuktiness.com/api/health` returns `{"status":"ok"}`.
- With the Pixel set: Events Manager → Test events shows PageView and Lead, marked "Deduplicated".
- Submit a test signup: you should land on the TagMango checkout with your name, email and phone prefilled, and the lead
  should appear in the CRM.

## Known limits

- **The backup copy of failed signups is short-lived on Vercel**, because its disk is temporary. If the CRM is down, the signup is
  also written to the function log. Add a Vercel log drain (e.g. Better Stack) if you want a permanent record.
- Rate limits are kept in memory, per Vercel instance.
