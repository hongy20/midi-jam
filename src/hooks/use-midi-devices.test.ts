import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as midiAccess from "@/lib/midi/midi-access";
import { useMIDIDevices } from "./use-midi-devices";

vi.mock("@/lib/midi/midi-access");

describe("useMIDIDevices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with an empty list and provide an accessPromise", async () => {
    const mockMIDIAccess = {
      inputs: new Map(),
      outputs: new Map(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.mocked(midiAccess.requestMIDIAccess).mockResolvedValue(
      mockMIDIAccess as unknown as WebMidi.MIDIAccess,
    );

    const { result } = renderHook(() => useMIDIDevices());

    expect(result.current.inputs).toEqual([]);
    expect(result.current.outputs).toEqual([]);
    expect(result.current.accessPromise).toBeInstanceOf(Promise);

    await result.current.accessPromise;
    await waitFor(() => expect(result.current.inputs).toEqual([]));
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

    const { result } = renderHook(() => useMIDIDevices());

    await result.current.accessPromise;
    await waitFor(() => expect(result.current.inputs).toEqual([mockInput]));
    expect(result.current.outputs).toEqual([mockOutput]);
  });

  it("should allow the accessPromise to reject on failure", async () => {
    const error = new Error("Access denied");
    vi.mocked(midiAccess.requestMIDIAccess).mockRejectedValue(error);

    const { result } = renderHook(() => useMIDIDevices());

    await expect(result.current.accessPromise).rejects.toThrow("Access denied");
    expect(result.current.inputs).toEqual([]);
  });
});
