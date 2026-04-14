import type { Midi } from "@tonejs/midi";
import {
  MIDI_DUMMY_NOTE_PITCH,
  MIDI_MAX_NOTE,
  MIDI_MIN_NOTE,
  MIN_NOTE_GAP_MS,
} from "./constant";

// FIXME: Can we merge MidiEvent and MIDINoteEvent?
export interface MidiEvent {
  timeMs: number;
  type: "noteOn" | "noteOff";
  note: number;
  velocity: number;
}

export interface NoteSpan {
  id: string;
  note: number;
  startTimeMs: number;
  durationMs: number;
  velocity: number;
}

/**
 * Extracts all note on and note off events from a MIDI object,
 * sorted by time.
 * Performs "Monophonic Merging": If multiple tracks play the same pitch at the same time,
 * they are merged into a single continuous span (union).
 * Introduces a minimal gap between sequential notes of the same pitch to ensure MIDI triggering,
 * shifting entire chords if necessary to maintain synchronization.
 */
export function getMidiEvents(
  midi: Midi,
  instrument: "piano" | "drums" = "piano",
): MidiEvent[] {
  // 1. Collect all piano notes from all tracks
  const rawNotes = midi.tracks
    .filter((track) => track.instrument.family === instrument)
    .flatMap((track) => track.notes)
    .filter((note) => note.duration > 0 && note.midi !== MIDI_DUMMY_NOTE_PITCH)
    .map((note) => ({
      pitch: note.midi,
      startMs: note.time * 1000,
      endMs: (note.time + note.duration) * 1000,
      velocity: note.velocity,
    }))
    .sort((a, b) => a.startMs - b.startMs);

  if (rawNotes.length === 0) return [];

  // 2. Perform Monophonic Union Per Pitch
  // Bridges strictly overlapping notes of the same pitch into single continuous spans.
  const mergedSpansPerPitch = new Map<number, (typeof rawNotes)[0][]>();

  for (const note of rawNotes) {
    let pitchSpans = mergedSpansPerPitch.get(note.pitch);
    if (!pitchSpans) {
      pitchSpans = [];
      mergedSpansPerPitch.set(note.pitch, pitchSpans);
    }

    const lastSpan = pitchSpans[pitchSpans.length - 1];
    if (lastSpan && note.startMs < lastSpan.endMs) {
      // Overlap detected: Extend the existing span
      if (note.endMs > lastSpan.endMs) {
        lastSpan.endMs = note.endMs;
      }
      if (note.velocity > lastSpan.velocity) {
        lastSpan.velocity = note.velocity;
      }
    } else {
      // Distinct note (touching or gap)
      pitchSpans.push({ ...note });
    }
  }

  // 3. Group all merged spans into chords (slices) for unified gap shifting
  const allMergedSpans = Array.from(mergedSpansPerPitch.values())
    .flat()
    .sort((a, b) => a.startMs - b.startMs);

  const slices: (typeof allMergedSpans)[] = [];
  for (const span of allMergedSpans) {
    const lastSlice = slices[slices.length - 1];
    // Chords are notes starting within 1ms of each other
    if (lastSlice && Math.abs(lastSlice[0].startMs - span.startMs) < 1) {
      lastSlice.push(span);
    } else {
      slices.push([span]);
    }
  }

  // 4. Process slices, shifting any slice that causes a collision for any of its pitches
  const events: MidiEvent[] = [];
  const activePitchesAtTime = new Map<number, number>(); // pitch -> last (shifted) endTimeMs
  const gapMs = MIN_NOTE_GAP_MS;

  for (const slice of slices) {
    let needsShift = false;
    for (const span of slice) {
      const lastEnd = activePitchesAtTime.get(span.pitch);
      if (lastEnd !== undefined && span.startMs < lastEnd + gapMs) {
        needsShift = true;
        break;
      }
    }

    for (const span of slice) {
      let shiftedStartMs = span.startMs;
      let shiftedEndMs = span.endMs;

      if (needsShift) {
        shiftedStartMs = span.startMs + gapMs;
        // Maintain original end time if possible to prevent song drift
        shiftedEndMs = Math.max(shiftedStartMs + 20, span.endMs);
      }

      events.push({
        timeMs: shiftedStartMs,
        type: "noteOn",
        note: span.pitch,
        velocity: span.velocity,
      });
      events.push({
        timeMs: shiftedEndMs,
        type: "noteOff",
        note: span.pitch,
        velocity: 0,
      });

      activePitchesAtTime.set(span.pitch, shiftedEndMs);
    }
  }

  return events.sort((a, b) => a.timeMs - b.timeMs);
}

/**
 * Pre-processes MIDI events into duration-based NoteSpans for efficient rendering.
 */
export function getNoteSpans(events: MidiEvent[]): NoteSpan[] {
  const spans: NoteSpan[] = [];
  const activeNotes = new Map<number, { timeMs: number; velocity: number }>();

  for (const event of events) {
    if (event.type === "noteOn") {
      activeNotes.set(event.note, {
        timeMs: event.timeMs,
        velocity: event.velocity,
      });
    } else if (event.type === "noteOff") {
      const start = activeNotes.get(event.note);
      if (start !== undefined) {
        spans.push({
          id: `${event.note}-${start.timeMs}-${spans.length}`,
          note: event.note,
          startTimeMs: start.timeMs,
          durationMs: event.timeMs - start.timeMs,
          velocity: start.velocity,
        });
        activeNotes.delete(event.note);
      }
    }
  }

  return spans.sort((a, b) => a.startTimeMs - b.startTimeMs);
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
        barLines.push(midi.header.ticksToSeconds(currentTick) * 1000);
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
