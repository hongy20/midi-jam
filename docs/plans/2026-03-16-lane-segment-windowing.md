# TrackLane → Windowed `LaneSegment` Refactor

## Background

`TrackLane` renders every note in the entire song as a single monolithic DOM tree thousands of pixels tall. The Web Animation API operates on that one element, but the browser must composite all those children simultaneously, causing compositor freeze as the song progresses.

The fix splits the tall lane into time-windowed **`LaneSegment`** components. At any point the DOM holds only **three** segments: previous, current, and next. Each segment runs its own Web Animation that is offset to match the corresponding slice of the master timeline — as if the whole lane were still one piece, but only the relevant slices exist in the DOM.

---

## Key Design Decisions

### Segment duration constant

```ts
// src/lib/midi/constant.ts
export const LANE_SEGMENT_DURATION_MS = 10 * 1000;
```

### Segment count

```ts
const segmentCount = Math.ceil(totalDurationMs / LANE_SEGMENT_DURATION_MS);
```

### DOM windowing — three segments live in the DOM at any time

| Index              | Role                       |
| ------------------ | -------------------------- |
| `currentIndex - 1` | Previous (just passed)     |
| `currentIndex`     | Active (hit-line crossing) |
| `currentIndex + 1` | Next (pre-loaded)          |

`currentIndex = Math.floor(getCurrentTimeMs() / LANE_SEGMENT_DURATION_MS)`, clamped to `[0, segmentCount - 1]`. Segments outside this window are **unmounted**.

### Per-segment height (CSS calc, matching existing convention)

Each `LaneSegment` sets `--segment-duration-ms` as an inline CSS variable, and its CSS module uses:

```css
.container {
  height: calc(
    calc(100dvh - var(--header-height) - var(--footer-height)) * (var(--segment-duration-ms) / 3000)
  );
}
```

This is identical in structure to the original `track-lane.module.css` height formula, substituting `--segment-duration-ms` for `--total-duration-ms`.

### Per-segment animation — virtual placement via `currentTime` offset

Each `LaneSegment` owns a Web Animation with the same keyframes the original full lane used, but scoped to one segment's duration:

```
keyframes: [
  { transform: `translateY(${containerHeight}px)` },   // t = 0  → below the screen
  { transform: `translateY(${-segmentHeight}px)` },    // t = LANE_SEGMENT_DURATION_MS → above
]
duration: LANE_SEGMENT_DURATION_MS
```

When a segment is **mounted**, its animation `currentTime` is immediately set to:

```
currentTime = masterCurrentTimeMs - segmentIndex * LANE_SEGMENT_DURATION_MS
```

This places the segment exactly where it would be if the entire lane were animating as one. Pause, resume, and playback speed are propagated from the master clock (owned by `useLaneTimeline`) to each live segment animation.

Because the keyframe math and timing are identical to the original, the visual result is indistinguishable — but each segment's DOM subtree is only a fraction of the total note count.

---

## Proposed Changes

### `src/lib/midi/constant.ts`

#### [MODIFY] [constant.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/constant.ts)

Add:

```ts
/** Duration in ms of each windowed LaneSegment */
export const LANE_SEGMENT_DURATION_MS = 10 * 1000;
```

---

### Pure utility helpers

#### [NEW] `src/lib/midi/lane-segment-utils.ts`

Pure functions — no side effects, fully unit-testable:

```ts
/** Index of the segment containing the given time. */
export function getCurrentSegmentIndex(
  currentTimeMs: number,
  laneSegmentDurationMs: number,
): number;

/** [prev, current, next] indexes, clamped to [0, segmentCount - 1]. */
export function getVisibleSegmentIndexes(
  currentTimeMs: number,
  totalDurationMs: number,
  laneSegmentDurationMs: number,
): [number, number, number];

/** Spans whose startTime falls within the segment's time window. */
export function filterSpansForSegment(
  spans: NoteSpan[],
  segmentIndex: number,
  laneSegmentDurationMs: number,
): NoteSpan[];

/** currentTime to set on a segment's animation when it mounts. */
export function segmentAnimationCurrentTime(
  masterCurrentTimeMs: number,
  segmentIndex: number,
  laneSegmentDurationMs: number,
): number;
```

---

### New component: `LaneSegment`

#### [NEW] `src/components/lane-stage/lane-segment.tsx`

```tsx
interface LaneSegmentProps {
  segmentIndex: number;
  spans: NoteSpan[]; // pre-filtered for this segment's window
  getMasterCurrentTimeMs: () => number;
  isPaused: boolean;
  speed: number;
}
```

Internal behaviour:

- On mount: creates a Web Animation on its root `div` (same keyframe shape as the original lane), sets `animation.currentTime` via `segmentAnimationCurrentTime(...)`, then plays or pauses according to `isPaused`.
- On `isPaused` / `speed` prop change: updates `animation.pause()` / `animation.play()` and `animation.playbackRate` — no re-render needed.
- Height via `--segment-duration-ms` inline variable + CSS calc (see above).
- Note `top%` / `height%` are proportional to `LANE_SEGMENT_DURATION_MS`, not `totalDurationMs`.
- Reuses `.note` and grid-column classes from the existing CSS modules unchanged.

#### [NEW] `src/components/lane-stage/lane-segment.module.css`

```css
.container {
  display: grid;
  width: 100%;
  position: absolute; /* stacks in the same coordinate space as the parent */
  top: 0;
  grid-template-columns: repeat(calc(var(--end-unit) - var(--start-unit)), minmax(0, 1fr));
  height: calc(
    calc(100dvh - var(--header-height) - var(--footer-height)) * (var(--segment-duration-ms) / 3000)
  );
}
```

---

### Modify `LaneStage`

#### [MODIFY] [lane-stage.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/lane-stage/lane-stage.tsx)

- Remove `<TrackLane>`.
- Track `currentIndex` in React state (updates only when the active segment changes, not every frame).
- Render the three `LaneSegment` components for `[prev, current, next]` indexes.
- Pass `getMasterCurrentTimeMs`, `isPaused`, and `speed` down; each segment self-manages its own animation on mount/update.

---

### Simplify `useLaneTimeline`

#### [MODIFY] [use-lane-timeline.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/hooks/use-lane-timeline.ts)

- Remove `querySelector("#track-lane")` and the `element.animate()` keyframe call — positioning is now delegated to each `LaneSegment`.
- Keep: master clock tracking, `isPaused` / `speed`, `getCurrentTimeMs`, `getProgress`, `onFinish`.

---

### Delete `TrackLane`

#### [DELETE] [track-lane.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/lane-stage/track-lane.tsx)

#### [DELETE] [track-lane.module.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/lane-stage/track-lane.module.css)

Both replaced in full by `LaneSegment` + `lane-segment.module.css`.

---

## Verification Plan

```bash
npm run lint
npm run type-check
npm test
npm run build
```

### New — `src/lib/midi/lane-segment-utils.test.ts`

| Test                                  | Assertion                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| `getCurrentSegmentIndex`              | correct floor division                                                          |
| `getVisibleSegmentIndexes` mid-track  | `[current-1, current, current+1]`                                               |
| `getVisibleSegmentIndexes` at `t = 0` | prev clamped to `0`                                                             |
| `getVisibleSegmentIndexes` near end   | next clamped to `segmentCount - 1`                                              |
| `filterSpansForSegment`               | only spans within segment window included                                       |
| `segmentAnimationCurrentTime`         | equals `masterTimeMs - segmentIndex * LANE_SEGMENT_DURATION_MS`                 |
| Segment count                         | `Math.ceil(totalDurationMs / LANE_SEGMENT_DURATION_MS)` for edge-case durations |

### Update — `lane-stage.test.tsx`

- Assert that note nodes for the **current segment** are present in the DOM.
- Assert that note nodes for a segment outside `[prev, current, next]` are **not** in the DOM.

### Update — `use-lane-timeline.test.ts`

- Remove assertions about `querySelector("#track-lane").animate()`.
- Retain tests for `getCurrentTimeMs`, `getProgress`, play/pause, speed, `onFinish`.

### Manual Verification

1. `npm run dev` → play any MIDI track end-to-end.
2. Confirm hit-line timing is identical to before.
3. Play > 30 s — confirm no freeze or stutter.
4. Pause / resume — verify position is preserved.
5. DevTools Performance tab — record 10 s; confirm compositor thread stays smooth.
