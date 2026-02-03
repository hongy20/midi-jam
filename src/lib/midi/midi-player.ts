import { Midi } from "@tonejs/midi";

export interface MidiEvent {
  time: number;
  type: "noteOn" | "noteOff";
  note: number;
  velocity: number;
  track: number;
}

export interface NoteSpan {
  id: string;
  note: number;
  startTime: number;
  duration: number;
  velocity: number;
  track: number;
  isBlack: boolean;
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
        const n = event.note % 12;
        const isBlack = [1, 3, 6, 8, 10].includes(n);

        spans.push({
          id: `${event.note}-${event.track}-${start.time}`,
          note: event.note,
          startTime: start.time,
          duration: event.time - start.time,
          velocity: start.velocity,
          track: event.track,
          isBlack,
        });
        activeNotes.delete(event.note);
      }
    }
  }

  // Sort by startTime for efficient range filtering
  return spans.sort((a, b) => a.startTime - b.startTime);
}

/**
 * Finds the minimum and maximum MIDI notes in a set of events.
 */
export function getNoteRange(
  events: MidiEvent[],
): { min: number; max: number } | null {
  if (events.length === 0) return null;

  let min = 127;
  let max = 0;

  for (const event of events) {
    if (event.note < min) min = event.note;
    if (event.note > max) max = event.note;
  }

  return { min, max };
}

/**
 * Calculates timestamps for bar-lines based on time signature and tempo events.
 */
export function getBarLines(midi: Midi): number[] {
  const barLines: number[] = [];
  const duration = midi.duration;

  // For now, support a single time signature (the first one found)
  // Standard MIDI files usually have them at the beginning.
  // Default to 4/4 if none found.
  const timeSignature = midi.header.timeSignatures[0] || {
    numerator: 4,
    denominator: 4,
  };

  const beatsPerBar = timeSignature.numerator;
  
  // denominator 4 = quarter note, 8 = eighth note, etc.
  // Tone.js MIDI duration/time is in seconds.
  const ppq = midi.header.ppq;
  const ticksPerBar = beatsPerBar * ppq * (4 / timeSignature.denominator);
  
  // Safety guard: if ticksPerBar is 0 or negative, we can't calculate bar-lines accurately
  if (ticksPerBar <= 0) return [];

  let currentTick = 0;
  // Limit iterations to prevent runaway loops in case of corrupt duration metadata
  const MAX_BARS = 10000; 
  while (barLines.length < MAX_BARS) {
    const time = midi.header.ticksToSeconds(currentTick);
    if (time > duration) break;
    barLines.push(time);
    currentTick += ticksPerBar;
  }

  return barLines;
}
