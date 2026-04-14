import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
// Mock constant values if needed, though they are imported from constants
import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "@/lib/midi/constant";
import { PianoKeyboard } from "./PianoKeyboard";

describe("PianoKeyboard", () => {
  it("renders the full 88-key range", () => {
    render(<PianoKeyboard liveNotes={new Set()} playbackNotes={new Set()} />);

    // Full 88 keys should be present
    const totalKeys = PIANO_88_KEY_MAX - PIANO_88_KEY_MIN + 1;
    expect(screen.getAllByRole("button")).toHaveLength(totalKeys);
  });
});
