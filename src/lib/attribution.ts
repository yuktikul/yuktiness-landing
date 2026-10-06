/**
 * First-touch attribution, captured in the browser.
 *
 * Consent model (see README → Privacy):
 *  - No choice yet: kept in sessionStorage only (this tab, cleared when it closes), so a signup
 *    made during this visit is still attributed. Nothing persistent is written.
 *  - Accepted: also saved in a first-party cookie for 90 days, first touch never overwritten.
 *  - Declined: everything is cleared and no marketing parameters are sent with the form.
 */

export const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "campaign_id",
  "campaign_name",
  "adset_id",
  "adset_name",
  "ad_id",
  "ad_name",
  "placement",
] as const;

const FIRST_TOUCH = "yk_ft";
const CONSENT = "yk_consent";
const FIRST_TOUCH_DAYS = 90;
const CONSENT_DAYS = 180;

export type Consent = "accepted" | "declined" | null;
type FirstTouch = { p: Record<string, string>; landingUrl: string; referrer: string; at: number };

function readCookie(name: string): string | null {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

function writeCookie(name: string, value: string, days: number) {
  try {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${days * 86400}; Path=/; SameSite=Lax${secure}`;
  } catch {}
}

const deleteCookie = (name: string) => writeCookie(name, "", 0);

function session(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function parse(raw: string | null | undefined): FirstTouch | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as FirstTouch;
    return v && typeof v === "object" && v.p ? v : null;
  } catch {
    return null;
  }
}

function fromCurrentPage(): FirstTouch {
  const qs = new URLSearchParams(location.search);
  const p: Record<string, string> = {};
  for (const k of TRACKED_PARAMS) {
    const v = qs.get(k);
    if (v) p[k] = v.slice(0, 300);
  }
  return { p, landingUrl: location.href.slice(0, 1500), referrer: (document.referrer || "").slice(0, 1000), at: Date.now() };
}

export const getConsent = (): Consent => {
  const v = readCookie(CONSENT);
  return v === "accepted" || v === "declined" ? v : null;
};

const stored = (consent: Consent) => (consent === "accepted" ? parse(readCookie(FIRST_TOUCH)) : null) ?? parse(session()?.getItem(FIRST_TOUCH));

/** Run once per page load. Keeps the FIRST touch: never overwrites an existing record. */
export function captureFirstTouch() {
  const consent = getConsent();
  if (consent === "declined") return;
  const existing = stored(consent);
  const record = existing ?? fromCurrentPage();
  if (!existing) session()?.setItem(FIRST_TOUCH, JSON.stringify(record));
  if (consent === "accepted" && !readCookie(FIRST_TOUCH)) writeCookie(FIRST_TOUCH, JSON.stringify(record), FIRST_TOUCH_DAYS);
}

export function setConsent(choice: "accepted" | "declined") {
  writeCookie(CONSENT, choice, CONSENT_DAYS);
  document.documentElement.classList.add("consent-set");
  if (choice === "accepted") {
    captureFirstTouch();
  } else {
    deleteCookie(FIRST_TOUCH);
    session()?.removeItem(FIRST_TOUCH);
  }
}

/** Everything to send with the signup. Empty when the visitor declined. */
export function getAttributionForSubmit(): Record<string, string> {
  const consent = getConsent();
  if (consent === "declined") return {};
  const ft = stored(consent) ?? fromCurrentPage();
  const out: Record<string, string> = { ...ft.p };
  if (ft.landingUrl) out.landingUrl = ft.landingUrl;
  if (ft.referrer) out.referrer = ft.referrer;
  const fbp = readCookie("_fbp");
  // Meta's documented fbc format when the pixel hasn't set _fbc: fb.1.<click time ms>.<fbclid>
  const fbc = readCookie("_fbc") ?? (ft.p.fbclid ? `fb.1.${ft.at}.${ft.p.fbclid}` : null);
  if (fbp) out.fbp = fbp;
  if (fbc) out.fbc = fbc;
  return out;
}
