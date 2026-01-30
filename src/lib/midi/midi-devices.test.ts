import { describe, expect, it, vi } from "vitest";
import { getMIDIInputs, onMIDIDevicesChange } from "./midi-devices";

describe("getMIDIInputs", () => {
  // ... existing tests ...
  it("should return an empty array if there are no MIDI inputs", () => {
    const mockMIDIAccess = {
      inputs: new Map(),
    } as unknown as WebMidi.MIDIAccess;

    expect(getMIDIInputs(mockMIDIAccess)).toEqual([]);
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

    const result = getMIDIInputs(mockMIDIAccess);
    expect(result).toHaveLength(2);
    expect(result).toContain(mockInput1);
    expect(result).toContain(mockInput2);
  });
});

describe("onMIDIDevicesChange", () => {
  it("should call the callback when a state change event occurs", () => {
    const mockMIDIAccess = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as WebMidi.MIDIAccess;

    const callback = vi.fn();
    const unsubscribe = onMIDIDevicesChange(mockMIDIAccess, callback);

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
