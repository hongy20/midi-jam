import { queryByAttribute, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LaneStage } from "./lane-stage";

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  callback: any;
  constructor(callback: any) {
    this.callback = callback;
  }
  observe(_el: HTMLElement) {
    this.callback([{ contentRect: { width: 1000, height: 600 } }]);
  }
  unobserve() {}
  disconnect() {}
};

describe("LaneStage", () => {
  const mockSpans = [
    {
      id: "1",
      note: 60,
      startTime: 0,
      duration: 1,
      velocity: 0.8,
      isBlack: false,
    },
    {
      id: "2",
      note: 61,
      startTime: 1,
      duration: 1,
      velocity: 0.8,
      isBlack: true,
    },
  ];
  const totalDurationMs = 2000;

  it("renders notes", () => {
    const scrollRef = { current: document.createElement("div") };
    const { container } = render(
      <LaneStage
        spans={mockSpans}
        totalDurationMs={totalDurationMs}
        scrollRef={scrollRef}
      />,
    );
    const note60 = queryByAttribute("data-pitch", container, "60");
    const note61 = queryByAttribute("data-pitch", container, "61");
    expect(note60).toBeInTheDocument();
    expect(note61).toBeInTheDocument();
  });
});
