import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useTimeline } from "./use-timeline";

describe("useTimeline hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(performance, "now").mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const mockOnFinish = vi.fn();

  it("calculates progress and time correctly", () => {
    const { result } = renderHook(() =>
      useTimeline({
        totalDurationMs: 10000,
        speed: 1,
        onFinish: mockOnFinish,
      }),
    );

    // After 5 seconds
    vi.spyOn(performance, "now").mockReturnValue(5000);
    expect(result.current.getCurrentTimeMs()).toBe(5000);
    expect(result.current.getProgress()).toBe(0.5);

    // After 10 seconds
    vi.spyOn(performance, "now").mockReturnValue(10000);
    expect(result.current.getCurrentTimeMs()).toBe(10000);
    expect(result.current.getProgress()).toBe(1);
  });

  it("handles speed correctly", () => {
    const { result } = renderHook(() =>
      useTimeline({
        totalDurationMs: 10000,
        speed: 2,
        onFinish: mockOnFinish,
      }),
    );

    // After 2.5 seconds real time, 5 seconds game time should have passed
    vi.spyOn(performance, "now").mockReturnValue(2500);
    expect(result.current.getCurrentTimeMs()).toBe(5000);
    expect(result.current.getProgress()).toBe(0.5);
  });

  it("calls onFinish at the correct time", () => {
    renderHook(() =>
      useTimeline({
        totalDurationMs: 10000,
        speed: 1,
        onFinish: mockOnFinish,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(9999);
    });
    expect(mockOnFinish).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(mockOnFinish).toHaveBeenCalled();
  });

  it("resets timeline correctly", () => {
    const { result } = renderHook(() =>
      useTimeline({
        totalDurationMs: 10000,
        speed: 1,
        onFinish: mockOnFinish,
      }),
    );

    // Run for 3 seconds
    vi.spyOn(performance, "now").mockReturnValue(3000);
    expect(result.current.getCurrentTimeMs()).toBe(3000);

    // Reset
    act(() => {
      // We must mock performance.now() again at the time of reset
      vi.spyOn(performance, "now").mockReturnValue(3000);
      result.current.resetTimeline();
    });

    // After another 2 seconds real time (5s total), game time should only be 2s
    vi.spyOn(performance, "now").mockReturnValue(5000);
    expect(result.current.getCurrentTimeMs()).toBe(2000);
  });
});
