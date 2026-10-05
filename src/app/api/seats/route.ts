import { NextResponse } from "next/server";
import { schedule } from "@content/landing";
import { nextOccurrence } from "@/lib/schedule";
import type { SeatsResponse, SlotSeats } from "@/lib/seats";

export const dynamic = "force-dynamic";

const CACHE_MS = 30_000;
let cache: { at: number; body: SeatsResponse } | null = null;

type CrmSlot = { slotId: string; dayOfWeek: number; startTime: string; date: string; capacity: number; seatsLeft: number };

const isInt = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= 0;

function isCrmSlot(v: unknown): v is CrmSlot {
  if (!v || typeof v !== "object") return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.slotId === "string" &&
    isInt(s.dayOfWeek) &&
    typeof s.startTime === "string" &&
    typeof s.date === "string" &&
    isInt(s.capacity) &&
    isInt(s.seatsLeft) &&
    (s.seatsLeft as number) <= (s.capacity as number)
  );
}

/** Ask the CRM for real seat counts. Any problem → null (the page then hides the seat line). */
async function fetchFromCrm(): Promise<SlotSeats[] | null> {
  const base = process.env.CRM_API_URL;
  const key = process.env.CRM_API_KEY;
  if (!base || !key) return null;
  try {
    const res = await fetch(new URL("/api/public/seats", base), {
      headers: { "x-api-key": key },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const raw = (data as { slots?: unknown })?.slots;
    if (!Array.isArray(raw)) return null;

    const now = Date.now();
    const matched: SlotSeats[] = [];
    for (const slot of schedule) {
      const crm = raw.find(
        (s): s is CrmSlot => isCrmSlot(s) && s.dayOfWeek === slot.dayOfWeek && s.startTime === slot.startTime,
      );
      // Only trust counts that are for the same session date we're showing.
      if (crm && crm.date === nextOccurrence(slot, now).istDate) {
        matched.push({ slotId: slot.id, crmSlotId: crm.slotId, date: crm.date, capacity: crm.capacity, seatsLeft: crm.seatsLeft });
      }
    }
    return matched;
  } catch {
    return null;
  }
}

export async function GET() {
  const now = Date.now();
  if (!cache || now - cache.at >= CACHE_MS) {
    const slots = await fetchFromCrm();
    if (!slots) {
      // Don't cache failures, so we recover as soon as the CRM is back.
      return NextResponse.json({ available: false } satisfies SeatsResponse, { headers: { "Cache-Control": "no-store" } });
    }
    cache = { at: now, body: { available: true, slots } };
  }
  return NextResponse.json(cache.body, { headers: { "Cache-Control": "public, max-age=15, s-maxage=30" } });
}
