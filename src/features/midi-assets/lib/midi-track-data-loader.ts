import { getInstrumentType } from "@/shared/lib/instrument";
import type { MidiNote, MidiNoteGroup } from "@/shared/types/midi";

import { LANE_SEGMENT_DURATION_MS } from "./constant";
import { loadMidiFile } from "./midi-loader";
import { buildMidiNoteGroups } from "./midi-note-group-parser";
import { parseMidiNotes } from "./midi-note-parser";

interface MidiTrackData {
  notes: MidiNote[];
  groups: MidiNoteGroup[];
  totalDurationMs: number;
}

const trackDataCache = new Map<string, Promise<MidiTrackData>>();

/**
 * High-level utility to load, parse, and group MIDI data in one call.
 * This is the primary entry point for the play route's data pipeline.
 * It uses an internal cache to ensure promise stability, which is critical
 * for React 19's use() hook to avoid infinite suspension loops.
 *
 * @param url The URL of the MIDI file.
 * @param input Optional MIDI input to determine the instrument type.
 */
export function getTrackData(url: string, input: WebMidi.MIDIInput | null): Promise<MidiTrackData> {
  const cacheKey = `${url}:${input?.id || "default"}`;
  const cached = trackDataCache.get(cacheKey);
  if (cached) return cached;

  const promise = (async () => {
    const midi = await loadMidiFile(url);
    const instrument = getInstrumentType(input);
    const notes = parseMidiNotes(midi, instrument);
    const totalDurationMs = midi.duration * 1000;
    const groups = buildMidiNoteGroups({
      notes,
      totalDurationMs,
      thresholdMs: LANE_SEGMENT_DURATION_MS,
    });

    return { notes, groups, totalDurationMs };
  })();

  trackDataCache.set(cacheKey, promise);
  return promise;
}
