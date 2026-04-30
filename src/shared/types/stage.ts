import type { MidiNote } from "./midi";

export interface StageProps {
  notes: MidiNote[];
  liveActiveNotesRef: React.MutableRefObject<Set<number>>;
  playbackNotesRef: React.MutableRefObject<Set<number>>;
  highway: React.ReactElement;
}
