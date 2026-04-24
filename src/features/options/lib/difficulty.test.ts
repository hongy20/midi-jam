import { describe, it, expect } from "vitest";
import { speedToDifficulty, difficultyToSpeed, getDifficultyLabel } from "./difficulty";

describe("difficulty lib", () => {
  it("maps speed to difficulty correctly", () => {
    expect(speedToDifficulty(0.5)).toBe("easy");
    expect(speedToDifficulty(1.0)).toBe("normal");
    expect(speedToDifficulty(2.0)).toBe("hard");
  });

  it("maps difficulty to speed correctly", () => {
    expect(difficultyToSpeed("easy")).toBe(0.5);
    expect(difficultyToSpeed("normal")).toBe(1.0);
    expect(difficultyToSpeed("hard")).toBe(2.0);
  });

  it("returns correct labels", () => {
    expect(getDifficultyLabel("easy")).toContain("0.5x");
    expect(getDifficultyLabel("normal")).toContain("1.0x");
    expect(getDifficultyLabel("hard")).toContain("2.0x");
  });
});
