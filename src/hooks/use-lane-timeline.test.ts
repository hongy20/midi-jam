import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLaneTimeline } from "./use-lane-timeline";

describe("useLaneTimeline hook", () => {
  const mockAnimate = vi.fn();
  const mockCancel = vi.fn();
  const mockPlay = vi.fn();
  const mockPause = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAnimate.mockReturnValue({
      play: mockPlay,
      pause: mockPause,
      cancel: mockCancel,
      currentTime: 0,
      playbackRate: 1,
    });
  });

  it("initializes animation on mount", () => {
    const container = {
      animate: mockAnimate,
      scrollHeight: 1000,
      clientHeight: 500,
    } as any;
    const containerRef = { current: container };

    renderHook(() =>
      useLaneTimeline({
        containerRef,
        totalDurationMs: 10000,
        speed: 1,
        isPaused: true,
      }),
    );

    expect(mockAnimate).toHaveBeenCalled();
    expect(mockPause).toHaveBeenCalled();
  });

  it("plays animation when isPaused is false", () => {
    const container = {
      animate: mockAnimate,
      scrollHeight: 1000,
      clientHeight: 500,
    } as any;
    const containerRef = { current: container };

    const { rerender } = renderHook(
      ({ isPaused }) =>
        useLaneTimeline({
          containerRef,
          totalDurationMs: 10000,
          speed: 1,
          isPaused,
        }),
      {
        initialProps: { isPaused: true },
      },
    );

    rerender({ isPaused: false });
    expect(mockPlay).toHaveBeenCalled();
  });
});
