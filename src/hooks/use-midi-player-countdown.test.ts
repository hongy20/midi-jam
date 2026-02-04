import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MidiEvent } from "../lib/midi/midi-parser";
import { useMidiPlayer } from "./use-midi-player";

// Mock the heavy dependency
vi.mock("../lib/midi/midi-parser", () => ({
  getMidiEvents: vi.fn(),
}));

vi.mock("../lib/midi/midi-loader", () => ({
  loadMidiFile: vi.fn(),
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

  it("should have initial state with lead-in", () => {
    const events: MidiEvent[] = [];
    const { result } = renderHook(() => useMidiPlayer(events));

    expect(result.current.currentTime).toBe(-4);
    expect(result.current.isCountdownActive).toBe(false);
  });

  it("should start countdown when play is called at time -4", () => {
    const events: MidiEvent[] = [];
    const { result } = renderHook(() => useMidiPlayer(events));

    act(() => {
      result.current.play();
    });

    expect(result.current.isCountdownActive).toBe(true);
    expect(result.current.isPlaying).toBe(true);
  });

  it("should reset to -4 when stop is called", () => {
    const events: MidiEvent[] = [];
    const { result } = renderHook(() => useMidiPlayer(events));

    act(() => {
      result.current.play();
    });

    act(() => {
      result.current.stop();
    });

    expect(result.current.isCountdownActive).toBe(false);
    expect(result.current.currentTime).toBe(-4);
    expect(result.current.isPlaying).toBe(false);
  });

  it("should not play notes initially during countdown", () => {
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

    expect(result.current.isCountdownActive).toBe(true);
    expect(result.current.isPlaying).toBe(true);
    // currentTime is still -4 because tick hasn't run
    expect(result.current.currentTime).toBe(-4);
    expect(onNoteOn).not.toHaveBeenCalled();
  });
});
