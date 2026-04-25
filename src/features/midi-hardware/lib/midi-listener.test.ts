import { describe, expect, it, vi } from "vitest";

import { subscribeToMessages } from "./midi-listener";

describe("subscribeToMessages", () => {
  it("should attach a listener and call the callback for any MIDI message", () => {
    const mockInput = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as WebMidi.MIDIInput;

    const callback = vi.fn();
    const unsubscribe = subscribeToMessages(mockInput, callback);

    expect(mockInput.addEventListener).toHaveBeenCalledWith("midimessage", callback);

    // Simulate a MIDI event
    const event = {
      data: new Uint8Array([0x90, 60, 100]),
    } as WebMidi.MIDIMessageEvent;

    // Call the callback directly as it's passed to addEventListener
    const midiMessageHandler = vi.mocked(mockInput.addEventListener).mock.calls[0][1] as (
      event: WebMidi.MIDIMessageEvent,
    ) => void;
    midiMessageHandler(event);

    expect(callback).toHaveBeenCalledWith(event);

    unsubscribe();
    expect(mockInput.removeEventListener).toHaveBeenCalledWith("midimessage", callback);
  });
});
