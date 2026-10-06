import { signup } from "@content/landing";

/** Shared by the browser (inline errors) and the server (final check). Plain-word messages. */

export type SignupValues = {
  fullName: string;
  phoneCode: string;
  phone: string;
  email: string;
  slotId: string;
  heard: string;
  heardOther: string;
  issues: string[];
  issuesText: string;
  medicalNote: string;
  consent: boolean;
};

export type FieldName = "fullName" | "phone" | "email" | "slotId" | "heard" | "heardOther" | "consent";

const E = signup.errors;

/** Digits of the national number, with common Indian prefixes (0, 91) removed. */
export function cleanNational(code: string, raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (code === "+91") {
    if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
    if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  }
  return d;
}

/** "+91" + "98765 43210" → "+919876543210" (null if invalid). */
export function toE164(code: string, raw: string): string | null {
  const c = code.trim().replace(/[^\d+]/g, "");
  if (!/^\+\d{1,3}$/.test(c)) return null;
  const d = cleanNational(c, raw);
  if (c === "+91") return /^[6-9]\d{9}$/.test(d) ? c + d : null;
  return /^\d{6,14}$/.test(d) ? c + d : null;
}

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(v.trim()) && v.trim().length <= 254;

export function validateField(field: FieldName, v: SignupValues): string | null {
  switch (field) {
    case "fullName": {
      const n = v.fullName.trim();
      return n.length >= 2 && n.length <= 120 && /\p{L}/u.test(n) ? null : E.name;
    }
    case "phone":
      if (!/^\+\d{1,3}$/.test(v.phoneCode.trim())) return E.phoneCode;
      return toE164(v.phoneCode, v.phone) ? null : v.phoneCode.trim() === "+91" ? E.phoneIndia : E.phoneOther;
    case "email":
      return isValidEmail(v.email) ? null : E.email;
    case "slotId":
      return v.slotId ? null : E.session;
    case "heard":
      return v.heard ? null : E.heard;
    case "heardOther":
      return v.heard !== "OTHER" || v.heardOther.trim() ? null : E.heardOther;
    case "consent":
      return v.consent ? null : E.consent;
  }
}

export const FIELD_ORDER: FieldName[] = ["fullName", "phone", "email", "slotId", "heard", "heardOther", "consent"];

export function validateAll(v: SignupValues): Partial<Record<FieldName, string>> {
  const out: Partial<Record<FieldName, string>> = {};
  for (const f of FIELD_ORDER) {
    const e = validateField(f, v);
    if (e) out[f] = e;
  }
  return out;
}

/** Name, phone and email are all valid, so a partial lead can be saved. */
export const contactReady = (v: SignupValues) => !validateField("fullName", v) && !validateField("phone", v) && !validateField("email", v);

/** Combine the optional notes into the CRM's issuesNote, prefixed so staff can spot health info. */
export function composeIssuesNote(issuesText: string, medicalNote: string): string | null {
  const parts = [];
  if (issuesText.trim()) parts.push(`What they're working on: ${issuesText.trim()}`);
  if (medicalNote.trim()) parts.push(`HEALTH NOTE (medical condition / pregnancy): ${medicalNote.trim()}`);
  return parts.length ? parts.join("\n\n") : null;
}
