import { queryByAttribute, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
  const mockSpans = [
    {
      id: "1",
      note: 60,
      startTime: 0,
      duration: 1,
      velocity: 0.8,
    },
    {
      id: "2",
      note: 61,
      startTime: 1,
      duration: 1,
      velocity: 0.8,
    },
  ];
  const originalDurationMs = 2000;

  it("renders notes", () => {
    const scrollRef = { current: document.createElement("div") };
    const { container } = render(
      <LaneStage
        spans={mockSpans}
        originalDurationMs={originalDurationMs}
        scrollRef={scrollRef}
        inputDevice={{} as WebMidi.MIDIInput}
      />,
    );
    const note60 = queryByAttribute("data-pitch", container, "60");
    const note61 = queryByAttribute("data-pitch", container, "61");
    expect(note60).toBeInTheDocument();
    expect(note61).toBeInTheDocument();
  });
});
