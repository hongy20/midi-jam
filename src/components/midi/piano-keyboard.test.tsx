import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PianoKeyboard } from "./piano-keyboard";

describe("PianoKeyboard", () => {
  it("should render a set of keys", () => {
    render(<PianoKeyboard activeNotes={new Set()} />);
    // A standard piano has 88 keys, but let's just check for some keys
    // for now we might render a smaller range, say 2 octaves.
    const keys = screen.getAllByRole("button");
    expect(keys.length).toBeGreaterThan(0);
  });

  it("should highlight active keys", () => {
    const activeNotes = new Set([60, 64, 67]); // C major chord
    render(<PianoKeyboard activeNotes={activeNotes} />);

    // Check if key 60 is pressed
    const key60 = screen.getByLabelText(/Note 60/i);
    expect(key60).toHaveAttribute("aria-pressed", "true");

    // Check if key 61 is not pressed
    const key61 = screen.getByLabelText(/Note 61/i);
    expect(key61).toHaveAttribute("aria-pressed", "false");
  });
});
