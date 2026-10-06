import { describe, expect, it } from "vitest";
import { urgency } from "@content/landing";
import { seatState } from "@/lib/seats";

const share = urgency.closingFastShareLeft;

describe("seatState", () => {
  it("says 'limited' when there is no CRM data", () => expect(seatState(undefined, share)).toBe("limited"));
  it("says 'limited' while plenty of seats remain", () => expect(seatState({ capacity: 40, seatsLeft: 30 }, share)).toBe("limited"));
  it("says 'closing' only at or below the real threshold", () => {
    expect(seatState({ capacity: 40, seatsLeft: 13 }, 0.3)).toBe("limited");
    expect(seatState({ capacity: 40, seatsLeft: 12 }, 0.3)).toBe("closing");
    expect(seatState({ capacity: 40, seatsLeft: 1 }, 0.3)).toBe("closing");
  });
  it("says 'full' at zero", () => expect(seatState({ capacity: 40, seatsLeft: 0 }, share)).toBe("full"));
});
