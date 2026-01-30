import { useCallback, useState } from "react";
import type { MIDINoteEvent } from "@/lib/midi/midi-listener";
import { useMIDINotes } from "./use-midi-notes";

/**
 * A React hook that tracks the currently active (pressed) MIDI notes.
 * @param input The MIDIInput device to listen to.
 * @param options Callbacks for note on/off events.
 * @returns A Set of active note numbers.
 */
export function useActiveNotes(
  input: WebMidi.MIDIInput | null,
  options?: {
    onNoteOn?: (note: number, velocity: number) => void;
    onNoteOff?: (note: number) => void;
  }
): Set<number> {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

  const handleNote = useCallback((event: MIDINoteEvent) => {
    setActiveNotes((prev) => {
      const next = new Set(prev);
      if (event.type === "note-on") {
        next.add(event.note);
        options?.onNoteOn?.(event.note, event.velocity);
      } else {
        next.delete(event.note);
        options?.onNoteOff?.(event.note);
      }
      return next;
    });
  }, [options]);

  useMIDINotes(input, handleNote);

  return activeNotes;
}
