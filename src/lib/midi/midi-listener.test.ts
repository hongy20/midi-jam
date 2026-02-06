import { describe, expect, it, vi } from "vitest";
import { MIDI_COMMAND_NOTE_OFF, MIDI_COMMAND_NOTE_ON } from "./constant";
import { subscribeToNotes } from "./midi-listener";

describe("subscribeToNotes", () => {
  it("should call the callback for Note On messages", () => {
    const mockInput = {
      onmidimessage: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as WebMidi.MIDIInput;

    const callback = vi.fn();
    const unsubscribe = subscribeToNotes(mockInput, callback);

    expect(mockInput.addEventListener).toHaveBeenCalledWith(
      "midimessage",
      expect.any(Function),
    );

    // Simulate a Note On event (Note 60, Velocity 100)
    const event = {
      data: new Uint8Array([MIDI_COMMAND_NOTE_ON, 60, 100]),
    } as WebMidi.MIDIMessageEvent;

    const midiMessageHandler = vi.mocked(mockInput.addEventListener).mock
      .calls[0][1] as (event: WebMidi.MIDIMessageEvent) => void;
    midiMessageHandler(event);

    expect(callback).toHaveBeenCalledWith({
      type: "note-on",
      note: 60,
      velocity: 100,
    });

    unsubscribe();
    expect(mockInput.removeEventListener).toHaveBeenCalledWith(
      "midimessage",
      expect.any(Function),
    );
  });

  it("should call the callback for Note Off messages", () => {
    const mockInput = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as WebMidi.MIDIInput;

    const callback = vi.fn();
    subscribeToNotes(mockInput, callback);

    const midiMessageHandler = vi.mocked(mockInput.addEventListener).mock
      .calls[0][1] as (event: WebMidi.MIDIMessageEvent) => void;

    // Simulate a Note Off event (Note 60, Velocity 0)
    midiMessageHandler({
      data: new Uint8Array([MIDI_COMMAND_NOTE_OFF, 60, 0]),
    } as WebMidi.MIDIMessageEvent);

    expect(callback).toHaveBeenCalledWith({
      type: "note-off",
      note: 60,
      velocity: 0,
    });
  });

  it("should treat Note On with velocity 0 as Note Off", () => {
    const mockInput = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as WebMidi.MIDIInput;

    const callback = vi.fn();
    subscribeToNotes(mockInput, callback);

    const midiMessageHandler = vi.mocked(mockInput.addEventListener).mock
      .calls[0][1] as (event: WebMidi.MIDIMessageEvent) => void;

    // Simulate a Note On event with 0 velocity
    midiMessageHandler({
      data: new Uint8Array([MIDI_COMMAND_NOTE_ON, 60, 0]),
    } as WebMidi.MIDIMessageEvent);

    expect(callback).toHaveBeenCalledWith({
      type: "note-off",
      note: 60,
      velocity: 0,
    });
  });

  it("should ignore non-note messages", () => {
    const mockInput = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as WebMidi.MIDIInput;

    const callback = vi.fn();
    subscribeToNotes(mockInput, callback);

    const midiMessageHandler = vi.mocked(mockInput.addEventListener).mock
      .calls[0][1] as (event: WebMidi.MIDIMessageEvent) => void;

    // Simulate a Clock message (0xF8)
    midiMessageHandler({
      data: new Uint8Array([0xf8]),
    } as WebMidi.MIDIMessageEvent);

    expect(callback).not.toHaveBeenCalled();
  });
});
