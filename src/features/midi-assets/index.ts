export { TrackProvider, useTrack } from "./context/track-context";
export type { TrackStatus } from "./context/track-context";
export { loadMidiFile } from "./lib/midi-loader";
export { getMidiEvents, getNoteSpans } from "./lib/midi-parser";
export type { MidiEvent, NoteSpan } from "./lib/midi-parser";
export { 
  buildSegmentGroups, 
  getCurrentSegmentIndex, 
  getVisibleSegmentIndexes,
  computeLaneSegmentAnimationDelay 
} from "./lib/lane-segment-utils";
export type { SegmentGroup, BuildSegmentGroupsOptions } from "./lib/lane-segment-utils";
export * from "./lib/constant";
