import { describe, expect, it } from "vitest";
import { getMidiEvents, getNoteSpans, getNoteRange, getBarLines } from "./midi-parser";
import type { Midi } from "@tonejs/midi";

describe("midi-parser", () => {
  const mockMidi = {
    duration: 10,
    header: {
      ppq: 480,
      timeSignatures: [{ ticks: 0, timeSignature: [4, 4] }],
      ticksToSeconds: (t: number) => t / 480,
    },
    tracks: [
      {
        instrument: { family: "piano" },
        notes: [
          { midi: 60, time: 0, duration: 1, velocity: 0.8 },
          { midi: 62, time: 1, duration: 1, velocity: 0.7 },
        ],
      },
      {
        instrument: { family: "drums" },
        notes: [{ midi: 36, time: 0, duration: 0.5, velocity: 0.9 }],
      },
    ],
  } as unknown as Midi;

  it("getMidiEvents filters by instrument and excludes zero-duration notes", () => {
    const events = getMidiEvents(mockMidi, "piano");
    expect(events).toHaveLength(4); // 2 notes * (on + off)
    expect(events[0].type).toBe("noteOn");
    expect(events[0].note).toBe(60);
    expect(events[1].type).toBe("noteOff");
    expect(events[1].note).toBe(60);
  });

  it("getNoteSpans correctly pairs noteOn and noteOff events", () => {
    const events = getMidiEvents(mockMidi, "piano");
    const spans = getNoteSpans(events);
    expect(spans).toHaveLength(2);
    expect(spans[0].note).toBe(60);
    expect(spans[0].duration).toBe(1);
    expect(spans[1].note).toBe(62);
  });

  it("getNoteRange returns correct min/max", () => {
    const events = getMidiEvents(mockMidi, "piano");
    const range = getNoteRange(events);
    expect(range).toEqual({ min: 60, max: 62 });
  });

  it("getNoteRange returns null for empty events", () => {
    expect(getNoteRange([])).toBeNull();
  });

  it("getBarLines handles single time signature", () => {
    const barLines = getBarLines(mockMidi);
    // 4/4 at 480 PPQ -> 4 * 480 = 1920 ticks per bar
    // ticksToSeconds(0)=0, 1920/480=4, 3840/480=8, 5760/480=12...
    // duration=10, so 0, 4, 8 are expected
    expect(barLines).toEqual([0, 4, 8]);
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
    // Segment 1 (4/4): tick 0 -> 0s
    // Next TS at tick 1920 (4s).
    // Segment 2 (3/4): tick 1920 -> 4s, tick 1920+(3*480)=3360 -> 7s, tick 3360+(3*480)=4800 -> 10s
    expect(barLines).toEqual([0, 4, 7, 10]);
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