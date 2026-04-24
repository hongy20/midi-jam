import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OptionsProvider, useOptions } from "./options-context";

describe("OptionsProvider & useOptions", () => {
  it("should throw an error if used outside of OptionsProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useOptions())).toThrow(
      "useOptions must be used within an OptionsProvider",
    );
    consoleSpy.mockRestore();
  });

  it("should provide speed and demoMode with defaults", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OptionsProvider>{children}</OptionsProvider>
    );

    const { result } = renderHook(() => useOptions(), { wrapper });

    expect(result.current.speed).toBe(1.0);
    expect(result.current.demoMode).toBe(true);
  });

  it("should allow updating speed and demoMode", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OptionsProvider>{children}</OptionsProvider>
    );

    const { result } = renderHook(() => useOptions(), { wrapper });

    act(() => {
      result.current.setSpeed(1.5);
      result.current.setDemoMode(false);
    });

    expect(result.current.speed).toBe(1.5);
    expect(result.current.demoMode).toBe(false);
  });
});
