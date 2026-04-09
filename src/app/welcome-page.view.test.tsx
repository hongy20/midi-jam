import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WelcomePageView } from "./welcome-page.view";

describe("WelcomePageView", () => {
  const defaultProps = {
    isLoading: false,
    isSupported: true,
    loadingTimeout: 1000,
    onStart: vi.fn(),
    onOptions: vi.fn(),
  };

  it("renders correctly when ready", () => {
    render(<WelcomePageView {...defaultProps} />);
    expect(screen.getByText(/MIDI JAM/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /START/i })).toBeInTheDocument();
  });

  it("shows loader when loading", () => {
    render(<WelcomePageView {...defaultProps} isLoading={true} />);
    expect(screen.getByText(/INITIALIZING ENGINE/i)).toBeInTheDocument();
  });

  it("shows error when not supported", () => {
    render(<WelcomePageView {...defaultProps} isSupported={false} />);
    expect(screen.getByText(/UNSUPPORTED BROWSER/i)).toBeInTheDocument();
  });

  it("calls onStart when start button is clicked", () => {
    render(<WelcomePageView {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /START/i }));
    expect(defaultProps.onStart).toHaveBeenCalled();
  });

  it("calls onOptions when options button is clicked", () => {
    render(<WelcomePageView {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Options/i }));
    expect(defaultProps.onOptions).toHaveBeenCalled();
  });
});
