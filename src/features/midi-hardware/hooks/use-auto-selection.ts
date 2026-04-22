"use client";

import { useEffect } from "react";

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
    const handlers = new Map<string, () => void>();

    inputs.forEach((input) => {
      const handler = () => {
        selectMIDIInput(input);
      };
      input.addEventListener("midimessage", handler);
      handlers.set(input.id, handler);
    });

    return () => {
      inputs.forEach((input) => {
        const handler = handlers.get(input.id);
        if (handler) {
          input.removeEventListener("midimessage", handler);
        }
      });
    };
  }, [inputs, selectMIDIInput]);
}
