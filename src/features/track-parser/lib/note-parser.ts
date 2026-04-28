import type { Midi } from "@tonejs/midi";

import type { Instrument } from "@/shared/lib/instrument";
import type { MidiNote } from "@/shared/types/midi";

import { MIDI_DUMMY_NOTE_PITCH, MIN_NOTE_GAP_MS } from "./constant";

/**
 * Parses a MIDI object into MidiNotes, applying collision handling and instrument filtering.
 */
export function parseMidiNotes(midi: Midi, instrument: Instrument): MidiNote[] {
  const notes: MidiNote[] = [];

  // 1. Merge all notes from all relevant tracks first to catch cross-track collisions
  const allNotes = midi.tracks
    .filter((track) => track.instrument.family === instrument)
    .flatMap((track) => track.notes)
    .filter((note) => note.duration > 0 && note.midi !== MIDI_DUMMY_NOTE_PITCH)
    .map((note) => ({
      ...note,
      timeMs: note.time * 1000,
      durationMs: note.duration * 1000,
    }))
    .sort((a, b) => a.timeMs - b.timeMs);

  if (allNotes.length === 0) return [];

  // 2. Group notes into time slices (chords) across all tracks
  const slices: (typeof allNotes)[] = [];
  for (const note of allNotes) {
    const lastSlice = slices[slices.length - 1];
    if (lastSlice && Math.abs(lastSlice[0].timeMs - note.timeMs) < 1) {
      lastSlice.push(note);
    } else {
      slices.push([note]);
    }
  }

  // 3. Process slices using a shared tracking map for collisions
  const activePitchesAtTime = new Map<number, number>(); // pitch -> final (shifted) endTimeMs
  const gapMs = MIN_NOTE_GAP_MS;

  for (const slice of slices) {
    let needsShift = false;

    // Check if any note in the current chord collisions with a previous note of the same pitch.
    for (const note of slice) {
      const lastEndTime = activePitchesAtTime.get(note.midi);
      if (lastEndTime !== undefined && note.timeMs < lastEndTime + 1) {
        needsShift = true;
        break;
      }
    }

    // Apply shift to the ENTIRE chord if any note needs it
    for (const note of slice) {
      let eventTimeMs = note.timeMs;
      let durationMs = note.durationMs;

      if (needsShift) {
        const originalEndMs = note.timeMs + note.durationMs;
        eventTimeMs = note.timeMs + gapMs;

        // Ensure we don't reduce duration below a safe minimum (20ms)
        const minDurationMs = 20;
        durationMs = Math.max(minDurationMs, originalEndMs - eventTimeMs);
      }

      notes.push({
        id: `${note.midi}-${eventTimeMs}`,
        pitch: note.midi,
        startTimeMs: eventTimeMs,
        durationMs: durationMs,
        velocity: note.velocity,
      });

      // Update tracking with the final end time of this note to maintain chain gaps
      activePitchesAtTime.set(note.midi, eventTimeMs + durationMs);
    }
  }

  return notes.sort((a, b) => a.startTimeMs - b.startTimeMs);
}
