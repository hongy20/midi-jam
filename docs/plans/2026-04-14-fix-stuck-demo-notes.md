# Refactor: Single-Pass Segment Grouping

This plan refactors the `buildSegmentGroups` algorithm into a more predictable single-pass logic as requested. It ensures that notes are clustered together if they are temporally connected or if the segment hasn't reached its 5-second minimum duration.

## User Review Required

> [!IMPORTANT]
> To satisfy the requirement that segments "touch" their neighbors, I will use the **midpoint of the gap** as the shared boundary.
> 
> Note: If the gap between clusters is very small (e.g., < 200ms), the buffer on each side will be proportionally smaller than 100ms. If a strict 100ms buffer is required even for tiny gaps, segments would have to **overlap** rather than "touch." I have proceeded with "touching" (shared boundary) per your latest instruction.

## Proposed Changes

### MIDI Utilities

#### [MODIFY] [lane-segment-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.ts)

Refactor `buildSegmentGroups` to:
1.  **Iterative Pass**: Loop through `spans` once.
2.  **Inclusion Logic**: Add a note to the current group if:
    -   The visual duration (`span.startTimeMs - currentGroup.startMs`) is less than `thresholdMs`.
    -   **OR** the note starts exactly when or before the previous notes end (`span.startTimeMs <= currentMaxEndMs`).
3.  **Boundary Stitching**:
    -   When starting a new group, set the previous group's `endMs` and the new group's `startMs` to the **midpoint** of the gap.
    -   **Lead-in**: The first segment starts at `0`.
    -   **Lead-out**: The last segment ends at `totalDurationMs`.

### Verification Plan

#### Automated Tests
-   **Reuse Existing Tests**: Verify that all existing tests pass with the new implementation.
-   **[NEW] [lane-segment-utils.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.test.ts)**: Add a test case for "Connected Notes" (Note A ends at 1000, Note B starts at 1000). Verify they now belong to the same segment.

#### Manual Verification
-   Run `npm run dev` and verify that song playback is smooth and segments are correctly mounted/unmounted at midpoints.
-   Verify that the F#4 note at 15% is now correctly released.
