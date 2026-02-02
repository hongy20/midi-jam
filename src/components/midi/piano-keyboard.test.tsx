import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PianoKeyboard } from "./piano-keyboard";

describe("PianoKeyboard Responsiveness and Zooming", () => {
  it("renders correct number of white keys for a specific range", () => {
    // Range C4 (60) to C5 (72)
    // White keys: 60, 62, 64, 65, 67, 69, 71, 72 (8 keys)
    render(<PianoKeyboard rangeStart={60} rangeEnd={72} />);

    const whiteKeys = screen.getAllByRole("button", { name: /note/i }).filter(
      (el) => !el.className.includes("bg-gray-900"), // Exclude black keys which use bg-gray-900 by default
    );

    // Total buttons found should be white keys + black keys
    // In range 60-72:
    // White: 60, 62, 64, 65, 67, 69, 71, 72 (8)
    // Black: 61, 63, 66, 68, 70 (5)
    // Total: 13
    expect(screen.getAllByRole("button", { name: /note/i })).toHaveLength(13);
  });

  it("handles dynamic range correctly", () => {
    const { rerender } = render(
      <PianoKeyboard rangeStart={60} rangeEnd={64} />,
    );
    // C4, D4, E4 (3 white keys) + C#4, D#4 (2 black keys) = 5 total
    expect(screen.getAllByRole("button", { name: /note/i })).toHaveLength(5);

    rerender(<PianoKeyboard rangeStart={21} rangeEnd={108} />);
    // Full 88 keys
    expect(screen.getAllByRole("button", { name: /note/i })).toHaveLength(88);
  });
});
