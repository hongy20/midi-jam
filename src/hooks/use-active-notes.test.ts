import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { MIDINoteEvent } from "@/lib/midi/midi-listener";
import * as midiListener from "@/lib/midi/midi-listener";
import { useActiveNotes } from "./use-active-notes";

vi.mock("@/lib/midi/midi-listener");

describe("useActiveNotes", () => {
  it("should add notes on note-on events", () => {
    let callback: (event: MIDINoteEvent) => void = () => {};
    vi.mocked(midiListener.subscribeToNotes).mockImplementation(
      (_input, cb) => {
        callback = cb;
        return () => {};
      },
    );

    const mockInput = {} as WebMidi.MIDIInput;
    const { result } = renderHook(() => useActiveNotes(mockInput));

    expect(result.current.size).toBe(0);

    act(() => {
      callback({ type: "note-on", note: 60, velocity: 100 });
    });

    expect(result.current.has(60)).toBe(true);
    expect(result.current.size).toBe(1);
  });

  it("should remove notes on note-off events", () => {
    let callback: (event: MIDINoteEvent) => void = () => {};
    vi.mocked(midiListener.subscribeToNotes).mockImplementation(
      (_input, cb) => {
        callback = cb;
        return () => {};
      },
    );

    const mockInput = {} as WebMidi.MIDIInput;
    const { result } = renderHook(() => useActiveNotes(mockInput));

    act(() => {
      callback({ type: "note-on", note: 60, velocity: 100 });
    });
    expect(result.current.has(60)).toBe(true);

    act(() => {
      callback({ type: "note-off", note: 60, velocity: 0 });
    });
    expect(result.current.has(60)).toBe(false);
    expect(result.current.size).toBe(0);
  });
});
