import { Midi } from "@tonejs/midi";

export interface MidiEvent {
  time: number;
  type: "noteOn" | "noteOff";
  note: number;
  velocity: number;
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

  for (const track of midi.tracks) {
    for (const note of track.notes) {
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
    }
  }

  return events.sort((a, b) => a.time - b.time);
}
