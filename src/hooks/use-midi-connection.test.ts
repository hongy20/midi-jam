import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMIDIConnection } from "./use-midi-connection";

describe("useMIDIConnection", () => {
  const mockDevice1 = { id: "1", name: "Device 1" } as WebMidi.MIDIInput;
  const mockDevice2 = { id: "2", name: "Device 2" } as WebMidi.MIDIInput;

  it("should start with no selected device", () => {
    const { result } = renderHook(() => useMIDIConnection([]));
    expect(result.current.selectedDevice).toBeNull();
  });

  it("should allow selecting a device", () => {
    const { result } = renderHook(() => useMIDIConnection([mockDevice1]));

    act(() => {
      result.current.selectDevice(mockDevice1);
    });

    expect(result.current.selectedDevice).toBe(mockDevice1);
  });

  it("should allow deselecting a device", () => {
    const { result } = renderHook(() => useMIDIConnection([mockDevice1]));

    act(() => {
      result.current.selectDevice(mockDevice1);
    });
    expect(result.current.selectedDevice).toBe(mockDevice1);

    act(() => {
      result.current.selectDevice(null);
    });
    expect(result.current.selectedDevice).toBeNull();
  });

  it("should auto-deselect if the selected device is no longer available", () => {
    // Start with the device available
    const { result, rerender } = renderHook(
      ({ inputs }) => useMIDIConnection(inputs),
      { initialProps: { inputs: [mockDevice1] } },
    );

    // Select the device
    act(() => {
      result.current.selectDevice(mockDevice1);
    });
    expect(result.current.selectedDevice).toBe(mockDevice1);

    // Update the hook with a new list of inputs (device removed)
    rerender({ inputs: [] });

    expect(result.current.selectedDevice).toBeNull();
  });

  it("should remain selected if the device is still available", () => {
    const { result, rerender } = renderHook(
      ({ inputs }) => useMIDIConnection(inputs),
      { initialProps: { inputs: [mockDevice1, mockDevice2] } },
    );

    act(() => {
      result.current.selectDevice(mockDevice1);
    });

    // Update with device still present (but maybe others changed)
    rerender({ inputs: [mockDevice1] });

    expect(result.current.selectedDevice).toBe(mockDevice1);
  });
});
