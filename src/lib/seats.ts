/** Seat data as served by this app's /api/seats route (already matched to our schedule). */
export type SlotSeats = {
  /** Our slot id from content/landing.ts. */
  slotId: string;
  /** The CRM's slot id (the signup form will send this). */
  crmSlotId: string;
  /** IST date of the session these seats are for, YYYY-MM-DD. */
  date: string;
  capacity: number;
  seatsLeft: number;
};

export type SeatsResponse = { available: true; slots: SlotSeats[] } | { available: false };

export type SeatState = "limited" | "closing" | "full";

/**
 * Which wording a session gets. Without real CRM data it's always "limited":
 * "closing" and "full" are only ever shown when bookings actually say so.
 */
export function seatState(seats: Pick<SlotSeats, "capacity" | "seatsLeft"> | undefined, closingFastShareLeft: number): SeatState {
  if (!seats) return "limited";
  if (seats.seatsLeft <= 0) return "full";
  if (seats.capacity > 0 && seats.seatsLeft / seats.capacity <= closingFastShareLeft) return "closing";
  return "limited";
}
