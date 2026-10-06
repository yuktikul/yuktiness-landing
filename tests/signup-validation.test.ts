import { afterEach, describe, expect, it } from "vitest";
import { composeIssuesNote, contactReady, toE164, validateAll, validateField, type SignupValues } from "@/lib/signup-validation";
import { checkoutUrl } from "@/lib/server/checkout";

const base: SignupValues = {
  fullName: "Shalini Bansal", phoneCode: "+91", phone: "98111 22334", email: "shalini@example.in", slotId: "wed-1900",
  heard: "INSTAGRAM", heardOther: "", issues: [], issuesText: "", medicalNote: "", consent: true,
};

describe("phone", () => {
  it.each([
    ["98111 22334", "+919811122334"],
    ["098111-22334", "+919811122334"],
    ["919811122334", "+919811122334"],
  ])("India %s → %s", (raw, e164) => expect(toE164("+91", raw)).toBe(e164));
  it.each(["12345", "5811122334", "98111 2233"])("rejects Indian %s", (raw) => expect(toE164("+91", raw)).toBeNull());
  it("accepts other country codes", () => expect(toE164("+971", "50 123 4567")).toBe("+971501234567"));
  it("plain-word error for India", () => expect(validateField("phone", { ...base, phone: "123" })).toMatch(/10-digit WhatsApp/));
});

describe("form rules", () => {
  it("a complete, valid form has no errors", () => expect(validateAll(base)).toEqual({}));
  it("requires consent, heard-from, and the Other text when Other is chosen", () => {
    const e = validateAll({ ...base, consent: false, heard: "OTHER" });
    expect(Object.keys(e).sort()).toEqual(["consent", "heardOther"]);
    expect(validateAll({ ...base, heard: "" }).heard).toBeTruthy();
  });
  it("email check", () => {
    expect(validateField("email", { ...base, email: "name@gmail" })).toBeTruthy();
    expect(validateField("email", { ...base, email: "name@gmail.com" })).toBeNull();
  });
  it("partial save needs name, phone and email to be valid", () => {
    expect(contactReady(base)).toBe(true);
    expect(contactReady({ ...base, email: "x" })).toBe(false);
  });
});

describe("composeIssuesNote", () => {
  it("prefixes the health note so staff can see it", () => {
    expect(composeIssuesNote("Sleep", "Pregnant, 5 months")).toBe(
      "What they're working on: Sleep\n\nHEALTH NOTE (medical condition / pregnancy): Pregnant, 5 months",
    );
    expect(composeIssuesNote(" ", "")).toBeNull();
  });
});

describe("checkoutUrl", () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
  });
  const URL_ = "https://wahacademy.yuktiness.com/web/checkout/6a719e2e03959b96644a66dc?purchaseNow=true";
  it("plain URL by default", () => {
    process.env.CHECKOUT_URL = URL_;
    delete process.env.CHECKOUT_PREFILL_PARAMS;
    expect(checkoutUrl({ name: "A", email: "a@b.co", phone: "+91" })).toBe(URL_);
  });
  it("appends mapped prefill params when configured", () => {
    process.env.CHECKOUT_URL = URL_;
    process.env.CHECKOUT_PREFILL_PARAMS = "name=name,email=email,phone=phone";
    const u = new URL(checkoutUrl({ name: "Shalini B", email: "s@x.in", phone: "+919811122334" })!);
    expect(u.searchParams.get("purchaseNow")).toBe("true");
    expect(u.searchParams.get("email")).toBe("s@x.in");
    expect(u.searchParams.get("phone")).toBe("+919811122334");
  });
  it("null when not configured", () => {
    process.env.CHECKOUT_URL = "";
    expect(checkoutUrl()).toBeNull();
  });
});
