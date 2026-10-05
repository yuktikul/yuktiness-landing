"use client";

import { urgency } from "@content/landing";
import { formatIST, formatLocal } from "@/lib/schedule";
import { useNow } from "@/lib/use-now";
import { useSession } from "./session-context";

/** The next date of every slot in IST, with the visitor's local time underneath. */
export function SessionDates({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { sessions } = useSession();
  const hydrated = useNow() !== null;
  const dark = tone === "dark";

  return (
    <ul className="space-y-3">
      {sessions.map((s) => {
        const local = hydrated ? formatLocal(s.startsAt) : null;
        return (
          <li key={s.slot.id} className="flex items-start gap-3">
            <span aria-hidden="true" className={`mt-2 h-2 w-2 shrink-0 rounded-full ${dark ? "bg-teal" : "bg-teal-deep"}`} />
            <div>
              <p className={`font-medium ${dark ? "text-offwhite" : "text-ink"}`}>{formatIST(s.startsAt)}</p>
              {/* Reserve the line height so nothing shifts when the local time appears. */}
              <p className={`min-h-[1.25rem] text-xs ${dark ? "text-mist" : "text-ink-soft"}`}>
                {local && (local.isIST ? urgency.sameAsLocal : `${urgency.localTimePrefix} ${local.text}`)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
