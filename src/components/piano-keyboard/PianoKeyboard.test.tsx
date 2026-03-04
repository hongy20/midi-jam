import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PianoKeyboard } from "./PianoKeyboard";

// Mock constant values if needed, though they are imported from constants
import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "@/lib/midi/constant";

describe("PianoKeyboard", () => {
  it("renders the full 88-key range by default", () => {
    render(
      <PianoKeyboard
        liveNotes={new Set()}
        playbackNotes={new Set()}
      />,
    );

    // Full 88 keys should be present by default
    const totalKeys = PIANO_88_KEY_MAX - PIANO_88_KEY_MIN + 1;
    expect(screen.getAllByRole("button")).toHaveLength(totalKeys);
  });

  it("renders a specific range when provided", () => {
    render(
      <PianoKeyboard
        liveNotes={new Set()}
        playbackNotes={new Set()}
        rangeStart={60}
        rangeEnd={72}
      />,
    );

    // C4 to C5 is 13 keys
    expect(screen.getAllByRole("button")).toHaveLength(13);
  });

  it("renders active notes correctly as glows within range", () => {
    const liveNotes = new Set([60]); // C4 (in range)
    const playbackNotes = new Set([21]); // A0 (out of range)
    
    const { container } = render(
      <PianoKeyboard
        liveNotes={liveNotes}
        playbackNotes={playbackNotes}
        rangeStart={60}
        rangeEnd={72}
      />,
    );

    // Only 1 glow should be rendered (the one in range)
    const glows = container.querySelectorAll('[class*="glow"]');
    expect(glows).toHaveLength(1);
  });
});
