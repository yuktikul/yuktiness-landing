import { describe, expect, it } from "vitest";
import { schedule } from "@content/landing";
import { countdownParts, formatIST, nextOccurrence, upcomingSessions } from "@/lib/schedule";

const ist = (s: string) => new Date(`${s}+05:30`).getTime();
const [wed7pm, sun11am] = schedule;

describe("schedule", () => {
  it("content has exactly Wednesday 7 PM and Sunday 11 AM IST", () => {
    expect(schedule.map((s) => [s.dayOfWeek, s.startTime])).toEqual([
      [3, "19:00"],
      [0, "11:00"],
    ]);
  });

  it("formats the next date in IST", () => {
    // Monday 5 Oct 2026
    expect(formatIST(nextOccurrence(wed7pm, ist("2026-10-05T10:00:00")).startsAt)).toBe("Wednesday 7 Oct, 7:00 PM IST");
    expect(formatIST(nextOccurrence(sun11am, ist("2026-10-05T10:00:00")).startsAt)).toBe("Sunday 11 Oct, 11:00 AM IST");
  });

  it("rolls to next week once a session has started", () => {
    expect(nextOccurrence(sun11am, ist("2026-10-11T11:00:00")).istDate).toBe("2026-10-18");
    expect(nextOccurrence(wed7pm, ist("2026-10-07T18:59:59")).istDate).toBe("2026-10-07");
  });

  it("uses the IST calendar day near UTC midnight", () => {
    // 20:00 UTC Saturday = 01:30 IST Sunday
    expect(nextOccurrence(sun11am, Date.parse("2026-10-10T20:00:00Z")).istDate).toBe("2026-10-11");
  });

  it("countdown targets the soonest session and rolls over at zero", () => {
    expect(upcomingSessions(schedule, ist("2026-10-07T18:59:59"))[0].slot.id).toBe("wed-1900");
    const afterWed = upcomingSessions(schedule, ist("2026-10-07T19:00:00"));
    expect(formatIST(afterWed[0].startsAt)).toBe("Sunday 11 Oct, 11:00 AM IST");
    const afterSun = upcomingSessions(schedule, ist("2026-10-11T11:00:00"));
    expect(formatIST(afterSun[0].startsAt)).toBe("Wednesday 14 Oct, 7:00 PM IST");
  });

  it("splits a duration into parts", () => {
    expect(countdownParts(((1 * 24 + 2) * 3600 + 3 * 60 + 4) * 1000)).toEqual({ days: 1, hours: 2, minutes: 3, seconds: 4 });
    expect(countdownParts(-5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});
