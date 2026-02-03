import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useMidiAudio } from "./use-midi-audio";

// Mock Tone.js
vi.mock("tone", () => {
  const mockPolySynth = {
    toDestination: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
    triggerAttack: vi.fn(),
    triggerRelease: vi.fn(),
    releaseAll: vi.fn(),
  };

  return {
    // biome-ignore lint/complexity/useArrowFunction: needs to be constructible
    PolySynth: vi.fn().mockImplementation(function () {
      return mockPolySynth;
    }),
    Synth: vi.fn(),
    now: vi.fn().mockReturnValue(0),
    Frequency: vi.fn().mockImplementation(() => ({
      toFrequency: vi.fn().mockReturnValue(440),
    })),
    getContext: vi.fn().mockReturnValue({ state: "suspended" }),
    start: vi.fn().mockResolvedValue(undefined),
  };
});

describe("useMidiAudio", () => {
  it("should initialize with isMuted false by default", () => {
    const { result } = renderHook(() => useMidiAudio());
    expect(result.current.isMuted).toBe(false);
  });

  it("should toggle mute status", () => {
    const { result } = renderHook(() => useMidiAudio());

    act(() => {
      result.current.toggleMute();
    });
    expect(result.current.isMuted).toBe(true);

    act(() => {
      result.current.toggleMute();
    });
    expect(result.current.isMuted).toBe(false);
  });

  it("should be forced to muted when demoMode is false", () => {
    const { result, rerender } = renderHook(
      ({ demoMode }) => useMidiAudio(demoMode),
      {
        initialProps: { demoMode: true },
      },
    );

    expect(result.current.isMuted).toBe(false);

    // Change demoMode to false
    rerender({ demoMode: false });
    expect(result.current.isMuted).toBe(true);

    // Attempt to toggle mute while demoMode is false
    act(() => {
      result.current.toggleMute();
    });
    expect(result.current.isMuted).toBe(true); // Should remain muted

    // Change demoMode back to true
    rerender({ demoMode: true });
    expect(result.current.isMuted).toBe(false); // Should return to unmuted (or previous state)
  });
});
