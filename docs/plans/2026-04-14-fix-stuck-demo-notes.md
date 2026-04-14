# Refactor: Single-Pass Segment Grouping (Final)

This plan refactors the `buildSegmentGroups` algorithm into a clean, single-pass logic. It ensures notes are clustered correctly while avoiding small "tail" segments at the end of the song.

## Finalized Logic

The algorithm will iterate through `spans` once, applying these rules for each note:

### 1. Inclusion Criteria
A note is added to the **current** segment if **any** of these are true:
-   **Threshold**: The visual duration (`span.startTimeMs - startMs`) is under 5 seconds.
-   **Connected / Overlapping**: The note starts exactly when (or before) the **furthest note in the current cluster** ends (`span.startTimeMs <= currentMaxEndMs`). This ensures chords and overlapping notes stay together.
-   **Tail Merge**: Starting a new segment now would leave less than 2.5 seconds (half of `thresholdMs`) before the end of the song (`totalDurationMs - span.startTimeMs < thresholdMs / 2`).

### 2. Splitting Logic
If none of the above are true, a split is performed:
-   The **shared boundary** (stitching point) between segments is the **midpoint** of the current gap (between `currentMaxEndMs` and the new note's `startTimeMs`).
-   This ensures segments "touch" perfectly without gaps, while providing a natural buffer for both.

### 3. Lead-In / Lead-Out
-   **First Segment**: Always starts at `0` for an initial lead-in.
-   **Last Segment**: Always ends at `totalDurationMs` for a final lead-out.

## Proposed Changes

### MIDI Utilities

#### [MODIFY] [lane-segment-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.ts)
-   Implement the single-pass iteration logic.
-   Remove the legacy multi-pass discovery and stitching.

### Test Suite

#### [MODIFY] [lane-segment-utils.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.test.ts)
-   Add a test case for **Connected Notes** (Note A ends at 1000, Note B starts at 1000) to verify they belong to the same segment.
-   Add a test case for **Chords** to verify they aren't split.
-   Add a test case for **Tail Merge** logic.

## Verification Plan
-   Run `npm test` to ensure zero regressions in existing behavior.
-   Manual verification in demo mode to confirm notes release correctly.
