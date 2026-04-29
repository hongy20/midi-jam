# Stage Grid Layout Fixes

## Goal

To properly apply `--header-height` and `--footer-height` CSS variables to the main `PlayPageView` grid, ensuring consistent layout sizing across `PianoStage` and `DrumStage`, and preventing footer elements from overflowing the viewport.

## Architecture Update

We will introduce `--main-height: calc(100dvh - var(--header-height) - var(--footer-height));` in the root `play-page.view.module.css`. This fully decouples the feature components (`PianoStage`, `DrumStage`, `Highway`) from `--header-height` and `--footer-height`. The parent grid dictates the track sizes, feature components fill the tracks (`h-full`), and Highway uses `--main-height` for its mathematical transforms.

## Proposed Changes

### 1. `src/app/play/components/play-page.view.module.css`

- **[MODIFY]** Define `--main-height` in both base `:root` and the media query.

### 2. `src/app/play/components/play-page.view.tsx`

- **[MODIFY]** Update grid container to `grid-rows-[var(--header-height)_1fr_var(--footer-height)]`.
- **[MODIFY]** Remove `py-4` from `<header>` to allow vertical centering within the row track.

### 3. `src/features/highway/components/highway-segment.module.css`

- **[MODIFY]** Remove local `--container-height` calculation.
- **[MODIFY]** Use `var(--main-height)` directly for `translateY` and height math.

### 4. `src/features/piano/components/piano-stage/piano-stage.module.css`

- **[MODIFY]** Change `.footer` height from `var(--footer-height)` to `100%`.

### 5. `src/features/drum/components/drum-stage.tsx`

- **[MODIFY]** Map `<main>` to `row-start-2` and `<footer>` to `row-start-3`. Change footer height to `h-full`.

## Verification Plan

1. Run `npm run lint:fix` and `npm run type-check`.
2. Start `npm run dev` and verify locally.
3. Commit changes and push branch `fix/stage-grid-layout`.
4. Create PR via `gh pr create`.
