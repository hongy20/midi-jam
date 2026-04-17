# Implementation Plan - Unify Demo and MIDI Scoring

Unify the scoring path for demo mode and manual MIDI input to ensure demo mode contributes to the score and achieves high accuracy.

## User Review Required

> [!IMPORTANT]
> The implementation will loosen the requirement for a MIDI device to start the game when `demoMode` is active. This allows watching the demo without hardware connected.

## Proposed Changes

### 1. Score Engine Refactoring

#### [MODIFY] [use-lane-score-engine.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/hooks/use-lane-score-engine.ts)

- Expose the internal `handleLiveNote` function (renamed to `processNoteEvent`) as a return value.
- Tweak scoring thresholds to ensure demo mode events (which have small observer-induced latency) are processed realistically.

### 2. Demo Integration in Play Client

#### [MODIFY] [play-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.client.tsx)

- Destructure `processNoteEvent` from `useLaneScoreEngine`.
- Update `onNoteOn` to call `processNoteEvent({ type: "note-on", note, velocity })`.
- Update the component guard to allow rendering if `demoMode` is true, even if `selectedMIDIInput` is null.

### 3. Navigation/Context Alignment (Optional)

- Ensure that if a user starts a track in "Demo Only" mode (no MIDI), the flow is smooth.

## Open Questions

- Should we show the "Live" MIDI input score _separately_ from the "Demo" score if both are active?
  _Decision_: No, the user wants them to "behave the same", implying a unified score. The scoring engine already handles de-duplication via note indices.

## Verification Plan

### Automated Tests

- Run existing tests for `useLaneScoreEngine` and `useDemoPlayback`.
- Add a new test case for `useLaneScoreEngine` verifying manual event processing.

### Manual Verification

- Start a track in Demo Mode with NO MIDI device selected. Verify score increases on its own.
- Start a track in Demo Mode WITH a MIDI device. Verify playing along doesn't duplicate scores but allows manual hits if the demo misses (which it shouldn't).
- Verify "Perfect" hits are consistently recorded for demo events based on real-time visual alignment.
