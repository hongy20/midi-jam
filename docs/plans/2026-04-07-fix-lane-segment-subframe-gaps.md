# Fix Lane Segment Sub-frame Gaps

The goal is to eliminate persistent vertical gaps between consecutive song segments during playback. These gaps are caused by a sub-frame timing mismatch between `performance.now()` (used in JS logic) and the CSS animation clock (aligned to vsync).

## Proposed Changes

### [Lane Stage]

#### [MODIFY] [lane-segment.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/lane-stage/lane-segment.tsx)

Synchronize CSS animations with the master clock using the Web Animations API. By explicitly setting the `startTime` of the animations to a captured `performance.now()` timestamp within `useLayoutEffect`, we can eliminate the sub-frame drift that occurs when animations are started at different vsync intervals.

- Capture `mountTimeReal` using `performance.now()` and `mountTimeMs` using `getCurrentTimeMs()` inside `useLayoutEffect`.
- Compute the `animation-delay` using `computeLaneSegmentAnimationDelay`.
- Use `requestAnimationFrame` to ensure we are at a frame boundary, then set `anim.startTime = mountTimeReal` for all animations on the element.
- This ensures that the animation logic in CSS and JS are perfectly phase-locked to the same time origin.

## Verification Plan

### Automated Tests
- Run `npm test` to ensure no regressions in segment grouping or timing logic.
- Run `npm run type-check` to ensure type safety.

### Manual Verification
- Visual inspection of "Happy Birthday" and other tracks to confirm that the vertical gap between segments is gone.
- Confirm that the initial idle pre-roll time (3 seconds) is still present.
- Verify that pausing and resuming doesn't re-introduce or fix gaps (it should stay seamless).
