import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FalldownVisualizer } from "./FalldownVisualizer";

describe("FalldownVisualizer", () => {
  const mockSpans = [
    {
      id: "test-note-1",
      note: 60, // C4
      startTime: 1.0,
      duration: 1.0,
      isBlack: false,
      velocity: 0.8,
    },
  ];

  it("should render notes from the spans array", () => {
    const { container } = render(
      <FalldownVisualizer
        spans={mockSpans}
        currentTime={0}
        speed={1}
        barLines={[]}
      />,
    );

    const notes = container.querySelectorAll(".absolute.rounded-md");
    expect(notes.length).toBe(1);
  });

  it("should render all notes regardless of current time (delegating visibility to CSS)", () => {
    // Even at t=3, the note (ending at t=2) should still be in the DOM
    const { container } = render(
      <FalldownVisualizer
        spans={mockSpans}
        currentTime={3}
        speed={1}
        barLines={[]}
      />,
    );

    const notes = container.querySelectorAll(".absolute.rounded-md");
    expect(notes.length).toBe(1);
  });
});
