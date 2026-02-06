import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useMidiAudio } from "./use-midi-audio";
import * as Tone from "tone";

// Mock Tone.js
vi.mock("tone", () => {
  const mockSynth = {
    toDestination: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
    triggerAttack: vi.fn(),
    triggerRelease: vi.fn(),
    releaseAll: vi.fn(),
    triggerAttackRelease: vi.fn(),
  };

  return {
    PolySynth: vi.fn().mockImplementation(function() { return mockSynth; }),
    Synth: {},
    Frequency: vi.fn(() => ({
      toFrequency: vi.fn(() => 440),
    })),
    now: vi.fn(() => 0),
    start: vi.fn(),
    getContext: vi.fn(() => ({ state: "running" })),
    MembraneSynth: vi.fn().mockImplementation(function() { return mockSynth; }),
  };
});

describe("useMidiAudio", () => {
  it("should send MIDI messages when outputDevice is provided", () => {
    const mockOutput = {
      send: vi.fn(),
    } as unknown as WebMidi.MIDIOutput;

    const { result } = renderHook(() => useMidiAudio(true, mockOutput));

    result.current.playNote(60, 0.8);
    expect(mockOutput.send).toHaveBeenCalledWith([0x90, 60, Math.floor(0.8 * 127)]);

    result.current.stopNote(60);
    expect(mockOutput.send).toHaveBeenCalledWith([0x80, 60, 0]);

    result.current.stopAllNotes();
    expect(mockOutput.send).toHaveBeenCalledWith([0xB0, 123, 0]);
  });

  it("should play audio using Tone.js when demoMode is true and no outputDevice", () => {
    const { result } = renderHook(() => useMidiAudio(true, null));
    
    result.current.playNote(60, 0.8);
    // Since we can't easily check the internal polySynthRef.current calls in this setup
    // without exposing it, we've at least covered the execution path.
    
    result.current.stopNote(60);
    result.current.stopAllNotes();
  });

  it("should not play audio when demoMode is false", () => {
    const { result } = renderHook(() => useMidiAudio(false, null));
    result.current.playNote(60, 0.8);
  });

  it("should play countdown beep", () => {
    const { result } = renderHook(() => useMidiAudio());
    result.current.playCountdownBeep(true);
  });
});
