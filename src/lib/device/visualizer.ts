import { PianoKeyboard } from "@/components/piano-keyboard/PianoKeyboard";

/**
 * Returns the visualizer configuration for a given instrument ID.
 */
export function getInstrumentVisualizer(instrumentId: string) {
  switch (instrumentId) {
    default:
      return PianoKeyboard;
  }
}
