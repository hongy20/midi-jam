import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeProvider, useHome } from "./home-context";

describe("HomeProvider & useHome", () => {
  it("should throw an error if used outside of HomeProvider", () => {
    // Suppress console.error for this test as it's expected to throw
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useHome())).toThrow(
      "useHome must be used within a HomeProvider",
    );

    consoleSpy.mockRestore();
  });

  it("should initialize isLoading as true and isSupported based on navigator", async () => {
    vi.useFakeTimers();
    // Mock navigator.requestMIDIAccess
    const originalNavigator = global.navigator;
    Object.defineProperty(global, "navigator", {
      value: { requestMIDIAccess: vi.fn() },
      writable: true,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HomeProvider>{children}</HomeProvider>
    );

    const { result } = renderHook(() => useHome(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isSupported).toBe(true);

    // Fast-forward 1000ms
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.isLoading).toBe(false);

    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
    });
    vi.useRealTimers();
  });

  it("should handle lack of MIDI support", () => {
    // Mock navigator WITHOUT requestMIDIAccess
    const originalNavigator = global.navigator;
    Object.defineProperty(global, "navigator", {
      value: {},
      writable: true,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HomeProvider>{children}</HomeProvider>
    );

    const { result } = renderHook(() => useHome(), { wrapper });

    expect(result.current.isSupported).toBe(false);

    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
    });
  });

  it("should reset home state", async () => {
    vi.useFakeTimers();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HomeProvider>{children}</HomeProvider>
    );

    const { result } = renderHook(() => useHome(), { wrapper });

    // Fast-forward
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.isLoading).toBe(false);

    // Resetting doesn't actually change loading state once finished,
    // but we verify the function exists and is callable.
    act(() => {
      result.current.resetHome();
    });
    expect(result.current.isLoading).toBe(false);
    vi.useRealTimers();
  });
});
