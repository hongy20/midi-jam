import { describe, it, expect } from "vitest";
import {
  speedToDifficulty,
  difficultyToSpeed,
  getDifficultyLabel,
  SPEED_EASY,
  SPEED_NORMAL,
  SPEED_HARD,
} from "./difficulty";

describe("difficulty lib", () => {
  it("maps speed to difficulty correctly", () => {
    expect(speedToDifficulty(SPEED_EASY)).toBe("easy");
    expect(speedToDifficulty(SPEED_NORMAL)).toBe("normal");
    expect(speedToDifficulty(SPEED_HARD)).toBe("hard");
  });

  it("maps difficulty to speed correctly", () => {
    expect(difficultyToSpeed("easy")).toBe(SPEED_EASY);
    expect(difficultyToSpeed("normal")).toBe(SPEED_NORMAL);
    expect(difficultyToSpeed("hard")).toBe(SPEED_HARD);
  });

  it("returns correct labels", () => {
    expect(getDifficultyLabel("easy")).toContain(`${SPEED_EASY}x`);
    expect(getDifficultyLabel("normal")).toContain(`${SPEED_NORMAL}x`);
    expect(getDifficultyLabel("hard")).toContain(`${SPEED_HARD}x`);
  });
});
