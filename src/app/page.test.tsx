import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "./page";

// Mock child components
vi.mock("@/components/midi/device-selector", () => ({
  DeviceSelector: () => <div data-testid="device-selector">DeviceSelector</div>,
}));
vi.mock("@/components/midi/midi-control-center", () => ({
  MidiControlCenter: () => <div data-testid="midi-control-center">MidiControlCenter</div>,
}));
vi.mock("@/components/midi/falldown-visualizer", () => ({
  FalldownVisualizer: () => <div data-testid="falldown-visualizer">FalldownVisualizer</div>,
}));
vi.mock("@/components/midi/piano-keyboard", () => ({
  PianoKeyboard: () => <div data-testid="piano-keyboard">PianoKeyboard</div>,
}));
vi.mock("@/components/midi/midi-header", () => ({
  MidiHeader: ({ isMinimized, onToggleMinimize }: any) => (
    <div data-testid="midi-header">
      MidiHeader
      <button onClick={onToggleMinimize} data-testid="toggle-minimize">
        Toggle
      </button>
      {isMinimized ? "Minimized" : "Expanded"}
    </div>
  ),
}));
vi.mock("@/components/midi/playback-controls", () => ({
  PlaybackControls: () => <div data-testid="playback-controls">PlaybackControls</div>,
}));

// Mock hooks
vi.mock("@/hooks/use-midi-inputs", () => ({
  useMIDIInputs: () => ({ inputs: [], isLoading: false, error: null }),
}));
vi.mock("@/hooks/use-midi-connection", () => ({
  useMIDIConnection: () => ({ selectedDevice: null, selectDevice: vi.fn() }),
}));
vi.mock("@/hooks/use-midi-audio", () => ({
  useMidiAudio: () => ({ playNote: vi.fn(), stopNote: vi.fn(), isMuted: false, toggleMute: vi.fn() }),
}));
vi.mock("@/hooks/use-active-notes", () => ({
  useActiveNotes: () => new Set(),
}));
vi.mock("@/hooks/use-midi-player", () => ({
  useMidiPlayer: () => ({
    activeNotes: new Set(),
    isPlaying: false,
    currentTime: 0,
    speed: 1,
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    setSpeed: vi.fn(),
  }),
}));
vi.mock("@/lib/action/midi", () => ({
  getMidiFiles: vi.fn().mockResolvedValue([]),
}));

describe("Home Page Layout Refactor", () => {
  it("renders MidiHeader and PlaybackControls", () => {
    render(<Home />);
    
    expect(screen.getByTestId("midi-header")).toBeInTheDocument();
    expect(screen.getByTestId("playback-controls")).toBeInTheDocument();
  });
});