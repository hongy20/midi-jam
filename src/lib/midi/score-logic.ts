import type { MidiEvent } from "./midi-player";

export const PERFECT_WINDOW = 0.050; // 50ms
export const GREAT_WINDOW = 0.100;  // 100ms
export const GOOD_WINDOW = 0.150;   // 150ms
export const POOR_WINDOW = 0.250;   // 250ms

export interface NoteWeight {
  eventId: number;
  weight: number;
  points: number;
}

/**
 * Calculates weighted points for each note in a list of MIDI events.
 * Chords get a multiplier.
 */
export function calculateNoteWeights(events: MidiEvent[]): Map<number, number> {
  const noteOnEvents = events.filter(e => e.type === "noteOn");
  if (noteOnEvents.length === 0) return new Map();

  const eventWeights = new Map<number, number>();
  
  // Group by time to identify chords
  const timeGroups = new Map<number, number[]>();
  noteOnEvents.forEach((e, index) => {
    const group = timeGroups.get(e.time) || [];
    group.push(index);
    timeGroups.set(e.time, group);
  });

  let totalWeightedPoints = 0;
  const rawWeights: { index: number, weight: number }[] = [];

  timeGroups.forEach((indices) => {
    const chordSize = indices.length;
    const multiplier = 1 + (chordSize - 1) * 0.1;
    indices.forEach(index => {
      const weight = 1.0 * multiplier;
      rawWeights.push({ index, weight });
      totalWeightedPoints += weight;
    });
  });

  const weights = new Map<number, number>();
  rawWeights.forEach(({ index, weight }) => {
    const points = (weight / totalWeightedPoints) * 100;
    // Use index in original noteOnEvents list or we should just use event index?
    // Let's use the index of the event in the original events array if possible.
  });

  // Better approach: map original event index to points
  const finalWeights = new Map<number, number>();
  let totalWeight = 0;
  
  // First pass: calculate weights
  const tempWeights: { eventIdx: number, weight: number }[] = [];
  
  // Group all NoteOn events by time
  const noteOnsByTime: Record<number, number[]> = {};
  events.forEach((e, i) => {
    if (e.type === "noteOn") {
      if (!noteOnsByTime[e.time]) noteOnsByTime[e.time] = [];
      noteOnsByTime[e.time].push(i);
    }
  });

  Object.values(noteOnsByTime).forEach(indices => {
    const multiplier = 1 + (indices.length - 1) * 0.1;
    indices.forEach(idx => {
      const w = 1.0 * multiplier;
      tempWeights.push({ eventIdx: idx, weight: w });
      totalWeight += w;
    });
  });

  // Second pass: normalize to 100 points
  tempWeights.forEach(({ eventIdx, weight }) => {
    finalWeights.set(eventIdx, (weight / totalWeight) * 100);
  });

  return finalWeights;
}
