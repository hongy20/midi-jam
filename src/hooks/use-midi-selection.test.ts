import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMIDISelection } from "./use-midi-selection";

describe("useMIDISelection", () => {
  const mockDevice1 = { id: "1", name: "Device 1" } as WebMidi.MIDIInput;
  const mockDevice2 = { id: "2", name: "Device 2" } as WebMidi.MIDIInput;
  const mockOutput1 = { id: "o1", name: "Device 1" } as WebMidi.MIDIOutput;
  const mockOutput2 = { id: "o2", name: "Other" } as WebMidi.MIDIOutput;

  it("should start with no selected device if no inputs are available", () => {
    const { result } = renderHook(() => useMIDISelection([], []));
    expect(result.current.selectedMIDIInput).toBeNull();
    expect(result.current.selectedMIDIOutput).toBeNull();
  });

  it("should auto-select if there is only one device available and find matching output", () => {
    const { result } = renderHook(() =>
      useMIDISelection([mockDevice1], [mockOutput1, mockOutput2]),
    );
    expect(result.current.selectedMIDIInput).toBe(mockDevice1);
    expect(result.current.selectedMIDIOutput).toBe(mockOutput1);
  });

  it("should update selectedMIDIOutput when a device is selected", () => {
    const { result } = renderHook(() =>
      useMIDISelection([mockDevice1, mockDevice2], [mockOutput1]),
    );

    act(() => {
      result.current.selectMIDIInput(mockDevice1);
    });

    expect(result.current.selectedMIDIInput).toBe(mockDevice1);
    expect(result.current.selectedMIDIOutput).toBe(mockOutput1);

    act(() => {
      result.current.selectMIDIInput(mockDevice2);
    });

    expect(result.current.selectedMIDIInput).toBe(mockDevice2);
    expect(result.current.selectedMIDIOutput).toBeNull();
  });

  it("should auto-deselect if the selected device is no longer available", () => {
    // Start with the device available
    const { result, rerender } = renderHook(
      ({ inputs }) => useMIDISelection(inputs),
      { initialProps: { inputs: [mockDevice1] } },
    );

    // Select the device
    act(() => {
      result.current.selectMIDIInput(mockDevice1);
    });
    expect(result.current.selectedMIDIInput).toBe(mockDevice1);

    // Update the hook with a new list of inputs (device removed)
    rerender({ inputs: [] });

    expect(result.current.selectedMIDIInput).toBeNull();
  });

  it("should remain selected if the device is still available", () => {
    const { result, rerender } = renderHook(
      ({ inputs }) => useMIDISelection(inputs),
      { initialProps: { inputs: [mockDevice1, mockDevice2] } },
    );

    act(() => {
      result.current.selectMIDIInput(mockDevice1);
    });

    // Update with device still present (but maybe others changed)
    rerender({ inputs: [mockDevice1] });

    expect(result.current.selectedMIDIInput).toBe(mockDevice1);
  });
});
