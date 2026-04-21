"use client";

import { useCallback, useState } from "react";
import { type MIDINoteEvent } from "@/shared/types/midi";
import { useMIDINotes } from "./use-midi-notes";

/**
 * A React hook that tracks the currently active (pressed) MIDI notes
 * and forwards events to a callback.
 * @param input The MIDIInput device to listen to.
 * @param onNoteEvent Callback function for MIDI note events (required).
 * @returns A Set of active note numbers.
 */
export function useActiveNotes(
  input: WebMidi.MIDIInput | null,
  onNoteEvent: (event: MIDINoteEvent) => void,
): Set<number> {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

  const handleNote = useCallback(
    (event: MIDINoteEvent) => {
      setActiveNotes((prev) => {
        const next = new Set(prev);
        if (event.type === "note-on") {
          next.add(event.pitch);
        } else {
          next.delete(event.pitch);
        }
        return next;
      });
      onNoteEvent(event);
    },
    [onNoteEvent],
  );

  useMIDINotes(input, handleNote);

  return activeNotes;
}
