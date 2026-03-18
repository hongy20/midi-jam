# Dynamic LaneSegment Lifespans

## Background
Currently, the timeline is chunked into fixed increments (e.g. 10000ms base duration). A span that overlaps multiple segments is injected into all of them. `overflow: hidden` on the segment cuts visual overlap.
This causes long notes and chords crossing segment boundaries to be visually cut into pieces with internal borders and shadow overlap.

## Proposed Strategy
Implement a **Note Ownership & Dynamic Lifespan** model:
1. **Ownership**: A note belongs to the `LaneSegment` where it *starts* (`startTime`). It is rendered exactly once.
2. **Overflow**: Remove `overflow: hidden` from `LaneSegment`. This allows long notes to expand visually outward into subsequent segment visual space.
3. **Dynamic Object Lifespan**: Precalculate the maximum `endTime` of all notes within each Segment when the `LaneStage` mounts. The Segment will stay active in the DOM until its longest owned note clears the hit-line safely.

## Implementation Plan

### 1. `src/lib/midi/lane-segment-utils.ts`
- **[MODIFY] `filterSpansForSegment`**:
  Change filter condition to:
  `startTimeMs >= windowStartMs && startTimeMs < windowEndMs`
- **[NEW] `computeSegmentLifespans`**:
  Helper to iterate over spans and determine the max `endTime` for each segment block. Returns an array of `{ startMs, endMs, maxEndMs }`.
- **[MODIFY] `getVisibleSegmentIndexes`**:
  Refactor to take `segmentLifespans` and return an array of all active segment block indexes. A segment is active if:
  `currentTimeMs >= startMs - LANE_SCROLL_DURATION_MS` AND
  `currentTimeMs <= maxEndMs + buffer` (ensure it cleanly passes the hit-line).

### 2. `src/components/lane-stage/lane-stage.tsx`
- **[MODIFY] `LaneStage`**:
  - `const segmentLifespans = useMemo(() => computeSegmentLifespans(...), [...])`
  - Refactor `visibleIndexes` `useMemo` to use the new `getVisibleSegmentIndexes` signature and pass in `segmentLifespans`.

### 3. `src/components/lane-stage/lane-segment.module.css`
- **[MODIFY] `.container`**:
  - Remove `overflow: hidden`.

### 4. Tests
- **[MODIFY] `lane-segment-utils.test.ts`**:
  Update tests to cover the new `computeSegmentLifespans` behavior, and ensure `getVisibleSegmentIndexes` behaves nicely with varied lengths.
- **[MODIFY] `lane-stage.test.tsx`**:
  Update tests if assertions were hardcoded to `[prev, current, next]`.

## Verification Planner
- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run build`
