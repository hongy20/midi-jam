import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import { useDemoPlayback } from "./use-demo-playback";

describe("useDemoPlayback", () => {
  let mockObserverCallback: IntersectionObserverCallback;
  const observe = vi.fn();
  const disconnect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation(function (
      this: IntersectionObserver,
      callback: IntersectionObserverCallback,
    ) {
      mockObserverCallback = callback;
      this.observe = observe;
      this.unobserve = vi.fn();
      this.disconnect = disconnect;
    }) as unknown as typeof IntersectionObserver;
  });

  it("does not fire onNoteOff initially for non-intersecting notes", () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const container = document.createElement("div");
    const containerRef = { current: container };

    const note = document.createElement("div");
    note.setAttribute("data-pitch", "60");
    container.appendChild(note);

    // Mock querySelectorAll to find our note
    container.querySelectorAll = vi
      .fn()
      .mockReturnValue([note] as unknown as NodeListOf<Element>);

    renderHook(() =>
      useDemoPlayback({
        containerRef,
        demoMode: true,
        isLoading: false,
        spans: [{ note: 60 } as unknown as NoteSpan],
        onNoteOn,
        onNoteOff,
      }),
    );

    // Simulate initial IntersectionObserver callback where nothing is intersecting
    mockObserverCallback(
      [
        {
          target: note,
          isIntersecting: false,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );

    expect(onNoteOff).not.toHaveBeenCalled();
  });

  it("fires onNoteOff then onNoteOn for contiguous notes of the same pitch", () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const container = document.createElement("div");
    const containerRef = { current: container };

    const note1 = document.createElement("div");
    note1.setAttribute("data-pitch", "60");
    const note2 = document.createElement("div");
    note2.setAttribute("data-pitch", "60");

    container.appendChild(note1);
    container.appendChild(note2);
    container.querySelectorAll = vi
      .fn()
      .mockReturnValue([note1, note2] as unknown as NodeListOf<Element>);

    renderHook(() =>
      useDemoPlayback({
        containerRef,
        demoMode: true,
        isLoading: false,
        spans: [
          { note: 60 } as unknown as NoteSpan,
          { note: 60 } as unknown as NoteSpan,
        ],
        onNoteOn,
        onNoteOff,
      }),
    );

    // Step 1: First note enters
    mockObserverCallback(
      [
        {
          target: note1,
          isIntersecting: true,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
    expect(onNoteOn).toHaveBeenCalledWith(60, 0.7);
    onNoteOn.mockClear();

    // Step 2: Batch where note 1 exits and note 2 enters
    // We expect onNoteOff(60) then onNoteOn(60)
    const callOrder: string[] = [];
    onNoteOn.mockImplementation(() => callOrder.push("on"));
    onNoteOff.mockImplementation(() => callOrder.push("off"));

    mockObserverCallback(
      [
        {
          target: note2,
          isIntersecting: true,
        } as unknown as IntersectionObserverEntry,
        {
          target: note1,
          isIntersecting: false,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );

    // Batch where note 1 exits and note 2 enters
    // We expect onNoteOff(60) then onNoteOn(60)
    expect(callOrder).toEqual(["off", "on"]);
  });
});
