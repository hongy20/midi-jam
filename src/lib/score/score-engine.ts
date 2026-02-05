import type { MidiEvent } from "../midi/midi-parser";

/**
 * Calculates weighted points for each note in a list of MIDI events.
 * Chords get a multiplier.
 */
export function calculateNoteWeights(events: MidiEvent[]): Map<number, number> {
  // Group all NoteOn events by time
  const noteOnsByTime: Record<number, number[]> = {};
  events.forEach((e, i) => {
    if (e.type === "noteOn") {
      if (!noteOnsByTime[e.time]) noteOnsByTime[e.time] = [];
      noteOnsByTime[e.time].push(i);
    }
  });

  if (Object.keys(noteOnsByTime).length === 0) return new Map();

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
