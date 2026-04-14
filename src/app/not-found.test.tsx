import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useNavigation } from "@/hooks/use-navigation";
import NotFound from "./not-found";

vi.mock("@/hooks/use-navigation");
vi.mock("next/image", () => ({
  default: (props: any) => <img alt="" {...props} />,
}));

describe("NotFound Page", () => {
  it("renders correctly with MIDI themed text", () => {
    vi.mocked(useNavigation).mockReturnValue({
      toHome: vi.fn(),
    } as any);

    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("LOST IN THE MIDI?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The track you're looking for was never composed or has been deleted.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("RETURN HOME")).toBeInTheDocument();
  });

  it("calls toHome navigation when the button is clicked", () => {
    const mockToHome = vi.fn();
    vi.mocked(useNavigation).mockReturnValue({
      toHome: mockToHome,
    } as any);

    render(<NotFound />);

    const button = screen.getByText("RETURN HOME");
    fireEvent.click(button);

    expect(mockToHome).toHaveBeenCalled();
  });
});
