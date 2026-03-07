import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GearProvider, useGear } from "./gear-context";

// Mock hooks used by GearProvider
vi.mock("@/hooks/use-midi-devices", () => ({
  useMIDIDevices: vi.fn(() => ({
    inputs: [{ id: "input-1", name: "Mock Input" }],
    outputs: [{ id: "output-1", name: "Mock Output" }],
    isLoading: false,
    error: null,
  })),
}));

vi.mock("@/hooks/use-midi-selection", () => ({
  useMIDISelection: vi.fn((inputs, outputs) => ({
    selectedMIDIInput: inputs[0] || null,
    selectedMIDIOutput: outputs[0] || null,
    selectMIDIInput: vi.fn(),
  })),
}));

describe("GearProvider & useGear", () => {
  it("should throw an error if used outside of GearProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useGear())).toThrow(
      "useGear must be used within a GearProvider",
    );
    consoleSpy.mockRestore();
  });

  it("should provide MIDI devices and selection state", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GearProvider>{children}</GearProvider>
    );

    const { result } = renderHook(() => useGear(), { wrapper });

    expect(result.current.inputs).toHaveLength(1);
    expect(result.current.outputs).toHaveLength(1);
    expect(result.current.selectedMIDIInput?.name).toBe("Mock Input");
    expect(result.current.selectedMIDIOutput?.name).toBe("Mock Output");
  });
});
