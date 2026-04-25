import type { MidiNote } from "./midi";

export interface StageProps {
  notes: MidiNote[];
  liveActiveNotes: Set<number>;
  playbackNotes: Set<number>;
  highway: React.ReactElement;
}
