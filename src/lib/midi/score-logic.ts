import type { MidiEvent } from "./midi-player";

export const PERFECT_WINDOW = 0.15; // 150ms
export const GREAT_WINDOW = 0.3; // 300ms
export const GOOD_WINDOW = 0.45; // 450ms
export const POOR_WINDOW = 0.6; // 600ms

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
  const noteOnEvents = events.filter((e) => e.type === "noteOn");
  if (noteOnEvents.length === 0) return new Map();

  // Group by time to identify chords
  const timeGroups = new Map<number, number[]>();
  noteOnEvents.forEach((e, index) => {
    const group = timeGroups.get(e.time) || [];
    group.push(index);
    timeGroups.set(e.time, group);
  });

  // Group all NoteOn events by time
  const noteOnsByTime: Record<number, number[]> = {};
  events.forEach((e, i) => {
    if (e.type === "noteOn") {
      if (!noteOnsByTime[e.time]) noteOnsByTime[e.time] = [];
      noteOnsByTime[e.time].push(i);
    }
  });

  const finalWeights = new Map<number, number>();
  let totalWeight = 0;

  // First pass: calculate weights
  const tempWeights: { eventIdx: number; weight: number }[] = [];

  Object.values(noteOnsByTime).forEach((indices) => {
    const multiplier = 1 + (indices.length - 1) * 0.1;
    indices.forEach((idx) => {
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
