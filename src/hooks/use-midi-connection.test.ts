import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMIDIConnection } from "./use-midi-connection";

describe("useMIDIConnection", () => {
  it("should start with no selected device", () => {
    const { result } = renderHook(() => useMIDIConnection());
    expect(result.current.selectedDevice).toBeNull();
  });

  it("should allow selecting a device", () => {
    const { result } = renderHook(() => useMIDIConnection());
    const mockDevice = { id: "1", name: "Test Device" } as WebMidi.MIDIInput;

    act(() => {
      result.current.selectDevice(mockDevice);
    });

    expect(result.current.selectedDevice).toBe(mockDevice);
  });

  it("should allow deselecting a device", () => {
    const { result } = renderHook(() => useMIDIConnection());
    const mockDevice = { id: "1", name: "Test Device" } as WebMidi.MIDIInput;

    act(() => {
      result.current.selectDevice(mockDevice);
    });
    expect(result.current.selectedDevice).toBe(mockDevice);

    act(() => {
      result.current.selectDevice(null);
    });
    expect(result.current.selectedDevice).toBeNull();
  });
});
