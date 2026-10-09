import { schedule } from "@content/landing";
import { nextOccurrence } from "@/lib/schedule";
import { urgency } from "@content/landing";
import { seatState, type SlotSeats } from "@/lib/seats";

const CACHE_MS = 30_000;
let cache: { at: number; slots: SlotSeats[] } | null = null;

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
    const raw = ((await res.json()) as { slots?: unknown })?.slots;
    if (!Array.isArray(raw)) return null;
    const now = Date.now();
    const matched: SlotSeats[] = [];
    for (const slot of schedule) {
      const crm = raw.find((s): s is CrmSlot => isCrmSlot(s) && s.dayOfWeek === slot.dayOfWeek && s.startTime === slot.startTime);
      // Only trust counts for the same session date we're showing.
      if (crm && crm.date === nextOccurrence(slot, now).istDate) {
        matched.push({ slotId: slot.id, crmSlotId: crm.slotId, date: crm.date, state: seatState(crm, urgency.closingFastShareLeft) });
      }
    }
    return matched;
  } catch {
    return null;
  }
}

/** Real seat data from the CRM, cached 30s. null if the CRM can't be reached (failures aren't cached). */
export async function getSeats(): Promise<SlotSeats[] | null> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) return cache.slots;
  const slots = await fetchFromCrm();
  if (slots) cache = { at: now, slots };
  return slots;
}

/** Drop the cache so the next read reflects a signup that just happened. */
export function invalidateSeats() {
  cache = null;
}
