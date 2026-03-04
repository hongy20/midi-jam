import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
// Mock constant values if needed, though they are imported from constants
import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "@/lib/midi/constant";
import { PianoKeyboard } from "./PianoKeyboard";

describe("PianoKeyboard", () => {
  it("always renders the full 88-key range", () => {
    render(<PianoKeyboard liveNotes={new Set()} playbackNotes={new Set()} />);

    // Full 88 keys should always be present in the DOM
    const totalKeys = PIANO_88_KEY_MAX - PIANO_88_KEY_MIN + 1;
    expect(screen.getAllByRole("button")).toHaveLength(totalKeys);
  });

  it("renders active notes correctly as glows", () => {
    const liveNotes = new Set([60]); // C4
    const playbackNotes = new Set([64]); // E4

    const { container } = render(
      <PianoKeyboard liveNotes={liveNotes} playbackNotes={playbackNotes} />,
    );

    // Check for glow elements
    // Note: Since we use CSS modules, we should check for elements with 'glow' in their class or data attributes
    const glows = container.querySelectorAll('[class*="glow"]');
    expect(glows).toHaveLength(2);
  });
});
