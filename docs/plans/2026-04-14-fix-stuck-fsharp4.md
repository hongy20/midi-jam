# Plan: Fix Stuck F#4 Note in Demo Mode

## Goal Description
Identify and resolve the bug where note "F#4" (MIDI 66) becomes permanently stuck in the "on" state during demo playback of the "Golden Kpop Demon Hunters" track.

## User Review Required
> [!IMPORTANT]
> The fix involves changing the state management of active notes in `useDemoPlayback` from a per-pitch reference counter to a per-element `Set`. This is a more robust approach but changes the underlying logic of how note triggers are handled.

## Proposed Changes

### Core Logic

- **Refine IO Exit Filter**: Modify the `IntersectionObserver` exit filter to always allow Note Off if the element is disconnected from the DOM (`!target.isConnected`). This prevents "stuck" notes when a long note element is unmounted while still crossing the hitline (where `boundingClientRect` becomes zeroed).
- **Increase Unmount Buffer**: Add a small temporal buffer (e.g., 500ms - 1000ms) to the segment unmounting logic in `getVisibleSegmentIndexes`. This ensures that note elements remain in the DOM long enough for the `IntersectionObserver` to fire a "clean" exit callback before the segment is destroyed.
- **Explicit MO Cleanup**: Add fallback cleanup in the `MutationObserver` removal loop. If a note element is removed from the DOM, explicitly check its `activeElements` status and trigger `onNoteOff` if it was still active.
- **Set-Based Tracking**: Continue using the `Set` per pitch to prevent concurrent note inflation and ensure idempotent triggers.

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
