# Fix: Floating-Point Robustness in Segment Grouping

This plan fixes a bug where connected notes (those starting exactly when previous notes end) were being split into separate segments due to sub-millisecond precision errors in MIDI-to-MS conversion.

## Proposed Changes

### MIDI Utilities

#### [MODIFY] [lane-segment-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.ts)

- Update the `isConnected` check to use a **0.1ms epsilon**.
- **Logic**: `const isConnected = span.startTimeMs <= currentMaxEndMs + 0.1;`
- This ensures that notes which "touch" at the same MIDI tick (but differ by a trillionth of a second in float representation) are correctly kept in the same segment.

### Test Suite

#### [MODIFY] [lane-segment-utils.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/lane-segment-utils.test.ts)

- Add a test case specifically for floating-point gaps.
- Restore the accidentally removed "Tail Merge" test case.

## Verification Plan

### Automated Tests
- Run `npm test src/lib/midi/lane-segment-utils.test.ts`.

### Manual Verification
- Verify that the "Golden Song" no longer splits segments around the 33% mark.
