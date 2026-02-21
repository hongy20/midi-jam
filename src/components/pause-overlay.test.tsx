import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PauseOverlay } from "./pause-overlay";

describe("PauseOverlay", () => {
  const defaultProps = {
    isVisible: true,
    onResume: vi.fn(),
    onRestart: vi.fn(),
    onSettings: vi.fn(),
    onQuit: vi.fn(),
  };

  it("renders nothing when not visible", () => {
    const { container } = render(
      <PauseOverlay {...defaultProps} isVisible={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the paused title and buttons when visible", () => {
    render(<PauseOverlay {...defaultProps} />);
    expect(screen.getByText("Paused")).toBeInTheDocument();
    expect(screen.getByText("RESUME")).toBeInTheDocument();
    expect(screen.getByText("RESTART")).toBeInTheDocument();
    expect(screen.getByText("SETTINGS ⚙️")).toBeInTheDocument();
    expect(screen.getByText("QUIT GAME")).toBeInTheDocument();
  });

  it("calls the correct handlers when buttons are clicked", () => {
    render(<PauseOverlay {...defaultProps} />);

    fireEvent.click(screen.getByText("RESUME"));
    expect(defaultProps.onResume).toHaveBeenCalled();

    fireEvent.click(screen.getByText("RESTART"));
    expect(defaultProps.onRestart).toHaveBeenCalled();

    fireEvent.click(screen.getByText("SETTINGS ⚙️"));
    expect(defaultProps.onSettings).toHaveBeenCalled();

    fireEvent.click(screen.getByText("QUIT GAME"));
    expect(defaultProps.onQuit).toHaveBeenCalled();
  });
});
