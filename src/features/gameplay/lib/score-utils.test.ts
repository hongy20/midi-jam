import { describe, expect, it } from "vitest";

import { calculateMaxRawPoints } from "./score-utils";

describe("calculateMaxRawPoints", () => {
  it("calculates correctly for small note counts", () => {
    // 10 notes: 10 * 100 = 1000
    expect(calculateMaxRawPoints(10)).toBe(1000);
  });

  it("calculates correctly with combo multipliers", () => {
    // 25 notes:
    // 0-9: 10 * 100 = 1000
    // 10-19: 10 * (100 * 1.1) = 1100
    // 20-24: 5 * (100 * 1.2) = 600
    // Total: 2700
    expect(calculateMaxRawPoints(25)).toBe(2700);
  });

  it("handles empty songs", () => {
    expect(calculateMaxRawPoints(0)).toBe(0);
  });
});
