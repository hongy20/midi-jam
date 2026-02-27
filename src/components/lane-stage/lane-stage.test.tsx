import { queryByAttribute, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SelectionProvider } from "@/context/selection-context";
import { LaneStage } from "./lane-stage";

// Mock Tone.js-dependent hooks to avoid Web Audio API errors in jsdom
vi.mock("@/hooks/use-midi-audio", () => ({
  useMidiAudio: () => ({
    playNote: vi.fn(),
    stopNote: vi.fn(),
    stopAllNotes: vi.fn(),
    playCountdownBeep: vi.fn(),
  }),
}));

vi.mock("@/hooks/use-demo-playback", () => ({
  useDemoPlayback: vi.fn(),
}));

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
  const originalDurationMs = 2000;

  it("renders notes", () => {
    const scrollRef = { current: document.createElement("div") };
    const { container } = render(
      <SelectionProvider>
        <LaneStage
          spans={mockSpans}
          originalDurationMs={originalDurationMs}
          scrollRef={scrollRef}
        />
      </SelectionProvider>,
    );
    const note60 = queryByAttribute("data-pitch", container, "60");
    const note61 = queryByAttribute("data-pitch", container, "61");
    expect(note60).toBeInTheDocument();
    expect(note61).toBeInTheDocument();
  });
});
