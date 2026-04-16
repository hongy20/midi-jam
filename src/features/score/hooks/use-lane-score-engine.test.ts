import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NoteSpan } from "@/features/midi-assets/lib/midi-parser";
import type { MIDINoteEvent } from "@/features/midi-hardware/lib/midi-listener";
import { useLaneScoreEngine } from "./use-lane-score-engine";
import { useMIDINotes } from "@/features/midi-hardware/hooks/use-midi-notes";

vi.mock("@/features/midi-hardware/hooks/use-midi-notes", () => ({
  useMIDINotes: vi.fn(),
}));

describe("useLaneScoreEngine hook", () => {
  const spans = [
    { id: "1", note: 60, startTimeMs: 3000, velocity: 0.7, durationMs: 1000 },
  ] as NoteSpan[];

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
        spans,
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
        spans,
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
    // with 150ms grace, effective duration is 650ms
    currentTime = 3500;
    act(() => {
      result.current.processNoteEvent({
        type: "note-off",
        note: 60,
        velocity: 0,
      });
    });

    // Score should be 100 (base) * 0.65 (overlap) = 65
    expect(result.current.getScore()).toBe(65);
  });

  it("resets combo on miss (wrong note)", () => {
    const { result } = renderHook(() =>
      useLaneScoreEngine({
        midiInput: null,
        spans,
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
        spans,
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

    // Advance time past targetOff (4000) + GOOD_THRESHOLD (500)
    currentTime = 4600;
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Score should be finalized by the interval loop
    expect(result.current.getScore()).toBeGreaterThan(0);
    vi.useRealTimers();
  });
});
