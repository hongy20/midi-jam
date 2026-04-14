# Fix: Segment Connectivity Bug (Integration Test & Fix)

The user reports a recurring bug in 'Golden Kpop Demon Hunters.mid' around the 32-33% mark where connected notes are split into different segments. This plan adds a precise integration test to catch this and then fixes it.

## Proposed Research & Reproduction

-   **Integration Test**: I will add a new test case in `src/lib/midi/lane-segment-utils.integration.test.ts`.
-   **Test Logic**:
    1.  Load `Golden Kpop Demon Hunters.mid`.
    2.  Use `buildSegmentGroups` with the default 5s threshold.
    3.  Iterate through all resulting groups and the original spans.
    4.  Verify that for every pair of sequential notes (A and B) that are "touching" (gap < 1ms), they both belong to the same `SegmentGroup`.
    5.  This will definitively fail if the 33% mark splits connected notes.

## Proposed Changes

### MIDI Utilities

#### [MODIFY] [lane-segment-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.ts)
-   Increase the `isConnected` epsilon to `1.0ms`.
-   Review the `visualDuration` logic to ensure it doesn't override the connectivity check when the threshold is hit exactly at a note transition.

### Test Suite

#### [NEW] [lane-segment-utils.integration.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.integration.test.ts)
-   Add the `Golden Kpop Demon Hunters.mid` connectivity test.

## Verification Plan
-   Run `npm test src/lib/midi/lane-segment-utils.integration.test.ts`.
-   Confirm the test fails with the current 0.1ms epsilon and passes with 1.0ms.
