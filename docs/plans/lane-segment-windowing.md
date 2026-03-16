# TrackLane → Windowed `LaneSegment` Refactor

## Background

`TrackLane` renders **every note in the entire song** as a single monolithic DOM tree thousands of pixels tall. The Web Animation API operates on that one element, but the browser must composite all those children simultaneously, causing compositor freeze as the song progresses.

The fix splits the tall lane into **time-windowed segments** (`LaneSegment`). At any point the DOM holds only **three** segments: the one before the current window, the current window, and the next window. Each segment receives its own `transform: translateY(…)` so no single element is ever tall enough to cause compositor stall.

---

## Key Design Decisions

### Segment width constant
```ts
// src/lib/midi/constant.ts
export const LANE_SEGMENT_DURATION_MS = 10_000; // 10 s per segment — adjust as needed
```

### Segment count
```ts
const segmentCount = Math.ceil(totalDurationMs / LANE_SEGMENT_DURATION_MS);
```

### DOM windowing — only three segments live in the DOM

| Index | Role |
|-------|------|
| `currentIndex - 1` | Previous (just passed) |
| `currentIndex` | Active (hit-line region) |
| `currentIndex + 1` | Next (pre-loaded) |

Segments outside this window are **unmounted**.

### Per-segment `translateY` formula

Each segment is a fixed-height box. Let:

```
segmentHeightPx  = containerHeightPx × (LANE_SEGMENT_DURATION_MS / 3_000)
segmentOffsetMs  = segmentIndex × LANE_SEGMENT_DURATION_MS
relativeTimeMs   = currentTimeMs - segmentOffsetMs
```

Then:

```
translateY = containerHeightPx - segmentHeightPx × (1 - relativeTimeMs / LANE_SEGMENT_DURATION_MS)
```

At `relativeTimeMs = 0` → bottom of segment is at the hit-line.  
At `relativeTimeMs = LANE_SEGMENT_DURATION_MS` → top of segment is at the hit-line.  
This mirrors the original single-lane scroll exactly.

Positions are updated **imperatively** on every animation frame — no React state, no re-renders.

---

## Proposed Changes

### `src/lib/midi/constant.ts`
#### [MODIFY] [constant.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/lib/midi/constant.ts)
Add:
```ts
/** Duration in ms of each windowed LaneSegment */
export const LANE_SEGMENT_DURATION_MS = 10_000;
```

---

### Pure math helper
#### [NEW] `src/lib/midi/lane-segment-math.ts`

Exports three pure functions (no side effects, fully testable):

```ts
computeSegmentTranslateY(
  segmentIndex: number,
  currentTimeMs: number,
  containerHeightPx: number,
  laneSegmentDurationMs: number,
): number

getVisibleSegmentIndexes(
  currentTimeMs: number,
  totalDurationMs: number,
  laneSegmentDurationMs: number,
): [number, number, number]   // [prev, current, next], clamped

filterSpansForSegment(
  spans: NoteSpan[],
  segmentIndex: number,
  laneSegmentDurationMs: number,
): NoteSpan[]
```

---

### New component: `LaneSegment`
#### [NEW] `src/components/lane-stage/lane-segment.tsx`

```tsx
interface LaneSegmentProps {
  segmentIndex: number;
  spans: NoteSpan[];           // pre-filtered for this segment's time window
  containerHeightPx: number;
  segmentRef: React.RefObject<HTMLDivElement | null>;
}
```

- Exposes a `divRef` so `LaneStage` can update `transform` imperatively.
- Height = `containerHeightPx × (LANE_SEGMENT_DURATION_MS / 3_000)` via inline style.
- Note `top%` / `height%` are relative to `LANE_SEGMENT_DURATION_MS`, not `totalDurationMs`.
- Reuses `.note` and grid-column styles from the existing CSS modules.

---

### Modify `LaneStage`
#### [MODIFY] [lane-stage.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/lane-stage/lane-stage.tsx)

- Remove `<TrackLane>` and the scrolling div.
- Observe container size with `ResizeObserver` to get live `containerHeightPx`.
- Run an **imperative rAF loop** that:
  1. Calls `getCurrentTimeMs()` from `useLaneTimeline`.
  2. Calls `getVisibleSegmentIndexes(…)` to find prev/current/next.
  3. Updates each of the three `LaneSegment` refs with `computeSegmentTranslateY(…)`.
- Mounts/unmounts `LaneSegment` components only when `currentIndex` changes (React state for index only, not for position).

---

### Simplify `useLaneTimeline`
#### [MODIFY] [use-lane-timeline.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/hooks/use-lane-timeline.ts)

- Remove `querySelector("#track-lane")` and `element.animate()` keyframe logic.
- Keep: internal clock (`currentTime` via `performance.now()` + rAF or a minimal `Animation`), `isPaused` / `speed`, `getCurrentTimeMs`, `getProgress`, `onFinish`.
- The hook now owns **time** only; **positioning** is fully delegated to `LaneStage`'s rAF loop.

---

### Delete `TrackLane`
#### [DELETE] [track-lane.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/lane-stage/track-lane.tsx)

Fully replaced by `LaneSegment`. Remove file and update any imports.

---

### CSS — `track-lane.module.css`
#### [MODIFY] [track-lane.module.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/lane-stage/track-lane.module.css)

- Remove `.container` CSS height calc (height now set via inline style in `LaneSegment`).
- Rename file to `lane-segment.module.css` to match new component.
- `.note` styles remain unchanged.

---

## Verification Plan

### Automated Tests

Run in order before proposing completion:

```bash
npm run lint
npm run type-check
npm test
npm run build
```

#### New — `src/lib/midi/lane-segment-math.test.ts`

| Test | Assertion |
|------|-----------|
| `computeSegmentTranslateY` at `relativeTimeMs = 0` | segment bottom == `containerHeightPx` |
| `computeSegmentTranslateY` at `relativeTimeMs = LANE_SEGMENT_DURATION_MS` | segment top == `containerHeightPx` |
| `getVisibleSegmentIndexes` mid-track | returns `[current-1, current, current+1]` |
| `getVisibleSegmentIndexes` at `t = 0` | prev clamped to `0` |
| `getVisibleSegmentIndexes` near end | next clamped to `segmentCount - 1` |
| `filterSpansForSegment` | only spans within the segment time window are included |
| Segment count | `Math.ceil(totalDurationMs / LANE_SEGMENT_DURATION_MS)` for edge-case durations |

#### Update — `lane-stage.test.tsx`

- Render with three-segment window; smoke-test that note nodes for the current segment appear in the DOM.
- Assert that note nodes for a segment outside `[prev, current, next]` are **not** in the DOM.

#### Update — `use-lane-timeline.test.ts`

- Remove assertions about `querySelector("#track-lane").animate()`.
- Retain tests for `getCurrentTimeMs`, `getProgress`, play/pause, speed, `onFinish`.

### Manual Verification

1. `npm run dev` → play any MIDI track end-to-end.
2. Confirm hit-line timing is identical to before.
3. Play > 30 s — confirm no freeze or visual stutter.
4. Pause / resume — verify playback resumes at correct position.
5. DevTools Performance tab — record 10 s of play; confirm compositor thread stays smooth.
