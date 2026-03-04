import { describe, it, expect } from "vitest";
import { getVisibleMidiRange } from "./piano";
import { PIANO_88_KEY_MIN, PIANO_88_KEY_MAX } from "../midi/constant";

describe("getVisibleMidiRange", () => {
  it("should return range around C4 with symmetric 3 white key buffer", () => {
    // C4 (60)
    // Left: B3, A3, G3 (3 keys)
    // Right: D4, E4, F4 (3 keys)
    const range = getVisibleMidiRange([]);
    expect(range).toEqual({ startNote: 55, endNote: 65 });
  });

  it("should maintain symmetry near edges of the 88-key piano", () => {
    // PIANO_88_KEY_MIN is 21 (A0)
    // 23 is B0. Only 1 white key (A0) is available on the left.
    // So buffer should be capped at 1 for both sides.
    const range = getVisibleMidiRange([23]); 
    // Song min: 21 (since A0 is included) or 23?
    // Wait, allNotes will be [23, 60]. Min is 23? No, min is 23.
    // Actually, min is 23, but if it was 22 (Bb0)...
    // If min is 22 (Bb0). 1 white key left (A0).
    // Buffer = min(3, 1, many) = 1.
    // 22 - 1 white key = 21 (A0).
    // Max of [22, 60] is 60.
    // 60 + 1 white key = 62 (D4).
    const edgeRange = getVisibleMidiRange([22]);
    expect(edgeRange).toEqual({ startNote: 21, endNote: 62 });
  });

  it("should return full range if song covers most of the piano", () => {
    const range = getVisibleMidiRange([21, 108]); 
    expect(range).toEqual({ startNote: 21, endNote: 108 });
  });
});
