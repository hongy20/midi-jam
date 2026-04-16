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
    { type: "noteOn", note: 60, timeMs: 3000, velocity: 0.7, durationMs: 1000 },
  ] as MidiEvent[];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("increases combo on perfect hit note-on, and score on note-off", () => {
    let onNoteCallback: (event: MIDINoteEvent) => void = () => {};
    vi.mocked(useMIDINotes).mockImplementation((_input, cb) => {
      onNoteCallback = cb as (event: MIDINoteEvent) => void;
    });

    let currentTime = 3000;
    const { result } = renderHook(() =>
      useLaneScoreEngine({
        midiInput: {} as WebMidi.MIDIInput,
        modelEvents,
        getCurrentTimeMs: () => currentTime,
      }),
    );

    // 1. Trigger Note On
    act(() => {
      onNoteCallback({ type: "note-on", note: 60, velocity: 0.7 });
    });

    expect(result.current.getCombo()).toBe(1);
    expect(result.current.getScore()).toBe(0); // Score not added yet
    expect(result.current.getLastHitQuality()).toBe("perfect");

    // 2. Trigger Note Off (100% overlap)
    currentTime = 4000;
    act(() => {
      onNoteCallback({ type: "note-off", note: 60, velocity: 0 });
    });

    expect(result.current.getScore()).toBeGreaterThan(0);
    expect(result.current.getCombo()).toBe(1);
  });

  it("calculates overlap correctly for score (partial hold)", () => {
    let currentTime = 3000;
    const { result } = renderHook(() =>
      useLaneScoreEngine({
        midiInput: null,
        modelEvents,
        getCurrentTimeMs: () => currentTime,
      }),
    );

    act(() => {
      result.current.processNoteEvent({
        type: "note-on",
        note: 60,
        velocity: 0.7,
      });
    });

    // Release halfway (500ms into 1000ms duration)
    currentTime = 3500;
    act(() => {
      result.current.processNoteEvent({
        type: "note-off",
        note: 60,
        velocity: 0,
      });
    });

    // Score should be 100 (base) * 0.5 (overlap) = 50
    expect(result.current.getScore()).toBe(50);
  });

  it("resets combo on miss (wrong note)", () => {
    const { result } = renderHook(() =>
      useLaneScoreEngine({
        midiInput: null,
        modelEvents,
        getCurrentTimeMs: () => 3000,
      }),
    );

    act(() => {
      result.current.processNoteEvent({
        type: "note-on",
        note: 60,
        velocity: 0.7,
      });
    });
    expect(result.current.getCombo()).toBe(1);

    act(() => {
      result.current.processNoteEvent({
        type: "note-on",
        note: 62,
        velocity: 0.7,
      });
    });

    expect(result.current.getCombo()).toBe(0);
    expect(result.current.getLastHitQuality()).toBe("miss");
  });

  it("finalizes score automatically if held too long", async () => {
    vi.useFakeTimers();
    let currentTime = 3000;
    const { result } = renderHook(() =>
      useLaneScoreEngine({
        midiInput: null,
        modelEvents,
        getCurrentTimeMs: () => currentTime,
      }),
    );

    act(() => {
      result.current.processNoteEvent({
        type: "note-on",
        note: 60,
        velocity: 0.7,
      });
    });

    // Advance time past targetOff (4000) + GOOD_THRESHOLD (300)
    currentTime = 4500;
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Score should be finalized by the interval loop
    expect(result.current.getScore()).toBeGreaterThan(0);
    vi.useRealTimers();
  });
});
