import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LiveScore } from "./live-score";

describe("LiveScore", () => {
  const defaultProps = {
    getScore: () => 50.0,
    getCombo: () => 15,
    lastHit: { quality: "perfect" as const, id: 1 },
    getProgress: () => 0.45,
  };

  it("renders score, combo and updates progress via rAF", async () => {
    render(<LiveScore {...defaultProps} />);

    // rAF loop takes a frame to update the DOM
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    });

    expect(screen.getByText(/50.0/)).toBeInTheDocument();
    expect(screen.getByText(/x15/)).toBeInTheDocument(); // Expecting x15 for combo
    expect(screen.getByText(/PERFECT!/)).toBeInTheDocument();
    expect(screen.getByText(/45%/)).toBeInTheDocument();
  });
});
