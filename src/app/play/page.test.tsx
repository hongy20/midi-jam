import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppContextType } from "@/context/app-context";
import { useAppContext } from "@/context/app-context";
import { useActiveNotes } from "@/hooks/use-active-notes";
import { useLaneScoreEngine } from "@/hooks/use-lane-score-engine";
import { useLaneTimeline } from "@/hooks/use-lane-timeline";
import { useMidiAudio } from "@/hooks/use-midi-audio";
import { useNavigation } from "@/hooks/use-navigation";
import PlayPage from "./page";

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

describe("Play Page", () => {
  const mockNavigation = {
    toHome: vi.fn(),
    toCollection: vi.fn(),
    toGear: vi.fn(),
    toPlay: vi.fn(),
    toPause: vi.fn(),
    toScore: vi.fn(),
    toOptions: vi.fn(),
    goBack: vi.fn(),
    navigate: vi.fn(),
  };

  const mockSetGameSession = vi.fn();
  const mockSetSessionResults = vi.fn();

  const mockContext: AppContextType = {
    collection: {
      selectedTrack: {
        id: "track-1.mid",
        name: "Test Track",
        url: "/midi/track-1.mid",
      },
      setSelectedTrack: vi.fn(),
    },
    gear: {
      selectedMIDIInput: { id: "piano", name: "Piano" } as WebMidi.MIDIInput,
      selectedMIDIOutput: null,
      lastInputName: "Piano",
      selectMIDIInput: vi.fn(),
      selectMIDIOutput: vi.fn(),
    },
    stage: {
      trackStatus: {
        isLoading: false,
        isReady: true,
        originalDurationMs: 1000,
        events: [],
        spans: [],
        error: null,
      },
      gameSession: null,
      setGameSession: mockSetGameSession,
    },
    score: {
      sessionResults: null,
      setSessionResults: mockSetSessionResults,
    },
    options: {
      speed: 1.0,
      demoMode: false,
      setSpeed: vi.fn(),
      setDemoMode: vi.fn(),
    },
    actions: { resetAll: vi.fn() },
    home: { isHomeLoading: false, isSupported: true },
  };

  beforeEach(() => {
    vi.resetAllMocks();
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

  it("navigates to score page when the timeline finishes", () => {
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
      stage: {
        ...mockContext.stage,
        trackStatus: {
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

    render(<PlayPage />);

    // Simulate timeline finish
    expect(capturedOnFinish).toBeDefined();
    capturedOnFinish?.();

    expect(mockSetSessionResults).toHaveBeenCalledWith({
      score: 1500,
      accuracy: expect.any(Number),
      combo: 42,
    });
    expect(mockNavigation.toScore).toHaveBeenCalled();
  });

  it("renders the track and gear names", () => {
    render(<PlayPage />);
    expect(screen.getByText(/Piano/)).toBeInTheDocument();
    expect(screen.getByText(/Test Track/)).toBeInTheDocument();
  });

  it("returns null when track or gear is missing", () => {
    vi.mocked(useAppContext).mockReturnValue({
      ...mockContext,
      collection: { selectedTrack: null, setSelectedTrack: vi.fn() },
    });

    const { container } = render(<PlayPage />);
    expect(container.firstChild).toBeNull();
  });

  it("shows loading state when track is loading", () => {
    vi.mocked(useAppContext).mockReturnValue({
      ...mockContext,
      stage: {
        ...mockContext.stage,
        trackStatus: { isLoading: true, isReady: false, error: null },
      },
    });

    render(<PlayPage />);
    expect(screen.getByText(/LOADING.../i)).toBeInTheDocument();
  });

  it("navigates to pause when pause button is clicked", () => {
    render(<PlayPage />);

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
