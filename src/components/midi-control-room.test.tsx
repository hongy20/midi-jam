import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MidiControlRoom } from "./midi-control-room";

// Mock child components
vi.mock("@/components/midi/device-selector", () => ({
  DeviceSelector: ({
    selectedMIDIInput,
  }: {
    selectedMIDIInput: { name: string } | null;
  }) => (
    <div data-testid="device-selector">
      {selectedMIDIInput ? selectedMIDIInput.name : "No Device"}
    </div>
  ),
}));

vi.mock("@/components/midi/sound-track-selector", () => ({
  SoundTrackSelector: ({
    selectedFile,
  }: {
    selectedFile: { name: string } | null;
  }) => (
    <div data-testid="sound-track-selector">
      {selectedFile ? selectedFile.name : "No File"}
    </div>
  ),
}));

describe("MidiControlRoom", () => {
  const mockProps = {
    inputs: [],
    isLoading: false,
    error: null,
    selectedMIDIInput: null,
    onSelectMIDIInput: vi.fn(),
    files: [],
    selectedFile: null,
    onSelectFile: vi.fn(),
  };

  it("renders in expanded mode initially", () => {
    render(<MidiControlRoom {...mockProps} />);

    // Status bar should be hidden (opacity-0)
    expect(screen.getByTestId("status-bar")).toHaveClass("opacity-0");

    // Header should be visible (opacity-100)
    expect(screen.getByRole("banner")).toHaveClass("opacity-100");
  });

  it("renders status bar when minimized", () => {
    render(
      <MidiControlRoom
        {...mockProps}
        isMinimized={true}
        onToggleMinimize={vi.fn()}
      />,
    );

    // Status bar should be visible
    expect(screen.getByTestId("status-bar")).toHaveClass("opacity-100");

    // Header should be hidden
    expect(screen.getByRole("banner")).toHaveClass("opacity-0");
  });

  it("displays correct status in minimized mode", () => {
    const props = {
      ...mockProps,
      selectedMIDIInput: {
        id: "1",
        name: "My Piano",
      } as unknown as WebMidi.MIDIInput,
      selectedFile: { name: "Jazz Song", url: "jazz.mid" },
      isMinimized: true,
      onToggleMinimize: vi.fn(),
    };

    render(<MidiControlRoom {...props} />);

    // Check within status bar specifically to avoid duplicate matches with hidden header
    const statusBar = screen.getByTestId("status-bar");
    expect(statusBar).toHaveTextContent("My Piano");
    expect(statusBar).toHaveTextContent("Jazz Song");
  });

  it("calls onToggleMinimize when status bar is clicked", () => {
    const toggleMock = vi.fn();
    render(
      <MidiControlRoom
        {...mockProps}
        isMinimized={true}
        onToggleMinimize={toggleMock}
      />,
    );

    fireEvent.click(screen.getByTestId("status-bar"));
    expect(toggleMock).toHaveBeenCalled();
  });
});
