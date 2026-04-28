import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAutoPlay } from "./use-auto-play";

describe("useAutoPlay", () => {
  let mockObserverCallback: IntersectionObserverCallback;
  const observe = vi.fn();
  const disconnect = vi.fn();
  const onNoteOn = vi.fn();
  const onNoteOff = vi.fn();

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

  it("manages playbackNotes state and triggers callbacks", () => {
    const processNoteEvent = vi.fn();
    const container = document.createElement("div");
    const containerRef = { current: container };

    const note = document.createElement("div");
    note.setAttribute("data-pitch", "60");
    container.appendChild(note);

    container.querySelectorAll = vi.fn().mockReturnValue([note] as unknown as NodeListOf<Element>);

    const { result } = renderHook(() =>
      useAutoPlay({
        containerRef,
        enabled: true,
        onNoteOn,
        onNoteOff,
        processNoteEvent,
      }),
    );

    // Initially empty
    expect(result.current.playbackNotes.has(60)).toBe(false);

    // Simulate Note On
    act(() => {
      mockObserverCallback(
        [
          {
            target: note,
            isIntersecting: true,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(onNoteOn).toHaveBeenCalledWith(60);
    expect(processNoteEvent).toHaveBeenCalledWith({ type: "note-on", pitch: 60, velocity: 0.7 });
    expect(result.current.playbackNotes.has(60)).toBe(true);

    // Simulate Note Off
    act(() => {
      mockObserverCallback(
        [
          {
            target: note,
            isIntersecting: false,
            rootBounds: { bottom: 1000 },
            boundingClientRect: { top: 1100 },
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(onNoteOff).toHaveBeenCalledWith(60);
    expect(processNoteEvent).toHaveBeenCalledWith({ type: "note-off", pitch: 60, velocity: 0 });
    expect(result.current.playbackNotes.has(60)).toBe(false);
  });

  it("fires onNoteOff then onNoteOn for contiguous notes of the same pitch", () => {
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

    const processNoteEvent = vi.fn();
    const { result } = renderHook(() =>
      useAutoPlay({
        containerRef,
        enabled: true,
        onNoteOn,
        onNoteOff,
        processNoteEvent,
      }),
    );

    // Step 1: First note enters
    act(() => {
      mockObserverCallback(
        [
          {
            target: note1,
            isIntersecting: true,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });
    expect(onNoteOn).toHaveBeenCalledWith(60);
    expect(result.current.playbackNotes.has(60)).toBe(true);
    onNoteOn.mockClear();

    // Step 2: Batch where note 1 exits and note 2 enters
    const callOrder: string[] = [];
    onNoteOn.mockImplementation(() => callOrder.push("on"));
    onNoteOff.mockImplementation(() => callOrder.push("off"));

    act(() => {
      mockObserverCallback(
        [
          {
            target: note2,
            isIntersecting: true,
            rootBounds: { bottom: 1000 },
            boundingClientRect: { top: 500 },
          } as unknown as IntersectionObserverEntry,
          {
            target: note1,
            isIntersecting: false,
            rootBounds: { bottom: 1000 },
            boundingClientRect: { top: 1100 },
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(callOrder).toEqual(["off", "on"]);
    expect(result.current.playbackNotes.has(60)).toBe(true);
  });
});
