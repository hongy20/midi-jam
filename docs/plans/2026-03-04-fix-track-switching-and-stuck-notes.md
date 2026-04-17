# Plan: Fix Track Switching and Stuck Notes

## Problem 1: Track Switching Bug

After selecting and playing one track, switching to another track (e.g., from the tracks page) and returning to the game results in the previous track's MIDI data being loaded.

**Root Cause:**
In `src/context/app-context.tsx`, the `useEffect` responsible for loading MIDI files includes `trackStatus.isReady` in its dependency array and contains an early return `if (trackStatus.isReady) return;`. When a track is already loaded, switching `selectedTrack` triggers the effect, but it immediately returns without loading the new track because `isReady` is still true from the previous track.

## Problem 2: Stuck Notes Bug (Implicit)

When leaving the gameplay page or switching tracks while notes are playing, some notes may remain "on" (ringing out) because the playback mechanism doesn't properly clean up active notes on unmount.

**Root Cause:**
In `src/hooks/use-demo-playback.ts`, the `IntersectionObserver` tracks active notes in an `activeCounts` map but doesn't call `onNoteOff` for those notes when the effect cleans up (e.g., on unmount or when `spans` change).

---

## Proposed Changes

### 1. Fix `src/context/app-context.tsx`

- Remove `trackStatus.isReady` from the loading effect's dependency array.
- Reset `trackStatus` to an initial (non-ready) state when `selectedTrack` changes to a different track ID.
- Ensure the loading logic is only skipped if the _correct_ track is already ready.

### 2. Fix `src/hooks/use-demo-playback.ts`

- Update the cleanup function of the `useEffect` to iterate through the `activeCounts` map.
- For every note that is still considered "active" (count > 0), call `onNoteOff` to ensure all audio and visual state is cleared.

### 3. Verification Plan

- **Manual Test:** Play a track, go back to track selection, select a different track, and verify the new track loads correctly in the game.
- **Manual Test:** Ensure that if the game is paused or exited while notes are playing, all audio stops immediately.
- **Automated Test:** Run existing tests to ensure no regressions in MIDI loading or playback logic.
