# Fix Lane Timeline Sync Issues

## Goal Description
The previous fix for the vertical gap attempted to phase-lock CSS animations using `requestAnimationFrame`. However, this caused the initial CSS position to start at `0` (paused) and then jump to the active phase. This "teleportation" bypassed the `IntersectionObserver`'s boundary line entirely, causing the initial demo notes to miss their audio triggers.

Furthermore, a critical bug was discovered in `useLaneTimeline`: the timeline's real-time synchronizer (`syncRealTimeRef`) was initialized when the page first rendered (during the "LOADING..." phase). By the time the track finished fetching, the hook incorrectly added the entire download duration as "elapsed time" to the internal master clock. This caused the game to instantly teleport hundreds of milliseconds forward upon mount.

We will revert the experimental CSS `requestAnimationFrame` jump fix (restoring the synchronous `useLayoutEffect` to fix the `IntersectionObserver` hit registration validation), and implement the true fix inside `useLaneTimeline`.

## Proposed Changes

### 1. Revert CSS Phase Jump Hack
#### [MODIFY] [lane-segment.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/lane-stage/lane-segment.tsx)
- Revert `useLayoutEffect` to synchronously assign `--anim-delay-raw` and remove the `rAF` wrapper.

#### [MODIFY] [lane-segment.module.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/lane-stage/lane-segment.module.css)
- Remove `animation-play-state: var(--play-state, paused);` so the animation properly initializes at the correct Y-axis position on its very first frame.

### 2. Fix Master Clock Accumulating Loading Time
#### [MODIFY] [use-lane-timeline.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/hooks/use-lane-timeline.ts)
- Add a `wasReadyRef` inside the hook.
- When `totalDurationMs > 0` and `!wasReadyRef.current`, update `syncRealTimeRef.current = performance.now()` directly within the render phase, and flip `wasReadyRef.current = true`.
- If `totalDurationMs <= 0`, reset `wasReadyRef.current = false`.
- This ensures the master clock strictly starts accumulating 'elapsed real time' from exactly 0ms right when the track switches from loading to ready, preserving perfect sync between the game engine and the timeline.

## Verification Plan

### Automated Tests
- Run `npm test` to ensure `LaneTimeline` tests pass.
- Run `npm run type-check` and `npm run lint`.
- Build the project using `npm run build`.

### Manual Testing
- Go to demo mode, load a track.
- Verify that initial notes perfectly trigger intersections (audio plays).
- Verify the gap is handled cleanly.
