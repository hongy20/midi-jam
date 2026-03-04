import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppContextType } from "@/context/app-context";
import { useAppContext } from "@/context/app-context";
import { useActiveNotes } from "@/hooks/use-active-notes";
import { useLaneScoreEngine } from "@/hooks/use-lane-score-engine";
import { useLaneTimeline } from "@/hooks/use-lane-timeline";
import { useMidiAudio } from "@/hooks/use-midi-audio";
import { useNavigation } from "@/hooks/use-navigation";
import GamePage from "./page";

// Mock the hooks
vi.mock("@/hooks/use-navigation", () => ({
  useNavigation: vi.fn(),
}));

vi.mock("@/context/app-context", () => ({
  useAppContext: vi.fn(),
}));

vi.mock("@/hooks/use-midi-audio", () => ({
  useMidiAudio: vi.fn(),
}));

vi.mock("@/hooks/use-active-notes", () => ({
  useActiveNotes: vi.fn(),
}));

vi.mock("@/hooks/use-lane-score-engine", () => ({
  useLaneScoreEngine: vi.fn(),
}));

vi.mock("@/hooks/use-lane-timeline", () => ({
  useLaneTimeline: vi.fn(),
}));

describe("Game Page", () => {
  const mockNavigation = {
    toHome: vi.fn(),
    toTracks: vi.fn(),
    toInstruments: vi.fn(),
    toGame: vi.fn(),
    toPause: vi.fn(),
    toResults: vi.fn(),
    toSettings: vi.fn(),
    goBack: vi.fn(),
    navigate: vi.fn(),
  };

  const mockSetGameSession = vi.fn();
  const mockSetSessionResults = vi.fn();

  const mockContext: AppContextType = {
    tracks: {
      selected: {
        id: "track-1.mid",
        name: "Test Track",
        url: "/midi/track-1.mid",
      },
      set: vi.fn(),
    },
    instruments: {
      input: { id: "piano", name: "Piano" } as WebMidi.MIDIInput,
      output: null,
      lastInputName: "Piano",
      selectInput: vi.fn(),
      selectOutput: vi.fn(),
    },
    game: {
      track: {
        isLoading: false,
        isReady: true,
        originalDurationMs: 1000,
        events: [],
        spans: [],
        error: null,
      },
      session: null,
      setSession: mockSetGameSession,
    },
    results: {
      last: null,
      set: mockSetSessionResults,
    },
    settings: {
      speed: 1.0,
      demoMode: false,
      setSpeed: vi.fn(),
      setDemoMode: vi.fn(),
    },
    actions: { resetAll: vi.fn() },
    isSupported: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useAppContext).mockReturnValue(mockContext);

    vi.mocked(useMidiAudio).mockReturnValue({
      playNote: vi.fn(),
      stopNote: vi.fn(),
      stopAllNotes: vi.fn(),
      playCountdownBeep: vi.fn(),
    });
    vi.mocked(useActiveNotes).mockReturnValue(new Set());
    vi.mocked(useLaneScoreEngine).mockReturnValue({
      score: 0,
      combo: 0,
      lastHitQuality: null,
      resetScore: vi.fn(),
    });
    vi.mocked(useLaneTimeline).mockReturnValue({
      getCurrentTimeMs: () => 0,
      getProgress: () => 0,
      resetTimeline: vi.fn(),
    });
  });

  it("navigates to results page when the timeline finishes", () => {
    let capturedOnFinish: (() => void) | undefined;
    vi.mocked(useLaneTimeline).mockImplementation(({ onFinish }) => {
      capturedOnFinish = onFinish;
      return {
        getCurrentTimeMs: () => 0,
        getProgress: () => 0,
        resetTimeline: vi.fn(),
      };
    });

    vi.mocked(useAppContext).mockReturnValue({
      ...mockContext,
      game: {
        ...mockContext.game,
        track: {
          isLoading: false,
          isReady: true,
          originalDurationMs: 100,
          events: new Array(10).fill({}),
          spans: [],
          error: null,
        },
      },
    });

    vi.mocked(useLaneScoreEngine).mockReturnValue({
      score: 1500,
      combo: 42,
      lastHitQuality: "perfect",
      resetScore: vi.fn(),
    });

    render(<GamePage />);

    // Simulate timeline finish
    expect(capturedOnFinish).toBeDefined();
    capturedOnFinish?.();

    expect(mockSetSessionResults).toHaveBeenCalledWith({
      score: 1500,
      accuracy: expect.any(Number),
      combo: 42,
    });
    expect(mockNavigation.toResults).toHaveBeenCalled();
  });

  it("renders the track and instrument names", () => {
    render(<GamePage />);
    expect(screen.getByText(/Piano/)).toBeInTheDocument();
    expect(screen.getByText(/Test Track/)).toBeInTheDocument();
  });

  it("returns null when track or instrument is missing", () => {
    vi.mocked(useAppContext).mockReturnValue({
      ...mockContext,
      tracks: { selected: null, set: vi.fn() },
    });

    const { container } = render(<GamePage />);
    expect(container.firstChild).toBeNull();
  });

  it("shows loading state when track is loading", () => {
    vi.mocked(useAppContext).mockReturnValue({
      ...mockContext,
      game: {
        ...mockContext.game,
        track: { isLoading: true, isReady: false, error: null },
      },
    });

    render(<GamePage />);
    expect(screen.getByText(/Loading Track/i)).toBeInTheDocument();
  });

  it("navigates to /game/pause when pause button is clicked", () => {
    render(<GamePage />);

    // Click pause button (the one in the header)
    const header = screen.getByRole("banner");
    const pauseButton = within(header).getByRole("button");
    fireEvent.click(pauseButton);

    // Should navigate to pause page
    expect(mockNavigation.toPause).toHaveBeenCalled();
    expect(mockSetGameSession).toHaveBeenCalledWith(
      expect.objectContaining({ isPaused: true }),
    );
  });
});
