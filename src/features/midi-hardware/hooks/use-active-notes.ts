"use client";

import { useCallback, useRef } from "react";

import { type MIDINoteEvent } from "@/shared/types/midi";

import { useMIDINotes } from "./use-midi-notes";

/**
 * A React hook that tracks the currently active (pressed) MIDI notes
 * and forwards events to a callback.
 * @param input The MIDIInput device to listen to.
 * @param onNoteEvent Callback function for MIDI note events (required).
 * @returns A MutableRefObject containing a Set of active note numbers.
 */
export function useActiveNotes(
  input: WebMidi.MIDIInput | null,
  onNoteEvent: (event: MIDINoteEvent) => void,
): React.MutableRefObject<Set<number>> {
  const activeNotesRef = useRef<Set<number>>(new Set());

  const handleNote = useCallback(
    (event: MIDINoteEvent) => {
      if (event.type === "note-on") {
        activeNotesRef.current.add(event.pitch);
      } else {
        activeNotesRef.current.delete(event.pitch);
      }
      onNoteEvent(event);
    },
    [onNoteEvent],
  );

  useMIDINotes(input, handleNote);

  return activeNotesRef;
}
