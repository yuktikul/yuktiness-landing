"use client";

import { urgency } from "@content/landing";
import { countdownParts, formatIST } from "@/lib/schedule";
import { useSession } from "./session-context";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Counts down to the real start of the next upcoming session (from the IST
 * schedule). Rolls to the following session automatically at zero.
 */
export function Countdown({
  tone = "dark",
  label,
  compact = false,
}: {
  tone?: "dark" | "light";
  label?: string;
  compact?: boolean;
}) {
  const { now, sessions } = useSession();
  const next = sessions[0];
  const { days, hours, minutes, seconds } = countdownParts(next.startsAt.getTime() - now);
  const accessibleTime = `${days} days ${hours} hours ${minutes} minutes until ${formatIST(next.startsAt)}`;

  if (compact) {
    return (
      <span className="font-sans text-xs font-medium tabular-nums text-mist" aria-label={accessibleTime}>
        <span aria-hidden="true">
          {days}d {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
        </span>
      </span>
    );
  }

  const units = [
    [days, urgency.countdownUnits.days],
    [hours, urgency.countdownUnits.hours],
    [minutes, urgency.countdownUnits.minutes],
    [seconds, urgency.countdownUnits.seconds],
  ] as const;

  const dark = tone === "dark";
  return (
    <div>
      {label && (
        <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${dark ? "text-teal" : "text-teal-deep"}`}>
          {label}
        </p>
      )}
      {/* Screen readers get one stable sentence instead of a value changing every second. */}
      <p className="sr-only">{accessibleTime}</p>
      <div className="flex gap-2 sm:gap-3" aria-hidden="true">
        {units.map(([value, unit]) => (
          <div
            key={unit}
            className={`flex w-16 flex-col items-center rounded-xl border py-2.5 sm:w-20 sm:py-3 ${
              dark ? "border-line-dark bg-midnight-2" : "border-line-light bg-white"
            }`}
          >
            <span className={`font-serif text-3xl font-semibold tabular-nums leading-none sm:text-4xl ${dark ? "text-offwhite" : "text-ink"}`}>
              {pad(value)}
            </span>
            <span className={`mt-1.5 text-[0.65rem] font-medium uppercase tracking-wider ${dark ? "text-mist" : "text-ink-soft"}`}>
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
