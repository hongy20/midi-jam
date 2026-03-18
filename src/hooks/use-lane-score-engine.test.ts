import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MIDINoteEvent } from "@/lib/midi/midi-listener";
import type { MidiEvent } from "@/lib/midi/midi-parser";
import { useLaneScoreEngine } from "./use-lane-score-engine";
import { useMIDINotes } from "./use-midi-notes";

vi.mock("./use-midi-notes", () => ({
  useMIDINotes: vi.fn(),
}));

describe("useLaneScoreEngine hook", () => {
  const modelEvents = [
    { type: "noteOn", note: 60, timeMs: 3000, velocity: 0.7 },
  ] as MidiEvent[];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("increases score and combo on perfect hit", () => {
    let onNoteCallback: (event: MIDINoteEvent) => void = () => {};
    vi.mocked(useMIDINotes).mockImplementation((_input, cb) => {
      onNoteCallback = cb as (event: MIDINoteEvent) => void;
    });

    const { result } = renderHook(() =>
      useLaneScoreEngine({
        midiInput: {} as WebMidi.MIDIInput,
        modelEvents,
        getCurrentTimeMs: () => 3000,
        isPlaying: true,
      }),
    );

    act(() => {
      onNoteCallback({ type: "note-on", note: 60, velocity: 0.7 });
    });

    expect(result.current.score).toBeGreaterThan(0);
    expect(result.current.combo).toBe(1);
    expect(result.current.lastHitQuality).toBe("perfect");
  });

  it("resets combo on miss (wrong note)", () => {
    let onNoteCallback: (event: MIDINoteEvent) => void = () => {};
    vi.mocked(useMIDINotes).mockImplementation((_input, cb) => {
      onNoteCallback = cb as (event: MIDINoteEvent) => void;
    });

    const { result } = renderHook(() =>
      useLaneScoreEngine({
        midiInput: {} as WebMidi.MIDIInput,
        modelEvents,
        getCurrentTimeMs: () => 3000,
        isPlaying: true,
      }),
    );

    // First a good hit to get combo
    act(() => {
      onNoteCallback({ type: "note-on", note: 60, velocity: 0.7 });
    });
    expect(result.current.combo).toBe(1);

    // Then a wrong note
    act(() => {
      onNoteCallback({ type: "note-on", note: 62, velocity: 0.7 });
    });

    expect(result.current.combo).toBe(0);
    expect(result.current.lastHitQuality).toBe("miss");
  });

  it("processes hits correctly with many model events", () => {
    // Create 10,000 model events, one every second
    const largeModelEvents: MidiEvent[] = Array.from(
      { length: 10000 },
      (_, i) => ({
        type: "noteOn",
        note: 60,
        timeMs: i * 1000 + 2000,
        velocity: 0.7,
      }),
    );

    let onNoteCallback: (event: MIDINoteEvent) => void = () => {};
    vi.mocked(useMIDINotes).mockImplementation((_input, cb) => {
      onNoteCallback = cb as (event: MIDINoteEvent) => void;
    });

    const { result } = renderHook(() =>
      useLaneScoreEngine({
        midiInput: {} as WebMidi.MIDIInput,
        modelEvents: largeModelEvents,
        getCurrentTimeMs: () => 5000 * 1000 + 2000, // At 5000 seconds
        isPlaying: true,
      }),
    );

    act(() => {
      onNoteCallback({ type: "note-on", note: 60, velocity: 0.7 });
    });

    expect(result.current.score).toBeGreaterThan(0);
    expect(result.current.combo).toBe(1);
    expect(result.current.lastHitQuality).toBe("perfect");
  });

  it("restores state from initial props", () => {
    const modelEventsRestore = [
      { type: "noteOn", note: 60, timeMs: 3000, velocity: 0.7 },
      { type: "noteOn", note: 62, timeMs: 7000, velocity: 0.7 },
    ] as MidiEvent[];

    let onNoteCallback: (event: MIDINoteEvent) => void = () => {};
    vi.mocked(useMIDINotes).mockImplementation((_input, cb) => {
      onNoteCallback = cb as (event: MIDINoteEvent) => void;
    });

    const { result } = renderHook(() =>
      useLaneScoreEngine({
        midiInput: {} as WebMidi.MIDIInput,
        modelEvents: modelEventsRestore,
        getCurrentTimeMs: () => 7000,
        isPlaying: true,
        initialScore: 500,
        initialCombo: 5,
        initialTimeMs: 5000, // We are resuming at 5s, past the 3s note
      }),
    );

    expect(result.current.score).toBe(500);
    expect(result.current.combo).toBe(5);

    // Hit the 7s note
    act(() => {
      onNoteCallback({ type: "note-on", note: 62, velocity: 0.7 });
    });

    expect(result.current.score).toBeGreaterThan(500);
    expect(result.current.combo).toBe(6);
    expect(result.current.lastHitQuality).toBe("perfect");
  });
});
