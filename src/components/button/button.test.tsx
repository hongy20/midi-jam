import { fireEvent, render, screen } from "@testing-library/react";
import { Play } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders with children and handles clicks", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with an icon", () => {
    render(<Button icon={Play}>Play</Button>);
    expect(screen.getByText("Play")).toBeDefined();
    // Lucide icon check
    const icon = document.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });
});
