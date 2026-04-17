import type { Midi } from "@tonejs/midi";
import { describe, expect, it } from "vitest";
import { getBarLines, getMidiEvents, getNoteRange, getNoteSpans } from "./midi-parser";

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
    expect(spans[0].durationMs).toBe(1000);
    expect(spans[1].note).toBe(62);
  });

  it("getMidiEvents introduces a gap between sequential notes of the same pitch", () => {
    const sequentialMidi = {
      tracks: [
        {
          instrument: { family: "piano" },
          notes: [
            { midi: 60, time: 0, duration: 1, velocity: 0.8 },
            { midi: 60, time: 1, duration: 1, velocity: 0.7 }, // Starts exactly when first ends
          ],
        },
      ],
    } as unknown as Midi;

    const events = getMidiEvents(sequentialMidi, "piano");
    // Events: 60-On(0), 60-Off(1000), 60-On(1010), 60-Off(2000)
    expect(events).toHaveLength(4);

    expect(events[0].type).toBe("noteOn");
    expect(events[0].timeMs).toBe(0);

    expect(events[1].type).toBe("noteOff");
    expect(events[1].timeMs).toBe(1000);

    // Second note should be shifted by MIN_NOTE_GAP_MS (10ms)
    expect(events[2].type).toBe("noteOn");
    expect(events[2].timeMs).toBe(1010);

    expect(events[3].type).toBe("noteOff");
    expect(events[3].timeMs).toBe(2000);
  });

  it("getMidiEvents shifts entire chords if one note has a collision", () => {
    const chordMidi = {
      tracks: [
        {
          instrument: { family: "piano" },
          notes: [
            { midi: 60, time: 0, duration: 1, velocity: 0.8 },
            // Chord at time 1.0: C4 (60) and E4 (64)
            { midi: 60, time: 1, duration: 1, velocity: 0.7 }, // Collision!
            { midi: 64, time: 1, duration: 1, velocity: 0.7 }, // Synchronized with collision
          ],
        },
      ],
    } as unknown as Midi;

    const events = getMidiEvents(chordMidi, "piano");
    // Events: 60-On(0), 60-Off(1000), [60-On(1010), 64-On(1010)], [60-Off(2000), 64-Off(2000)]
    expect(events).toHaveLength(6);

    const chordOnEvents = events.filter((e) => e.type === "noteOn" && e.timeMs > 0);
    expect(chordOnEvents).toHaveLength(2);
    expect(chordOnEvents[0].timeMs).toBe(1010);
    expect(chordOnEvents[1].timeMs).toBe(1010);
  });

  it("getMidiEvents detects sequential collisions across different tracks", () => {
    const crossTrackMidi = {
      tracks: [
        {
          instrument: { family: "piano" },
          notes: [{ midi: 60, time: 0, duration: 1, velocity: 0.8 }],
        },
        {
          instrument: { family: "piano" },
          notes: [{ midi: 60, time: 1, duration: 1, velocity: 0.7 }], // Collision across tracks
        },
      ],
    } as unknown as Midi;

    const events = getMidiEvents(crossTrackMidi, "piano");
    expect(events).toHaveLength(4);

    // Second note (from second track) should be shifted
    expect(events[2].note).toBe(60);
    expect(events[2].type).toBe("noteOn");
    expect(events[2].timeMs).toBe(1010);
  });

  it("getMidiEvents detects and shifts overlapping notes of the same pitch", () => {
    const overlappingMidi = {
      tracks: [
        {
          instrument: { family: "piano" },
          notes: [
            { midi: 60, time: 0, duration: 1, velocity: 0.8 },
            { midi: 60, time: 0.5, duration: 1, velocity: 0.7 }, // Starts while first is still on
          ],
        },
      ],
    } as unknown as Midi;

    const events = getMidiEvents(overlappingMidi, "piano");
    // Should shift second note to start at 500 + gap
    expect(events.filter((e) => e.note === 60 && e.type === "noteOn")[1].timeMs).toBe(510);
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
