"use client";

import { signup, urgency, hero } from "@content/landing";
import { formatIST } from "@/lib/schedule";
import { Countdown } from "./countdown";
import { SeatsLeft } from "./seats-left";
import { useSession } from "./session-context";

/** Placeholder signup card: session choice, countdown and seats. The form is built next. */
export function SignupPlaceholder() {
  const { sessions, seats, selectedSlotId, selectSlot } = useSession();

  return (
    <div className="on-light rounded-3xl bg-offwhite p-6 text-ink shadow-2xl shadow-black/30 sm:p-10">
      <fieldset>
        <legend className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-deep">{signup.chooseSlot}</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {sessions.map((s) => {
            const full = seats?.[s.slot.id]?.seatsLeft === 0;
            const checked = selectedSlotId === s.slot.id;
            return (
              <label
                key={s.slot.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-deep ${
                  checked ? "border-teal-deep bg-white" : "border-line-light bg-white/60 hover:border-ink-soft"
                } ${full ? "cursor-not-allowed opacity-60" : ""}`}
              >
                <input
                  type="radio"
                  name="session"
                  value={s.slot.id}
                  checked={checked}
                  disabled={full}
                  onChange={() => selectSlot(s.slot.id)}
                  className="mt-1 h-4 w-4 accent-[#1B6F6A]"
                />
                <span>
                  <span className="block font-medium">{formatIST(s.startsAt)}</span>
                  {full && <span className="mt-0.5 block text-sm text-ink-soft">{urgency.slotFullShort}</span>}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:items-end">
        <Countdown tone="light" label={hero.countdownLabel} />
        <SeatsLeft tone="light" />
      </div>

      <p className="mt-8 border-t border-line-light pt-6 text-sm text-ink-soft">{urgency.smallGroupLine}</p>

      <div className="mt-6 rounded-2xl border border-dashed border-ink-soft/40 bg-white/60 p-6 text-center">
        <p className="font-medium text-ink">{signup.placeholder}</p>
        <p className="mt-2 text-sm text-ink-soft">
          <span className="font-semibold text-ink">{signup.price}</span> · {signup.priceNote}
        </p>
      </div>
    </div>
  );
}
