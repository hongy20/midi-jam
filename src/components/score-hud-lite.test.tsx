import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScoreHudLite } from "./score-hud-lite";

describe("ScoreHudLite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders score, combo and updates progress", () => {
    const getProgress = vi.fn().mockReturnValue(0.5);

    render(
      <ScoreHudLite
        score={1200}
        combo={5}
        lastHitQuality="perfect"
        getProgress={getProgress}
        isPaused={false}
      />,
    );

    expect(screen.getByText("1,200")).toBeInTheDocument();
    expect(screen.getByText(/x5/)).toBeInTheDocument();
    expect(screen.getByText(/perfect/i)).toBeInTheDocument();

    // Advance timers to trigger progress update
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it("does not update progress when paused", () => {
    const getProgress = vi.fn().mockReturnValue(0.5);

    render(
      <ScoreHudLite
        score={1200}
        combo={5}
        lastHitQuality="perfect"
        getProgress={getProgress}
        isPaused={true}
      />,
    );

    // Advance timers
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should still be 0% as it's paused
    expect(screen.getByText(/0%/)).toBeInTheDocument();
    expect(getProgress).not.toHaveBeenCalled();
  });
});
