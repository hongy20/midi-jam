import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useWakeLock } from "./use-wake-lock";

describe("useWakeLock", () => {
  const mockRelease = vi.fn().mockResolvedValue(undefined);
  const mockAddEventListener = vi.fn();
  const mockRequest = vi.fn().mockResolvedValue({
    release: mockRelease,
    addEventListener: mockAddEventListener,
  });

  beforeEach(() => {
    // Stub navigator.wakeLock without replacing the whole navigator
    vi.stubGlobal("navigator", {
      ...global.navigator,
      wakeLock: {
        request: mockRequest,
      },
    });

    // Mock visibilityState on the real document
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
      writable: true,
    });

    vi.spyOn(document, "addEventListener");
    vi.spyOn(document, "removeEventListener");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("requests wake lock when isActive is true", async () => {
    renderHook(() => useWakeLock(true));
    // Wait for promise to resolve
    await vi.waitFor(() => {
      expect(mockRequest).toHaveBeenCalledWith("screen");
    });
  });

  it("does not request wake lock when isActive is false", () => {
    renderHook(() => useWakeLock(false));
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it("releases wake lock when isActive becomes false", async () => {
    const { rerender } = renderHook(({ isActive }) => useWakeLock(isActive), {
      initialProps: { isActive: true },
    });

    await vi.waitFor(() => {
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    rerender({ isActive: false });
    await vi.waitFor(() => {
      expect(mockRelease).toHaveBeenCalled();
    });
  });

  it("releases wake lock on unmount", async () => {
    const { unmount } = renderHook(() => useWakeLock(true));

    await vi.waitFor(() => {
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    unmount();
    await vi.waitFor(() => {
      expect(mockRelease).toHaveBeenCalled();
    });
  });

  it("re-requests wake lock on visibility change to visible", async () => {
    let releaseHandler: (() => void) | undefined;
    mockAddEventListener.mockImplementation((event, handler) => {
      if (event === "release") releaseHandler = handler;
    });

    const addEventListenerSpy = vi.spyOn(document, "addEventListener");
    renderHook(() => useWakeLock(true));

    await vi.waitFor(() => {
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    expect(releaseHandler).toBeDefined();

    // Find the visibilitychange listener
    const visibilityListener = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === "visibilitychange",
    )?.[1] as EventListener;

    expect(visibilityListener).toBeDefined();

    // Simulate browser releasing the lock when hidden
    releaseHandler?.();

    // Change visibility to visible and trigger listener
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
    });

    await visibilityListener(new Event("visibilitychange"));

    await vi.waitFor(() => {
      expect(mockRequest).toHaveBeenCalledTimes(2);
    });
  });

  it("does not crash if wakeLock is not supported", () => {
    vi.stubGlobal("navigator", { ...global.navigator, wakeLock: undefined });
    expect(() => {
      renderHook(() => useWakeLock(true));
    }).not.toThrow();
  });
});
