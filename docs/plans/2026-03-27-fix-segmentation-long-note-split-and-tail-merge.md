# Plan: Segmentation Algorithm Fixes

## Issue Summary
1.  **Long note split bug**: In `buildSegmentGroups`, the gap check (`span.startTimeMs - currentStartMs >= thresholdMs`) compares a new note's start time against the cluster's *first* note's start time, not the cluster's end time. This incorrectly splits long notes (e.g., long sustained chords) when a short note appears later but still within the long note's duration.
2.  **Tiny last segment**: If the final segment is very short (under the threshold), it feels awkward. There is no logic to merge a tiny tail segment with the previous one.

## Proposed Changes

### 1. Fix interval check for splitting (Long Note Split)
**File**: `src/lib/midi/lane-segment-utils.ts`
-   In the Pass 1 loop of `buildSegmentGroups`, change the splitting condition to compare `span.startTimeMs` against the actual end of the cluster (`currentMaxEndMs`) instead of the start (`currentStartMs`).
-   Update from:
    ```typescript
    span.startTimeMs - currentStartMs >= thresholdMs && span.startTimeMs > lastStartTimeMs
    ```
-   To:
    ```typescript
    span.startTimeMs - currentMaxEndMs >= thresholdMs && span.startTimeMs > lastStartTimeMs
    ```

### 2. Tail merge for tiny last segment
**File**: `src/lib/midi/lane-segment-utils.ts`
-   Add a **Pass 1.5** right after generating the `rawClusters` array:
-   If there are at least 2 default clusters AND the last cluster's duration (`maxEndMs - minStartMs`) is `< thresholdMs`, pop it from `rawClusters`, append its `spans` to the previous cluster, and update the previous cluster's `maxEndMs`.

### 3. Add Tests
**File**: `src/lib/midi/lane-segment-utils.test.ts`
-   Add a test proving a long note spanning over a gap won't cause split.
-   Add a test proving the tiny last segment gets merged.

## Verification Steps
1.  Run `npm run lint` and `npm run type-check`.
2.  Run `npm test` to verify new tests pass and old behavior isn't broken.
3.  Run `npm run build` as a final check.
