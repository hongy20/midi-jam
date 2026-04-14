import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScoreWidget } from "./score-widget";

describe("ScoreWidget", () => {
  const defaultProps = {
    getScore: () => 1250,
    getCombo: () => 15,
    getLastHitQuality: () => "perfect" as const,
    getProgress: () => 0.45,
  };

  it("renders score, combo and updates progress via rAF", async () => {
    render(<ScoreWidget {...defaultProps} />);

    // rAF loop takes a frame to update the DOM
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    });

    expect(screen.getByText(/1,250/)).toBeInTheDocument();
    expect(screen.getByText(/15/)).toBeInTheDocument();
    expect(screen.getByText(/PERFECT!/)).toBeInTheDocument();
    expect(screen.getByText(/45%/)).toBeInTheDocument();
  });
});
