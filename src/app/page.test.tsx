import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSelection } from "@/context/selection-context";
import { useGameNavigation } from "@/hooks/use-game-navigation";
import WelcomePage from "./page";

// Mock the hook
vi.mock("@/hooks/use-game-navigation", () => ({
  useGameNavigation: vi.fn(),
}));

vi.mock("@/context/selection-context", () => ({
  useSelection: vi.fn(),
}));

describe("Welcome Page", () => {
  beforeEach(() => {
    // Mock Web MIDI and ScrollTimeline support
    Object.defineProperty(navigator, "requestMIDIAccess", {
      value: vi.fn(),
      configurable: true,
    });
    Object.defineProperty(window, "ScrollTimeline", {
      value: vi.fn(),
      configurable: true,
    });
  });

  it("renders the title and start button", () => {
    vi.mocked(useGameNavigation).mockReturnValue({
      navigate: vi.fn(),
      goBack: vi.fn(),
    });
    vi.mocked(useSelection).mockReturnValue({
      selectedTrack: null,
      gameSession: null,
      sessionResults: null,
      speed: 1.0,
      demoMode: false,
      selectedMIDIInput: null,
      selectedMIDIOutput: null,
      setTrack: vi.fn(),
      setGameSession: vi.fn(),
      setSessionResults: vi.fn(),
      setSpeed: vi.fn(),
      setDemoMode: vi.fn(),
      selectMIDIInput: vi.fn(),
      clearSelection: vi.fn(),
    });

    render(<WelcomePage />);
    expect(screen.getByText(/Midi Jam/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /START JAM/i }),
    ).toBeInTheDocument();
  });

  it("navigates to instruments on start click", () => {
    const mockNavigate = vi.fn();
    vi.mocked(useGameNavigation).mockReturnValue({
      navigate: mockNavigate,
      goBack: vi.fn(),
    });
    vi.mocked(useSelection).mockReturnValue({
      selectedTrack: null,
      gameSession: null,
      sessionResults: null,
      speed: 1.0,
      demoMode: false,
      selectedMIDIInput: null,
      selectedMIDIOutput: null,
      setTrack: vi.fn(),
      setGameSession: vi.fn(),
      setSessionResults: vi.fn(),
      setSpeed: vi.fn(),
      setDemoMode: vi.fn(),
      selectMIDIInput: vi.fn(),
      clearSelection: vi.fn(),
    });

    render(<WelcomePage />);
    fireEvent.click(screen.getByRole("button", { name: /START JAM/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/instruments");
  });

  it("navigates to settings on settings click", () => {
    const mockNavigate = vi.fn();
    vi.mocked(useGameNavigation).mockReturnValue({
      navigate: mockNavigate,
      goBack: vi.fn(),
    });
    vi.mocked(useSelection).mockReturnValue({
      selectedTrack: null,
      gameSession: null,
      sessionResults: null,
      speed: 1.0,
      demoMode: false,
      selectedMIDIInput: null,
      selectedMIDIOutput: null,
      setTrack: vi.fn(),
      setGameSession: vi.fn(),
      setSessionResults: vi.fn(),
      setSpeed: vi.fn(),
      setDemoMode: vi.fn(),
      selectMIDIInput: vi.fn(),
      clearSelection: vi.fn(),
    });

    render(<WelcomePage />);
    fireEvent.click(screen.getByRole("button", { name: /Settings/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/settings?from=/");
  });
});
