import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useMIDIAutoSelect } from "./use-midi-auto-select";

describe("useMIDIAutoSelect", () => {
  it("should attach and detach midimessage listeners", () => {
    const addEventListenerMock = vi.fn();
    const removeEventListenerMock = vi.fn();

    const mockInput = {
      id: "input-1",
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    } as unknown as WebMidi.MIDIInput;

    const selectMIDIInputMock = vi.fn();

    const { unmount } = renderHook(() => useMIDIAutoSelect([mockInput], selectMIDIInputMock));

    expect(addEventListenerMock).toHaveBeenCalledWith("midimessage", expect.any(Function));

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith("midimessage", expect.any(Function));
  });

  it("should call selectMIDIInput when a midimessage is received", () => {
    let handler: any = null;
    const addEventListenerMock = vi.fn((event, cb) => {
      if (event === "midimessage") {
        handler = cb;
      }
    });
    const removeEventListenerMock = vi.fn();

    const mockInput = {
      id: "input-2",
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    } as unknown as WebMidi.MIDIInput;

    const selectMIDIInputMock = vi.fn();

    renderHook(() => useMIDIAutoSelect([mockInput], selectMIDIInputMock));

    expect(handler).not.toBeNull();

    // Simulate midimessage
    if (handler) {
      handler(new Event("midimessage"));
    }

    expect(selectMIDIInputMock).toHaveBeenCalledWith(mockInput);
  });
});
