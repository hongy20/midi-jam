import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScoreHud } from "./score-hud";

describe("ScoreHud", () => {
  it("renders basic score and high score", () => {
    render(
      <ScoreHud
        score={123.4}
        combo={0}
        lastAccuracy={null}
        highScore={500}
        bestCombo={10}
      />,
    );

    expect(screen.getByText("123.4")).toBeInTheDocument();
    expect(screen.getByText("500.0")).toBeInTheDocument();
    expect(screen.getByText("10x")).toBeInTheDocument();
  });

  it("renders combo when it is >= 2", () => {
    render(
      <ScoreHud
        score={0}
        combo={5}
        lastAccuracy={null}
        highScore={0}
        bestCombo={0}
      />,
    );

    expect(screen.getByText("5x COMBO")).toBeInTheDocument();
  });

  it("does not render combo when it is < 2", () => {
    render(
      <ScoreHud
        score={0}
        combo={1}
        lastAccuracy={null}
        highScore={0}
        bestCombo={0}
      />,
    );

    expect(screen.queryByText("1x COMBO")).not.toBeInTheDocument();
  });

  it("renders accuracy feedback when provided", () => {
    render(
      <ScoreHud
        score={0}
        combo={0}
        lastAccuracy={{ type: "PERFECT", id: 123 }}
        highScore={0}
        bestCombo={0}
      />,
    );

    expect(screen.getByText("PERFECT!")).toBeInTheDocument();
  });
});
