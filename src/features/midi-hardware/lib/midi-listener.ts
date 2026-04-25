/**
 * Subscribes to all MIDI messages from a MIDI input device.
 * @param input The MIDIInput device to listen to.
 * @param callback The function to be called when a MIDI message is received.
 * @returns An unsubscribe function to remove the listener.
 */
export function subscribeToMessages(
  input: WebMidi.MIDIInput,
  callback: (event: WebMidi.MIDIMessageEvent) => void,
): () => void {
  input.addEventListener("midimessage", callback);

  return () => {
    input.removeEventListener("midimessage", callback);
  };
}
