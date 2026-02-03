import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MidiHeader } from "./midi-header";

// Mock child components
vi.mock("@/components/midi/device-selector", () => ({
  DeviceSelector: ({
    selectedDevice,
  }: {
    selectedDevice: { name: string } | null;
  }) => (
    <div data-testid="device-selector">
      {selectedDevice ? selectedDevice.name : "No Device"}
    </div>
  ),
}));

vi.mock("@/components/midi/midi-control-center", () => ({
  MidiControlCenter: ({
    selectedFile,
  }: {
    selectedFile: { name: string } | null;
  }) => (
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
  };

  it("renders in expanded mode initially", () => {
    render(<MidiHeader {...mockProps} />);

    // Status bar should be hidden (opacity-0)
    expect(screen.getByTestId("status-bar")).toHaveClass("opacity-0");

    // Header should be visible (opacity-100)
    expect(screen.getByRole("banner")).toHaveClass("opacity-100");
  });

  it("renders status bar when minimized", () => {
    render(
      <MidiHeader
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
      selectedDevice: {
        id: "1",
        name: "My Piano",
      } as unknown as WebMidi.MIDIInput,
      selectedFile: { name: "Jazz Song", url: "jazz.mid" },
      isMinimized: true,
      onToggleMinimize: vi.fn(),
    };

    render(<MidiHeader {...props} />);

    // Check within status bar specifically to avoid duplicate matches with hidden header
    const statusBar = screen.getByTestId("status-bar");
    expect(statusBar).toHaveTextContent("My Piano");
    expect(statusBar).toHaveTextContent("Jazz Song");
  });

  it("calls onToggleMinimize when status bar is clicked", () => {
    const toggleMock = vi.fn();
    render(
      <MidiHeader
        {...mockProps}
        isMinimized={true}
        onToggleMinimize={toggleMock}
      />,
    );

    fireEvent.click(screen.getByTestId("status-bar"));
    expect(toggleMock).toHaveBeenCalled();
  });

  it("calls onToggleDemo when demo button is clicked", () => {
    const toggleDemoMock = vi.fn();
    render(
      <MidiHeader
        {...mockProps}
        demoMode={true}
        onToggleDemo={toggleDemoMock}
      />,
    );

    // The demo button should be in the expanded header (role banner)
    const demoButton = screen.getByRole("button", { name: /demo/i });
    fireEvent.click(demoButton);
    expect(toggleDemoMock).toHaveBeenCalled();
  });
});
