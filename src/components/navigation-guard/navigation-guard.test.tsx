import { render } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";
import { ROUTES } from "@/lib/navigation/routes";
import { NavigationGuard } from "./navigation-guard";

vi.mock("@/context/app-context");
vi.mock("@/hooks/use-navigation");
vi.mock("next/navigation");

describe("NavigationGuard", () => {
  const mockToGear = vi.fn();
  const mockToCollection = vi.fn();
  const mockToHome = vi.fn();
  const mockSetGameSession = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigation).mockReturnValue({
      toGear: mockToGear,
      toCollection: mockToCollection,
      toHome: mockToHome,
      toPlay: vi.fn(),
      toPause: vi.fn(),
      toScore: vi.fn(),
      toOptions: vi.fn(),
      goBack: vi.fn(),
      navigate: vi.fn(),
    });
  });

  it("redirects from Level 2 to Gear if MIDI is missing", () => {
    vi.mocked(usePathname).mockReturnValue(ROUTES.PLAY);
    vi.mocked(useAppContext).mockReturnValue({
      collection: {
        selectedTrack: { id: "1", name: "Track", url: "url" },
        setSelectedTrack: vi.fn(),
      },
      gear: {
        selectedMIDIInput: null,
        selectedMIDIOutput: null,
        selectMIDIInput: vi.fn(),
        selectMIDIOutput: vi.fn(),
      },
      stage: {
        trackStatus: {
          isLoading: false,
          isReady: true,
          error: null,
          originalDurationMs: 1000,
          events: [],
          spans: [],
        },
        gameSession: null,
        setGameSession: mockSetGameSession,
      },
      score: { sessionResults: null, setSessionResults: vi.fn() },
      options: {
        speed: 1,
        demoMode: false,
        setSpeed: vi.fn(),
        setDemoMode: vi.fn(),
      },
      home: { isHomeLoading: false, isSupported: true, resetAll: vi.fn() },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockSetGameSession).toHaveBeenCalledWith(null);
    expect(mockToGear).toHaveBeenCalled();
  });

  it("redirects from Level 2 to Collection if track is missing", () => {
    vi.mocked(usePathname).mockReturnValue(ROUTES.PLAY);
    vi.mocked(useAppContext).mockReturnValue({
      collection: { selectedTrack: null, setSelectedTrack: vi.fn() },
      gear: {
        // biome-ignore lint/suspicious/noExplicitAny: mocking MIDI input
        selectedMIDIInput: { id: "midi-1" } as any,
        selectedMIDIOutput: null,
        selectMIDIInput: vi.fn(),
        selectMIDIOutput: vi.fn(),
      },
      stage: {
        trackStatus: { isLoading: false, isReady: false, error: null },
        gameSession: null,
        setGameSession: mockSetGameSession,
      },
      score: { sessionResults: null, setSessionResults: vi.fn() },
      options: {
        speed: 1,
        demoMode: false,
        setSpeed: vi.fn(),
        setDemoMode: vi.fn(),
      },
      home: { isHomeLoading: false, isSupported: true, resetAll: vi.fn() },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockSetGameSession).toHaveBeenCalledWith(null);
    expect(mockToCollection).toHaveBeenCalled();
  });

  it("redirects from Level 1 to Gear if MIDI is missing", () => {
    vi.mocked(usePathname).mockReturnValue(ROUTES.COLLECTION);
    vi.mocked(useAppContext).mockReturnValue({
      collection: { selectedTrack: null, setSelectedTrack: vi.fn() },
      gear: {
        selectedMIDIInput: null,
        selectedMIDIOutput: null,
        selectMIDIInput: vi.fn(),
        selectMIDIOutput: vi.fn(),
      },
      stage: {
        trackStatus: { isLoading: false, isReady: false, error: null },
        gameSession: null,
        setGameSession: mockSetGameSession,
      },
      score: { sessionResults: null, setSessionResults: vi.fn() },
      options: {
        speed: 1,
        demoMode: false,
        setSpeed: vi.fn(),
        setDemoMode: vi.fn(),
      },
      home: { isHomeLoading: false, isSupported: true, resetAll: vi.fn() },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockToGear).toHaveBeenCalled();
  });

  it("does not redirect from Level 0 (Gear) even if MIDI is missing", () => {
    vi.mocked(usePathname).mockReturnValue(ROUTES.GEAR);
    vi.mocked(useAppContext).mockReturnValue({
      collection: { selectedTrack: null, setSelectedTrack: vi.fn() },
      gear: {
        selectedMIDIInput: null,
        selectedMIDIOutput: null,
        selectMIDIInput: vi.fn(),
        selectMIDIOutput: vi.fn(),
      },
      stage: {
        trackStatus: { isLoading: false, isReady: false, error: null },
        gameSession: null,
        setGameSession: mockSetGameSession,
      },
      score: { sessionResults: null, setSessionResults: vi.fn() },
      options: {
        speed: 1,
        demoMode: false,
        setSpeed: vi.fn(),
        setDemoMode: vi.fn(),
      },
      home: { isHomeLoading: false, isSupported: true, resetAll: vi.fn() },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockToGear).not.toHaveBeenCalled();
    expect(mockToCollection).not.toHaveBeenCalled();
  });

  it("redirects from Score to Home if results are missing", () => {
    vi.mocked(usePathname).mockReturnValue(ROUTES.SCORE);
    vi.mocked(useAppContext).mockReturnValue({
      collection: { selectedTrack: null, setSelectedTrack: vi.fn() },
      gear: {
        selectedMIDIInput: null,
        selectedMIDIOutput: null,
        selectMIDIInput: vi.fn(),
        selectMIDIOutput: vi.fn(),
      },
      stage: {
        trackStatus: { isLoading: false, isReady: false, error: null },
        gameSession: null,
        setGameSession: mockSetGameSession,
      },
      score: { sessionResults: null, setSessionResults: vi.fn() },
      options: {
        speed: 1,
        demoMode: false,
        setSpeed: vi.fn(),
        setDemoMode: vi.fn(),
      },
      home: { isHomeLoading: false, isSupported: true, resetAll: vi.fn() },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockToHome).toHaveBeenCalled();
  });
});
