import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLaneTimeline } from "./use-lane-timeline";

describe("useLaneTimeline hook", () => {
  let roCallback: ResizeObserverCallback = () => {};

  beforeEach(() => {
    vi.useFakeTimers();

    // Mock ResizeObserver to capture its callback
    global.ResizeObserver = class ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        roCallback = callback;
      }
      observe(_target: Element) {
        // Initial call
        roCallback([], this as unknown as ResizeObserver);
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
      [{ transform: "translateY(-600px)" }, { transform: "translateY(0px)" }],
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

  it("restores progress and state on resize", () => {
    const mockAnimation = {
      play: vi.fn(),
      pause: vi.fn(),
      cancel: vi.fn(),
      playbackRate: 1.5,
      playState: "running",
      currentTime: 250,
      effect: {
        getComputedTiming: () => ({ progress: 0.25 }),
      },
      onfinish: null,
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
        speed: 1.5,
        isPaused: false,
      }),
    );

    expect(animateMock).toHaveBeenCalledTimes(1);

    // Simulate resize
    act(() => {
      // @ts-ignore
      container.clientHeight = 500; // New clientHeight, maxScrollPx becomes 500
      roCallback([], {} as ResizeObserver);
    });

    // Should re-create animation with new keyframes
    expect(animateMock).toHaveBeenCalledTimes(2);
    expect(animateMock).toHaveBeenLastCalledWith(
      [{ transform: "translateY(-500px)" }, { transform: "translateY(0px)" }],
      expect.any(Object),
    );

    // Should restore state
    expect(mockAnimation.currentTime).toBe(250);
    expect(mockAnimation.playbackRate).toBe(1.5);
    expect(mockAnimation.play).toHaveBeenCalledTimes(2); // Initial + after resize
  });
});
