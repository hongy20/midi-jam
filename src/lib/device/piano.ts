/**
 * Checks if a MIDI note corresponds to a black key on a piano.
 * @param note The MIDI note number (0-127).
 * @returns True if the note is a black key (sharp/flat), false otherwise.
 */
export function isBlackKey(note: number): boolean {
  const n = note % 12;
  return [1, 3, 6, 8, 10].includes(n);
}

// 21 units per octave (3 units per white key, 2 per black key)
const NOTE_OFFSETS = [0, 2, 3, 5, 6, 9, 11, 12, 14, 15, 17, 18];

/**
 * Returns the horizontal unit range (start and end) for a MIDI note
 * in a 21-unit-per-octave grid.
 */
export function getNoteUnits(note: number) {
  const octave = Math.floor(note / 12);
  const semitone = note % 12;
  const start = octave * 21 + NOTE_OFFSETS[semitone];
  const isBlack = isBlackKey(note);
  return {
    start,
    end: start + (isBlack ? 2 : 3),
  };
}
