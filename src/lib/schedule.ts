import type { SessionSlot } from "@content/landing";

/** IST is UTC+05:30 all year (no daylight saving). */
const IST_OFFSET_MS = 330 * 60_000;

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type UpcomingSession = {
  slot: SessionSlot;
  /** Real start instant. */
  startsAt: Date;
  /** IST calendar date, YYYY-MM-DD. */
  istDate: string;
};

function parseTime(startTime: string) {
  const [h, m] = startTime.split(":").map(Number);
  return { h, m };
}

/**
 * Next start of a weekly slot, in IST. Today's session counts until the moment it starts.
 */
export function nextOccurrence(slot: SessionSlot, now: number): UpcomingSession {
  const { h, m } = parseTime(slot.startTime);
  const ist = new Date(now + IST_OFFSET_MS);
  const y = ist.getUTCFullYear();
  const mo = ist.getUTCMonth();
  const d = ist.getUTCDate();
  let ahead = (slot.dayOfWeek - ist.getUTCDay() + 7) % 7;
  let start = Date.UTC(y, mo, d + ahead, h, m) - IST_OFFSET_MS;
  if (start <= now) {
    ahead += 7;
    start = Date.UTC(y, mo, d + ahead, h, m) - IST_OFFSET_MS;
  }
  const istDate = new Date(Date.UTC(y, mo, d + ahead)).toISOString().slice(0, 10);
  return { slot, startsAt: new Date(start), istDate };
}

/** Next occurrence of every slot, soonest first. */
export function upcomingSessions(slots: SessionSlot[], now: number): UpcomingSession[] {
  return slots.map((s) => nextOccurrence(s, now)).sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

/** e.g. "Wednesday 7 Oct, 7:00 PM IST". Deterministic on server and client. */
export function formatIST(date: Date): string {
  const ist = new Date(date.getTime() + IST_OFFSET_MS);
  const h24 = ist.getUTCHours();
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const mins = String(ist.getUTCMinutes()).padStart(2, "0");
  const period = h24 < 12 ? "AM" : "PM";
  return `${WEEKDAYS[ist.getUTCDay()]} ${ist.getUTCDate()} ${MONTHS[ist.getUTCMonth()]}, ${h12}:${mins} ${period} IST`;
}

/** Split a duration into countdown parts. */
export function countdownParts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
