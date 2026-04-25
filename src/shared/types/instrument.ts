import type { MidiNote, MidiNoteGroup } from "./midi";

export interface TimelineProps {
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
  Timeline: React.ComponentType<TimelineProps>;
}
