import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppContextType } from "@/context/app-context";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";
import WelcomePage from "./page";

// Mock the hooks
vi.mock("@/hooks/use-navigation", () => ({
  useNavigation: vi.fn(),
}));

vi.mock("@/context/app-context", () => ({
  useAppContext: vi.fn(),
}));

describe("Welcome Page", () => {
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

  const mockContext: AppContextType = {
    collection: { selectedTrack: null, setSelectedTrack: vi.fn() },
    gear: {
      selectedMIDIInput: null,
      selectedMIDIOutput: null,
      lastInputName: null,
      selectMIDIInput: vi.fn(),
      selectMIDIOutput: vi.fn(),
    },
    stage: {
      trackStatus: { isLoading: false, isReady: false, error: null },
      gameSession: null,
      setGameSession: vi.fn(),
    },
    score: { sessionResults: null, setSessionResults: vi.fn() },
    options: {
      speed: 1.0,
      demoMode: false,
      setSpeed: vi.fn(),
      setDemoMode: vi.fn(),
    },
    home: { isHomeLoading: false, isSupported: true, resetAll: vi.fn() },
  };

  beforeEach(() => {
    // Mock Web MIDI support
    Object.defineProperty(navigator, "requestMIDIAccess", {
      value: vi.fn(),
      configurable: true,
    });
    vi.resetAllMocks();
  });

  it("renders the title and start button", () => {
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useAppContext).mockReturnValue(mockContext);

    render(<WelcomePage />);
    expect(screen.getByText(/Midi Jam/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /START JAM/i }),
    ).toBeInTheDocument();
  });

  it("shows spinner when loading", () => {
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useAppContext).mockReturnValue({
      ...mockContext,
      home: { isHomeLoading: true, isSupported: true, resetAll: vi.fn() },
    });

    render(<WelcomePage />);
    expect(screen.getByText(/Initializing Engine/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /START JAM/i }),
    ).not.toBeInTheDocument();
  });

  it("shows error when not supported", () => {
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useAppContext).mockReturnValue({
      ...mockContext,
      home: { isHomeLoading: false, isSupported: false, resetAll: vi.fn() },
    });

    render(<WelcomePage />);
    expect(screen.getByText(/UNSUPPORTED BROWSER/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /START JAM/i }),
    ).not.toBeInTheDocument();
  });

  it("navigates to gear on start click", () => {
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useAppContext).mockReturnValue(mockContext);

    render(<WelcomePage />);
    fireEvent.click(screen.getByRole("button", { name: /START JAM/i }));
    expect(mockNavigation.toGear).toHaveBeenCalled();
  });

  it("navigates to options on options click", () => {
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useAppContext).mockReturnValue(mockContext);

    render(<WelcomePage />);
    fireEvent.click(screen.getByRole("button", { name: /Options/i }));
    expect(mockNavigation.toOptions).toHaveBeenCalled();
  });
});
