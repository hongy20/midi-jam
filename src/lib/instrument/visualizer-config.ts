import { PianoKeyboard } from "@/components/piano-keyboard/PianoKeyboard";

export interface VisualizerConfig {
  Component: React.ComponentType<any>;
}

/**
 * Returns the visualizer configuration for a given instrument ID.
 */
export function getInstrumentVisualizerConfig(
  instrumentId: string,
): VisualizerConfig {
  switch (instrumentId) {
    default:
      return {
        Component: PianoKeyboard,
      };
  }
}
