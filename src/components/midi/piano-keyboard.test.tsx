import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PianoKeyboard } from "./piano-keyboard";

describe("PianoKeyboard", () => {
  it("should render 88 keys (52 white keys)", () => {
    render(<PianoKeyboard activeNotes={new Set()} />);
    // 52 white keys + 36 black keys = 88 total buttons
    const keys = screen.getAllByRole("button");
    expect(keys.length).toBe(88);
  });

  it("should highlight active keys", () => {
    const activeNotes = new Set([21, 60, 108]); // A0, middle C, C8
    render(<PianoKeyboard activeNotes={activeNotes} />);

    expect(screen.getByLabelText(/Note 21/i)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByLabelText(/Note 60/i)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByLabelText(/Note 108/i)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByLabelText(/Note 61/i)).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
