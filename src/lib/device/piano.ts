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
 * Returns the horizontal unit range (start coordinate of startNote and end coordinate of endNote)
 * for a MIDI note range in a 21-unit-per-octave grid.
 */
export function getNoteUnits(startNote: number, endNote: number) {
  const startOctave = Math.floor(startNote / 12);
  const startSemitone = startNote % 12;
  const startUnit = startOctave * 21 + NOTE_OFFSETS[startSemitone];

  const endOctave = Math.floor(endNote / 12);
  const endSemitone = endNote % 12;
  const endStart = endOctave * 21 + NOTE_OFFSETS[endSemitone];
  const isEndBlack = isBlackKey(endNote);
  const endUnit = endStart + (isEndBlack ? 2 : 3);

  return {
    startUnit,
    endUnit,
  };
}
