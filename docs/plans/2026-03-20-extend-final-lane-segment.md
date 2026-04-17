# Plan: Extend Final Lane Segment to Song Duration

## Objective

Extend the final `LaneSegment` visually until the true end of the song (`totalDurationMs`), rather than cutting it off abruptly at the end of the last playable MIDI note. This provides a natural empty space at the top of the final segment for the visual lead-out, preventing the screen from abruptly emptying before the final audio padding finishes.

## Branching Protocol

- Create branch: `git checkout -b feature/extend-final-lane-segment`

## Design

We can achieve this organically by expanding the final `SegmentGroup`'s `durationMs` to encapsulate the track's full duration. The existing CSS scaling logic in `LaneStage` and `LaneSegment` will automatically accommodate this larger duration by linearly rendering a taller segment grid.

## Implementation Steps

### 1. Update `lane-segment-utils.ts`

- Modify the `buildSegmentGroups` signature to accept `totalDurationMs: number` as the second argument.
- Inside the "Pass 2: Boundary Stitching" logic for the final group, update the `endMs` calculation to extend to the very end of the song using `Math.max(cluster.maxEndMs, totalDurationMs)`.

### 2. Update Context Call Site (`use-track-sync.ts`)

- In the `loadMidiFile` Promise resolution, capture the full duration from `midi.duration * 1000`.
- Pass this `totalDurationMs` as the newly required second argument to `buildSegmentGroups()`.

### 3. Update Unit Tests

- **`lane-segment-utils.test.ts`**: Update all test calls to `buildSegmentGroups()` to provide a mockup `totalDurationMs` parameter. Validate that the last group's length extends correctly.
- **`use-demo-playback.test.ts`** and **`lane-stage.test.tsx`**: Update any mock implementations or instances initializing `buildSegmentGroups()` to accommodate the new function signature.

## Validation & Verification (SOP Checklist)

To fulfill the mandatory completion checklist, run the following:

- [ ] Linting: `npm run lint`
- [ ] Type Checking: `npm run type-check`
- [ ] Testing: `npm test`
- [ ] Build: `npm run build`
