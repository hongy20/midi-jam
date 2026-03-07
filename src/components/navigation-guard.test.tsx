import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { NavigationGuard } from "./navigation-guard";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/navigation/routes";

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
    (useNavigation as any).mockReturnValue({
      toGear: mockToGear,
      toCollection: mockToCollection,
      toHome: mockToHome,
    });
  });

  it("redirects from Level 2 to Gear if MIDI is missing", () => {
    (usePathname as any).mockReturnValue(ROUTES.PLAY);
    (useAppContext as any).mockReturnValue({
      collection: { selectedTrack: { id: "1" } },
      gear: { selectedMIDIInput: null },
      stage: { setGameSession: mockSetGameSession },
      score: { sessionResults: null },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockSetGameSession).toHaveBeenCalledWith(null);
    expect(mockToGear).toHaveBeenCalledWith("game");
  });

  it("redirects from Level 2 to Collection if track is missing", () => {
    (usePathname as any).mockReturnValue(ROUTES.PLAY);
    (useAppContext as any).mockReturnValue({
      collection: { selectedTrack: null },
      gear: { selectedMIDIInput: { id: "midi-1" } },
      stage: { setGameSession: mockSetGameSession },
      score: { sessionResults: null },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockSetGameSession).toHaveBeenCalledWith(null);
    expect(mockToCollection).toHaveBeenCalled();
  });

  it("redirects from Level 1 to Gear if MIDI is missing", () => {
    (usePathname as any).mockReturnValue(ROUTES.COLLECTION);
    (useAppContext as any).mockReturnValue({
      collection: { selectedTrack: null },
      gear: { selectedMIDIInput: null },
      stage: { setGameSession: mockSetGameSession },
      score: { sessionResults: null },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockToGear).toHaveBeenCalled();
  });

  it("does not redirect from Level 0 (Gear) even if MIDI is missing", () => {
    (usePathname as any).mockReturnValue(ROUTES.GEAR);
    (useAppContext as any).mockReturnValue({
      collection: { selectedTrack: null },
      gear: { selectedMIDIInput: null },
      stage: { setGameSession: mockSetGameSession },
      score: { sessionResults: null },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockToGear).not.toHaveBeenCalled();
    expect(mockToCollection).not.toHaveBeenCalled();
  });

  it("redirects from Score to Home if results are missing", () => {
    (usePathname as any).mockReturnValue(ROUTES.SCORE);
    (useAppContext as any).mockReturnValue({
      collection: { selectedTrack: null },
      gear: { selectedMIDIInput: null },
      stage: { setGameSession: mockSetGameSession },
      score: { sessionResults: null },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockToHome).toHaveBeenCalled();
  });
});
