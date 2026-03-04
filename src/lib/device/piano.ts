/**
 * Checks if a MIDI pitch corresponds to a black key on a piano.
 * @param pitch The MIDI note number (0-127).
 * @returns True if the pitch is a black key (sharp/flat), false otherwise.
 */
export function isBlackKey(pitch: number): boolean {
  const n = pitch % 12;
  return [1, 3, 6, 8, 10].includes(n);
}

// 21 units per octave (3 units per white key, 2 per black key)
const PITCH_OFFSETS = [0, 2, 3, 5, 6, 9, 11, 12, 14, 15, 17, 18];

/**
 * Returns the horizontal unit range (start and end) for a MIDI pitch
 * in a 21-unit-per-octave grid.
 */
export function getPitchUnits(pitch: number) {
  const octave = Math.floor(pitch / 12);
  const semitone = pitch % 12;
  const start = octave * 21 + PITCH_OFFSETS[semitone];
  const isBlack = isBlackKey(pitch);
  return {
    start,
    end: start + (isBlack ? 2 : 3),
  };
}
