import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useDemoPlayback } from "./use-demo-playback";
import React from "react";

describe("useDemoPlayback", () => {
  let mockObserverCallback: (entries: any[]) => void;
  const observe = vi.fn();
  const disconnect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation(function (this: any, callback: any) {
      mockObserverCallback = callback;
      this.observe = observe;
      this.unobserve = vi.fn();
      this.disconnect = disconnect;
    }) as any;
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
    container.querySelectorAll = vi.fn().mockReturnValue([note]);

    renderHook(() => useDemoPlayback({
      containerRef,
      demoMode: true,
      isLoading: false,
      spans: [{ note: 60 } as any],
      onNoteOn,
      onNoteOff,
    }));

    // Simulate initial IntersectionObserver callback where nothing is intersecting
    mockObserverCallback([{
      target: note,
      isIntersecting: false,
    }]);

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
    container.querySelectorAll = vi.fn().mockReturnValue([note1, note2]);

    renderHook(() => useDemoPlayback({
      containerRef,
      demoMode: true,
      isLoading: false,
      spans: [{ note: 60 } as any, { note: 60 } as any],
      onNoteOn,
      onNoteOff,
    }));

    // Step 1: First note enters
    mockObserverCallback([{
      target: note1,
      isIntersecting: true,
    }]);
    expect(onNoteOn).toHaveBeenCalledWith(60, 0.7);
    onNoteOn.mockClear();

    // Step 2: Batch where note 1 exits and note 2 enters
    // We expect onNoteOff(60) then onNoteOn(60)
    const callOrder: string[] = [];
    onNoteOn.mockImplementation(() => callOrder.push("on"));
    onNoteOff.mockImplementation(() => callOrder.push("off"));

    mockObserverCallback([
      { target: note2, isIntersecting: true },
      { target: note1, isIntersecting: false },
    ]);

    // Current implementation will fail this because it doesn't guarantee order 
    // AND it might not fire off/on at all if it just sees pitch 60 is still active
    // But per user request, we want Off then On.
    expect(callOrder).toEqual(["off", "on"]);
  });
});
