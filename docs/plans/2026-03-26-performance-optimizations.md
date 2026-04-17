# Plan: Performance Optimizations for 60fps Rendering

This task addresses performance bottlenecks in the high-frequency rendering layers (Play page, LaneStage, and PianoKeyboard) to maintain a stable 60fps target.

## Background

The previous implementation had several CSS properties (backdrop-blur, box-shadow, transitions) that were expensive for the GPU or compositor, especially when many elements were present. Additionally, `LaneStage` was recalculating visible segments on every render, causing unnecessary React reconciliation pressure.

## Proposed Changes

### 1. CSS Optimization

- Remove `backdrop-blur-md` from `src/app/play/page.tsx` header and footer.
- Remove `box-shadow` and `transition: opacity` from `lane-segment.module.css` to reduce paint/composite costs during scrolling.
- Remove `transition: opacity` and complex `box-shadow` from `piano-keyboard.module.css` to ensure immediate visual feedback without layout/animation overhead.

### 2. React Loop Optimization

- Refactor `LaneStage` in `src/components/lane-stage/lane-stage.tsx`:
  - Replace `useMemo` for `renderIndexes` with an interval-driven `useState` update.
  - Only update state when the set of visible segment indexes actually changes (shallow comparison of index arrays).
  - This reduces the number of re-renders for the entire lane stage from "every time timeMs changes" to "only when segments enter/exit the viewport".

### 3. Utility Refinement

- Update `src/lib/midi/lane-segment-utils.ts` to make `thresholdMs` mandatory in `BuildSegmentGroupsOptions` for better predictability.

## Verification Plan

### Automated Tests

- Run `npm run lint` to ensure style consistency.
- Run `npm run type-check` to verify the mandatory `thresholdMs` change.
- Run `npm test` to ensure no regressions in playback or lane logic.
- Run `npm run build` to confirm production readiness.

### Manual Verification

- Verify the "Play" page still renders correctly.
- Ensure transitions between segments are smooth and performance is stable.
