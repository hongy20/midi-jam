import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { MidiEvent } from "../lib/midi/midi-parser";
import { useScoreEngine } from "./use-score-engine";

describe("useScoreEngine", () => {
  const mockEvents: MidiEvent[] = [
    { time: 1.0, type: "noteOn", note: 60, velocity: 100 },
    { time: 2.0, type: "noteOff", note: 60, velocity: 0 },
  ];

  it("should initialize with zero score and combo", () => {
    const { result } = renderHook(() =>
      useScoreEngine(mockEvents, -4, new Set(), true),
    );
    expect(result.current.score).toBe(0);
    expect(result.current.combo).toBe(0);
  });

  it("should not award points during countdown", () => {
    const { result, rerender } = renderHook(
      ({ currentTime, liveNotes }) =>
        useScoreEngine(mockEvents, currentTime, liveNotes, true),
      { initialProps: { currentTime: -1, liveNotes: new Set<number>() } },
    );

    act(() => {
      rerender({ currentTime: -0.5, liveNotes: new Set([60]) });
    });

    expect(result.current.score).toBe(0);
  });

  it("should award points for accurate press", () => {
    const { result, rerender } = renderHook(
      ({ currentTime, liveNotes }) =>
        useScoreEngine(mockEvents, currentTime, liveNotes, true),
      { initialProps: { currentTime: 0, liveNotes: new Set<number>() } },
    );

    act(() => {
      rerender({ currentTime: 1.0, liveNotes: new Set([60]) });
    });

    // 100 points total, 1 note, press is 50%
    expect(result.current.score).toBe(50);
    expect(result.current.combo).toBe(1);
    expect(result.current.lastAccuracy).toBe("PERFECT");
  });

  it("should reset combo on wrong key", () => {
    const { result, rerender } = renderHook(
      ({ currentTime, liveNotes }) =>
        useScoreEngine(mockEvents, currentTime, liveNotes, true),
      { initialProps: { currentTime: 0, liveNotes: new Set<number>() } },
    );

    act(() => {
      rerender({ currentTime: 1.0, liveNotes: new Set([60]) });
    });
    expect(result.current.combo).toBe(1);

    act(() => {
      rerender({ currentTime: 1.1, liveNotes: new Set([60, 61]) }); // 61 is wrong key
    });
    expect(result.current.combo).toBe(0);
  });

  it("should handle chord weighting", () => {
    const chordEvents: MidiEvent[] = [
      { time: 1.0, type: "noteOn", note: 60, velocity: 100 },
      { time: 1.0, type: "noteOn", note: 64, velocity: 100 },
      { time: 2.0, type: "noteOn", note: 67, velocity: 100 },
    ];
    // Chord (60, 64) at t=1.0, Single note (67) at t=2.0
    // Multiplier for chord = 1 + (2-1)*0.1 = 1.1
    // Weights: 60 -> 1.1, 64 -> 1.1, 67 -> 1.0
    // Total Weight = 3.2
    // Points for 60: (1.1/3.2)*100 = 34.375
    // Press points for 60: 17.1875

    const { result, rerender } = renderHook(
      ({ currentTime, liveNotes }) =>
        useScoreEngine(chordEvents, currentTime, liveNotes, true),
      { initialProps: { currentTime: 0, liveNotes: new Set<number>() } },
    );

    act(() => {
      rerender({ currentTime: 1.0, liveNotes: new Set([60]) });
    });

    expect(result.current.score).toBeCloseTo(17.1875, 2);
  });

  it("should award points for hold and release", () => {
    const { result, rerender } = renderHook(
      ({ currentTime, liveNotes }) =>
        useScoreEngine(mockEvents, currentTime, liveNotes, true),
      { initialProps: { currentTime: 0, liveNotes: new Set<number>() } },
    );

    // Press
    act(() => {
      rerender({ currentTime: 1.0, liveNotes: new Set([60]) });
    });
    expect(result.current.score).toBe(50);

    // Release
    act(() => {
      rerender({ currentTime: 2.0, liveNotes: new Set<number>() });
    });
    expect(result.current.score).toBe(100);
  });

  it("should reset combo and set accuracy to MISS when a note is missed", () => {
    const { result, rerender } = renderHook(
      ({ currentTime, liveNotes }) =>
        useScoreEngine(mockEvents, currentTime, liveNotes, true),
      { initialProps: { currentTime: 0, liveNotes: new Set<number>() } },
    );

    act(() => {
      // Move time past POOR_WINDOW (1.0 + 0.60 = 1.60)
      rerender({ currentTime: 1.7, liveNotes: new Set<number>() });
    });

    expect(result.current.combo).toBe(0);
    expect(result.current.lastAccuracy).toBe("MISS");
  });

  it("should reset score and combo when isPlaying becomes false", () => {
    const { result, rerender } = renderHook(
      ({ currentTime, liveNotes, isPlaying }) =>
        useScoreEngine(mockEvents, currentTime, liveNotes, isPlaying),
      {
        initialProps: {
          currentTime: 0,
          liveNotes: new Set<number>(),
          isPlaying: true,
        },
      },
    );

    act(() => {
      rerender({ currentTime: 1.0, liveNotes: new Set([60]), isPlaying: true });
    });
    expect(result.current.score).toBe(50);

    act(() => {
      rerender({
        currentTime: 1.0,
        liveNotes: new Set([60]),
        isPlaying: false,
      });
    });
    expect(result.current.score).toBe(0);
    expect(result.current.combo).toBe(0);
  });
});
