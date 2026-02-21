import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSelection } from "@/context/selection-context";
import { useActiveNotes } from "@/hooks/use-active-notes";
import { useGameNavigation } from "@/hooks/use-game-navigation";
import { useLaneScoreEngine } from "@/hooks/use-lane-score-engine";
import { useLaneTimeline } from "@/hooks/use-lane-timeline";
import { useMidiAudio } from "@/hooks/use-midi-audio";
import { useMidiTrack } from "@/hooks/use-midi-track";
import GamePage from "./page";

// Mock the hooks
vi.mock("@/hooks/use-game-navigation", () => ({
  useGameNavigation: vi.fn(),
}));

vi.mock("@/context/selection-context", () => ({
  useSelection: vi.fn(),
}));

vi.mock("@/hooks/use-midi-track", () => ({
  useMidiTrack: vi.fn(),
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
  const mockNavigate = vi.fn();
  const mockSetGameSession = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGameNavigation).mockReturnValue({
      navigate: mockNavigate,
      goBack: vi.fn(),
    });
    vi.mocked(useSelection).mockReturnValue({
      selectedInstrument: { id: "piano", name: "Piano" },
      selectedTrack: {
        id: "track-1.mid",
        name: "Test Track",
        url: "/midi/track-1.mid",
      },
      gameSession: null,
      sessionResults: null,
      speed: 1.0,
      demoMode: false,
      selectedMIDIInput: null,
      selectedMIDIOutput: null,
      midiError: null,
      setInstrument: vi.fn(),
      setTrack: vi.fn(),
      setGameSession: mockSetGameSession,
      setSessionResults: vi.fn(),
      clearSelection: vi.fn(),
    } as any);
    vi.mocked(useMidiTrack).mockReturnValue({
      events: [],
      spans: [],
      duration: 0,
      isLoading: false,
      error: null,
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
      motion: null,
    });
  });

  it("renders the track and instrument names", () => {
    render(<GamePage />);
    expect(screen.getByText(/Piano/)).toBeInTheDocument();
    expect(screen.getByText(/Test Track/)).toBeInTheDocument();
  });

  it("navigates to welcome page when track is missing", () => {
    vi.mocked(useSelection).mockReturnValue({
      selectedInstrument: { id: "piano", name: "Piano" },
      selectedTrack: null,
      gameSession: null,
      sessionResults: null,
      speed: 1.0,
      demoMode: false,
      selectedMIDIInput: null,
      selectedMIDIOutput: null,
      midiError: null,
      setInstrument: vi.fn(),
      setTrack: vi.fn(),
      setGameSession: mockSetGameSession,
      setSessionResults: vi.fn(),
      clearSelection: vi.fn(),
    } as any);

    render(<GamePage />);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows loading state when track is loading", () => {
    vi.mocked(useMidiTrack).mockReturnValue({
      events: [],
      spans: [],
      duration: 0,
      isLoading: true,
      error: null,
    });

    render(<GamePage />);
    expect(screen.getByText(/Loading Track/i)).toBeInTheDocument();
  });

  it("toggles pause overlay when pause button is clicked", () => {
    render(<GamePage />);

    // Should not show paused overlay initially
    expect(screen.queryByText("Paused")).not.toBeInTheDocument();

    // Click pause button (the one in the header, not the piano keys)
    const header = screen.getByRole("banner");
    const pauseButton = within(header).getByRole("button");
    fireEvent.click(pauseButton);

    // Should show paused overlay
    expect(screen.getByText("Paused")).toBeInTheDocument();

    // Click RESUME button in overlay
    const resumeButton = screen.getByText("RESUME");
    fireEvent.click(resumeButton);

    // Should hide paused overlay
    expect(screen.queryByText("Paused")).not.toBeInTheDocument();
  });

  it("navigates to results page when QUIT GAME is clicked", () => {
    render(<GamePage />);

    // Open pause overlay
    const header = screen.getByRole("banner");
    const pauseButton = within(header).getByRole("button");
    fireEvent.click(pauseButton);

    // Click QUIT GAME button
    const quitButton = screen.getByText(/QUIT GAME/i);
    fireEvent.click(quitButton);

    expect(mockNavigate).toHaveBeenCalledWith("/results");
  });
});
