import { createHash } from "node:crypto";

/**
 * Meta Conversions API (server-side "Lead" event). Active only when META_PIXEL_ID and
 * META_CAPI_TOKEN are both set; otherwise every call is a silent no-op.
 * The same event_id is used by the browser Pixel, so Meta de-duplicates the two.
 */

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

/** Meta's normalisation: email trimmed + lowercased. */
export const hashEmail = (email: string) => sha256(email.trim().toLowerCase());
/** Phone: E.164 digits only, without "+" (e.g. 919876543210). */
export const hashPhone = (e164: string) => sha256(e164.replace(/\D/g, ""));

export type LeadEventInput = {
  eventId: string;
  eventTime: Date;
  sourceUrl: string | null;
  email: string;
  phoneE164: string;
  fbp?: string | null;
  fbc?: string | null;
  ip?: string | null;
  userAgent?: string | null;
};

export function buildLeadEvent(i: LeadEventInput) {
  return {
    event_name: "Lead",
    event_time: Math.floor(i.eventTime.getTime() / 1000),
    event_id: i.eventId,
    action_source: "website",
    ...(i.sourceUrl ? { event_source_url: i.sourceUrl } : {}),
    user_data: {
      em: [hashEmail(i.email)],
      ph: [hashPhone(i.phoneE164)],
      ...(i.fbp ? { fbp: i.fbp } : {}),
      ...(i.fbc ? { fbc: i.fbc } : {}),
      ...(i.ip ? { client_ip_address: i.ip } : {}),
      ...(i.userAgent ? { client_user_agent: i.userAgent } : {}),
    },
    custom_data: { content_name: "Breath Alignment Masterclass" },
  };
}

export const capiConfigured = () => !!(process.env.META_PIXEL_ID && process.env.META_CAPI_TOKEN);

/** Send one Lead event. Never throws; failures are logged without personal data. */
export async function sendLeadEvent(input: LeadEventInput): Promise<"sent" | "skipped" | "failed"> {
  const pixel = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixel || !token) return "skipped";
  const base = (process.env.META_GRAPH_URL || "https://graph.facebook.com").replace(/\/+$/, "");
  const version = process.env.META_GRAPH_VERSION || "v21.0";
  const body: Record<string, unknown> = { data: [buildLeadEvent(input)], access_token: token };
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;
  try {
    const res = await fetch(`${base}/${version}/${encodeURIComponent(pixel)}/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      console.error(`[meta-capi] Lead event ${input.eventId} rejected: HTTP ${res.status}`);
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error(`[meta-capi] Lead event ${input.eventId} failed:`, (err as Error).name);
    return "failed";
  }
}
