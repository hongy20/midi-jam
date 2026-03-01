import { useEffect, useLayoutEffect, useRef } from "react";
import { type MIDINoteEvent, subscribeToNotes } from "@/lib/midi/midi-listener";

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

    const unsubscribe = subscribeToNotes(input, (event) => {
      onNoteRef.current(event);
    });

    return unsubscribe;
  }, [input]);
}
