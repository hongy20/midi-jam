# Plan: Fix Stuck F#4 Note in Demo Mode

## Goal Description
Identify and resolve the bug where note "F#4" (MIDI 66) becomes permanently stuck in the "on" state during demo playback of the "Golden Kpop Demon Hunters" track.

## User Review Required
> [!IMPORTANT]
> The fix involves changing the state management of active notes in `useDemoPlayback` from a per-pitch reference counter to a per-element `Set`. This is a more robust approach but changes the underlying logic of how note triggers are handled.

## Proposed Changes

### Core Logic

#### [MODIFY] [use-demo-playback.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/hooks/use-demo-playback.ts)
- Replace `activeCounts: Map<number, number>` (pitch -> count) with `activeElements: Map<number, Set<Element>>` (pitch -> Set of intersecting elements).
- Update the `IntersectionObserver` callback to add/remove specific elements from these sets.
- Trigger `onNoteOn` only when a pitch's set goes from empty to non-empty.
- Trigger `onNoteOff` only when a pitch's set becomes empty.
- This ensures that IO callback batching delays (which were causing counter inflation) do not result in stuck notes.

## Verification Plan

### Automated Tests
- [ ] `npm run lint` (Biome check)
- [ ] `npm run type-check` (TypeScript tsc)
- [ ] `npm test` (Vitest suite)
- [ ] `npm run build` (Next.js production build)

### Manual Verification
- Start the "Golden" track in Demo Mode.
- Verify F#4 does not stick at the ~11% mark.
- Ensure no other regressions in note triggering/release.
