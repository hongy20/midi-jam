# Implementation Plan - Fix Vertical Gap Between Lane Segments

The user reported a noticeable vertical gap between `LaneSegment` groups (e.g., group 0 and group 1) when playing songs like "Happy Birthday".

## Root Cause Analysis
The current logic in `buildSegmentGroups` uses midpoints for stitching segments together. These midpoints can result in non-integer millisecond values (e.g., `.5ms`). When these values are used to calculate CSS `height` and `transform` in `lane-segment.module.css`, the browser's sub-pixel rendering and compositor layer snapping can lead to a 1px gap between the segments.

## Proposed Changes

### [Component Name] MIDI Utilities

#### [MODIFY] [lane-segment-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.ts)
- Update `buildSegmentGroups` to round `startMs` and `endMs` to the nearest integer.
- Add a 1ms "bleed" to `durationMs` for each segment (except the last one which extends to the end of the song anyway). This 1ms overlap will effectively hide any sub-pixel gaps between adjacent segments.

## Verification Plan

### Automated Tests
- Run existing tests for `lane-segment-utils.ts` to ensure no regressions in grouping logic.
- `npm test src/lib/midi/lane-segment-utils.test.ts`

### Manual Verification
- The user should play "Happy Birthday" and verify that the vertical gap between colored groups is gone.
- Check that notes still hit the piano target line at the correct time.
