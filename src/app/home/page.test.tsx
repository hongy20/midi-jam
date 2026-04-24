import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSongTracks, useCollection } from "@/features/collection";
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
  getSongTracks: vi.fn(),
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
    vi.mocked(getSongTracks).mockResolvedValue(mockTracks);

    // Mock MIDI support
    Object.defineProperty(global.navigator, "requestMIDIAccess", {
      value: vi.fn().mockResolvedValue({}),
      configurable: true,
    });
  });

  it("renders the title, start button, and song count", async () => {
    const tracksPromise = Promise.resolve(mockTracks);
    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <HomePageClient tracksPromise={tracksPromise} />
        </Suspense>,
      );
    });

    await waitFor(
      () => {
        expect(screen.getByText(/Midi Jam/i)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    expect(screen.getByRole("button", { name: /START/i })).toBeInTheDocument();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
    expect(screen.getByText(/SONGS/i)).toBeInTheDocument();
  });

  it("calls reset functions on mount", async () => {
    const tracksPromise = Promise.resolve(mockTracks);
    await act(async () => {
      render(
        <Suspense fallback={null}>
          <HomePageClient tracksPromise={tracksPromise} />
        </Suspense>,
      );
    });

    await waitFor(() => {
      expect(mockCollection.resetCollection).toHaveBeenCalled();
    });
    expect(mockScore.resetScore).toHaveBeenCalled();
    expect(mockGear.selectMIDIInput).toHaveBeenCalledWith(null);
  });

  it("navigates to gear on start click", async () => {
    const tracksPromise = Promise.resolve(mockTracks);
    await act(async () => {
      render(
        <Suspense fallback={null}>
          <HomePageClient tracksPromise={tracksPromise} />
        </Suspense>,
      );
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /START/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /START/i }));
    expect(mockNavigation.toGear).toHaveBeenCalled();
  });

  it("navigates to options on options click", async () => {
    const tracksPromise = Promise.resolve(mockTracks);
    await act(async () => {
      render(
        <Suspense fallback={null}>
          <HomePageClient tracksPromise={tracksPromise} />
        </Suspense>,
      );
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Options/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /Options/i }));
    expect(mockNavigation.toOptions).toHaveBeenCalled();
  });
});
