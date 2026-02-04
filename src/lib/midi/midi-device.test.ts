import { describe, expect, it, vi } from "vitest";
import {
  getMIDIInputDevices,
  getMIDIOutputDevices,
  onMIDIDevicesStateChange,
} from "./midi-device";

describe("getMIDIInputDevices", () => {
  // ... existing tests ...
  it("should return an empty array if there are no MIDI inputs", () => {
    const mockMIDIAccess = {
      inputs: new Map(),
    } as unknown as WebMidi.MIDIAccess;

    expect(getMIDIInputDevices(mockMIDIAccess)).toEqual([]);
  });

  it("should return an array of MIDI inputs", () => {
    const mockInput1 = { id: "1", name: "Input 1", manufacturer: "Brand A" };
    const mockInput2 = { id: "2", name: "Input 2", manufacturer: "Brand B" };

    const mockInputs = new Map([
      ["1", mockInput1],
      ["2", mockInput2],
    ]);

    const mockMIDIAccess = {
      inputs: mockInputs,
    } as unknown as WebMidi.MIDIAccess;

    const result = getMIDIInputDevices(mockMIDIAccess);
    expect(result).toHaveLength(2);
    expect(result).toContain(mockInput1);
    expect(result).toContain(mockInput2);
  });
});

describe("getMIDIOutputDevices", () => {
  it("should return an empty array if there are no MIDI outputs", () => {
    const mockMIDIAccess = {
      outputs: new Map(),
    } as unknown as WebMidi.MIDIAccess;

    expect(getMIDIOutputDevices(mockMIDIAccess)).toEqual([]);
  });

  it("should return an array of MIDI outputs", () => {
    const mockOutput1 = { id: "1", name: "Output 1", manufacturer: "Brand A" };
    const mockOutput2 = { id: "2", name: "Output 2", manufacturer: "Brand B" };

    const mockOutputs = new Map([
      ["1", mockOutput1],
      ["2", mockOutput2],
    ]);

    const mockMIDIAccess = {
      outputs: mockOutputs,
    } as unknown as WebMidi.MIDIAccess;

    const result = getMIDIOutputDevices(mockMIDIAccess);
    expect(result).toHaveLength(2);
    expect(result).toContain(mockOutput1);
    expect(result).toContain(mockOutput2);
  });
});

describe("onMIDIDevicesStateChange", () => {
  it("should call the callback when a state change event occurs", () => {
    const mockMIDIAccess = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as WebMidi.MIDIAccess;

    const callback = vi.fn();
    const unsubscribe = onMIDIDevicesStateChange(mockMIDIAccess, callback);

    expect(mockMIDIAccess.addEventListener).toHaveBeenCalledWith(
      "statechange",
      callback,
    );

    unsubscribe();
    expect(mockMIDIAccess.removeEventListener).toHaveBeenCalledWith(
      "statechange",
      callback,
    );
  });
});
