import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NotFound from "./not-found";

vi.mock("next/image", () => ({
  default: (props: any) => <img alt="" {...props} />,
}));

describe("NotFound Page", () => {
  it("renders correctly with MIDI themed text", () => {
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

  it("links to the home page", () => {
    render(<NotFound />);

    const link = screen.getByRole("link", { name: /return home/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
