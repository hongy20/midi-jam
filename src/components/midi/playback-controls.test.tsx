import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlaybackControls } from "./playback-controls";

describe("PlaybackControls", () => {
  const mockProps = {
    isPlaying: false,
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onStop: vi.fn(),
    speed: 1.0,
    onSpeedChange: vi.fn(),
    demoMode: true,
    onToggleDemo: vi.fn(),
  };

  it("renders playback buttons and speed selector", () => {
    render(<PlaybackControls {...mockProps} />);

    expect(screen.getByLabelText("Play")).toBeInTheDocument();
    expect(screen.getByLabelText("Stop")).toBeInTheDocument();
    expect(screen.getByLabelText(/demo/i)).toBeInTheDocument();
    expect(screen.getByText("1x")).toBeInTheDocument();
    // Mute should be gone
    expect(screen.queryByLabelText(/mute/i)).not.toBeInTheDocument();
  });

  it("calls onPlay when play button is clicked", () => {
    render(<PlaybackControls {...mockProps} />);
    fireEvent.click(screen.getByLabelText("Play"));
    expect(mockProps.onPlay).toHaveBeenCalled();
  });

  it("calls onToggleDemo when demo button is clicked", () => {
    render(<PlaybackControls {...mockProps} />);
    fireEvent.click(screen.getByLabelText(/demo/i));
    expect(mockProps.onToggleDemo).toHaveBeenCalled();
  });

  it("shows pause button when isPlaying is true", () => {
    render(<PlaybackControls {...mockProps} isPlaying={true} />);
    expect(screen.getByLabelText("Pause")).toBeInTheDocument();
  });

  it("calls onSpeedChange when a speed is selected", () => {
    render(<PlaybackControls {...mockProps} />);
    fireEvent.click(screen.getByText("1.5x"));
    expect(mockProps.onSpeedChange).toHaveBeenCalledWith(1.5);
  });
});
