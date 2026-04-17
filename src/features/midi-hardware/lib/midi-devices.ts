/**
 * Retrieves an array of available MIDI input devices from the MIDIAccess object.
 * @param access The MIDIAccess object obtained from the Web MIDI API.
 * @returns An array of MIDIInput objects.
 */
export function getMIDIInputDevices(
  access: WebMidi.MIDIAccess,
): WebMidi.MIDIInput[] {
  return Array.from(access.inputs.values());
}

/**
 * Retrieves an array of available MIDI output devices from the MIDIAccess object.
 * @param access The MIDIAccess object obtained from the Web MIDI API.
 * @returns An array of MIDIOutput objects.
 */
export function getMIDIOutputDevices(
  access: WebMidi.MIDIAccess,
): WebMidi.MIDIOutput[] {
  return Array.from(access.outputs.values());
}

/**
 * Subscribes to MIDI device state change events (connection/disconnection).
 * @param access The MIDIAccess object.
 * @param callback The function to be called when a state change occurs.
 * @returns An unsubscribe function to remove the listener.
 */
export function onMIDIDevicesStateChange(
  access: WebMidi.MIDIAccess,
  callback: (event: WebMidi.MIDIConnectionEvent) => void,
): () => void {
  access.addEventListener("statechange", callback);
  return () => access.removeEventListener("statechange", callback);
}
