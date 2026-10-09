import { NextResponse } from "next/server";
import { toE164 } from "@/lib/signup-validation";
import { postLeadToCrm } from "@/lib/server/crm";
import { enqueueFailedSignup } from "@/lib/server/queue";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";
import { partialSchema, serverFieldErrors } from "@/lib/server/signup-schema";
import { crmStep1Body } from "@/lib/server/signup";
import { isSameOrigin } from "@/lib/server/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Saves name + phone + email as soon as they're valid, so drop-offs are still captured. */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ ok: false, error: "forbidden" }, 403);
  const ip = clientIp(req);
  if (!rateLimit(`partial:${ip}`, 20, 10 * 60_000).ok) return json({ ok: false, error: "rate_limited" }, 429);

  const parsed = partialSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ ok: false, error: "invalid" }, 400);
  const input = parsed.data;
  if (input.website) return json({ ok: true, leadId: null }); // honeypot: pretend all is well

  const errors = serverFieldErrors(input, ["fullName", "phone", "email"]);
  if (Object.keys(errors).length) return json({ ok: false, error: "invalid", errors }, 400);

  const body = crmStep1Body({ ...input, phoneE164: toE164(input.phoneCode, input.phone)! }, input.attribution, req, ip);
  const res = await postLeadToCrm(body);
  if (res.ok) return json({ ok: true, leadId: res.data.leadId ?? null });

  await enqueueFailedSignup({ kind: "partial", reason: `CRM ${res.status}: ${res.error}`, payload: { step1: body } });
  return json({ ok: true, leadId: null, queued: true });
}
