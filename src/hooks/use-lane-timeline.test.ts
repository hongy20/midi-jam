import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLaneTimeline } from "./use-lane-timeline";

describe("useLaneTimeline hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("initializes and plays Web Animation clock", () => {
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
      animate: animateMock,
    } as unknown as HTMLDivElement;
    const containerRef = { current: container };

    renderHook(() =>
      useLaneTimeline({
        containerRef,
        totalDurationMs: 1000,
        speed: 1,
      }),
    );

    expect(animateMock).toHaveBeenCalledWith([{ opacity: 1 }, { opacity: 1 }], {
      duration: 1000,
      fill: "both",
      easing: "linear",
    });
    expect(mockAnimation.play).toHaveBeenCalled();
  });

  it("resets timeline correctly", () => {
    const mockAnimation = {
      play: vi.fn(),
      pause: vi.fn(),
      cancel: vi.fn(),
      playbackRate: 1,
      playState: "running",
      _currentTime: 500,
      get currentTime() {
        return this._currentTime;
      },
      set currentTime(v) {
        this._currentTime = v;
      },
    };
    const animateMock = vi.fn().mockReturnValue(mockAnimation);

    const container = {
      animate: animateMock,
    } as unknown as HTMLDivElement;
    const containerRef = { current: container };

    const { result } = renderHook(() =>
      useLaneTimeline({
        containerRef,
        totalDurationMs: 1000,
        speed: 1,
      }),
    );

    act(() => {
      result.current.resetTimeline();
    });

    expect(mockAnimation.currentTime).toBe(0);
    expect(mockAnimation.play).toHaveBeenCalledTimes(2); // Initial + reset
  });

  it("applies initialTimeMs correctly", () => {
    const mockAnimation = {
      play: vi.fn(),
      pause: vi.fn(),
      cancel: vi.fn(),
      _currentTime: 0,
      get currentTime() {
        return this._currentTime;
      },
      set currentTime(v) {
        this._currentTime = v;
      },
      playbackRate: 1,
      playState: "running",
    };
    const animateMock = vi.fn().mockReturnValue(mockAnimation);

    const container = {
      animate: animateMock,
    } as unknown as HTMLDivElement;
    const containerRef = { current: container };

    renderHook(() =>
      useLaneTimeline({
        containerRef,
        totalDurationMs: 1000,
        speed: 1,
        initialTimeMs: 500,
      }),
    );

    expect(mockAnimation.currentTime).toBe(500);
  });

  it("updates speed (playbackRate) when speed prop changes", () => {
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
      animate: animateMock,
    } as unknown as HTMLDivElement;
    const containerRef = { current: container };

    const { rerender } = renderHook(
      ({ speed }) =>
        useLaneTimeline({
          containerRef,
          totalDurationMs: 1000,
          speed,
        }),
      {
        initialProps: { speed: 1 },
      },
    );

    expect(mockAnimation.playbackRate).toBe(1);

    rerender({ speed: 2 });

    expect(mockAnimation.playbackRate).toBe(2);
  });
});
