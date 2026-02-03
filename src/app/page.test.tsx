import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

// Mock child components
vi.mock("@/components/midi/device-selector", () => ({
  DeviceSelector: () => <div data-testid="device-selector">DeviceSelector</div>,
}));
vi.mock("@/components/midi/midi-control-center", () => ({
  MidiControlCenter: () => (
    <div data-testid="midi-control-center">MidiControlCenter</div>
  ),
}));
vi.mock("@/components/midi/falldown-visualizer", () => ({
  FalldownVisualizer: () => (
    <div data-testid="falldown-visualizer">FalldownVisualizer</div>
  ),
}));
vi.mock("@/components/midi/piano-keyboard", () => ({
  PianoKeyboard: () => <div data-testid="piano-keyboard">PianoKeyboard</div>,
}));
vi.mock("@/components/midi/midi-header", () => ({
  MidiHeader: ({
    isMinimized,
    onToggleMinimize,
  }: {
    isMinimized: boolean;
    onToggleMinimize: () => void;
  }) => (
    <div data-testid="midi-header">
      MidiHeader
      <button
        type="button"
        onClick={onToggleMinimize}
        data-testid="toggle-minimize"
      >
        Toggle
      </button>
      {isMinimized ? "Minimized" : "Expanded"}
    </div>
  ),
}));
vi.mock("@/components/midi/playback-controls", () => ({
  PlaybackControls: () => (
    <div data-testid="playback-controls">PlaybackControls</div>
  ),
}));

// Mock hooks
vi.mock("@/hooks/use-midi-inputs", () => ({
  useMIDIInputs: () => ({ inputs: [], isLoading: false, error: null }),
}));
vi.mock("@/hooks/use-midi-connection", () => ({
  useMIDIConnection: () => ({ selectedDevice: null, selectDevice: vi.fn() }),
}));
vi.mock("@/hooks/use-midi-audio", () => ({
  useMidiAudio: () => ({
    playNote: vi.fn(),
    stopNote: vi.fn(),
    isMuted: false,
    toggleMute: vi.fn(),
  }),
}));
vi.mock("@/hooks/use-active-notes", () => ({
  useActiveNotes: () => new Set(),
}));
let mockIsPlaying = false;
const mockPlay = vi.fn(() => {
  mockIsPlaying = true;
});
const mockPause = vi.fn(() => {
  mockIsPlaying = false;
});
const mockStop = vi.fn(() => {
  mockIsPlaying = false;
});

vi.mock("@/hooks/use-midi-player", () => ({
  useMidiPlayer: () => ({
    activeNotes: new Map(),
    get isPlaying() {
      return mockIsPlaying;
    },
    currentTime: 0,
    duration: 0,
    speed: 1,
    play: mockPlay,
    pause: mockPause,
    stop: mockStop,
    setSpeed: vi.fn(),
  }),
}));
vi.mock("@/lib/action/midi", () => ({
  getMidiFiles: vi.fn().mockResolvedValue([]),
}));

describe("Home Page Layout Refactor", () => {
  beforeEach(() => {
    mockIsPlaying = false;
    mockPlay.mockClear();
    mockPause.mockClear();
    mockStop.mockClear();
  });

  it("renders MidiHeader and PlaybackControls", () => {
    render(<Home />);

    expect(screen.getByTestId("midi-header")).toBeInTheDocument();
    expect(screen.getByTestId("playback-controls")).toBeInTheDocument();
  });

  it("should auto-pause when expanding and auto-resume if it was playing", () => {
    const { rerender } = render(<Home />);

    // 1. Start minimized
    const toggle = screen.getByTestId("toggle-minimize");
    fireEvent.click(toggle); // isMinimized becomes true (now Minimized)
    expect(screen.getByText(/Minimized/)).toBeInTheDocument();

    // 2. Start playing and trigger rerender
    mockIsPlaying = true;
    rerender(<Home />);

    // 3. Expand header (isMinimized becomes false)
    fireEvent.click(toggle);
    expect(screen.getByText(/Expanded/)).toBeInTheDocument();
    expect(mockPause).toHaveBeenCalled();

    // 4. Collapse header (isMinimized becomes true)
    fireEvent.click(toggle);
    expect(screen.getByText(/Minimized/)).toBeInTheDocument();
    expect(mockPlay).toHaveBeenCalled();
  });
});
