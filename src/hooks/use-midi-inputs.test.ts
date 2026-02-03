import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as midiAccess from "@/lib/midi/midi-access";
import { useMIDIInputs } from "./use-midi-inputs";

vi.mock("@/lib/midi/midi-access");

describe("useMIDIInputs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with an empty list and loading state", async () => {
    const mockMIDIAccess = {
      inputs: new Map(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.mocked(midiAccess.requestMIDIAccess).mockResolvedValue(
      mockMIDIAccess as unknown as WebMidi.MIDIAccess,
    );

    const { result } = renderHook(() => useMIDIInputs());

    expect(result.current.inputs).toEqual([]);
    expect(result.current.outputs).toEqual([]);
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.inputs).toEqual([]);
    expect(result.current.outputs).toEqual([]);
  });

  it("should return inputs and outputs when they are available", async () => {
    const mockInput = { id: "in-1", name: "Keyboard" };
    const mockOutput = { id: "out-1", name: "Synth" };
    const mockMIDIAccess = {
      inputs: new Map([["in-1", mockInput]]),
      outputs: new Map([["out-1", mockOutput]]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.mocked(midiAccess.requestMIDIAccess).mockResolvedValue(
      mockMIDIAccess as unknown as WebMidi.MIDIAccess,
    );

    const { result } = renderHook(() => useMIDIInputs());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.inputs).toEqual([mockInput]);
    expect(result.current.outputs).toEqual([mockOutput]);
  });

  it("should handle errors when requesting access", async () => {
    vi.mocked(midiAccess.requestMIDIAccess).mockRejectedValue(
      new Error("Access denied"),
    );

    const { result } = renderHook(() => useMIDIInputs());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("Access denied");
    expect(result.current.inputs).toEqual([]);
  });
});
