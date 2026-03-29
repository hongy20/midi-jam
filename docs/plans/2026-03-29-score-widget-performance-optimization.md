# ScoreWidget Performance & Low-Latency Optimization

Optimize the scoring engine and UI to reach a stable 60fps target and bypass React reconciliation for high-frequency updates (hits, misses, progress).

## User Review Required

> [!IMPORTANT]
> This change refactors values in `useLaneScoreEngine` from React State to stable Getters/Refs. This prevents the entire `PlayPage` from re-rendering on every hit, significantly improving game performance, but requires components that consume these values to pull them manually during the animation loop.

## Proposed Changes

### [Core] use-lane-score-engine.ts
- [MODIFY] [use-lane-score-engine.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/hooks/use-lane-score-engine.ts)
  - Replace `score`, `combo`, and `lastHitQuality` state with `useRef`.
  - Provide stable getter functions: `getScore()`, `getCombo()`, `getLastHitQuality()`.
  - Add logic to track "dirty" states if needed, but the UI rAF loop will handle polling.

### [UI] ScoreWidget
- [MODIFY] [score-widget.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/score-widget/score-widget.tsx)
  - Wrap the entire component in `React.memo` to prevent parent-driven re-renders.
  - Update `ScoreWidgetProps` to take getters instead of raw values.
  - Add refs for `scoreValueRef`, `comboValueRef`, and `feedbackRef`.
  - In the rAF loop:
    - Update progress bar (with "is dirty" check for textContent).
    - Update score display (using `toLocaleString()` only when changed).
    - Update combo display.
    - Handle "Hit Quality" feedback by updating a stable DOM element's text and class list (using imperative animation reset).
  - [MODIFY] [score-widget.module.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/score-widget/score-widget.module.css)
    - Ensure `.hitText` is always present but hidden/visible via classes to keep the DOM tree stable.
    - Fix potential layout shifts.

### [Page] PlayPage
- [MODIFY] [play/page.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/page.tsx)
  - Consume stable getters from `useLaneScoreEngine`.
  - Update `ScoreWidget` props to pass these getters.
  - Fix the `onFinish` logic to pull final values from getters/refs instead of state.

## Verification Plan

### Automated Tests
- `npm run lint` & `npm run type-check` to ensure type safety with getters.
- `npm run build` to verify production bundling.

### Manual Verification
- Play a complex track and observe the `ScoreWidget` updates.
- Verify no "scaleX(0)" flicker on the progress bar.
- Verify that score and combo format correctly.
- Verify that performance (FPS) remains stable during rapid hits.
