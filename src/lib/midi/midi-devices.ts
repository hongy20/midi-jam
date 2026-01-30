/**
 * Retrieves an array of available MIDI input devices from the MIDIAccess object.
 * @param access The MIDIAccess object obtained from the Web MIDI API.
 * @returns An array of MIDIInput objects.
 */
export function getMIDIInputs(access: WebMidi.MIDIAccess): WebMidi.MIDIInput[] {
  return Array.from(access.inputs.values());
}

/**
 * Subscribes to MIDI device state change events (connection/disconnection).
 * @param access The MIDIAccess object.
 * @param callback The function to be called when a state change occurs.
 * @returns An unsubscribe function to remove the listener.
 */
export function onMIDIDevicesChange(
  access: WebMidi.MIDIAccess,
  callback: (event: WebMidi.MIDIConnectionEvent) => void,
): () => void {
  access.addEventListener("statechange", callback);
  return () => access.removeEventListener("statechange", callback);
}
