# Aggressive Lane Segment Cleanup

This refactor aims to reduce the memory and DOM footprint of the visualizer by keeping only the segments that are currently visible within the scrolling window.

## Proposed Changes

### [Component] MIDI Utilities

#### [MODIFY] [lane-segment-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.ts)

- Update `getVisibleSegmentIndexes(currentTimeMs, segmentGroups, scrollDurationMs)` to use `scrollDurationMs` for precise visibility checks.
- Logic:
  - A segment is "visible" if `currentTimeMs` is between `segment.startMs - scrollDurationMs` and `segment.endMs + scrollDurationMs`.
  - Since segments are contiguous (stitched), we can still use `currentIndex` as a base but filter its neighbors more strictly.

### [Component] Lane Stage

#### [MODIFY] [lane-stage.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/lane-stage/lane-stage.tsx)

- Pass `LANE_SCROLL_DURATION_MS` to `getVisibleSegmentIndexes`.

### [Component] Tests

#### [MODIFY] [lane-segment-utils.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.test.ts)

- Update test cases to reflect the new visibility logic.

## Verification Plan

### Automated Tests

- Run `npm test src/lib/midi/lane-segment-utils.test.ts` to verify the logic.

### Manual Verification

- Start the app with `npm run dev`.
- Play a song and inspect the DOM (elements with class `lane-segment_container`).
- Observe that the count stays at 1 or 2 most of the time.
