import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// 1. Mock the heavy dependency BEFORE anything else is imported
vi.mock("../lib/midi/midi-player", () => ({
  loadMidiFile: vi.fn(),
  getMidiEvents: vi.fn(),
}));

// 2. Now safe to import the hook
import { useMidiPlayer } from "./use-midi-player";

describe("useMidiPlayer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 16);
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      clearTimeout(id);
    });
    vi.spyOn(performance, "now").mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const advanceTime = (ms: number) => {
    act(() => {
      const current = performance.now();
      vi.spyOn(performance, "now").mockReturnValue(current + ms);
      vi.advanceTimersByTime(ms);
    });
  };

  it.skip("should handle playback lifecycle", () => {
    const { result } = renderHook(() => useMidiPlayer([]));

    act(() => {
      result.current.play();
    });
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.pause();
    });
    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.stop();
    });
    expect(result.current.currentTime).toBe(0);
  });

  it.skip("should trigger notes at correct times", () => {
    const onNoteOn = vi.fn();
    const events = [
      {
        time: 1.0,
        type: "noteOn" as const,
        note: 60,
        velocity: 0.8,
        track: 0,
      },
    ];

    const { result } = renderHook(() => useMidiPlayer(events, { onNoteOn }));

    act(() => {
      result.current.play();
    });

    // Move to 0.5s -> no note yet
    advanceTime(500);
    expect(onNoteOn).not.toHaveBeenCalled();

    // Move to 1.1s -> note triggered
    advanceTime(600);
    expect(onNoteOn).toHaveBeenCalledWith(60, 0.8);
    expect(result.current.activeNotes.has(60)).toBe(true);
  });

  it.skip("should silence notes on pause and re-strike on play", () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const events = [
      {
        time: 1.0,
        type: "noteOn" as const,
        note: 60,
        velocity: 0.8,
        track: 0,
      },
    ];

    const { result } = renderHook(() =>
      useMidiPlayer(events, { onNoteOn, onNoteOff }),
    );

    act(() => {
      result.current.play();
    });

    // Trigger note
    advanceTime(1100);
    expect(onNoteOn).toHaveBeenCalledWith(60, 0.8);
    onNoteOn.mockClear();

    // Pause
    act(() => {
      result.current.pause();
    });
    expect(onNoteOff).toHaveBeenCalledWith(60);
    onNoteOff.mockClear();

    // Resume
    act(() => {
      result.current.play();
    });
    expect(onNoteOn).toHaveBeenCalledWith(60, 0.8);
  });
});
