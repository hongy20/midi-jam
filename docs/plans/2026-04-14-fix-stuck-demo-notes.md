# Final Fix: Segment Boundary Buffering & Overlap

This plan implements a robust fix for the "stuck demo notes" bug by ensuring that every note is wrapped with a temporal buffer within its parent segment. This is achieved by allowing adjacent segments to **overlap temporally** at their boundaries.

## Proposed Changes

### [Component Name] MIDI Segment Utilities

#### [MODIFY] [lane-segment-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.ts)

1.  **Enforce Temporal Buffer**:
    - Update Pass 2 (Boundary Stitching) to ensure every segment starts at least **100ms** before its first note and ends at least **100ms** after its last note.
    - If the gap between two segments is less than 200ms (or zero), the segments will now **overlap**.
    - This guarantees that when a note ends at Time T, its parent segment remains mounted until `T + 100ms`, giving the `IntersectionObserver` ample time to trigger the `onNoteOff` event.

### [Component Name] Demo Playback & Lifecycle

#### [MODIFY] [use-demo-playback.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/hooks/use-demo-playback.ts)

1.  **Recursive Unmount Handling**:
    - Re-implement the robust `MutationObserver` logic that traverses the subtree of removed nodes to find any unmounted notes. This provides a second layer of defense.
2.  **Diagnostic Cleanup**:
    - Remove all `console.log` statements added during the investigation.

#### [MODIFY] [play-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.client.tsx)

- Restore the original `initialProgress: gameSession?.currentProgress ?? 0` logic.

### [Component Name] Presentation Layer

#### [MODIFY] [lane-segment.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/lane-stage/lane-segment.tsx)

- Remove the diagnostic `data-start-time` attribute.

## Verification Plan

### Automated Tests
- Run `npm test` to verify that the segment grouping logic still functions correctly.

### Manual Verification
- Run `npm run dev` and verify that the F#4 note (and all others) release correctly.
- Ensure that the temporal overlap between segments doesn't cause any visual or performance regressions (overlapped segments are absolutely positioned and will simply render their respective notes).
