export type SeatState = "limited" | "closing" | "full";

/**
 * Seat info as served by this app's public /api/seats route. Only the wording state leaves the
 * server: the real counts stay private.
 */
export type SlotSeats = {
  /** Our slot id from content/landing.ts. */
  slotId: string;
  /** The CRM's slot id (the signup form sends this). */
  crmSlotId: string;
  /** IST date of the session, YYYY-MM-DD. */
  date: string;
  state: SeatState;
};

export type SeatsResponse = { available: true; slots: SlotSeats[] } | { available: false };

/**
 * Which wording a session gets. Without real CRM data it's always "limited":
 * "closing" and "full" are only ever shown when bookings actually say so.
 */
export function seatState(seats: { capacity: number; seatsLeft: number } | undefined, closingFastShareLeft: number): SeatState {
  if (!seats) return "limited";
  if (seats.seatsLeft <= 0) return "full";
  if (seats.capacity > 0 && seats.seatsLeft / seats.capacity <= closingFastShareLeft) return "closing";
  return "limited";
}

/** State for one of our slots from (possibly missing) seat data. */
export const stateOf = (seats: Record<string, SlotSeats> | null, slotId: string): SeatState => seats?.[slotId]?.state ?? "limited";
