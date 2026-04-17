export { TrackProvider, useTrack } from "./context/track-context";
export {
  LANE_SCROLL_DURATION_MS,
  LANE_SEGMENT_DURATION_MS,
  MIDI_NOTE_C4,
  PIANO_88_KEY_MAX,
  PIANO_88_KEY_MIN,
} from "./lib/constant";
export type { SegmentGroup } from "./lib/lane-segment-utils";
export {
  buildSegmentGroups,
  computeLaneSegmentAnimationDelay,
  getVisibleSegmentIndexes,
} from "./lib/lane-segment-utils";
export { loadMidiFile } from "./lib/midi-loader";
export { getBarLines, parseMidiNotes } from "./lib/midi-parser";
