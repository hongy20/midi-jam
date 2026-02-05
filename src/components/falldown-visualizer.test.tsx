import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FalldownVisualizer } from "./falldown-visualizer";

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

  it("should render correct number of visible notes", () => {
    // At t=0, the note is in the look-ahead window
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

  it("should hide notes that have already passed", () => {
    // At t=3, the note (ending at t=2) should be gone
    const { container } = render(
      <FalldownVisualizer
        spans={mockSpans}
        currentTime={3}
        speed={1}
        barLines={[]}
      />,
    );

    const notes = container.querySelectorAll(".absolute.rounded-md");
    expect(notes.length).toBe(0);
  });
});
