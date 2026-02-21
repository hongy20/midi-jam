import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InstrumentVisualizer } from "./instrument-visualizer";

// Mock PianoKeyboard
vi.mock("@/components/piano-keyboard/PianoKeyboard", () => ({
  PianoKeyboard: vi.fn(() => <div data-testid="piano-keyboard" />),
}));

describe("InstrumentVisualizer", () => {
  it("renders PianoKeyboard for piano instrument", () => {
    render(
      <InstrumentVisualizer
        instrumentId="piano"
        liveNotes={new Set()}
        demoNotes={new Set()}
      />,
    );
    expect(screen.getByTestId("piano-keyboard")).toBeInTheDocument();
  });

  it("renders PianoKeyboard as fallback for unknown instrument", () => {
    render(
      <InstrumentVisualizer
        instrumentId="unknown"
        liveNotes={new Set()}
        demoNotes={new Set()}
      />,
    );
    expect(screen.getByTestId("piano-keyboard")).toBeInTheDocument();
  });
});
