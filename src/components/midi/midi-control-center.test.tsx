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
  };

  it("should render correctly", () => {
    render(<MidiControlCenter {...defaultProps} />);
    expect(screen.getByLabelText(/music library/i)).toBeInTheDocument();
  });

  it("should call onSelectFile when a file is selected", () => {
    render(<MidiControlCenter {...defaultProps} />);

    const select = screen.getByLabelText(/music library/i);
    fireEvent.change(select, { target: { value: "/midi/song1.mid" } });

    expect(defaultProps.onSelectFile).toHaveBeenCalledWith(mockFiles[0]);
  });
});