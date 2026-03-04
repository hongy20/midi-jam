import { describe, it, expect } from "vitest";
import { getVisibleMidiRange } from "./piano";
import { PIANO_88_KEY_MIN, PIANO_88_KEY_MAX, MIDI_NOTE_C4 } from "../midi/constant";

describe("getVisibleMidiRange", () => {
  it("should return range around C4 for empty notes with 3 white key buffer", () => {
    // C4 (60)
    // -1: B3 (59)
    // -2: A3 (57)
    // -3: G3 (55)
    // +1: D4 (62)
    // +2: E4 (64)
    // +3: F4 (65)
    const range = getVisibleMidiRange([]);
    expect(range).toEqual({ startNote: 55, endNote: 65 });
  });

  it("should always include C4 even if song is higher", () => {
    // Song uses C5 (72)
    // Range must include C4 (60) and C5 (72)
    // Start: C4 - 3 white keys = 55 (G3)
    // End: C5 + 3 white keys = 77 (F5)
    const range = getVisibleMidiRange([72]); 
    expect(range).toEqual({ startNote: 55, endNote: 77 });
  });

  it("should add 3 white keys buffer to song notes", () => {
    // Song uses C4 (60)
    const range = getVisibleMidiRange([60]); 
    expect(range).toEqual({ startNote: 55, endNote: 65 });
  });

  it("should clamp to PIANO_88_KEY_MIN and PIANO_88_KEY_MAX", () => {
    const range = getVisibleMidiRange([21, 108]); 
    expect(range).toEqual({ startNote: 21, endNote: 108 });
  });
});
