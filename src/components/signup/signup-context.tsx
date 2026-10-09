"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getAttributionForSubmit, getConsent } from "@/lib/attribution";
import { trackLead } from "../meta-pixel";
import { contactReady, FIELD_ORDER, validateAll, validateField, type FieldName, type SignupValues } from "@/lib/signup-validation";
import { useSession } from "../session-context";

type Status = "idle" | "submitting" | "done";
type Confirmation = { name: string; session: string };
type EditableValues = Omit<SignupValues, "slotId">;

type SignupState = {
  values: SignupValues;
  set: <K extends keyof EditableValues>(field: K, value: EditableValues[K]) => void;
  setSlot: (id: string) => void;
  touch: (field: FieldName) => void;
  errorFor: (field: FieldName) => string | null;
  /** Call on blur of name / phone / email: saves a partial lead once all three are valid. */
  saveContactIfReady: () => void;
  submit: (idPrefix: string) => Promise<void>;
  status: Status;
  confirmation: Confirmation | null;
  /** Announced to screen readers after a failed submit. */
  announcement: string;
  sheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
};

const SignupContext = createContext<SignupState | null>(null);

const initial: EditableValues = {
  fullName: "",
  phoneCode: "+91",
  phone: "",
  email: "",
  heard: "",
  heardOther: "",
  issues: [],
  issuesText: "",
  medicalNote: "",
  consent: false,
};

async function postJson(url: string, body: unknown, timeoutMs: number) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

export function SignupProvider({ checkoutUrl, summaryError, children }: { checkoutUrl: string | null; summaryError: string; children: ReactNode }) {
  const { selectedSlotId, selectSlot } = useSession();
  const [form, setForm] = useState<EditableValues>(initial);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const leadId = useRef<string | null>(null);
  const savedKey = useRef<string>("");

  const values: SignupValues = useMemo(() => ({ ...form, slotId: selectedSlotId }), [form, selectedSlotId]);

  // Coming back from the checkout with the browser's Back button: let them submit again.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => e.persisted && setStatus("idle");
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const set: SignupState["set"] = useCallback((field, value) => setForm((f) => ({ ...f, [field]: value })), []);
  const touch = useCallback((field: FieldName) => setTouched((t) => (t[field] ? t : { ...t, [field]: true })), []);
  const errorFor = (field: FieldName) => (touched[field] || submitted ? validateField(field, values) : null);

  const saveContactIfReady = () => {
    if (!contactReady(values)) return;
    const key = [values.fullName.trim(), values.phoneCode, values.phone.replace(/\D/g, ""), values.email.trim().toLowerCase()].join("|");
    if (key === savedKey.current) return;
    savedKey.current = key;
    postJson(
      "/api/signup/partial",
      { fullName: values.fullName, phoneCode: values.phoneCode, phone: values.phone, email: values.email, website: honeypotValue(), attribution: getAttributionForSubmit() },
      8000,
    )
      .then(({ data }) => {
        if (data?.leadId) leadId.current = data.leadId;
      })
      .catch(() => {
        savedKey.current = ""; // try again on the next blur
      });
  };

  const submit = async (idPrefix: string) => {
    if (status === "submitting") return;
    setSubmitted(true);
    const errors = validateAll(values);
    const first = FIELD_ORDER.find((f) => errors[f]);
    if (first) {
      setAnnouncement(summaryError);
      document.getElementById(`${idPrefix}-${first}`)?.focus();
      return;
    }
    setAnnouncement("");
    setStatus("submitting");
    try {
      const { status: code, data } = await postJson(
        "/api/signup/complete",
        { ...values, leadId: leadId.current, website: honeypotValue(), attribution: getAttributionForSubmit(), marketingConsent: getConsent() ?? "pending" },
        10000,
      );
      if (code === 400 && data?.errors) {
        setStatus("idle");
        setAnnouncement(summaryError);
        return;
      }
      if (data?.redirectUrl) {
        // Browser Pixel "Lead" (same event id as the server's Conversions API event), then go.
        const tracked = data.eventId ? trackLead(data.eventId) : false;
        setTimeout(() => window.location.assign(data.redirectUrl), tracked ? 250 : 0);
        return; // keep the spinner while the checkout loads
      }
      if (data?.eventId) trackLead(data.eventId);
      setConfirmation(data?.confirmation ?? { name: values.fullName, session: "" });
      setStatus("done");
    } catch {
      // Our own server didn't answer. The partial lead is usually saved already; don't block them.
      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }
      setConfirmation({ name: values.fullName, session: "" });
      setStatus("done");
    }
  };

  const value: SignupState = {
    values,
    set,
    setSlot: selectSlot,
    touch,
    errorFor,
    saveContactIfReady,
    submit,
    status,
    confirmation,
    announcement,
    sheetOpen,
    openSheet: () => setSheetOpen(true),
    closeSheet: () => setSheetOpen(false),
  };
  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

/** Read the honeypot from whichever form instance is on the page. */
function honeypotValue(): string {
  let v = "";
  document.querySelectorAll<HTMLInputElement>('input[name="website"]').forEach((el) => (v ||= el.value));
  return v;
}

export function useSignup(): SignupState {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error("useSignup must be used inside <SignupProvider>");
  return ctx;
}
