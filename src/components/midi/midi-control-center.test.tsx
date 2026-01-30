import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MidiControlCenter } from "./midi-control-center";

describe("MidiControlCenter", () => {
  const mockFiles = [
    { name: "Song One", url: "/midi/song1.mid" },
    { name: "Song Two", url: "/midi/song2.mid" },
  ];

  const defaultProps = {
    files: mockFiles,
    selectedFile: null,
    onSelectFile: vi.fn(),
    isPlaying: false,
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onStop: vi.fn(),
    speed: 1,
    onSpeedChange: vi.fn(),
    isMuted: false,
    onToggleMute: vi.fn(),
  };

  it("should render correctly", () => {
    render(<MidiControlCenter {...defaultProps} />);

    expect(screen.getByLabelText(/select midi file/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /play/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /stop/i })).toBeDefined();
    expect(screen.getByLabelText(/mute/i)).toBeDefined();
  });

  it("should call onToggleMute when mute button is clicked", () => {
    render(<MidiControlCenter {...defaultProps} />);

    const muteButton = screen.getByLabelText(/mute/i);
    fireEvent.click(muteButton);
    expect(defaultProps.onToggleMute).toHaveBeenCalled();
  });

  it("should call onSelectFile when a file is selected", () => {
    render(<MidiControlCenter {...defaultProps} />);

    const select = screen.getByLabelText(/select midi file/i);
    fireEvent.change(select, { target: { value: "/midi/song1.mid" } });

    expect(defaultProps.onSelectFile).toHaveBeenCalledWith(mockFiles[0]);
  });

  it("should call onPlay/onPause when play button is clicked and file is selected", () => {
    const props = { ...defaultProps, selectedFile: mockFiles[0] };
    const { rerender } = render(<MidiControlCenter {...props} />);

    const playButton = screen.getByRole("button", { name: /play/i });
    fireEvent.click(playButton);
    expect(defaultProps.onPlay).toHaveBeenCalled();

    rerender(<MidiControlCenter {...props} isPlaying={true} />);
    const pauseButton = screen.getByRole("button", { name: /pause/i });
    fireEvent.click(pauseButton);
    expect(defaultProps.onPause).toHaveBeenCalled();
  });

  it("should call onStop when stop button is clicked and file is selected", () => {
    const props = { ...defaultProps, selectedFile: mockFiles[0] };
    render(<MidiControlCenter {...props} />);

    const stopButton = screen.getByRole("button", { name: /stop/i });
    fireEvent.click(stopButton);
    expect(defaultProps.onStop).toHaveBeenCalled();
  });

  it("should call onSpeedChange when speed is selected", () => {
    render(<MidiControlCenter {...defaultProps} />);

    const speedButton = screen.getByText("1.5x");
    fireEvent.click(speedButton);
    expect(defaultProps.onSpeedChange).toHaveBeenCalledWith(1.5);
  });
});
