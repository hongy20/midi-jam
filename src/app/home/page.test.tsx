import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSoundTracks, useCollection } from "@/features/collection";
import { useGear } from "@/features/midi-hardware";
import { useScore } from "@/features/score";
import { useNavigation } from "@/shared/hooks/use-navigation";

import { HomePageClient } from "./components/home-page.client";

// Mock the hooks
vi.mock("@/shared/hooks/use-navigation", () => ({
  useNavigation: vi.fn(),
}));

vi.mock("@/features/collection", () => ({
  useCollection: vi.fn(),
  getSoundTracks: vi.fn(),
}));

vi.mock("@/features/midi-hardware", () => ({
  useGear: vi.fn(),
}));

vi.mock("@/features/score", () => ({
  useScore: vi.fn(),
}));

describe("HomePageClient", () => {
  const mockNavigation = {
    toGear: vi.fn(),
    toOptions: vi.fn(),
  };

  const mockCollection = {
    resetCollection: vi.fn(),
  };

  const mockGear = {
    selectMIDIInput: vi.fn(),
  };

  const mockScore = {
    resetScore: vi.fn(),
  };

  const mockTracks = [
    { id: "1", name: "Song 1", artist: "Artist 1", difficulty: "Easy", url: "/1.mid" },
    { id: "2", name: "Song 2", artist: "Artist 2", difficulty: "Medium", url: "/2.mid" },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useNavigation).mockReturnValue(
      mockNavigation as unknown as ReturnType<typeof useNavigation>,
    );
    vi.mocked(useCollection).mockReturnValue(
      mockCollection as unknown as ReturnType<typeof useCollection>,
    );
    vi.mocked(useGear).mockReturnValue(mockGear as unknown as ReturnType<typeof useGear>);
    vi.mocked(useScore).mockReturnValue(mockScore as unknown as ReturnType<typeof useScore>);
    vi.mocked(getSoundTracks).mockResolvedValue(mockTracks);

    // Mock MIDI support
    Object.defineProperty(global.navigator, "requestMIDIAccess", {
      value: vi.fn().mockResolvedValue({}),
      configurable: true,
    });
  });

  it("renders the title, start button, and song count", async () => {
    render(<HomePageClient />);
    expect(screen.getByText(/Midi Jam/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /START/i })).toBeInTheDocument();

    // Wait for songs to load
    await waitFor(() => {
      expect(screen.getByText(/2/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/SONGS/i)).toBeInTheDocument();
  });

  it("calls reset functions on mount", () => {
    render(<HomePageClient />);
    expect(mockCollection.resetCollection).toHaveBeenCalled();
    expect(mockScore.resetScore).toHaveBeenCalled();
    expect(mockGear.selectMIDIInput).toHaveBeenCalledWith(null);
  });

  it("navigates to gear on start click", () => {
    render(<HomePageClient />);
    fireEvent.click(screen.getByRole("button", { name: /START/i }));
    expect(mockNavigation.toGear).toHaveBeenCalled();
  });

  it("navigates to options on options click", () => {
    render(<HomePageClient />);
    fireEvent.click(screen.getByRole("button", { name: /Options/i }));
    expect(mockNavigation.toOptions).toHaveBeenCalled();
  });
});
