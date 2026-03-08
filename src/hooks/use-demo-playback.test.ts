import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LEAD_IN_DEFAULT_MS } from "@/lib/midi/constant";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import { useDemoPlayback } from "./use-demo-playback";

describe("useDemoPlayback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it("triggers onNoteOn when time reaches note startTime", () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const spans: NoteSpan[] = [
      { id: "1", note: 60, startTime: 1, duration: 1, velocity: 0.7 },
    ];
    let currentTime = 0;
    const getCurrentTimeMs = vi.fn(() => currentTime);

    renderHook(() =>
      useDemoPlayback({
        demoMode: true,
        isLoading: false,
        spans,
        getCurrentTimeMs,
        onNoteOn,
        onNoteOff,
      }),
    );

    // Initial tick at T=0
    vi.advanceTimersByTime(16);
    expect(onNoteOn).not.toHaveBeenCalled();

    // Move to T=1s (which is 1000ms + LEAD_IN_DEFAULT_MS in raw timeline)
    currentTime = 1000 + LEAD_IN_DEFAULT_MS;
    vi.advanceTimersByTime(16);
    expect(onNoteOn).toHaveBeenCalledWith(60, 0.7);
  });

  it("triggers onNoteOff when time reaches note endTime", () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const spans: NoteSpan[] = [
      { id: "1", note: 60, startTime: 1, duration: 1, velocity: 0.7 },
    ];
    let currentTime = 1000 + LEAD_IN_DEFAULT_MS;
    const getCurrentTimeMs = vi.fn(() => currentTime);

    renderHook(() =>
      useDemoPlayback({
        demoMode: true,
        isLoading: false,
        spans,
        getCurrentTimeMs,
        onNoteOn,
        onNoteOff,
      }),
    );

    // Note starts
    vi.advanceTimersByTime(16);
    expect(onNoteOn).toHaveBeenCalled();

    // Move to T=2s (end of note)
    currentTime = 2000 + LEAD_IN_DEFAULT_MS;
    vi.advanceTimersByTime(16);
    expect(onNoteOff).toHaveBeenCalledWith(60);
  });

  it("handles timeline resets correctly", () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const spans: NoteSpan[] = [
      { id: "1", note: 60, startTime: 1, duration: 1, velocity: 0.7 },
    ];
    let currentTime = 1500 + LEAD_IN_DEFAULT_MS; // Middle of note
    const getCurrentTimeMs = vi.fn(() => currentTime);

    renderHook(() =>
      useDemoPlayback({
        demoMode: true,
        isLoading: false,
        spans,
        getCurrentTimeMs,
        onNoteOn,
        onNoteOff,
      }),
    );

    vi.advanceTimersByTime(16);
    expect(onNoteOn).toHaveBeenCalled();

    // Reset timeline to T=0
    currentTime = 0;
    vi.advanceTimersByTime(16);
    expect(onNoteOff).toHaveBeenCalledWith(60); // Note should be cut off

    // Move forward again to T=1s
    currentTime = 1000 + LEAD_IN_DEFAULT_MS;
    vi.advanceTimersByTime(16);
    expect(onNoteOn).toHaveBeenCalledTimes(2); // Should trigger again
  });

  it("handles multiple notes starting at the same time", () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const spans: NoteSpan[] = [
      { id: "1", note: 60, startTime: 1, duration: 1, velocity: 0.7 },
      { id: "2", note: 64, startTime: 1, duration: 1, velocity: 0.7 },
    ];
    const currentTime = 1000 + LEAD_IN_DEFAULT_MS;
    const getCurrentTimeMs = vi.fn(() => currentTime);

    renderHook(() =>
      useDemoPlayback({
        demoMode: true,
        isLoading: false,
        spans,
        getCurrentTimeMs,
        onNoteOn,
        onNoteOff,
      }),
    );

    vi.advanceTimersByTime(16);
    expect(onNoteOn).toHaveBeenCalledWith(60, 0.7);
    expect(onNoteOn).toHaveBeenCalledWith(64, 0.7);
  });
});
