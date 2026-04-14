# Fix: Segment Connectivity & Clustering Bug

Despite the previous epsilon fix, some connected notes in the 'Golden Song' are still being split into multiple segments. This plan focuses on robustly reproducing and fixing this behavior.

## Proposed Research & Reproduction

-   **New Test Cases**: I will add a test case with a long chain of connected notes (10+ notes) where each note starts exactly when the previous one ends, exceeding the segment threshold multiple times.
-   **Diagnostic Logs (Temporary)**: I will add `console.log` to track the exact state (`currentMaxEndMs`, `visualDuration`, etc.) when a split occurs in the app.

## Proposed Changes

### MIDI Utilities

#### [MODIFY] [lane-segment-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.ts)
-   Increase the `isConnected` epsilon from `0.1` to `1.0ms`. MIDI jitter can often exceed 0.1ms depending on the source.
-   Ensure that the `isConnected` check is the highest priority for clustering.

### Test Suite

#### [MODIFY] [lane-segment-utils.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.test.ts)
-   Add `it("does not split a chain of 10+ connected notes regardless of threshold")`
-   Add `it("bridges gaps up to 1ms")`

## Verification Plan
-   Run `npm test src/lib/midi/lane-segment-utils.test.ts`
-   Verification in browser with the 'Golden Song' at the 33% mark.
