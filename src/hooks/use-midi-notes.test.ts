import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MIDI_COMMAND_NOTE_ON } from "@/lib/midi/constant";
import { useMIDINotes } from "./use-midi-notes";

describe("useMIDINotes", () => {
  it("should call the callback when a note event occurs", () => {
    const mockInput = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as WebMidi.MIDIInput;

    const onNote = vi.fn();
    renderHook(() => useMIDINotes(mockInput, onNote));

    expect(mockInput.addEventListener).toHaveBeenCalledWith(
      "midimessage",
      expect.any(Function),
    );

    const midiMessageHandler = vi.mocked(mockInput.addEventListener).mock
      .calls[0][1] as (event: WebMidi.MIDIMessageEvent) => void;

    // Simulate Note On
    midiMessageHandler({
      data: new Uint8Array([MIDI_COMMAND_NOTE_ON, 60, 100]),
    } as WebMidi.MIDIMessageEvent);

    expect(onNote).toHaveBeenCalledWith({
      type: "note-on",
      note: 60,
      velocity: 100,
    });
  });

  it("should not re-subscribe when the callback changes", () => {
    const mockInput = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as WebMidi.MIDIInput;

    const { rerender } = renderHook(
      ({ onNote }) => useMIDINotes(mockInput, onNote),
      {
        initialProps: { onNote: vi.fn() },
      },
    );

    expect(mockInput.addEventListener).toHaveBeenCalledTimes(1);

    // Re-render with a new callback
    rerender({ onNote: vi.fn() });

    // Should still only have called addEventListener once
    expect(mockInput.addEventListener).toHaveBeenCalledTimes(1);
  });

  it("should not add listener if input is null", () => {
    const onNote = vi.fn();
    renderHook(() => useMIDINotes(null, onNote));
    expect(onNote).not.toHaveBeenCalled();
  });

  it("should clean up listener on unmount", () => {
    const mockInput = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as WebMidi.MIDIInput;

    const { unmount } = renderHook(() => useMIDINotes(mockInput, vi.fn()));
    unmount();

    expect(mockInput.removeEventListener).toHaveBeenCalled();
  });
});
