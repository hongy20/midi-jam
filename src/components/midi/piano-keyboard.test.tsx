import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PianoKeyboard } from "./piano-keyboard";

describe("PianoKeyboard", () => {
  it("should render 88 keys (52 white keys)", () => {
    render(<PianoKeyboard />);
    // 52 white keys + 36 black keys = 88 total buttons
    const keys = screen.getAllByRole("button");
    expect(keys.length).toBe(88);
  });

  it("should highlight active keys", () => {
    const liveNotes = new Set([21]); // A0
    const playbackNotes = new Set([60, 108]); // middle C, C8
    render(<PianoKeyboard liveNotes={liveNotes} playbackNotes={playbackNotes} />);

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
