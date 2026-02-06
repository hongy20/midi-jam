import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CountdownOverlay } from "./countdown-overlay";

describe("CountdownOverlay", () => {
  it("renders nothing when not active", () => {
    const { container } = render(
      <CountdownOverlay countdownRemaining={0} isActive={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders correctly for each countdown value", () => {
    const { rerender } = render(
      <CountdownOverlay countdownRemaining={4} isActive={true} />,
    );
    expect(screen.getByText("3")).toBeInTheDocument();

    rerender(<CountdownOverlay countdownRemaining={3} isActive={true} />);
    expect(screen.getByText("2")).toBeInTheDocument();

    rerender(<CountdownOverlay countdownRemaining={2} isActive={true} />);
    expect(screen.getByText("1")).toBeInTheDocument();

    rerender(<CountdownOverlay countdownRemaining={1} isActive={true} />);
    expect(screen.getByText("GO!")).toBeInTheDocument();
  });
});
