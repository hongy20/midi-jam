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
});
