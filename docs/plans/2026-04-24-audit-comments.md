# 2026-04-24 Audit Comments Implementation Plan

The objective is to scan the codebase for outdated, misleading, or redundant comments and update or remove them to ensure they align with the current implementation.

## User Review Required

> [!IMPORTANT]
> This is a broad task. I will start by auditing the currently active files and then expand to the rest of the features.

## Proposed Changes

### Visualizer Feature

#### [MODIFY] [constants.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/visualizer/lib/constants.ts)

- Remove "and score engine" from `LANE_SCROLL_DURATION_MS` comment.

### MIDI Hardware Feature

#### [MODIFY] [gear-context.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-hardware/context/gear-context.tsx)

- Clarify `selectMIDIOutput` TODO (it is currently auto-matched by input name).

### Score Feature

#### [MODIFY] [score-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/score/lib/score-utils.ts)

- Align comment with the current combo multiplier logic.

## Verification Plan

### Manual Verification

- Review comments against logic in each file.
- Verify that removing or updating comments does not affect code functionality.
