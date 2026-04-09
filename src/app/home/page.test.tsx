import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useNavigation } from "@/hooks/use-navigation";
import { useAppReset } from "@/hooks/use-track-sync";
import { WelcomePageContainer } from "./welcome-page.container";

// Mock the hooks
vi.mock("@/hooks/use-navigation", () => ({
  useNavigation: vi.fn(),
}));

vi.mock("@/hooks/use-track-sync", () => ({
  useAppReset: vi.fn(),
}));

describe("WelcomePageContainer", () => {
  const mockNavigation = {
    toGear: vi.fn(),
    toOptions: vi.fn(),
  };

  const mockAppReset = {
    resetAll: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useNavigation).mockReturnValue(mockNavigation as any);
    vi.mocked(useAppReset).mockReturnValue(mockAppReset as any);
  });

  it("renders the title and start button", () => {
    render(<WelcomePageContainer />);
    expect(screen.getByText(/Midi Jam/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /START/i })).toBeInTheDocument();
  });

  it("calls resetAll on mount", () => {
    render(<WelcomePageContainer />);
    expect(mockAppReset.resetAll).toHaveBeenCalled();
  });

  it("navigates to gear on start click", () => {
    render(<WelcomePageContainer />);
    fireEvent.click(screen.getByRole("button", { name: /START/i }));
    expect(mockNavigation.toGear).toHaveBeenCalled();
  });

  it("navigates to options on options click", () => {
    render(<WelcomePageContainer />);
    fireEvent.click(screen.getByRole("button", { name: /Options/i }));
    expect(mockNavigation.toOptions).toHaveBeenCalled();
  });
});
