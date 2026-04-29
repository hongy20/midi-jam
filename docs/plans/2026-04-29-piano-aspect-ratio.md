# Piano Keyboard Aspect Ratio & Layout Refactor

## Goal

To maintain a consistent, premium aspect ratio for the piano keys regardless of the visible key range, ensuring keys never look "squashed" or "stretched."

## Technical Approach

We will shift to a content-driven grid layout where the instrument stage dictates its own height. This requires refactoring the `Highway` animation to use percentage-based transforms, making it independent of absolute pixel heights and compatible with an `auto` grid row.

## Proposed Changes

### 1. `src/app/play/components/play-page.view.tsx`

- **[MODIFY]** Change grid layout to `grid-rows-[var(--header-height)_1fr_auto]`.

### 2. `src/app/play/components/play-page.view.module.css`

- **[DELETE]** Remove `--main-height` as it is no longer needed for absolute calculations.

### 3. `src/features/highway/components/highway-segment.module.css`

- **[MODIFY]** Refactor animation to use percentage-based transforms:
  - `height: calc(100% * (var(--segment-duration-ms) / var(--lane-scroll-duration-ms)))`
  - `--translate-y-from: -100%` (relative to element height, positions bottom edge at top of container)
  - `--translate-y-to: calc(100% * var(--lane-scroll-duration-ms) / var(--segment-duration-ms))` (moves top edge to bottom of container)

### 4. `src/features/piano/components/piano-stage/piano-stage.tsx`

- **[MODIFY]** Inject `--start-unit` and `--end-unit` as CSS variables into the `<footer>` element's style.

### 5. `src/features/piano/components/piano-stage/piano-stage.module.css`

- **[MODIFY]** Implement dynamic aspect ratio for `.footer`:
  ```css
  aspect-ratio: calc(var(--end-unit) - var(--start-unit)) / 15;
  min-height: 3rem;
  max-height: 40dvh;
  ```

### 6. `src/features/drum/components/drum-stage.tsx`

- **[MODIFY]** Set footer height back to `h-[var(--footer-height)]` to ensure it has a fixed size in the `auto` grid row.

## Verification Plan

1. Run `npm run lint:fix` and `npm run type-check`.
2. Start `npm run dev` and test songs with narrow vs. wide ranges.
3. Verify Highway animation remains perfectly synced with the piano.
4. Create PR via `gh pr create`.
