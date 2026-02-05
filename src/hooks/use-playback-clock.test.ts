import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePlaybackClock } from "./use-playback-clock";

describe("usePlaybackClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(performance, "now").mockReturnValue(0);

    // Make requestAnimationFrame behave like setTimeout and cancelAnimationFrame like clearTimeout
    let rafId = 0;
    const rafTimers = new Map<number, NodeJS.Timeout>();
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      const id = ++rafId;

      const timeoutId = setTimeout(() => {
        rafTimers.delete(id);
        cb(performance.now());
      }, 16);

      rafTimers.set(id, timeoutId);
      return id;
    });

    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      const timeoutId = rafTimers.get(id);
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
        rafTimers.delete(id);
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() =>
      usePlaybackClock({ duration: 10, initialTime: -4 }),
    );

    expect(result.current.currentTime).toBe(-4);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.speed).toBe(1);
    expect(result.current.isCountdownActive).toBe(false);
    expect(result.current.countdownRemaining).toBe(0);
  });

  it("should start playing and progress time", async () => {
    const { result } = renderHook(() =>
      usePlaybackClock({ duration: 10, initialTime: 0 }),
    );

    act(() => {
      result.current.play();
    });

    expect(result.current.isPlaying).toBe(true);

    // Advance 1 second
    vi.spyOn(performance, "now").mockReturnValue(1000);
    await act(async () => {
      vi.advanceTimersByTime(16); // Trigger one tick
    });

    expect(result.current.currentTime).toBeGreaterThan(0);
  });

  it("should handle countdown (negative initial time) at 1x speed", async () => {
    const { result } = renderHook(() =>
      usePlaybackClock({ duration: 10, initialTime: -4 }),
    );

    act(() => {
      result.current.play();
    });

    expect(result.current.isCountdownActive).toBe(true);
    expect(result.current.countdownRemaining).toBe(4);

    // Advance 1 second
    vi.spyOn(performance, "now").mockReturnValue(1000);
    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    expect(result.current.currentTime).toBe(-3);
    expect(result.current.countdownRemaining).toBe(3);
  });

  it("should pause and resume without losing position", async () => {
    const { result } = renderHook(() =>
      usePlaybackClock({ duration: 10, initialTime: 0 }),
    );

    act(() => {
      result.current.play();
    });

    // Advance 2 seconds
    vi.spyOn(performance, "now").mockReturnValue(2000);
    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    const timeBeforePause = result.current.currentTime;
    expect(timeBeforePause).toBe(2);

    act(() => {
      result.current.pause();
    });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTime).toBe(2);

    // Advance 5 seconds while paused
    vi.spyOn(performance, "now").mockReturnValue(7000);

    act(() => {
      result.current.play();
    });

    expect(result.current.currentTime).toBe(2);
    expect(result.current.isPlaying).toBe(true);
  });

  it("should adjust progression based on speed", async () => {
    const { result } = renderHook(() =>
      usePlaybackClock({ duration: 10, initialTime: 0 }),
    );

    act(() => {
      result.current.setSpeed(2);
      result.current.play();
    });

    // Advance 1 real second
    vi.spyOn(performance, "now").mockReturnValue(1000);
    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    // currentTime should be 2 because speed is 2x
    expect(result.current.currentTime).toBe(2);
  });

  it("should stop and reset to initial time", async () => {
    const { result } = renderHook(() =>
      usePlaybackClock({ duration: 10, initialTime: -4 }),
    );

    act(() => {
      result.current.play();
    });

    vi.spyOn(performance, "now").mockReturnValue(5000);
    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    expect(result.current.currentTime).toBeGreaterThan(0);

    act(() => {
      result.current.stop();
    });

    expect(result.current.currentTime).toBe(-4);
    expect(result.current.isPlaying).toBe(false);
  });

  it("should stop automatically when duration is reached", async () => {
    const { result } = renderHook(() =>
      usePlaybackClock({ duration: 5, initialTime: 0 }),
    );

    act(() => {
      result.current.play();
    });

    vi.spyOn(performance, "now").mockReturnValue(6000);
    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    expect(result.current.currentTime).toBe(5);
    expect(result.current.isPlaying).toBe(false);
  });

  it("should call onTick when time updates", async () => {
    const onTick = vi.fn();
    renderHook(() =>
      usePlaybackClock({ duration: 10, initialTime: 0, onTick }),
    );

    act(() => {
      // Logic inside play doesn't call onTick immediately, tick loop does
    });

    // We need to trigger a play to start the tick loop
    const { result } = renderHook(() =>
      usePlaybackClock({ duration: 10, initialTime: 0, onTick }),
    );

    act(() => {
      result.current.play();
    });

    vi.spyOn(performance, "now").mockReturnValue(1000);
    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    expect(onTick).toHaveBeenCalledWith(expect.any(Number));
  });
});
