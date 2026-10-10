"use client";

import { formatIST } from "@/lib/schedule";
import { useSession } from "./session-context";

/** The next session's date, in IST. */
export function SessionDates({ tone = "dark", inline = false }: { tone?: "dark" | "light"; inline?: boolean }) {
  const { next } = useSession();
  const dark = tone === "dark";
  if (inline) return <span className="font-semibold">{formatIST(next.startsAt)}</span>;

  return (
    <ul className="space-y-3">
      {[next].map((s) => (
        <li key={s.slot.id} className="flex items-center gap-3">
          <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${dark ? "bg-teal" : "bg-teal-deep"}`} />
          <p className={`font-medium ${dark ? "text-offwhite" : "text-ink"}`}>{formatIST(s.startsAt)}</p>
        </li>
      ))}
    </ul>
  );
}
