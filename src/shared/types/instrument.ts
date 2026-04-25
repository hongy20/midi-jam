import type { MidiNote, MidiNoteGroup } from "./midi";

export interface VisualizerProps {
  groups: MidiNoteGroup[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  getCurrentTimeMs: () => number;
  noteClassName?: string;
  children?: React.ReactNode;
}

export interface InstrumentStageProps {
  notes: MidiNote[];
  groups: MidiNoteGroup[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  getCurrentTimeMs: () => number;
  liveActiveNotes: Set<number>;
  playbackNotes: Set<number>;
  speed: number;
  visualizer: React.ComponentType<VisualizerProps>;
}
