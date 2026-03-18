# LaneSegment Grouping Algorithm

## Background
The previous refactor separated note ownership to its native starting `LaneSegment` visually, solving note cropping. However, the groups were still mathematically rigidly defined by a generic `segmentIndex` covering strict 10s intervals.

## Objective
Convert `LaneSegment` creation to a purely data-driven clustering model. The timeline will be grouped into exact `SegmentGroup` objects based exclusively on note relationships and duration limitations, completely eliminating rigid "empty" window intervals.

## Rules per the User
1. **Natural Clustering**: Spans are sequentially assigned to clusters based on `startTimeMs`.
2. **Chord Protection**: A true grouping "split" can never happen between notes that share the exact same `startTimeMs`.
3. **Thresholding**: When a group's chronological spread exceeds the threshold (e.g. `currentSpan.startTimeMs - groupStartMs >= 10000ms`), we break and flush the group before processing the next uniquely-timed note.
4. **Varying Duration**: Because thresholding only dictates the cut-point for starting a *new* group, the absolute physical length (`durationMs`) of the group fully encompasses its longest note. It is mathematically very common for a group's total height to be substantially larger than 10 seconds.

## Structural Changes

### 1. New Model `SegmentGroup`
```typescript
export interface SegmentGroup {
  index: number;
  startMs: number;
  durationMs: number; // dynamically varying (maxEndMs - startMs)
  spans: NoteSpan[];
}
```

### 2. Utility Grouping Function (`src/lib/midi/lane-segment-utils.ts`)
- **[REMOVE]** `computeSegmentLifespans` and `filterSpansForSegment`.
- **[NEW]** `buildSegmentGroups(spans: NoteSpan[], thresholdMs?: number): SegmentGroup[]`.
- **[MODIFY]** `getVisibleSegmentIndexes` to accept `SegmentGroup[]` directly.
- **[MODIFY]** `computeSegmentTranslateY` to accept `groupStartMs` and `groupDurationMs` directly.

### 3. UI Prop Modification (`LaneStage` over `LaneSegment`)
- `LaneStage` maps out mounted groups cleanly with `const groups = useMemo(() => buildSegmentGroups(...))`. Rendering passes `group={group}` downwards.
- `LaneSegment` reads `group.durationMs` and passes it via inline CSS.
- Note `topPercent` and `heightPercent` calculations natively use `group.durationMs` directly.

### 4. Tests (`lane-segment-utils.test.ts`)
Strictly rewrite the tests to check `buildSegmentGroups` against varied threshold breaks, chord protections, and `>10s` variable durations.

## Verification
- Unit test suite validation (`npm test`)
- CLI validation (`type-check`, `lint`, `build`)
