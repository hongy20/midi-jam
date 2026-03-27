# Fix First Segment Vertical Gap
  
## Goal Description
There is a noticeable vertical gap between the first and second track segments when playing a song. The root cause is a synchronization misalignment between the React render cycle and the browser's compositor clock.
During the very first component mount (which handles the entire page layout), `useLayoutEffect` calculates the phase-lock delay before the browser actually paints the frame. Because the initial page render is heavy, the CSS animation starts ticking slightly after `useLayoutEffect` runs, but its `--anim-delay-raw` was snapshot earlier. This lag applies only to the first segment, as subsequent segments mount dynamically during smooth gameplay and don't suffer from large layout delays.

Additionally, the `VirtualInstrument` exhibits a "zoom in" flicker upon loading. This occurs because the `groups` array is initially empty while the MIDI file is loading, causing `visibleMidiRange` to default to the full 88-key piano. Once the file loads, the range instantly snapping to the actual notes causes a harsh layout shift.

We will fix the gap by deferring the calculation of `--anim-delay-raw` and the start of the CSS animation until the exact frame paint via `requestAnimationFrame` and `animation-play-state`. We will fix the flicker by preventing the `VirtualInstrument` grid from rendering until `isLoading` is false.

## Proposed Changes

### Lane Stage Segment Sync

#### [MODIFY] [lane-segment.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/lane-stage/lane-segment.tsx)
- Inside `useLayoutEffect`, defer the phase-lock calculation to a `requestAnimationFrame` callback.
- Inside the frame callback, query `getCurrentTimeMs()` and compute the exact `delayMs`.
- Set both `--anim-delay-raw` and `--play-state` simultaneously so the animation begins perfectly synced with the compositor's frame clock.

#### [MODIFY] [lane-segment.module.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/lane-stage/lane-segment.module.css)
- Add `animation-play-state: var(--play-state, paused);` to `.container` to prevent the animation from prematurely ticking during the `useLayoutEffect` rendering gap.
- The `play-state` will be transitioned to `running` dynamically via JavaScript perfectly in lockstep with the frame's phase time.

### Virtual Instrument Layout Shift

#### [MODIFY] [play/page.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/page.tsx)
- Add a conditional fade-in opacity class to the `PageLayout` components, or specifically conditionally render `VirtualInstrument` ONLY when `!isLoading`, so the user does not see the raw 88-key piano snapping to the bounded range.

## Verification Plan

### Automated Tests
- Run `npm run type-check` to ensure no TypeScript compilation issues.
- Run `npm test` to verify `LaneStage` and `LaneSegment` test suites pass.
- Run `npm run lint` for formatting.

### Manual Verification
- Deploy locally and load "Happy Birthday" or any track.
- Verify visually that the vertical gap between the first two segments is eliminated.
