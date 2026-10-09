import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildLeadEvent, hashEmail, hashPhone, sendLeadEvent } from "@/lib/server/meta-capi";

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

describe("Meta CAPI hashing", () => {
  it("email: trimmed + lowercased before SHA-256", () => expect(hashEmail("  Priya.Test@Example.COM ")).toBe(sha("priya.test@example.com")));
  it("phone: E.164 digits without +", () => expect(hashPhone("+919845067321")).toBe(sha("919845067321")));
});

describe("Lead event", () => {
  const input = { eventId: "evt-1", eventTime: new Date("2026-10-09T05:00:00Z"), sourceUrl: "https://masterclass.yuktiness.com/", email: "A@b.co", phoneE164: "+919811122334", fbp: "fb.1.1.2", fbc: "fb.1.3.abc", ip: "49.36.1.2", userAgent: "UA" };
  it("never contains raw email or phone, and carries the shared event_id, fbp and fbc", () => {
    const e = buildLeadEvent(input);
    const json = JSON.stringify(e);
    expect(json).not.toContain("A@b.co");
    expect(json).not.toContain("9811122334");
    expect(e).toMatchObject({ event_name: "Lead", event_id: "evt-1", event_time: 1791522000, action_source: "website", user_data: { fbp: "fb.1.1.2", fbc: "fb.1.3.abc" } });
  });

  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
    vi.restoreAllMocks();
  });
  it("is skipped silently when the env vars are missing", async () => {
    delete process.env.META_PIXEL_ID;
    delete process.env.META_CAPI_TOKEN;
    const spy = vi.spyOn(globalThis, "fetch");
    expect(await sendLeadEvent(input)).toBe("skipped");
    expect(spy).not.toHaveBeenCalled();
  });
  it("posts to the pixel's events endpoint when configured", async () => {
    process.env.META_PIXEL_ID = "123";
    process.env.META_CAPI_TOKEN = "tok";
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));
    expect(await sendLeadEvent(input)).toBe("sent");
    const [url, init] = spy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://graph.facebook.com/v21.0/123/events");
    expect(JSON.parse(init.body as string)).toMatchObject({ access_token: "tok", data: [{ event_id: "evt-1" }] });
  });
});
