import { render } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useStage } from "@/app/play/context/stage-context";
import { useCollection } from "@/features/collection/context/collection-context";
import { useGear } from "@/features/midi-hardware/context/gear-context";
import { useNavigation } from "@/features/navigation/hooks/use-navigation";
import { ROUTES } from "@/features/navigation/lib/routes";
import { useScore } from "@/features/score/context/score-context";
import { NavigationGuard } from "./navigation-guard";

vi.mock("@/features/collection/context/collection-context");
vi.mock("@/features/midi-hardware/context/gear-context");
vi.mock("@/features/score/context/score-context");
vi.mock("@/app/play/context/stage-context");
vi.mock("@/features/navigation/hooks/use-navigation");
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

    // Default mock values
    vi.mocked(useCollection).mockReturnValue({
      selectedTrack: null,
      setSelectedTrack: vi.fn(),
      resetCollection: vi.fn(),
    });
    vi.mocked(useGear).mockReturnValue({
      selectedMIDIInput: null,
      selectedMIDIOutput: null,
      selectMIDIInput: vi.fn(),
      selectMIDIOutput: vi.fn(),
      inputs: [],
      outputs: [],
      accessPromise: Promise.resolve({} as WebMidi.MIDIAccess),
    });
    vi.mocked(useScore).mockReturnValue({
      sessionResults: null,
      setSessionResults: vi.fn(),
      resetScore: vi.fn(),
    });
    vi.mocked(useStage).mockReturnValue({
      gameSession: null,
      setGameSession: mockSetGameSession,
      resetStage: vi.fn(),
    });
  });

  it("redirects from Level 2 to Home if MIDI is missing", () => {
    vi.mocked(usePathname).mockReturnValue(ROUTES.PLAY);
    vi.mocked(useCollection).mockReturnValue({
      selectedTrack: { id: "1", name: "Track", url: "url" },
      setSelectedTrack: vi.fn(),
      resetCollection: vi.fn(),
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockToHome).toHaveBeenCalled();
  });

  it("redirects from Level 2 to Collection if track is missing", () => {
    vi.mocked(usePathname).mockReturnValue(ROUTES.PLAY);
    vi.mocked(useGear).mockReturnValue({
      selectedMIDIInput: { id: "midi-1" } as unknown as WebMidi.MIDIInput,
      selectedMIDIOutput: null,
      selectMIDIInput: vi.fn(),
      selectMIDIOutput: vi.fn(),
      inputs: [],
      outputs: [],
      accessPromise: Promise.resolve({} as WebMidi.MIDIAccess),
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockSetGameSession).toHaveBeenCalledWith(null);
    expect(mockToCollection).toHaveBeenCalled();
  });

  it("redirects from Level 1 to Gear if MIDI is missing", () => {
    vi.mocked(usePathname).mockReturnValue(ROUTES.COLLECTION);

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockToGear).toHaveBeenCalled();
  });

  it("does not redirect from Level 0 (Gear) even if MIDI is missing", () => {
    vi.mocked(usePathname).mockReturnValue(ROUTES.GEAR);

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockToGear).not.toHaveBeenCalled();
    expect(mockToCollection).not.toHaveBeenCalled();
  });

  it("redirects from Score to Home if results are missing", () => {
    vi.mocked(usePathname).mockReturnValue(ROUTES.SCORE);

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockToHome).toHaveBeenCalled();
  });
});
