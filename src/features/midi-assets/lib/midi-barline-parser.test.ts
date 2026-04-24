import type { Midi } from "@tonejs/midi";
import { describe, expect, it } from "vitest";

import { getBarLines } from "./midi-barline-parser";

describe("midi-barline-parser", () => {
  const mockMidi = {
    duration: 10,
    header: {
      ppq: 480,
      timeSignatures: [{ ticks: 0, timeSignature: [4, 4] }],
      ticksToSeconds: (t: number) => t / 480,
    },
    tracks: [],
  } as unknown as Midi;

  it("getBarLines handles single time signature", () => {
    const barLines = getBarLines(mockMidi);
    // 4/4 at 480 PPQ -> 4 * 480 = 1920 ticks per bar
    // ticksToSeconds(0)=0, 1920/480=4, 3840/480=8, 5760/480=12...
    // duration=10, so 0, 4, 8 are expected in ms
    expect(barLines).toEqual([0, 4000, 8000]);
  });

  it("getBarLines handles multiple time signatures", () => {
    const multiTSMidi = {
      duration: 10,
      header: {
        ppq: 480,
        timeSignatures: [
          { ticks: 0, timeSignature: [4, 4] },
          { ticks: 1920, timeSignature: [3, 4] }, // Change at 4s
        ],
        ticksToSeconds: (t: number) => t / 480,
      },
    } as unknown as Midi;

    const barLines = getBarLines(multiTSMidi);
    // Segment 1 (4/4): tick 0 -> 0ms
    // Next TS at tick 1920 (4000ms).
    // Segment 2 (3/4): tick 1920 -> 4000ms, tick 1920+(3*480)=3360 -> 7000ms, tick 3360+(3*480)=4800 -> 10000ms
    expect(barLines).toEqual([0, 4000, 7000, 10000]);
  });

  it("getBarLines respects MAX_BARS limit", () => {
    const longMidi = {
      duration: 10000,
      header: {
        ppq: 480,
        timeSignatures: [{ ticks: 0, timeSignature: [4, 4] }],
        ticksToSeconds: (t: number) => t / 480,
      },
    } as unknown as Midi;
    const barLines = getBarLines(longMidi);
    expect(barLines.length).toBeLessThanOrEqual(5000);
  });
});
