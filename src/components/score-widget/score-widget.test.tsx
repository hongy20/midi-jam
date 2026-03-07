import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ScoreWidget } from "./score-widget";

describe("ScoreWidget", () => {
  const defaultProps = {
    score: 1250,
    combo: 15,
    lastHitQuality: "perfect" as const,
    getProgress: () => 0.45,
    isPaused: false,
  };

  it("renders score, combo and updates progress", async () => {
    vi.useFakeTimers();
    render(<ScoreWidget {...defaultProps} />);

    expect(screen.getByText(/1,250/)).toBeInTheDocument();
    expect(screen.getByText(/x/)).toBeInTheDocument();
    expect(screen.getByText(/15/)).toBeInTheDocument();
    expect(screen.getByText(/perfect/)).toBeInTheDocument();

    // Advance time to trigger progress update interval
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText(/45/)).toBeInTheDocument();
    expect(screen.getByText(/%/)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("stops interval when paused", () => {
    const getProgress = vi.fn(() => 0.5);
    const { unmount } = render(
      <ScoreWidget
        {...defaultProps}
        getProgress={getProgress}
        isPaused={true}
      />,
    );

    // Should not call getProgress immediately if paused
    expect(getProgress).not.toHaveBeenCalled();
    unmount();
  });
});
