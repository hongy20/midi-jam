"use client";

import { useEffect } from "react";

import { subscribeToMessages } from "../lib/midi-listener";

/**
 * A React hook that attaches listeners to all provided MIDI inputs and
 * automatically selects an input when it detects a "midimessage" event.
 *
 * @param inputs - The list of currently available MIDI input devices.
 * @param selectMIDIInput - Callback invoked when a MIDI message is received on an input.
 */
export function useAutoSelection(
  inputs: WebMidi.MIDIInput[],
  selectMIDIInput: (input: WebMidi.MIDIInput) => void,
): void {
  useEffect(() => {
    // Attach listener to all inputs to detect activity and auto-select
    const unsubscribes = inputs.map((input) =>
      subscribeToMessages(input, () => {
        selectMIDIInput(input);
      }),
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [inputs, selectMIDIInput]);
}
