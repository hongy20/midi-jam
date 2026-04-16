import { queryByAttribute, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildSegmentGroups } from "@/features/midi-assets";
import { LaneStage } from "./lane-stage";

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(_el: HTMLElement) {
    const entry = {
      contentRect: { width: 1000, height: 600 },
      target: _el,
    } as unknown as ResizeObserverEntry;

    this.callback([entry], this); // 👈 pass observer
  }
  unobserve() {}
  disconnect() {}
};

describe("LaneStage", () => {
  const mockGroups = buildSegmentGroups({
    spans: [
      {
        id: "1",
        note: 60,
        startTimeMs: 0,
        durationMs: 1000,
        velocity: 0.8,
      },
      {
        id: "2",
        note: 61,
        startTimeMs: 1000,
        durationMs: 1000,
        velocity: 0.8,
      },
    ],
    totalDurationMs: 3000,
    thresholdMs: 10000,
  });

  it("renders notes", () => {
    const scrollRef = { current: document.createElement("div") };
    const { container } = render(
      <LaneStage
        groups={mockGroups}
        scrollRef={scrollRef}
        getCurrentTimeMs={() => 0}
      />,
    );
    const note60 = queryByAttribute("data-pitch", container, "60");
    const note61 = queryByAttribute("data-pitch", container, "61");
    expect(note60).toBeInTheDocument();
    expect(note61).toBeInTheDocument();
  });
});
