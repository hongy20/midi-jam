# Stage Grid Layout Fixes

## Goal
To properly apply `--header-height` and `--footer-height` CSS variables to the main `PlayPageView` grid, ensuring consistent layout sizing across `PianoStage` and `DrumStage`, and preventing footer elements from overflowing the viewport.

## Answers to Developer Questions
1. **Can Highway use `100%` instead of `calc(100dvh - ...)`?**
   *No.* CSS `transform: translateY(100%)` calculates percentages based on the element's *own* height, not the parent container's height. Since the Highway segments need to animate from `-selfHeight` to `+parentHeight` using hardware-accelerated transforms (required for 60fps), it must calculate the absolute container height using `calc(100dvh - var(--header-height) - var(--footer-height))`.
2. **Do feature components need to use the variables if the grid sizes the rows?**
   *Technically no, but practically yes.* Once `PlayPageView` sizes the 3rd row exactly to `--footer-height`, the feature's footer could simply use `height: 100%` (`h-full`). However, since the Highway component absolutely depends on these variables to calculate its animation path, the variables must remain defined globally. Using `h-[var(--footer-height)]` inside the feature components remains a safe and explicit pattern.

## Proposed Changes

### 1. `src/app/play/components/play-page.view.tsx`
- **[MODIFY]** Update the parent grid container from `grid-rows-[5rem_1fr]` to `grid-rows-[var(--header-height)_1fr_var(--footer-height)]`.
- **[MODIFY]** Remove the `py-4` utility class from the `<header>` element. The existing `items-center` class will perfectly vertically center the content within the strictly defined `--header-height` track.

### 2. `src/features/drum/components/drum-stage.tsx`
- **[MODIFY]** Add `row-start-2` to the `<main>` container so it maps to the middle grid track.
- **[MODIFY]** Add `row-start-3` to the `<footer>` container so it maps to the bottom grid track. 
- **[MODIFY]** Update the footer height to explicitly use `h-[var(--footer-height)]` (or keep the existing `h-(--footer-height,151px)` syntax to match standard Tailwind v4 behavior).

## Verification Plan
1. Run `npm run lint:fix` and `npm run type-check`.
2. Start `npm run dev` and verify locally.
3. Commit changes and push branch `fix/stage-grid-layout`.
4. Create PR via `gh pr create`.
