const BLACK_KEY_INDICES = [
  1, // C#
  3, // D#
  6, // F#
  8, // G#
  10, // A#
];

/**
 * Checks if a MIDI note corresponds to a black key on a piano.
 * @param midiNote The MIDI note number (0-127).
 * @returns True if the note is a black key (sharp/flat), false otherwise.
 */
export function isBlackKey(midiNote: number): boolean {
  const n = midiNote % 12;
  return BLACK_KEY_INDICES.includes(n);
}
