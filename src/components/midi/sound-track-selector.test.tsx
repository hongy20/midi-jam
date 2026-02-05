import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SoundTrackSelector } from "./sound-track-selector";

describe("SoundTrackSelector", () => {
  const mockFiles = [
    { name: "Song One", url: "/midi/song1.mid" },
    { name: "Song Two", url: "/midi/song2.mid" },
  ];

  const defaultProps = {
    files: mockFiles,
    selectedFile: null,
    onSelectFile: vi.fn(),
  };

  it("should render correctly", () => {
    render(<SoundTrackSelector {...defaultProps} />);
    expect(screen.getByText(/Song One/i)).toBeInTheDocument();
    expect(screen.getByText(/Song Two/i)).toBeInTheDocument();
  });

  it("should call onSelectFile when a file is selected", () => {
    render(<SoundTrackSelector {...defaultProps} />);

    const button = screen.getByText(/Song One/i).closest("button");
    if (button) fireEvent.click(button);

    expect(defaultProps.onSelectFile).toHaveBeenCalledWith(mockFiles[0]);
  });
});
