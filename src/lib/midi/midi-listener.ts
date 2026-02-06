import { MIDI_COMMAND_NOTE_OFF, MIDI_COMMAND_NOTE_ON } from "./constant";

export type MIDINoteEvent = {
  type: "note-on" | "note-off";
  note: number;
  velocity: number;
};

/**
 * Subscribes to MIDI note messages from a MIDI input device.
 * @param input The MIDIInput device to listen to.
 * @param callback The function to be called when a note message is received.
 * @returns An unsubscribe function to remove the listener.
 */
export function subscribeToNotes(
  input: WebMidi.MIDIInput,
  callback: (event: MIDINoteEvent) => void,
): () => void {
  const handleMIDIMessage = (event: WebMidi.MIDIMessageEvent) => {
    const [status, note, velocity] = event.data;

    // Mask out the channel bits (lower 4 bits) to get the command type
    const command = status & 0xf0;

    if (command === MIDI_COMMAND_NOTE_ON) {
      // Note On
      if (velocity === 0) {
        // Note On with velocity 0 is actually Note Off
        callback({ type: "note-off", note, velocity: 0 });
      } else {
        callback({ type: "note-on", note, velocity });
      }
    } else if (command === MIDI_COMMAND_NOTE_OFF) {
      // Note Off
      callback({ type: "note-off", note, velocity: velocity || 0 });
    }
  };

  input.addEventListener("midimessage", handleMIDIMessage);

  return () => {
    input.removeEventListener("midimessage", handleMIDIMessage);
  };
}
