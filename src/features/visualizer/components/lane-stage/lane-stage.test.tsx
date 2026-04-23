import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { MidiNoteGroup } from "@/shared/types/midi";

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
  const mockGroups: MidiNoteGroup[] = [
    {
      index: 0,
      startMs: 0,
      durationMs: 3000,
      notes: [
        {
          id: "1",
          pitch: 60,
          startTimeMs: 0,
          durationMs: 1000,
          velocity: 0.8,
        },
        {
          id: "2",
          pitch: 61,
          startTimeMs: 1000,
          durationMs: 1000,
          velocity: 0.8,
        },
      ],
    },
  ];

  it("renders notes", () => {
    const scrollRef = { current: document.createElement("div") };
    const { container } = render(
      <LaneStage groups={mockGroups} scrollRef={scrollRef} getCurrentTimeMs={() => 0} />,
    );
    const notes60 = container.querySelectorAll('[data-pitch="60"]');
    const notes61 = container.querySelectorAll('[data-pitch="61"]');
    expect(notes60.length).toBeGreaterThan(0);
    expect(notes61.length).toBeGreaterThan(0);
  });
});
