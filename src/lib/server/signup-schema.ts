import { z } from "zod";
import { schedule, signup } from "@content/landing";
import { FIELD_ORDER, validateField, type SignupValues } from "@/lib/signup-validation";

const str = (max: number) => z.string().max(max).optional().default("");
const optStr = (max: number) => z.string().trim().max(max).optional().nullable().transform((v) => v || null);

/** First-touch attribution the browser captured (all optional). */
export const attributionSchema = z
  .object({
    utm_source: optStr(200),
    utm_medium: optStr(200),
    utm_campaign: optStr(300),
    utm_content: optStr(300),
    utm_term: optStr(300),
    fbclid: optStr(500),
    campaign_id: optStr(64),
    campaign_name: optStr(300),
    adset_id: optStr(64),
    adset_name: optStr(300),
    ad_id: optStr(64),
    ad_name: optStr(300),
    placement: optStr(100),
    fbp: optStr(200),
    fbc: optStr(700),
    landingUrl: optStr(2000),
    referrer: optStr(2000),
  })
  .partial()
  .default({});

export type Attribution = z.infer<typeof attributionSchema>;

const heardValues = signup.heardOptions.map((o) => o.value) as [string, ...string[]];
const issueValues = signup.issueOptions.map((o) => o.value) as [string, ...string[]];
const slotIds = schedule.map((s) => s.id) as [string, ...string[]];

/** Honeypot: a hidden "website" field real people never fill. */
const honeypot = z.string().max(500).optional().default("");

export const partialSchema = z.object({
  fullName: z.string().max(120),
  phoneCode: z.string().max(5).default("+91"),
  phone: z.string().max(25),
  email: z.string().max(254),
  website: honeypot,
  attribution: attributionSchema,
});

export const completeSchema = z.object({
  leadId: z.string().max(64).optional().nullable(),
  fullName: z.string().max(120),
  phoneCode: z.string().max(5).default("+91"),
  phone: z.string().max(25),
  email: z.string().max(254),
  slotId: z.enum(slotIds),
  heard: z.enum(heardValues),
  heardOther: str(200),
  issues: z.array(z.enum(issueValues)).max(issueValues.length).default([]),
  issuesText: str(2000),
  medicalNote: str(2000),
  consent: z.literal(true),
  website: honeypot,
  attribution: attributionSchema,
});

/** Run the same plain-word rules the browser uses. Returns field → message. */
export function serverFieldErrors(v: Partial<SignupValues>, fields = FIELD_ORDER) {
  const values: SignupValues = {
    fullName: "", phoneCode: "+91", phone: "", email: "", slotId: "", heard: "", heardOther: "", issues: [], issuesText: "", medicalNote: "", consent: false,
    ...v,
  };
  return Object.fromEntries(fields.map((f) => [f, validateField(f, values)]).filter(([, e]) => e));
}
