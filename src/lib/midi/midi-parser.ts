import type { Midi } from "@tonejs/midi";

// Can we merge MidiEvent and MIDINoteEvent?
export interface MidiEvent {
  time: number;
  type: "noteOn" | "noteOff";
  note: number;
  velocity: number;
  track: number; // TODO: get rid of this property
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

  // Use the first time signature or default to 4/4
  const ts = midi.header.timeSignatures[0];

  const numerator = ts?.timeSignature[0] ?? 4;
  const denominator = ts?.timeSignature[1] ?? 4;
  const ppq = midi.header.ppq || 480;

  // 1 bar = beatsPerBar * PPQ * (4 / denominator)
  const ticksPerBar = numerator * ppq * (4 / denominator);

  if (!Number.isFinite(ticksPerBar) || ticksPerBar <= 0) {
    return [];
  }

  let currentTick = 0;
  const MAX_BARS = 2000; // Realistic limit for a song

  try {
    while (currentTick < 1000000) {
      // Safety cap on total ticks
      const time = midi.header.ticksToSeconds(currentTick);

      if (!Number.isFinite(time) || time > duration) break;

      barLines.push(time);
      currentTick += ticksPerBar;

      if (barLines.length >= MAX_BARS) {
        break;
      }
    }
  } catch (e) {
    console.error("Error during bar-line generation:", e);
  }

  return barLines;
}
