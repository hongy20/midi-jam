import { describe, it, expect } from "vitest";
import { getNoteRange, type MidiEvent } from "./midi-player";

describe("midi-player utilities", () => {
  describe("getNoteRange", () => {
    it("returns the correct range for a set of events", () => {
      const events: MidiEvent[] = [
        { time: 0, type: "noteOn", note: 60, velocity: 0.5, track: 0 },
        { time: 1, type: "noteOn", note: 72, velocity: 0.5, track: 0 },
        { time: 2, type: "noteOn", note: 48, velocity: 0.5, track: 0 },
      ];

      const range = getNoteRange(events);
      expect(range).toEqual({ min: 48, max: 72 });
    });

    it("returns null for empty events", () => {
      expect(getNoteRange([])).toBeNull();
    });

    it("handles a single note", () => {
      const events: MidiEvent[] = [
        { time: 0, type: "noteOn", note: 60, velocity: 0.5, track: 0 },
      ];
      expect(getNoteRange(events)).toEqual({ min: 60, max: 60 });
    });
  });
});
