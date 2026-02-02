import { Midi } from "@tonejs/midi";

export interface MidiEvent {
  time: number;
  type: "noteOn" | "noteOff";
  note: number;
  velocity: number;
  track: number;
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
  return new Midi(arrayBuffer);
}

/**
 * Extracts all note on and note off events from a MIDI object,
 * sorted by time.
 */
export function getMidiEvents(midi: Midi): MidiEvent[] {
  const events: MidiEvent[] = [];

  midi.tracks.forEach((track, trackIndex) => {
    for (const note of track.notes) {
      events.push({
        time: note.time,
        type: "noteOn",
        note: note.midi,
        velocity: note.velocity,
        track: trackIndex,
      });
      events.push({
        time: note.time + note.duration,
        type: "noteOff",
        note: note.midi,
        velocity: 0,
        track: trackIndex,
      });
    }
  });

  return events.sort((a, b) => a.time - b.time);
}

/**
 * Finds the minimum and maximum MIDI notes in a set of events.
 */
export function getNoteRange(events: MidiEvent[]): { min: number; max: number } | null {
  if (events.length === 0) return null;

  let min = 127;
  let max = 0;

  for (const event of events) {
    if (event.note < min) min = event.note;
    if (event.note > max) max = event.note;
  }

  return { min, max };
}
