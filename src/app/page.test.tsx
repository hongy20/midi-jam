import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WelcomePage from "./page";
import { useGameNavigation } from "@/hooks/use-game-navigation";

// Mock the hook
vi.mock("@/hooks/use-game-navigation", () => ({
  useGameNavigation: vi.fn(),
}));

describe("Welcome Page", () => {
  it("renders the title and start button", () => {
    vi.mocked(useGameNavigation).mockReturnValue({
      navigate: vi.fn(),
      goBack: vi.fn(),
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

    render(<WelcomePage />);
    fireEvent.click(screen.getByRole("button", { name: /Settings/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/settings");
  });
});
