import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FalldownVisualizer } from "./falldown-visualizer";

describe("FalldownVisualizer", () => {
  const mockEvents = [
    { time: 1.0, type: "noteOn" as const, note: 60, velocity: 0.8, track: 0 },
    { time: 2.0, type: "noteOff" as const, note: 60, velocity: 0, track: 0 },
  ];

  it("should render correct number of visible notes", () => {
    // At t=0, the note is in the look-ahead window
    const { container } = render(
      <FalldownVisualizer events={mockEvents} currentTime={0} speed={1} />,
    );

    const notes = container.querySelectorAll(".absolute.rounded-full");
    expect(notes.length).toBe(1);
  });

  it("should hide notes that have already passed", () => {
    // At t=3, the note (ending at t=2) should be gone
    const { container } = render(
      <FalldownVisualizer events={mockEvents} currentTime={3} speed={1} />,
    );

    const notes = container.querySelectorAll(".absolute.rounded-full");
    expect(notes.length).toBe(0);
  });
});
