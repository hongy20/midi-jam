import type { Midi } from "@tonejs/midi";
import { describe, expect, it } from "vitest";

import { parseMidiNotes } from "./midi-note-parser";

describe("midi-note-parser", () => {
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

  it("parseMidiNotes filters by instrument and excludes zero-duration notes", () => {
    const notes = parseMidiNotes(mockMidi, "piano");
    expect(notes).toHaveLength(2);
    expect(notes[0].pitch).toBe(60);
    expect(notes[0].startTimeMs).toBe(0);
    expect(notes[1].pitch).toBe(62);
    expect(notes[1].startTimeMs).toBe(1000);
  });

  it("parseMidiNotes introduces a gap between sequential notes of the same pitch", () => {
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

    const notes = parseMidiNotes(sequentialMidi, "piano");
    expect(notes).toHaveLength(2);

    expect(notes[0].startTimeMs).toBe(0);
    expect(notes[0].durationMs).toBe(1000);

    // Second note should be shifted by MIN_NOTE_GAP_MS (10ms)
    expect(notes[1].startTimeMs).toBe(1010);
  });

  it("parseMidiNotes shifts entire chords if one note has a collision", () => {
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

    const notes = parseMidiNotes(chordMidi, "piano");
    // Notes: 60(0-1000), [60(1010-2000), 64(1010-2000)]
    expect(notes).toHaveLength(3);

    const chordNotes = notes.filter((s) => s.startTimeMs > 500);
    expect(chordNotes).toHaveLength(2);
    expect(chordNotes[0].startTimeMs).toBe(1010);
    expect(chordNotes[1].startTimeMs).toBe(1010);
  });

  it("parseMidiNotes detects sequential collisions across different tracks", () => {
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

    const notes = parseMidiNotes(crossTrackMidi, "piano");
    expect(notes).toHaveLength(2);

    // Second note (from second track) should be shifted
    expect(notes[1].pitch).toBe(60);
    expect(notes[1].startTimeMs).toBe(1010);
  });

  it("parseMidiNotes detects and shifts overlapping notes of the same pitch", () => {
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

    const notes = parseMidiNotes(overlappingMidi, "piano");
    // Should shift second note to start at 500 + gap
    expect(notes[1].pitch).toBe(60);
    expect(notes[1].startTimeMs).toBe(510);
  });
});
