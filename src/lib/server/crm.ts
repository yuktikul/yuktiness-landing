/** Server-only client for the CRM intake API. The API key never leaves the server. */

export type CrmResult = { ok: true; status: number; data: { leadId?: string; isNew?: boolean } } | { ok: false; status: number; retryable: boolean; error: string };

async function postOnce(body: unknown): Promise<CrmResult> {
  const base = process.env.CRM_API_URL;
  const key = process.env.CRM_API_KEY;
  if (!base || !key) return { ok: false, status: 0, retryable: false, error: "CRM_API_URL / CRM_API_KEY not set" };
  try {
    const res = await fetch(new URL("/api/public/leads", base), {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, status: res.status, data };
    return { ok: false, status: res.status, retryable: res.status >= 500 || res.status === 429, error: JSON.stringify(data).slice(0, 500) };
  } catch (err) {
    return { ok: false, status: 0, retryable: true, error: String(err) };
  }
}

/** POST to the CRM, retrying once on network errors, 5xx and 429. */
export async function postLeadToCrm(body: unknown): Promise<CrmResult> {
  const first = await postOnce(body);
  if (first.ok || !first.retryable) return first;
  await new Promise((r) => setTimeout(r, 400));
  return postOnce(body);
}
