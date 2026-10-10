"use client";

import { urgency } from "@content/landing";
import { stateOf } from "@/lib/seats";
import { useSession } from "./session-context";

/**
 * One line for the next session: "Limited seats", "Seats closing fast" or "This session is full".
 * No numbers are shown. "Closing fast" and "full" appear only when the CRM's real
 * bookings say so; without CRM data the line stays at "Limited seats".
 */
export function SeatsLeft({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { next, seats } = useSession();
  const dark = tone === "dark";

  const text = { limited: urgency.seatsLimited, closing: urgency.seatsClosingFast, full: urgency.seatsFull };

  return (
    <ul className="space-y-2" aria-live="polite">
      {[next].map(({ slot }) => {
        const state = stateOf(seats, slot.id);
        return (
          <li key={slot.id} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className={`h-2 w-2 shrink-0 rounded-full ${state === "full" ? (dark ? "bg-mist" : "bg-ink-soft") : "bg-amber"}`}
            />
            <p className={`text-sm ${state === "limited" ? "font-medium" : "font-semibold"} ${dark ? "text-offwhite" : "text-ink"}`}>
              {text[state].replace("{slot}", slot.label)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
