import type { MidiNote, MidiNoteGroup } from "./midi";

export interface InstrumentStageProps {
  notes: MidiNote[];
  groups: MidiNoteGroup[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  getCurrentTimeMs: () => number;
  liveActiveNotes: Set<number>;
  playbackNotes: Set<number>;
  speed: number;
  children?: React.ReactNode;
}
