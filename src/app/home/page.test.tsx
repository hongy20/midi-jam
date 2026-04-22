import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useNavigation } from "@/shared/hooks/use-navigation";

import { HomePageClient } from "./components/home-page.client";
import { useAppReset } from "./hooks/use-app-reset";

// Mock the hooks
vi.mock("@/shared/hooks/use-navigation", () => ({
  useNavigation: vi.fn(),
}));

vi.mock("./hooks/use-app-reset", () => ({
  useAppReset: vi.fn(),
}));

describe("HomePageClient", () => {
  const mockNavigation = {
    toGear: vi.fn(),
    toOptions: vi.fn(),
  };

  const mockAppReset = {
    resetAll: vi.fn(),
  };

  const defaultProps = {
    songsCount: 10,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useNavigation).mockReturnValue(
      mockNavigation as unknown as ReturnType<typeof useNavigation>,
    );
    vi.mocked(useAppReset).mockReturnValue(
      mockAppReset as unknown as ReturnType<typeof useAppReset>,
    );

    // Mock MIDI support
    Object.defineProperty(global.navigator, "requestMIDIAccess", {
      value: vi.fn().mockResolvedValue({}),
      configurable: true,
    });
  });

  it("renders the title, start button, and song count", () => {
    render(<HomePageClient {...defaultProps} />);
    expect(screen.getByText(/Midi Jam/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /START/i })).toBeInTheDocument();
    expect(screen.getByText(/10/i)).toBeInTheDocument();
    expect(screen.getByText(/SONGS/i)).toBeInTheDocument();
  });

  it("calls resetAll on mount", () => {
    render(<HomePageClient {...defaultProps} />);
    expect(mockAppReset.resetAll).toHaveBeenCalled();
  });

  it("navigates to gear on start click", () => {
    render(<HomePageClient {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /START/i }));
    expect(mockNavigation.toGear).toHaveBeenCalled();
  });

  it("navigates to options on options click", () => {
    render(<HomePageClient {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Options/i }));
    expect(mockNavigation.toOptions).toHaveBeenCalled();
  });
});
