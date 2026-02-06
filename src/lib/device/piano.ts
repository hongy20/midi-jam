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

// 21 units per octave (3 units per white key, 2 per black key)
export const PIANO_OFFSETS = [0, 2, 3, 5, 6, 9, 11, 12, 14, 15, 17, 18];

/**
 * Calculates the horizontal unit offset for a MIDI note in a 21-unit-per-octave grid.
 */
export function getNoteUnitOffset(note: number): number {
  const octave = Math.floor(note / 12);
  const semitone = note % 12;
  return octave * 21 + PIANO_OFFSETS[semitone];
}
