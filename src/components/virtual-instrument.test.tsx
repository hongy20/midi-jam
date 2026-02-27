import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VirtualInstrument } from "./virtual-instrument";

// Mock PianoKeyboard
vi.mock("./piano-keyboard", () => ({
  PianoKeyboard: vi.fn(() => <div data-testid="piano-keyboard" />),
}));

describe("VirtualInstrument", () => {
  it("renders PianoKeyboard", () => {
    render(
      <VirtualInstrument
        inputDevice={{} as WebMidi.MIDIInput}
        liveNotes={new Set()}
        playbackNotes={new Set()}
      />,
    );
    expect(screen.getByTestId("piano-keyboard")).toBeInTheDocument();
  });
});
