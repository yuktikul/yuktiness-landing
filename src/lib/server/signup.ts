import type { Attribution } from "./signup-schema";

/** CRM step-1 body: contact details + first-touch attribution + the visitor's IP / browser. */
export function crmStep1Body(
  contact: { fullName: string; email: string; phoneE164: string; consent?: boolean },
  attribution: Attribution,
  req: Request,
  ip: string,
) {
  return {
    step: 1,
    fullName: contact.fullName.trim(),
    email: contact.email.trim().toLowerCase(),
    phone: contact.phoneE164,
    ...(contact.consent ? { consentToContact: true } : {}),
    utmSource: attribution.utm_source,
    utmMedium: attribution.utm_medium,
    utmCampaign: attribution.utm_campaign,
    utmContent: attribution.utm_content,
    utmTerm: attribution.utm_term,
    metaCampaignId: attribution.campaign_id,
    metaCampaignName: attribution.campaign_name,
    metaAdsetId: attribution.adset_id,
    metaAdsetName: attribution.adset_name,
    metaAdId: attribution.ad_id,
    metaAdName: attribution.ad_name,
    metaPlacement: attribution.placement,
    fbclid: attribution.fbclid,
    fbp: attribution.fbp,
    fbc: attribution.fbc,
    landingUrl: attribution.landingUrl,
    referrer: attribution.referrer,
    ipAddress: ip === "unknown" ? null : ip,
    userAgent: req.headers.get("user-agent")?.slice(0, 1000) ?? null,
  };
}
