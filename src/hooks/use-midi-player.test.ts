import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// 1. Mock the heavy dependency BEFORE anything else is imported
vi.mock("../lib/midi/midi-parser", () => ({
  getMidiEvents: vi.fn(),
}));

vi.mock("../lib/midi/midi-loader", () => ({
  loadMidiFile: vi.fn(),
}));

import type { MidiEvent } from "../lib/midi/midi-parser";
// 2. Now safe to import the hook
import { useMidiPlayer } from "./use-midi-player";

describe("useMidiPlayer", () => {
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

  it("should handle playback lifecycle", () => {
    const events: MidiEvent[] = [];
    const { result } = renderHook(() => useMidiPlayer(events));

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
    expect(result.current.currentTime).toBe(-4);
  });

  it("should start playing and trigger activeNotes state", () => {
    const onNoteOn = vi.fn();
    const events: MidiEvent[] = [
      {
        time: 1.0,
        type: "noteOn" as const,
        note: 60,
        velocity: 0.8,
      },
    ];

    const { result } = renderHook(() => useMidiPlayer(events, { onNoteOn }));

    act(() => {
      result.current.play();
    });

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.isCountdownActive).toBe(true);
  });

  it("should silence notes on pause", () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const events: MidiEvent[] = [
      {
        time: 1.0,
        type: "noteOn" as const,
        note: 60,
        velocity: 0.8,
      },
    ];

    const { result } = renderHook(() =>
      useMidiPlayer(events, { onNoteOn, onNoteOff }),
    );

    act(() => {
      result.current.play();
    });

    // Pause
    act(() => {
      result.current.pause();
    });
    expect(result.current.isPlaying).toBe(false);
  });
});
