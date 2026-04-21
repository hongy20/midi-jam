import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MidiNote } from "@/shared/types/midi";
import { useScoreEngine } from "./use-score-engine";

describe("useScoreEngine hook", () => {
  const notes = [
    { id: "1", pitch: 60, startTimeMs: 3000, velocity: 0.7, durationMs: 1000 },
  ] as MidiNote[];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("increases combo on perfect hit note-on, and score on note-off", () => {
    let currentTime = 3000;
    const { result } = renderHook(() =>
      useScoreEngine({
        notes,
        getCurrentTimeMs: () => currentTime,
      }),
    );

    // 1. Trigger Note On
    act(() => {
      result.current.processNoteEvent({ type: "note-on", pitch: 60, velocity: 0.7 });
    });

    expect(result.current.getCombo()).toBe(1);
    expect(result.current.getScore()).toBe(0); // Score not added yet
    expect(result.current.getLastHitQuality()).toBe("perfect");

    // 2. Trigger Note Off (100% overlap)
    currentTime = 4000;
    act(() => {
      result.current.processNoteEvent({ type: "note-off", pitch: 60, velocity: 0 });
    });

    expect(result.current.getScore()).toBeGreaterThan(0);
    expect(result.current.getCombo()).toBe(1);
  });

  it("calculates overlap correctly for score (partial hold)", () => {
    let currentTime = 3000;
    const { result } = renderHook(() =>
      useScoreEngine({
        notes,
        getCurrentTimeMs: () => currentTime,
      }),
    );

    act(() => {
      result.current.processNoteEvent({
        type: "note-on",
        pitch: 60,
        velocity: 0.7,
      });
    });

    // Release halfway (500ms into 1000ms duration)
    // with 150ms grace, effective duration is 650ms
    currentTime = 3500;
    act(() => {
      result.current.processNoteEvent({
        type: "note-off",
        pitch: 60,
        velocity: 0,
      });
    });

    // Score should be 100 (base) * 0.65 (overlap) = 65
    expect(result.current.getScore()).toBe(65);
  });

  it("resets combo on miss (wrong note)", () => {
    const { result } = renderHook(() =>
      useScoreEngine({
        notes,
        getCurrentTimeMs: () => 3000,
      }),
    );

    act(() => {
      result.current.processNoteEvent({
        type: "note-on",
        pitch: 60,
        velocity: 0.7,
      });
    });
    expect(result.current.getCombo()).toBe(1);

    act(() => {
      result.current.processNoteEvent({
        type: "note-on",
        pitch: 62,
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
      useScoreEngine({
        notes,
        getCurrentTimeMs: () => currentTime,
      }),
    );

    act(() => {
      result.current.processNoteEvent({
        type: "note-on",
        pitch: 60,
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
