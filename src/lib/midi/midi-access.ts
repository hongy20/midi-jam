/**
 * Requests access to the Web MIDI API.
 * @returns A promise that resolves to a MIDIAccess object.
 * @throws An error if Web MIDI API is not supported or if access is denied.
 */
export async function requestMIDIAccess(): Promise<WebMidi.MIDIAccess> {
  if (typeof navigator === "undefined" || !navigator.requestMIDIAccess) {
    throw new Error("Web MIDI API is not supported in this browser.");
  }

  try {
    return await navigator.requestMIDIAccess();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to access MIDI devices: ${message}`);
  }
}
