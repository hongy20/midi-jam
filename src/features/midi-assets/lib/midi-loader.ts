import { Midi } from "@tonejs/midi";

import type { MidiTrackData } from "@/shared/types/midi";

import {
  LANE_SEGMENT_DURATION_MS,
  LEAD_IN_DEFAULT_MS,
  LEAD_OUT_DEFAULT_MS,
  MIDI_DUMMY_NOTE_PITCH,
} from "./constant";
import { buildMidiNoteGroups } from "./lane-segment-utils";
import { parseMidiNotes } from "./midi-parser";

/**
 * Patches a MIDI object to include lead-in and lead-out margins.
 * Shifts all events by LEAD_IN_DEFAULT_MS and ensures the total duration
 * includes LEAD_OUT_DEFAULT_MS.
 */
function patchMidi(midi: Midi): Midi {
  const leadInS = LEAD_IN_DEFAULT_MS / 1000;
  const leadOutS = LEAD_OUT_DEFAULT_MS / 1000;

  // 1. Calculate shift in ticks based on the lead-in time.
  // We use the header's current mapping (tempo @ tick 0) to find the tick offset.
  const shiftTicks = Math.round(midi.header.secondsToTicks(leadInS));

  // Capture initial tempo and time signature to re-insert at tick 0.
  const firstTempo = midi.header.tempos[0];
  const firstTS = midi.header.timeSignatures[0];

  // 2. Shift all events in all tracks by ticks.
  // Note: Shifting ticks is more robust than shifting time directly,
  // as @tonejs/midi calculates time from ticks based on the header's tempo map.
  for (const track of midi.tracks) {
    for (const note of track.notes) {
      note.ticks += shiftTicks;
    }

    // controlChanges is a proxy object with CC numbers as keys.
    const controlChanges = track.controlChanges as unknown as Record<string, { ticks: number }[]>;
    for (const ccNumber in controlChanges) {
      const ccList = controlChanges[ccNumber];
      if (Array.isArray(ccList)) {
        for (const cc of ccList) {
          cc.ticks += shiftTicks;
        }
      }
    }

    for (const pb of track.pitchBends) {
      pb.ticks += shiftTicks;
    }
  }

  // 3. Shift header events (tempos and time signatures) by ticks.
  for (const tempo of midi.header.tempos) {
    tempo.ticks += shiftTicks;
  }
  for (const ts of midi.header.timeSignatures) {
    ts.ticks += shiftTicks;
  }

  // 4. Re-insert a tempo and time signature at tick 0 to ensure the lead-in
  // silence has a defined tempo/signature.
  if (firstTempo) {
    midi.header.tempos.push({
      ticks: 0,
      bpm: firstTempo.bpm,
    });
  }
  if (firstTS) {
    midi.header.timeSignatures.push({
      ticks: 0,
      timeSignature: [...firstTS.timeSignature],
    });
  }

  // Sort to maintain chronological order for the header update.
  midi.header.tempos.sort((a, b) => a.ticks - b.ticks);
  midi.header.timeSignatures.sort((a, b) => a.ticks - b.ticks);

  // 5. Update header to recalculate time-to-tick mappings.
  midi.header.update();

  // 6. Extend duration by adding a silent dummy note at the very end.
  // We use a dummy note because some MIDI parsers (like Tone.js/midi) may only
  // use notes to calculate the total duration, ignoring control changes.
  const targetDurationS = midi.duration + leadOutS;
  if (midi.tracks.length > 0) {
    const duration = 0.1; // 100ms
    midi.tracks[0].addNote({
      midi: MIDI_DUMMY_NOTE_PITCH, // Inaudible dummy note
      time: targetDurationS - duration,
      duration,
      velocity: 0, // Silent
    });
  }

  // Final update to ensure duration and other properties are synchronized.
  midi.header.update();

  return midi;
}

/**
 * Fetches and parses a MIDI file from a URL.
 */
export async function loadMidiFile(url: string): Promise<Midi> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch MIDI file: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const midi = new Midi(arrayBuffer);
  return patchMidi(midi);
}
const trackDataCache = new Map<string, Promise<MidiTrackData>>();

/**
 * High-level utility to load, parse, and group MIDI data in one call.
 * This is the primary entry point for the play route's data pipeline.
 * It uses an internal cache to ensure promise stability, which is critical
 * for React 19's use() hook to avoid infinite suspension loops.
 */
export function getTrackData(url: string): Promise<MidiTrackData> {
  const cached = trackDataCache.get(url);
  if (cached) return cached;

  const promise = (async () => {
    const midi = await loadMidiFile(url);
    const notes = parseMidiNotes(midi);
    const totalDurationMs = midi.duration * 1000;
    const groups = buildMidiNoteGroups({
      notes,
      totalDurationMs,
      thresholdMs: LANE_SEGMENT_DURATION_MS,
    });

    return { notes, groups, totalDurationMs };
  })();

  trackDataCache.set(url, promise);
  return promise;
}
