import { describe, expect, it } from "vitest";

import { getVisibleMidiRange } from "./utils";

describe("getVisibleMidiRange", () => {
  it("should return range around C4 with natural group expansion", () => {
    // C4 (60)
    // 3 white keys buffer:
    // Left: 60 (C) -> 59 (B) -> 57 (A) -> 55 (G). (startNote: 55)
    // Right: 60 (C) -> 62 (D) -> 64 (E) -> 65 (F). (endNote: 65)
    //
    // Align left (55): 55 % 12 is 7 (G). Nearest left C/F is 53 (F).
    // Align right (65): 65 % 12 is 5 (F). Nearest right E/B is 71 (B)?
    // Wait, endNote 65 is F. Smallest endNote >= 65 is 71 (B).
    // Let's re-verify the right alignment:
    // If endNote starts at 65 (F). Is it >= 65? Yes. Is it E or B? No.
    // 66 (F#) No, 67 (G) No, 68 (G#) No, 69 (A) No, 70 (A#) No, 71 (B) Yes.
    // So 71 (B) is the end.
    // Wait, let's check the code:
    // while (endNote < PIANO_88_KEY_MAX) { if (endNote % 12 === 4 || 11) break; endNote++; }
    // If endNote starts at 65 (F):
    // 65 % 12 = 5. Not 4 or 11.
    // endNote = 66. % 12 = 6.
    // ...
    // endNote = 71. % 12 = 11. Break.
    const range = getVisibleMidiRange([]);
    expect(range).toEqual({ startPitch: 53, endPitch: 71 });
  });

  it("should maintain natural grouping near edges of the 88-key piano", () => {
    // [22, 60] range. Buffer 3 white keys.
    // Left: 22 (Bb0) -> 21 (A0). Bound hit. startNote = 21.
    // Right: 60 (C4) -> 62 (D) -> 64 (E) -> 65 (F). endNote = 65.
    //
    // Align left (21): 21 % 12 is 9 (A). Move left to C/F?
    // 21 -> 20 No... but bound is 21. Loop will break.
    // Align right (65): 65 -> 71 (B).
    const edgeRange = getVisibleMidiRange([22]);
    expect(edgeRange).toEqual({ startPitch: 21, endPitch: 71 });
  });

  it("should return full range if song covers most of the piano", () => {
    const range = getVisibleMidiRange([21, 108]);
    expect(range).toEqual({ startPitch: 21, endPitch: 108 });
  });
});
