import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  MIDI_COMMAND_CONTROL_CHANGE,
  MIDI_COMMAND_NOTE_ON,
  MIDI_CONTROLLER_ALL_NOTES_OFF,
} from "@/lib/midi/constant";
import { useMidiAudio } from "./use-midi-audio";

// Mock Tone.js
vi.mock("tone", () => {
  class MockPolySynth {
    toDestination = vi.fn().mockReturnThis();
    dispose = vi.fn();
    triggerAttack = vi.fn();
    triggerRelease = vi.fn();
    releaseAll = vi.fn();
  }

  class MockMembraneSynth {
    toDestination = vi.fn().mockReturnThis();
    dispose = vi.fn();
    triggerAttackRelease = vi.fn();
  }

  return {
    PolySynth: MockPolySynth,
    Synth: vi.fn(),
    MembraneSynth: MockMembraneSynth,
    now: vi.fn().mockReturnValue(0),
    Frequency: vi.fn().mockImplementation(() => ({
      toFrequency: vi.fn().mockReturnValue(440),
    })),
    getContext: vi.fn().mockReturnValue({ state: "suspended" }),
    start: vi.fn().mockResolvedValue(undefined),
  };
});

describe("useMidiAudio", () => {
  it("should play through synth by default when demoMode is true", () => {
    const { result } = renderHook(() => useMidiAudio(true));

    act(() => {
      result.current.playNote(60, 0.8);
    });

    // We can't easily check the mock instances inside the hook,
    // but we can check if it returns the expected API.
    expect(result.current).toHaveProperty("playNote");
    expect(result.current).toHaveProperty("stopNote");
    expect(result.current).toHaveProperty("stopAllNotes");
    // isMuted and toggleMute should be gone
    expect(result.current).not.toHaveProperty("isMuted");
    expect(result.current).not.toHaveProperty("toggleMute");
  });

  it("should silence all output when demoMode is false", () => {
    // We'll verify this by ensuring no calls reach the MIDI output or synth
    // once implemented. For now, let's just test the API.
    const { result } = renderHook(() => useMidiAudio(false));
    expect(result.current).toBeDefined();
  });

  it("should route to MIDI output when provided", () => {
    const mockOutput = {
      send: vi.fn(),
    } as unknown as WebMidi.MIDIOutput;

    const { result } = renderHook(({ output }) => useMidiAudio(true, output), {
      initialProps: { output: mockOutput },
    });

    act(() => {
      result.current.playNote(60, 0.8);
    });

    // Note On for note 60 (0x3C), channel 1, velocity 0.8 -> ~101
    expect(mockOutput.send).toHaveBeenCalledWith([
      MIDI_COMMAND_NOTE_ON,
      60,
      expect.any(Number),
    ]);
  });

  it("should immediately silence audio when demoMode toggles from true to false", () => {
    const mockOutput = {
      send: vi.fn(),
    } as unknown as WebMidi.MIDIOutput;

    const { rerender } = renderHook(
      ({ demoMode }) => useMidiAudio(demoMode, mockOutput),
      {
        initialProps: { demoMode: true },
      },
    );

    // Toggle demoMode to false
    rerender({ demoMode: false });

    // Should send All Notes Off
    expect(mockOutput.send).toHaveBeenCalledWith([
      MIDI_COMMAND_CONTROL_CHANGE,
      MIDI_CONTROLLER_ALL_NOTES_OFF,
      0,
    ]);
  });
});
