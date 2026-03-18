# Plan: CSS Self-Animating `LaneSegment`

## Goal

Replace the master `requestAnimationFrame` sync loop in `LaneStage` with CSS keyframe
animations that each `LaneSegment` configures itself at the moment it is inserted into
the DOM. After this refactor, the browser's compositor drives all segment motion — 0 JS
per frame.

## Background & Key Insight

`computeSegmentTranslateY` is a linear function of time:

```
translateY = -segmentHeightPx + progress * (containerHeightPx + segmentHeightPx)
```

This maps 1:1 to a CSS `linear` keyframe animation. The only parameter that synchronises
the animation phase to the master clock is `animation-delay` with a **negative value**,
meaning "start as if this many milliseconds have already elapsed."

Because pausing always navigates to the Pause page, `LaneStage` and every `LaneSegment`
**unmount entirely** on pause and **remount fresh** on resume. This means every mount is
always a cold start from the current playback time — there is no pause/resume state to
manage in the CSS animation.

The correct delay to compute at mount time:

```
delay = -(getCurrentTimeMs() - group.startMs + LANE_FALL_TIME_MS)
```

This is computed **once**, inside `useLayoutEffect`, which fires synchronously after DOM
insertion, giving the tightest possible snapshot of "this element just appeared."

## Architecture After Refactor

```
LaneStage  (4 Hz setInterval — mount/unmount decisions only)
  │
  └─► <LaneSegment getCurrentTimeMs group containerHeight />
          │
          └─ useLayoutEffect (runs once on insert):
               mountTimeMs = getCurrentTimeMs()
               writes to element:
                 --ty-from       = -(height * durationMs / LANE_FALL_TIME_MS)  px
                 --ty-to         = containerHeight                               px
                 --anim-duration = durationMs + LANE_FALL_TIME_MS               ms
                 --anim-delay    = -(mountTimeMs - group.startMs + FALL)        ms

CSS (compositor-owned from this point):
  animation: fall var(--anim-duration) linear var(--anim-delay) both;

@keyframes fall {
  from { transform: translateY(var(--ty-from)); }
  to   { transform: translateY(var(--ty-to));   }
}
```

## Tasks

### Task 1 — Update `lane-segment-utils.ts`

- **Delete** `computeSegmentTranslateY` (no longer needed).
- **Add** a pure helper `computeLaneSegmentAnimationDelay(mountTimeMs, groupStartMs)`:
  ```ts
  export function computeLaneSegmentAnimationDelay(
    mountTimeMs: number,
    groupStartMs: number,
  ): number {
    return -(mountTimeMs - groupStartMs + LANE_FALL_TIME_MS);
  }
  ```
  Keeping the math in a named, testable function preserves coverage parity.
- Update the test file: remove tests for `computeSegmentTranslateY`, add tests for
  `computeLaneSegmentAnimationDelay`.

### Task 2 — Refactor `lane-segment.tsx`

- **Replace** `innerRef` prop with a local `useRef<HTMLDivElement>`.
- **Replace** `containerHeight: number` prop with the same (still needed for `--ty-from`
  and `--ty-to` until/unless we go the pure-CSS dvh route — keep it for now to minimise
  scope).
- **Add** `getCurrentTimeMs: () => number` prop.
- **Add** `useLayoutEffect` (empty deps) that:
  1. Calls `getCurrentTimeMs()` to get `mountTimeMs`.
  2. Computes `--anim-delay`, `--anim-duration`, `--ty-from`, `--ty-to`.
  3. Sets all four via `el.style.setProperty(...)`.
- **Remove** the inline `style` prop's `transform` (the initial off-screen position is
  now handled by `animation-fill-mode: both` + the from-keyframe being off-screen).
- Keep `--segment-duration-ms` and `--fall-time-ms` CSS vars if still consumed by the
  height calc in `lane-segment.module.css`; otherwise remove them too.

### Task 3 — Update `lane-segment.module.css`

- **Add** `@keyframes fall` declaration.
- **Add** `animation` shorthand to `.container`:
  ```css
  animation: fall var(--anim-duration) linear var(--anim-delay) both;
  ```
  `both` covers `backwards` (start at `--ty-from` before delay elapses) and `forwards`
  (freeze at `--ty-to` after animation ends, until the 4 Hz loop unmounts the element).
- Keep `will-change: transform` — compositor promotion is still correct.

### Task 4 — Simplify `lane-stage.tsx`

- **Delete** the RAF `useEffect` (the master sync loop).
- **Delete** `segmentRefs` (`useRef<Map<number, HTMLDivElement>>`).
- **Delete** the `innerRef` callback passed to `<LaneSegment>`.
- **Pass** `getCurrentTimeMs` down to each `<LaneSegment>`.
- The `isPaused` prop can be removed from `LaneStage` entirely if its only remaining use
  was gating the RAF loop — verify before deleting.
- The `containerHeight` state and `ResizeObserver` remain (still needed for `--ty-from` /
  `--ty-to` passed to `LaneSegment`).

## Validation Checklist

- [ ] `npm run lint`
- [ ] `npm run type-check`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] Manual smoke test: notes fall at the correct speed and position on first mount and
      after a pause/resume cycle.

## Files Changed

| File | Change |
|---|---|
| `src/lib/midi/lane-segment-utils.ts` | Delete `computeSegmentTranslateY`; add `computeLaneSegmentAnimationDelay` |
| `src/lib/midi/lane-segment-utils.test.ts` | Swap tests accordingly |
| `src/components/lane-stage/lane-segment.tsx` | Self-animating via `useLayoutEffect` |
| `src/components/lane-stage/lane-segment.module.css` | Add `@keyframes fall` + `animation` rule |
| `src/components/lane-stage/lane-stage.tsx` | Delete RAF loop, `segmentRefs`, `innerRef`; pass `getCurrentTimeMs` |
