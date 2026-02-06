import type { Midi } from "@tonejs/midi";
import { isBlackKey } from "../device/piano";
import { MIDI_MAX_NOTE, MIDI_MIN_NOTE } from "./constant";

// FIXME: Can we merge MidiEvent and MIDINoteEvent?
export interface MidiEvent {
  time: number;
  type: "noteOn" | "noteOff";
  note: number;
  velocity: number;
}

export interface NoteSpan {
  id: string;
  note: number;
  startTime: number;
  duration: number;
  velocity: number;
  isBlack: boolean;
}

/**
 * Extracts all note on and note off events from a MIDI object,
 * sorted by time.
 */
export function getMidiEvents(
  midi: Midi,
  instrument: "piano" | "drums" = "piano",
): MidiEvent[] {
  const events: MidiEvent[] = [];

  midi.tracks
    .filter((track) => track.instrument.family === instrument)
    .forEach((track) => {
      track.notes
        .filter((note) => note.duration > 0)
        .forEach((note) => {
          events.push({
            time: note.time,
            type: "noteOn",
            note: note.midi,
            velocity: note.velocity,
          });
          events.push({
            time: note.time + note.duration,
            type: "noteOff",
            note: note.midi,
            velocity: 0,
          });
        });
    });

  return events.sort((a, b) => a.time - b.time);
}

/**
 * Pre-processes MIDI events into duration-based NoteSpans for efficient rendering.
 */
export function getNoteSpans(events: MidiEvent[]): NoteSpan[] {
  const spans: NoteSpan[] = [];
  const activeNotes = new Map<number, { time: number; velocity: number }>();

  for (const event of events) {
    if (event.type === "noteOn") {
      activeNotes.set(event.note, {
        time: event.time,
        velocity: event.velocity,
      });
    } else if (event.type === "noteOff") {
      const start = activeNotes.get(event.note);
      if (start !== undefined) {
        spans.push({
          id: `${event.note}-${start.time}`,
          note: event.note,
          startTime: start.time,
          duration: event.time - start.time,
          velocity: start.velocity,
          isBlack: isBlackKey(event.note),
        });
        activeNotes.delete(event.note);
      }
    }
  }

  return spans.sort((a, b) => a.startTime - b.startTime);
}

/**
 * Finds the minimum and maximum MIDI notes in a set of events.
 */
export function getNoteRange(
  events: MidiEvent[],
): { min: number; max: number } | null {
  if (events.length === 0) return null;

  let min = MIDI_MAX_NOTE;
  let max = MIDI_MIN_NOTE;

  for (const event of events) {
    if (event.note < min) min = event.note;
    if (event.note > max) max = event.note;
  }

  return { min, max };
}

/**
 * Calculates timestamps for bar-lines based on time signature segments.
 * Supports songs with multiple time signature changes.
 */
export function getBarLines(midi: Midi): number[] {
  const barLines: number[] = [];
  const duration = midi.duration;
  const ppq = midi.header.ppq || 480;
  const MAX_BARS = 5000; // Increased limit for longer compositions

  // Ensure we have at least a default 4/4 time signature at tick 0
  const timeSignatures =
    midi.header.timeSignatures.length > 0
      ? midi.header.timeSignatures
      : [{ ticks: 0, timeSignature: [4, 4] }];

  try {
    for (let i = 0; i < timeSignatures.length; i++) {
      const ts = timeSignatures[i];
      const nextSegmentStartTick = timeSignatures[i + 1]?.ticks ?? Infinity;

      const [numerator, denominator] = ts.timeSignature;
      // 1 bar = beatsPerBar * PPQ * (4 / denominator)
      const ticksPerBar = numerator * ppq * (4 / denominator);

      if (!Number.isFinite(ticksPerBar) || ticksPerBar <= 0) continue;

      let currentTick = ts.ticks;

      // Generate bar lines for this segment
      while (
        currentTick < nextSegmentStartTick &&
        midi.header.ticksToSeconds(currentTick) <= duration
      ) {
        barLines.push(midi.header.ticksToSeconds(currentTick));
        currentTick += ticksPerBar;

        if (barLines.length >= MAX_BARS) {
          return barLines;
        }
      }
    }
  } catch (e) {
    console.error("Error during bar-line generation:", e);
  }

  return barLines;
}
