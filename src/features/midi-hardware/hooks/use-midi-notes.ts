"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { COMMAND_NOTE_OFF, COMMAND_NOTE_ON } from "@/shared/lib/command";
import { type MIDINoteEvent } from "@/shared/types/midi";

import { subscribeToMessages } from "../lib/midi-listener";

/**
 * A React hook that subscribes to MIDI note events from a MIDI input device.
 * @param input The MIDIInput device to listen to.
 * @param onNote Callback function for MIDI note events.
 */
export function useMIDINotes(
  input: WebMidi.MIDIInput | null,
  onNote: (event: MIDINoteEvent) => void,
) {
  // Use a ref for the callback to avoid re-subscribing if the callback changes.
  // We update it in useLayoutEffect to ensure it's always up-to-date before
  // any events can fire, while avoiding the "ref update in render" anti-pattern.
  const onNoteRef = useRef(onNote);

  useLayoutEffect(() => {
    onNoteRef.current = onNote;
  });

  useEffect(() => {
    if (!input) return;

    const unsubscribe = subscribeToMessages(input, (event) => {
      const [status, pitch, velocity] = event.data;

      // Mask out the channel bits (lower 4 bits) to get the command type
      const command = status & 0xf0;

      if (command === COMMAND_NOTE_ON) {
        // Note On
        if (velocity === 0) {
          // Note On with velocity 0 is actually Note Off
          onNoteRef.current({ type: "note-off", pitch, velocity: 0 });
        } else {
          onNoteRef.current({ type: "note-on", pitch, velocity });
        }
      } else if (command === COMMAND_NOTE_OFF) {
        // Note Off
        onNoteRef.current({ type: "note-off", pitch, velocity: velocity || 0 });
      }
    });

    return unsubscribe;
  }, [input]);
}
