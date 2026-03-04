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
    toInstruments: vi.fn(),
    toSettings: vi.fn(),
    toHome: vi.fn(),
    toTracks: vi.fn(),
    toGame: vi.fn(),
    toPause: vi.fn(),
    toResults: vi.fn(),
    goBack: vi.fn(),
    navigate: vi.fn(),
  };

  const mockContext: AppContextType = {
    tracks: { selected: null, set: vi.fn() },
    instruments: {
      input: null,
      output: null,
      lastInputName: null,
      selectInput: vi.fn(),
      selectOutput: vi.fn(),
    },
    game: {
      track: { isLoading: false, isReady: false, error: null },
      session: null,
      setSession: vi.fn(),
    },
    results: { last: null, set: vi.fn() },
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
    // Mock Web MIDI support
    Object.defineProperty(navigator, "requestMIDIAccess", {
      value: vi.fn(),
      configurable: true,
    });
    vi.clearAllMocks();
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

  it("navigates to instruments on start click", () => {
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useAppContext).mockReturnValue(mockContext);

    render(<WelcomePage />);
    fireEvent.click(screen.getByRole("button", { name: /START JAM/i }));
    expect(mockNavigation.toInstruments).toHaveBeenCalled();
  });

  it("navigates to settings on settings click", () => {
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useAppContext).mockReturnValue(mockContext);

    render(<WelcomePage />);
    fireEvent.click(screen.getByRole("button", { name: /Settings/i }));
    expect(mockNavigation.toSettings).toHaveBeenCalled();
  });
});
