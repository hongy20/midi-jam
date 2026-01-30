import { useCallback, useState } from "react";
import type { MIDINoteEvent } from "@/lib/midi/midi-listener";
import { useMIDINotes } from "./use-midi-notes";

/**
 * A React hook that tracks the currently active (pressed) MIDI notes.
 * @param input The MIDIInput device to listen to.
 * @returns A Set of active note numbers.
 */
export function useActiveNotes(input: WebMidi.MIDIInput | null): Set<number> {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

  const handleNote = useCallback((event: MIDINoteEvent) => {
    setActiveNotes((prev) => {
      const next = new Set(prev);
      if (event.type === "note-on") {
        next.add(event.note);
      } else {
        next.delete(event.note);
      }
      return next;
    });
  }, []);

  useMIDINotes(input, handleNote);

  return activeNotes;
}
