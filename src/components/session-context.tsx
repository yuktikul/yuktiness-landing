"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { schedule } from "@content/landing";
import { upcomingSessions, type UpcomingSession } from "@/lib/schedule";
import type { SeatsResponse, SlotSeats } from "@/lib/seats";
import { useNow } from "@/lib/use-now";

type SessionState = {
  /** Current time: the live client clock, or the server's timestamp before hydration. */
  now: number;
  /** Next occurrence of each slot, soonest first. */
  sessions: UpcomingSession[];
  /** Seat counts by our slot id; null while loading or if the CRM can't be reached. */
  seats: Record<string, SlotSeats> | null;
  selectedSlotId: string;
  selectSlot: (id: string) => void;
};

const SessionContext = createContext<SessionState | null>(null);

const SEATS_REFRESH_MS = 60_000;

export function SessionProvider({ initialNow, children }: { initialNow: number; children: ReactNode }) {
  const clock = useNow();
  const now = clock ?? initialNow;
  const sessions = useMemo(() => upcomingSessions(schedule, now), [now]);

  const [seats, setSeats] = useState<Record<string, SlotSeats> | null>(null);
  const [chosenSlotId, setChosenSlotId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/seats");
        const data = (await res.json()) as SeatsResponse;
        if (cancelled) return;
        setSeats(data.available ? Object.fromEntries(data.slots.map((s) => [s.slotId, s])) : null);
      } catch {
        if (!cancelled) setSeats(null);
      }
    }
    load();
    const id = setInterval(load, SEATS_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Seat data is only valid for the session date it was counted for.
  const currentSeats = useMemo(() => {
    if (!seats) return null;
    const valid: Record<string, SlotSeats> = {};
    for (const s of sessions) {
      const entry = seats[s.slot.id];
      if (entry && entry.date === s.istDate) valid[s.slot.id] = entry;
    }
    return valid;
  }, [seats, sessions]);

  // Default: the soonest session that isn't full. A visitor's own choice wins unless it fills up.
  const isFull = (id: string) => currentSeats?.[id]?.state === "full";
  const fallback = sessions.find((s) => !isFull(s.slot.id))?.slot.id ?? sessions[0].slot.id;
  const selectedSlotId = chosenSlotId && !isFull(chosenSlotId) ? chosenSlotId : fallback;

  const value: SessionState = { now, sessions, seats: currentSeats, selectedSlotId, selectSlot: setChosenSlotId };
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
