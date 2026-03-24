import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ScoreWidget } from "./score-widget";

describe("ScoreWidget", () => {
  const defaultProps = {
    score: 1250,
    combo: 15,
    lastHitQuality: "perfect" as const,
    getProgress: () => 0.45,
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
});
