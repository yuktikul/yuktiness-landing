"use client";

import { schedule, urgency } from "@content/landing";
import { useSession } from "./session-context";

const fill = (template: string, seats: number, slot: string) =>
  template.replace("{seats}", String(seats)).replace("{slot}", slot);

/**
 * Real seat counts from the CRM, one line per slot. Renders nothing while loading
 * or if the CRM can't be reached: we never show an invented number.
 */
export function SeatsLeft({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { seats } = useSession();
  if (!seats) return null;
  const rows = schedule.filter((s) => seats[s.id]);
  if (rows.length === 0) return null;
  const dark = tone === "dark";

  return (
    <ul className="space-y-3" aria-live="polite">
      {rows.map((slot) => {
        const { seatsLeft, capacity } = seats[slot.id];
        const full = seatsLeft === 0;
        const veryFew = !full && seatsLeft <= urgency.veryFewThreshold;
        const text = full
          ? fill(urgency.seatsFull, 0, slot.label)
          : fill(veryFew ? urgency.seatsVeryFew : urgency.seatsLeft, seatsLeft, slot.label);
        const taken = capacity > 0 ? Math.round(((capacity - seatsLeft) / capacity) * 100) : 100;
        return (
          <li key={slot.id}>
            <p className={`text-sm ${veryFew || full ? "font-semibold" : "font-medium"} ${dark ? "text-offwhite" : "text-ink"}`}>
              {text}
            </p>
            <div
              className={`mt-1.5 h-1 w-full max-w-xs overflow-hidden rounded-full ${dark ? "bg-line-dark" : "bg-line-light"}`}
              role="presentation"
            >
              <div className="h-full rounded-full bg-amber" style={{ width: `${taken}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
