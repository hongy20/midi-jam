import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScoreHudLite } from "./score-hud-lite";

describe("ScoreHudLite", () => {
  it("renders score, combo and progress", () => {
    render(
      <ScoreHudLite
        score={1200}
        combo={5}
        lastHitQuality="perfect"
        progress={0.5}
      />,
    );
    expect(screen.getByText("1,200")).toBeInTheDocument();
    expect(screen.getByText(/x5/)).toBeInTheDocument();
    expect(screen.getByText(/perfect/i)).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });
});
