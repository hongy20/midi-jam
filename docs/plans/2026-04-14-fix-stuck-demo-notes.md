# Refactor: Single-Pass Segment Grouping (Final)

This plan refactors the `buildSegmentGroups` algorithm into a clean, single-pass logic. It ensures notes are clustered correctly while avoiding small "tail" segments at the end of the song.

## Finalized Logic

The algorithm will iterate through `spans` once, applying these rules for each note:

### 1. Inclusion Criteria
A note is added to the **current** segment if **any** of these are true:
-   **Threshold**: The visual duration (`span.startTimeMs - startMs`) is under 5 seconds.
-   **Connected**: The note starts exactly when (or before) the previous notes end (`span.startTimeMs <= maxEndMs`).
-   **Tail Merge**: Starting a new segment now would leave less than 2.5 seconds (half of `thresholdMs`) before the end of the song.

### 2. Splitting Logic
If none of the above are true, a split is performed:
-   The **shared boundary** between segments is the **midpoint** of the gap between `maxEndMs` and the new note's `startTimeMs`.
-   This ensures segments "touch" perfectly without gaps, while providing a natural buffer for both.

### 3. Lead-In / Lead-Out
-   **First Segment**: Starts at `0`.
-   **Last Segment**: Ends at `totalDurationMs`.

## Proposed Changes

### MIDI Utilities

#### [MODIFY] [lane-segment-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.ts)
-   Implement the logic described above.
-   Replace the existing multi-pass discovery and stitching.

### Test Suite

#### [MODIFY] [lane-segment-utils.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.test.ts)
-   Add a test case for "Connected Notes" (Note A ends at 1000, Note B starts at 1000).
-   Add a test case for the new "Tail Merge" logic within the single-pass iteration.

## Verification Plan
-   Run `npm test` to ensure zero regressions in existing clustering behavior.
-   Manual verification in demo mode to confirm notes (like F#4) release correctly.
