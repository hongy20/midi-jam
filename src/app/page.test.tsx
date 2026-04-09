import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useHome } from "@/context/home-context";
import { useNavigation } from "@/hooks/use-navigation";
import { useAppReset } from "@/hooks/use-track-sync";
import WelcomePage from "./page";

// Mock the hooks
vi.mock("@/hooks/use-navigation", () => ({
  useNavigation: vi.fn(),
}));

vi.mock("@/context/home-context", () => ({
  useHome: vi.fn(),
  INITIAL_LOADING_TIMEOUT: 1000,
}));

vi.mock("@/hooks/use-track-sync", () => ({
  useAppReset: vi.fn(),
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

  const mockAppReset = {
    resetAll: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useAppReset).mockReturnValue(mockAppReset);
  });

  it("renders the title and start button", () => {
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useHome).mockReturnValue({
      isLoading: false,
      isSupported: true,
      resetHome: vi.fn(),
    });

    render(<WelcomePage />);
    expect(screen.getByText(/Midi Jam/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /START/i })).toBeInTheDocument();
  });

  it("shows spinner when loading", () => {
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useHome).mockReturnValue({
      isLoading: true,
      isSupported: true,
      resetHome: vi.fn(),
    });

    render(<WelcomePage />);
    expect(screen.getByText(/INITIALIZING ENGINE/i)).toBeInTheDocument();
  });

  it("shows error when not supported", () => {
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useHome).mockReturnValue({
      isLoading: false,
      isSupported: false,
      resetHome: vi.fn(),
    });

    render(<WelcomePage />);
    expect(screen.getByText(/UNSUPPORTED BROWSER/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /START/i }),
    ).not.toBeInTheDocument();
  });

  it("navigates to gear on start click", () => {
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useHome).mockReturnValue({
      isLoading: false,
      isSupported: true,
      resetHome: vi.fn(),
    });

    render(<WelcomePage />);
    fireEvent.click(screen.getByRole("button", { name: /START/i }));
    expect(mockNavigation.toGear).toHaveBeenCalled();
  });

  it("navigates to options on options click", () => {
    vi.mocked(useNavigation).mockReturnValue(mockNavigation);
    vi.mocked(useHome).mockReturnValue({
      isLoading: false,
      isSupported: true,
      resetHome: vi.fn(),
    });

    render(<WelcomePage />);
    fireEvent.click(screen.getByRole("button", { name: /Options/i }));
    expect(mockNavigation.toOptions).toHaveBeenCalled();
  });
});
