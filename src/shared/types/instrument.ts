import type { MidiNote } from "./midi";

export interface InstrumentStageProps {
  notes: MidiNote[];
  liveActiveNotes: Set<number>;
  playbackNotes: Set<number>;
  Timeline: React.ReactElement;
}
