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
        this.callback([], this as unknown as ResizeObserver);
      }
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("initializes and plays Web Animation", () => {
    const mockAnimation = {
      play: vi.fn(),
      pause: vi.fn(),
      cancel: vi.fn(),
      playbackRate: 1,
      playState: "running",
      currentTime: 0,
    };
    const animateMock = vi.fn().mockReturnValue(mockAnimation);

    const container = {
      scrollHeight: 1000,
      clientHeight: 400,
      querySelector: vi.fn().mockReturnValue({ animate: animateMock }),
    } as unknown as HTMLDivElement;
    const containerRef = { current: container };

    renderHook(() =>
      useLaneTimeline({
        containerRef,
        totalDurationMs: 1000,
        speed: 1,
        isPaused: false,
      }),
    );

    expect(animateMock).toHaveBeenCalledWith(
      [{ transform: `translateY(-600px)` }, { transform: `translateY(0px)` }],
      { duration: 1000, fill: "both", easing: "linear" },
    );
    expect(mockAnimation.play).toHaveBeenCalled();
  });

  it("pauses animation when isPaused is true", () => {
    const mockAnimation = {
      play: vi.fn(),
      pause: vi.fn(),
      cancel: vi.fn(),
      playbackRate: 1,
      playState: "running",
      currentTime: 0,
    };
    const animateMock = vi.fn().mockReturnValue(mockAnimation);

    const container = {
      scrollHeight: 1000,
      clientHeight: 400,
      querySelector: vi.fn().mockReturnValue({ animate: animateMock }),
    } as unknown as HTMLDivElement;
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

    expect(mockAnimation.play).toHaveBeenCalled();

    rerender({ isPaused: true });

    expect(mockAnimation.pause).toHaveBeenCalled();
  });

  it("resets timeline correctly", () => {
    const mockAnimation = {
      play: vi.fn(),
      pause: vi.fn(),
      cancel: vi.fn(),
      playbackRate: 1,
      playState: "running",
      currentTime: 500,
    };
    const animateMock = vi.fn().mockReturnValue(mockAnimation);

    const container = {
      scrollHeight: 1000,
      clientHeight: 400,
      querySelector: vi.fn().mockReturnValue({ animate: animateMock }),
    } as unknown as HTMLDivElement;
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
      result.current.resetTimeline();
    });

    expect(mockAnimation.currentTime).toBe(0);
    expect(mockAnimation.play).toHaveBeenCalledTimes(2); // Initial + reset
  });
});
