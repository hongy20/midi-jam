# Plan: ScoreWidget Performance Refactor

Refactor the `ScoreWidget` to use `requestAnimationFrame` instead of `setInterval` for smoother progress tracking and reduced React reconciliation overhead.

## 1. Objectives

- Replace `setInterval` with `requestAnimationFrame` for 60fps-ready updates.
- Use imperative DOM updates for high-frequency visual feedback (progress bar and percentage text) to bypass React's virtual DOM reconciliation.
- Maintain React's declarative style for lower-frequency updates like score, combo, and hit feedback.

## 2. Changes

### `src/components/score-widget/score-widget.tsx`

- **Add Refs**:
  - `progressBarFillRef`: For updating the `scaleX` transform of the fill element.
  - `progressValueRef`: For updating the `textContent` of the percentage value.
- **Refactor `useEffect`**:
  - Replace `setInterval` loop with an `requestAnimationFrame` loop.
  - Loop logic:
    1. Call `getProgress()`.
    2. Update `progressBarFillRef.current.style.transform = "scaleX(${progress})"`.
    3. Update `progressValueRef.current.textContent = "${Math.floor(progress * 100)}%"`.
  - Cleanup: Ensure the animation frame is cancelled on unmount or when `isPaused` changes.
- **Remove `progress` state**: No longer needed since we are updating the DOM directly.

### `src/components/score-widget/score-widget.module.css`

- **Remove transition**: Remove `transition: transform 0.1s linear;` from `.progressBarFill` to allow smooth, frame-by-frame updates without interpolation lag or CSS-JS conflict.

## 3. Verification

- Verify that the progress bar fills smoothly in `PlayPage`.
- Verify that the percentage text updates correctly from 0% to 100%.
- Ensure score, combo, and hit feedback still work as expected.
- Run `npm run lint` and `npm run type-check`.
- Run `npm test`.
