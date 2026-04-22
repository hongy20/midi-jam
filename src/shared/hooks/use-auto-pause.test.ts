import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAutoPause } from "./use-auto-pause";

describe("useAutoPause", () => {
  const onPause = vi.fn();

  beforeEach(() => {
    onPause.mockReset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls onPause when the window loses focus (blur)", () => {
    renderHook(() => useAutoPause(onPause));

    vi.spyOn(document, "hasFocus").mockReturnValue(false);

    const blurEvent = new Event("blur");
    window.dispatchEvent(blurEvent);

    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it("calls onPause when the document visibility changes to hidden", () => {
    renderHook(() => useAutoPause(onPause));

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });

    const visEvent = new Event("visibilitychange");
    document.dispatchEvent(visEvent);

    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it("does not call onPause if the document visibility is visible and focus is maintained", () => {
    renderHook(() => useAutoPause(onPause));

    vi.spyOn(document, "hasFocus").mockReturnValue(true);
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });

    const visEvent = new Event("visibilitychange");
    document.dispatchEvent(visEvent);

    expect(onPause).not.toHaveBeenCalled();
  });

  it("debounces simultaneous events and calls onPause only once", () => {
    renderHook(() => useAutoPause(onPause));

    vi.spyOn(document, "hasFocus").mockReturnValue(false);
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });

    // Dispatch both events at the same time
    window.dispatchEvent(new Event("blur"));
    document.dispatchEvent(new Event("visibilitychange"));

    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it("allows subsequent triggers after the debounce period", () => {
    renderHook(() => useAutoPause(onPause));

    vi.spyOn(document, "hasFocus").mockReturnValue(false);

    window.dispatchEvent(new Event("blur"));
    expect(onPause).toHaveBeenCalledTimes(1);

    // Fast forward past DEBOUNCE_MS (100ms)
    vi.advanceTimersByTime(200);

    window.dispatchEvent(new Event("blur"));
    expect(onPause).toHaveBeenCalledTimes(2);
  });
});
