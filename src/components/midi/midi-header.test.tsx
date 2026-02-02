import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MidiHeader } from "./midi-header";

// Mock child components
vi.mock("@/components/midi/device-selector", () => ({
  DeviceSelector: ({ selectedDevice }: any) => (
    <div data-testid="device-selector">
      {selectedDevice ? selectedDevice.name : "No Device"}
    </div>
  ),
}));

vi.mock("@/components/midi/midi-control-center", () => ({
  MidiControlCenter: ({ selectedFile }: any) => (
    <div data-testid="midi-control-center">
      {selectedFile ? selectedFile.name : "No File"}
    </div>
  ),
}));

describe("MidiHeader", () => {
  const mockProps = {
    devices: [],
    isLoading: false,
    error: null,
    selectedDevice: null,
    onSelectDevice: vi.fn(),
    files: [],
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

  it("renders in expanded mode initially", () => {
    render(<MidiHeader {...mockProps} />);
    
    // Should show full controls
    expect(screen.getByTestId("device-selector")).toBeInTheDocument();
    expect(screen.getByTestId("midi-control-center")).toBeInTheDocument();
    
    // Should not show minimized status bar
    expect(screen.queryByTestId("status-bar")).not.toBeInTheDocument();
  });

  it("renders status bar when minimized", () => {
    render(<MidiHeader {...mockProps} isMinimized={true} onToggleMinimize={vi.fn()} />);

    expect(screen.getByTestId("status-bar")).toBeInTheDocument();
    expect(screen.queryByTestId("device-selector")).not.toBeInTheDocument();
  });

  it("displays correct status in minimized mode", () => {
    const props = {
      ...mockProps,
      selectedDevice: { id: "1", name: "My Piano" } as any,
      selectedFile: { name: "Jazz Song", url: "jazz.mid" },
      isMinimized: true,
      onToggleMinimize: vi.fn(),
    };

    render(<MidiHeader {...props} />);

    expect(screen.getByText("My Piano")).toBeInTheDocument();
    expect(screen.getByText("Jazz Song")).toBeInTheDocument();
  });

  it("calls onToggleMinimize when status bar is clicked", () => {
    const toggleMock = vi.fn();
    render(<MidiHeader {...mockProps} isMinimized={true} onToggleMinimize={toggleMock} />);

    fireEvent.click(screen.getByTestId("status-bar"));
    expect(toggleMock).toHaveBeenCalled();
  });
});
