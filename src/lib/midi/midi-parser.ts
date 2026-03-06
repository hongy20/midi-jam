import type { Midi } from "@tonejs/midi";
import { MIDI_MAX_NOTE, MIDI_MIN_NOTE, MIN_NOTE_GAP_MS } from "./constant";

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
}

/**
 * Extracts all note on and note off events from a MIDI object,
 * sorted by time.
 * Introduces a minimal gap between sequential notes of the same pitch to ensure MIDI triggering.
 */
export function getMidiEvents(
  midi: Midi,
  instrument: "piano" | "drums" = "piano",
): MidiEvent[] {
  const events: MidiEvent[] = [];

  // 1. Merge all notes from all relevant tracks first to catch cross-track collisions
  const allNotes = midi.tracks
    .filter((track) => track.instrument.family === instrument)
    .flatMap((track) => track.notes)
    .filter((note) => note.duration > 0)
    .sort((a, b) => a.time - b.time);

  if (allNotes.length === 0) return [];

  // 2. Group notes into time slices (chords) across all tracks
  const slices: (typeof allNotes)[] = [];
  for (const note of allNotes) {
    const lastSlice = slices[slices.length - 1];
    if (lastSlice && Math.abs(lastSlice[0].time - note.time) < 0.001) {
      lastSlice.push(note);
    } else {
      slices.push([note]);
    }
  }

  // 3. Process slices using a shared tracking map for collisions
  const activePitchesAtTime = new Map<number, number>(); // pitch -> final (shifted) endTime
  const gapS = MIN_NOTE_GAP_MS / 1000;

  for (const slice of slices) {
    let needsShift = false;

    // Check if any note in the current chord collisions with a previous note of the same pitch.
    // A collision is defined as starting before or exactly when a previous note ends.
    for (const note of slice) {
      const lastEndTime = activePitchesAtTime.get(note.midi);
      if (lastEndTime !== undefined && note.time < lastEndTime + 0.001) {
        needsShift = true;
        break;
      }
    }

    // Apply shift to the ENTIRE chord if any note needs it
    for (const note of slice) {
      let eventTime = note.time;
      let duration = note.duration;

      if (needsShift) {
        const originalEnd = note.time + note.duration;
        eventTime = note.time + gapS;

        // Ensure we don't reduce duration below a safe minimum (20ms)
        const minDuration = 0.02;
        duration = Math.max(minDuration, originalEnd - eventTime);
      }

      events.push({
        time: eventTime,
        type: "noteOn",
        note: note.midi,
        velocity: note.velocity,
      });
      events.push({
        time: eventTime + duration,
        type: "noteOff",
        note: note.midi,
        velocity: 0,
      });

      // Update tracking with the final end time of this note to maintain chain gaps
      activePitchesAtTime.set(note.midi, eventTime + duration);
    }
  }

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
