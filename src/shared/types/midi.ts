/**
 * Represents a parsed MIDI note with duration, timing, and velocity info.
 * This is the primary data structure for notes on a timeline.
 */
export interface MidiNote {
  id: string;
  pitch: number;
  startTimeMs: number;
  durationMs: number;
  velocity: number;
}

export interface MidiNoteGroup {
  index: number;
  startMs: number;
  durationMs: number;
  notes: MidiNote[];
}

export interface MIDINoteEvent {
  type: "note-on" | "note-off";
  pitch: number;
  velocity: number;
}
