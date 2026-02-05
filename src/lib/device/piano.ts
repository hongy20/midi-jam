/**
 * Checks if a MIDI note corresponds to a black key on a piano.
 * @param midiNote The MIDI note number (0-127).
 * @returns True if the note is a black key (sharp/flat), false otherwise.
 */
export function isBlackKey(midiNote: number): boolean {
  const n = midiNote % 12;
  // C# (1), D# (3), F# (6), G# (8), A# (10)
  return [1, 3, 6, 8, 10].includes(n);
}
