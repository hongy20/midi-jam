/**
 * Represents a parsed MIDI note with duration, timing, and velocity info.
 * This is the primary data structure for notes on a timeline.
 */
export interface MidiNote {
  id: string;
  note: number;
  startTimeMs: number;
  durationMs: number;
  velocity: number;
}
