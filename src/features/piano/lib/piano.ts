import { MidiNote } from "@/shared/types/midi";

import { MIDI_NOTE_C4, PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "./constants";

/**
 * Checks if a MIDI note corresponds to a black key on a piano.
 * @param note The MIDI note number (0-127).
 * @returns True if the note is a black key (sharp/flat), false otherwise.
 */
function isBlackKey(pitch: number): boolean {
  const n = pitch % 12;
  return [1, 3, 6, 8, 10].includes(n);
}

// 21 units per octave (3 units per white key, 2 per black key)
const NOTE_OFFSETS = [0, 2, 3, 5, 6, 9, 11, 12, 14, 15, 17, 18];

/**
 * Returns the horizontal unit range (start coordinate of startNote and end coordinate of endNote)
 * for a MIDI note range in a 21-unit-per-octave grid.
 */
export function getNoteUnits(startPitch: number, endPitch: number) {
  const startOctave = Math.floor(startPitch / 12);
  const startSemitone = startPitch % 12;
  const startUnit = startOctave * 21 + NOTE_OFFSETS[startSemitone];

  const endOctave = Math.floor(endPitch / 12);
  const endSemitone = endPitch % 12;
  const endStart = endOctave * 21 + NOTE_OFFSETS[endSemitone];
  const isEndBlack = isBlackKey(endPitch);
  const endUnit = endStart + (isEndBlack ? 2 : 3);

  return {
    startUnit,
    endUnit,
  };
}

/**
 * Shifts a MIDI note by a given number of white keys.
 */
function shiftWhiteKey(pitch: number, delta: number): number {
  let current = pitch;
  let count = Math.abs(delta);
  const step = delta > 0 ? 1 : -1;

  while (count > 0) {
    current += step;
    if (current < 0 || current > 127) break;
    if (!isBlackKey(current)) {
      count--;
    }
  }
  return current;
}

/**
 * Calculates the optimal MIDI range for a set of notes.
 * Expands the range to the nearest "natural break" (C-E or F-B groups)
 * where no black keys "sit" on the line between white keys.
 */
export function getVisibleMidiRange(notes: number[], buffer = 3) {
  // Always include C4 (60) in the range calculation base
  const allNotes = notes && notes.length > 0 ? [...notes, MIDI_NOTE_C4] : [MIDI_NOTE_C4];

  let startPitch = Math.min(...allNotes);
  let endPitch = Math.max(...allNotes);

  // 1. Apply white-key buffer first
  for (let i = 0; i < buffer; i++) {
    startPitch = shiftWhiteKey(startPitch, -1);
    endPitch = shiftWhiteKey(endPitch, 1);
  }

  // 2. Expand left to the nearest 'C' or 'F' (start of a group)
  while (startPitch > PIANO_88_KEY_MIN) {
    const semitone = startPitch % 12;
    if (semitone === 0 || semitone === 5) break; // C or F
    startPitch--;
  }

  // 3. Expand right to the nearest 'E' or 'B' (end of a group)
  while (endPitch < PIANO_88_KEY_MAX) {
    const semitone = endPitch % 12;
    if (semitone === 4 || semitone === 11) break; // E or B
    endPitch++;
  }

  // Final safety clip
  startPitch = Math.max(startPitch, PIANO_88_KEY_MIN);
  endPitch = Math.min(endPitch, PIANO_88_KEY_MAX);

  return {
    startPitch,
    endPitch,
  };
}

/**
 * Calculates the unit boundaries for a set of MIDI notes.
 * Combines range calculation and unit conversion into a single call.
 * @param notes Array of MIDI notes (objects with a note property).
 * @returns Object with startUnit and endUnit values.
 */
export function getPianoLayoutUnits(notes: MidiNote[]) {
  const noteNumbers = notes.map((n) => n.pitch);
  const { startPitch, endPitch } = getVisibleMidiRange(noteNumbers);
  return getNoteUnits(startPitch, endPitch);
}
