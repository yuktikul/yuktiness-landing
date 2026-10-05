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
