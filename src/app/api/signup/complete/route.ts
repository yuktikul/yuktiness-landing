import { NextResponse } from "next/server";
import { schedule } from "@content/landing";
import { nextOccurrence, formatIST } from "@/lib/schedule";
import { composeIssuesNote, toE164 } from "@/lib/signup-validation";
import { checkoutUrl } from "@/lib/server/checkout";
import { postLeadToCrm } from "@/lib/server/crm";
import { enqueueFailedSignup } from "@/lib/server/queue";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";
import { getSeats, invalidateSeats } from "@/lib/server/seats";
import { completeSchema, serverFieldErrors } from "@/lib/server/signup-schema";
import { crmStep1Body } from "@/lib/server/signup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Final submit. Saves everything to the CRM (step 2, or step 1 + step 2 if the partial
 * save never happened), then returns the checkout URL. If the CRM is down the lead is
 * queued and the visitor still goes to checkout: no scary error.
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`complete:${ip}`, 10, 10 * 60_000).ok) return json({ ok: false, error: "rate_limited" }, 429);

  const parsed = completeSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ ok: false, error: "invalid", issues: parsed.error.flatten().fieldErrors }, 400);
  const input = parsed.data;

  const slot = schedule.find((s) => s.id === input.slotId)!;
  const session = nextOccurrence(slot, Date.now());
  const confirmation = { name: input.fullName.trim(), session: formatIST(session.startsAt) };
  const phoneE164 = toE164(input.phoneCode, input.phone);
  const redirectUrl = checkoutUrl({ name: input.fullName.trim(), email: input.email.trim(), phone: phoneE164 ?? "" });

  if (input.website) return json({ ok: true, redirectUrl, confirmation }); // honeypot

  const errors = serverFieldErrors({ ...input, heardOther: input.heardOther, consent: input.consent });
  if (Object.keys(errors).length) return json({ ok: false, error: "invalid", errors }, 400);

  const crmSlotId = (await getSeats())?.find((s) => s.slotId === slot.id)?.crmSlotId ?? slot.crmSlotId;
  const step1 = crmStep1Body({ fullName: input.fullName, email: input.email, phoneE164: phoneE164!, consent: true }, input.attribution, req, ip);
  const step2 = {
    step: 2,
    fullName: input.fullName.trim(),
    howDidYouHear: input.heard,
    howDidYouHearOther: input.heard === "OTHER" ? input.heardOther.trim() : null,
    issues: input.issues,
    issuesNote: composeIssuesNote(input.issuesText, input.medicalNote),
    consentToContact: true,
    sessionSlot: crmSlotId,
    sessionDate: session.istDate,
  };

  let leadId = input.leadId || null;
  let result = leadId ? await postLeadToCrm({ ...step2, leadId }) : null;
  if (!result || (!result.ok && result.status === 404)) {
    // No partial lead yet (or it's gone): create/re-register it, then complete it.
    const created = await postLeadToCrm(step1);
    leadId = created.ok ? (created.data.leadId ?? null) : null;
    result = created.ok && leadId ? await postLeadToCrm({ ...step2, leadId }) : created;
  }

  if (!result.ok) {
    await enqueueFailedSignup({
      kind: "complete",
      reason: `CRM ${result.status}: ${result.error}`,
      payload: { leadId, step1, step2 },
    });
  } else {
    invalidateSeats();
  }
  return json({ ok: true, redirectUrl, confirmation, saved: result.ok });
}
