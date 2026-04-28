import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HomePageView } from "./home-page.view";

describe("HomePageView", () => {
  const defaultProps = {
    onStart: vi.fn(),
    onOptions: vi.fn(),
    tracksCount: 0,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    // Mock MIDI support
    Object.defineProperty(global.navigator, "requestMIDIAccess", {
      value: vi.fn().mockResolvedValue({}),
      configurable: true,
    });
  });

  it("renders correctly when ready", () => {
    render(<HomePageView {...defaultProps} />);
    expect(screen.getByText(/MIDI JAM/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /START/i })).toBeInTheDocument();
  });

  it("calls onStart when start button is clicked", () => {
    render(<HomePageView {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /START/i }));
    expect(defaultProps.onStart).toHaveBeenCalled();
  });

  it("calls onOptions when options button is clicked", () => {
    render(<HomePageView {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Options/i }));
    expect(defaultProps.onOptions).toHaveBeenCalled();
  });
});
