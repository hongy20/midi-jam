import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLaneTimeline } from "./use-lane-timeline";

describe("useLaneTimeline hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    // Mock ResizeObserver to immediately call its callback
    global.ResizeObserver = class ResizeObserver {
      callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }
      observe(_target: Element) {
        this.callback([], this);
      }
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("updates scrollTop as time passes", () => {
    const container = {
      scrollHeight: 1000,
      clientHeight: 400,
      scrollTop: 600, // maxScroll
    } as HTMLDivElement;
    const containerRef = { current: container };

    renderHook(() =>
      useLaneTimeline({
        containerRef,
        totalDurationMs: 1000,
        speed: 1,
        isPaused: false,
      }),
    );

    // Advance time by 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Progress 0.5, scrollTop should be around 300
    expect(container.scrollTop).toBeLessThan(600);
    expect(container.scrollTop).toBeGreaterThan(0);
  });

  it("pauses updates when isPaused is true", () => {
    const container = {
      scrollHeight: 1000,
      clientHeight: 400,
      scrollTop: 600,
    } as HTMLDivElement;
    const containerRef = { current: container };

    const { rerender } = renderHook(
      ({ isPaused }) =>
        useLaneTimeline({
          containerRef,
          totalDurationMs: 1000,
          speed: 1,
          isPaused,
        }),
      {
        initialProps: { isPaused: false },
      },
    );

    act(() => {
      vi.advanceTimersByTime(250);
    });
    const scrollAfterSomeTime = container.scrollTop;
    expect(scrollAfterSomeTime).toBeLessThan(600);

    rerender({ isPaused: true });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Should remain same as when it was paused
    expect(container.scrollTop).toBe(scrollAfterSomeTime);
  });

  it("resets timeline correctly", () => {
    const container = {
      scrollHeight: 1000,
      clientHeight: 400,
      scrollTop: 0,
    } as HTMLDivElement;
    const containerRef = { current: container };

    const { result } = renderHook(() =>
      useLaneTimeline({
        containerRef,
        totalDurationMs: 1000,
        speed: 1,
        isPaused: false,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(container.scrollTop).not.toBe(600);

    act(() => {
      result.current.resetTimeline();
    });

    expect(container.scrollTop).toBe(600); // maxScroll
    expect(result.current.getCurrentTimeMs()).toBe(0);
  });
});
