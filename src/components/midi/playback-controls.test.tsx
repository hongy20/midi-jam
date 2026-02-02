import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PlaybackControls } from "./playback-controls";

describe("PlaybackControls", () => {
  const mockProps = {
    isPlaying: false,
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onStop: vi.fn(),
    speed: 1.0,
    onSpeedChange: vi.fn(),
    isMuted: false,
    onToggleMute: vi.fn(),
  };

  it("renders playback buttons and speed selector", () => {
    render(<PlaybackControls {...mockProps} />);
    
    expect(screen.getByLabelText("Play")).toBeInTheDocument();
    expect(screen.getByLabelText("Stop")).toBeInTheDocument();
    expect(screen.getByLabelText("Mute")).toBeInTheDocument();
    expect(screen.getByText("1x")).toBeInTheDocument();
  });

  it("calls onPlay when play button is clicked", () => {
    render(<PlaybackControls {...mockProps} />);
    fireEvent.click(screen.getByLabelText("Play"));
    expect(mockProps.onPlay).toHaveBeenCalled();
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
