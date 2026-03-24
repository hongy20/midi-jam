import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCollection } from "@/context/collection-context";
import { useGear } from "@/context/gear-context";
import { useOptions } from "@/context/options-context";
import { useScore } from "@/context/score-context";
import { useStage } from "@/context/stage-context";
import { useTrack } from "@/context/track-context";
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

vi.mock("@/context/collection-context");
vi.mock("@/context/gear-context");
vi.mock("@/context/options-context");
vi.mock("@/context/score-context");
vi.mock("@/context/stage-context");
vi.mock("@/context/track-context");

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

vi.mock("@/hooks/use-demo-playback", () => ({
  useDemoPlayback: vi.fn(),
}));

vi.mock("@/hooks/use-wake-lock", () => ({
  useWakeLock: vi.fn(),
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

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);

    vi.mocked(useCollection).mockReturnValue({
      selectedTrack: {
        id: "track-1.mid",
        name: "Test Track",
        url: "/midi/track-1.mid",
      },
      setSelectedTrack: vi.fn(),
      resetCollection: vi.fn(),
    });

    vi.mocked(useGear).mockReturnValue({
      selectedMIDIInput: { id: "piano", name: "Piano" } as WebMidi.MIDIInput,
      selectedMIDIOutput: null,
      selectMIDIInput: vi.fn(),
      selectMIDIOutput: vi.fn(),
      inputs: [],
      outputs: [],
      isLoading: false,
      error: null,
    });

    vi.mocked(useTrack).mockReturnValue({
      trackStatus: {
        isLoading: false,
        isReady: true,
        totalDurationMs: 1000,
        events: [],
        groups: [],
        error: null,
      },
      setTrackStatus: vi.fn(),
      resetTrack: vi.fn(),
    });

    vi.mocked(useStage).mockReturnValue({
      gameSession: null,
      setGameSession: mockSetGameSession,
      resetStage: vi.fn(),
    });

    vi.mocked(useScore).mockReturnValue({
      sessionResults: null,
      setSessionResults: mockSetSessionResults,
      resetScore: vi.fn(),
    });

    vi.mocked(useOptions).mockReturnValue({
      speed: 1.0,
      demoMode: false,
      setSpeed: vi.fn(),
      setDemoMode: vi.fn(),
      resetOptions: vi.fn(),
    });

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

    vi.mocked(useTrack).mockReturnValue({
      trackStatus: {
        isLoading: false,
        isReady: true,
        totalDurationMs: 100,
        events: new Array(10).fill({}),
        groups: [],
        error: null,
      },
      setTrackStatus: vi.fn(),
      resetTrack: vi.fn(),
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
    vi.mocked(useCollection).mockReturnValue({
      selectedTrack: null,
      setSelectedTrack: vi.fn(),
      resetCollection: vi.fn(),
    });

    const { container } = render(<PlayPage />);
    expect(container.firstChild).toBeNull();
  });

  it("shows loading state when track is loading", () => {
    vi.mocked(useTrack).mockReturnValue({
      trackStatus: { isLoading: true, isReady: false, error: null },
      setTrackStatus: vi.fn(),
      resetTrack: vi.fn(),
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
