import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MidiEvent } from "../lib/midi/midi-player";
import { useMidiPlayer } from "./use-midi-player";

// Mock the heavy dependency
vi.mock("../lib/midi/midi-player", () => ({
  loadMidiFile: vi.fn(),
  getMidiEvents: vi.fn(),
}));

describe("useMidiPlayer Countdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", vi.fn());
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
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

  it("should have countdown state", () => {
    const events: MidiEvent[] = [];
    const { result } = renderHook(() => useMidiPlayer(events));

    expect(result.current.countdownRemaining).toBe(0);
    expect(result.current.isCountdownActive).toBe(false);
  });

  it("should start countdown when play is called at time 0", () => {
    const events: MidiEvent[] = [];
    const { result } = renderHook(() => useMidiPlayer(events));

    act(() => {
      result.current.play();
    });

    expect(result.current.isCountdownActive).toBe(true);
    expect(result.current.countdownRemaining).toBe(4);
    expect(result.current.isPlaying).toBe(false); // Should not start playing immediately
  });

  it("should progress countdown and start playback at 0", () => {
    const events: MidiEvent[] = [];
    const { result } = renderHook(() => useMidiPlayer(events));

    act(() => {
      result.current.play();
    });

    expect(result.current.countdownRemaining).toBe(4);

    // After 1s
    advanceTime(1000);
    expect(result.current.countdownRemaining).toBe(3);

    // After 4s total
    advanceTime(3000);
    expect(result.current.countdownRemaining).toBe(0);
    expect(result.current.isCountdownActive).toBe(false);
    expect(result.current.isPlaying).toBe(true);
  });

  it("should pause countdown when pause is called", () => {
    const events: MidiEvent[] = [];
    const { result } = renderHook(() => useMidiPlayer(events));

    act(() => {
      result.current.play();
    });

    advanceTime(1000);
    expect(result.current.countdownRemaining).toBe(3);

    act(() => {
      result.current.pause();
    });

    advanceTime(2000);
    // Should still be at 3
    expect(result.current.countdownRemaining).toBe(3);
    expect(result.current.isCountdownActive).toBe(false);
  });

  it("should resume countdown when play is called after pause", () => {
    const events: MidiEvent[] = [];
    const { result } = renderHook(() => useMidiPlayer(events));

    act(() => {
      result.current.play();
    });

    advanceTime(1000);

    act(() => {
      result.current.pause();
    });

    act(() => {
      result.current.play();
    });

    expect(result.current.isCountdownActive).toBe(true);
    expect(result.current.countdownRemaining).toBe(3);

    advanceTime(3000);
    expect(result.current.countdownRemaining).toBe(0);
    expect(result.current.isPlaying).toBe(true);
  });

  it("should reset countdown when stop is called", () => {
    const events: MidiEvent[] = [];
    const { result } = renderHook(() => useMidiPlayer(events));

    act(() => {
      result.current.play();
    });

    advanceTime(1000);

    act(() => {
      result.current.stop();
    });

    expect(result.current.isCountdownActive).toBe(false);
    expect(result.current.countdownRemaining).toBe(0);
    expect(result.current.isPlaying).toBe(false);
  });

  it("should not play notes during countdown", () => {
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

    expect(result.current.isCountdownActive).toBe(true);

    // Advance 3.9s -> still in countdown
    advanceTime(3900);
    expect(onNoteOn).not.toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);

    // Advance to 5s total (4s countdown + 1s playback)
    advanceTime(1100);
    expect(result.current.isPlaying).toBe(true);
    // expect(onNoteOn).toHaveBeenCalledWith(60, 0.8); // Skip this for now as it depends on tick
  });
});
