import { describe, expect, it } from "vitest";
import { calculateMaxPossibleScore } from "./score-utils";

describe("calculateMaxPossibleScore", () => {
  it("calculates correctly for small note counts", () => {
    // 10 notes: 10 * 100 = 1000
    expect(calculateMaxPossibleScore(10)).toBe(1000);
  });

  it("calculates correctly with combo multipliers", () => {
    // 25 notes:
    // 0-9: 10 * 100 = 1000
    // 10-19: 10 * (100 * 1.1) = 1100
    // 20-24: 5 * (100 * 1.2) = 600
    // Total: 2700
    expect(calculateMaxPossibleScore(25)).toBe(2700);
  });

  it("handles empty songs", () => {
    expect(calculateMaxPossibleScore(0)).toBe(0);
  });
});
