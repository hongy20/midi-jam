# Plan: Refactor Hit Zone Height to 1px

The goal is to increase the precision of note detection by shrinking the "hit" zone from 1% of the container height to exactly 1 pixel. This will be implemented for the `IntersectionObserver` used in demo playback and reflected in the visual debug layer.

## Phase 1: Research & Experimentation

- [ ] Investigate if `rootMargin: "-100% 0px 1px 0px"` reliably creates a 1px detection zone at the bottom of the container.
- [ ] Check if `IntersectionObserver` triggers correctly on a 1px boundary when elements have high-velocity animations.
- [ ] Evaluate the impact of this change on the visual alignment of notes and the piano keyboard.

## Phase 2: Implementation

- [ ] **Modify `use-demo-playback.ts`**:
  - Update the `IntersectionObserver` configuration.
  - Test if `rootMargin: "-100% 0px 1px 0px"` works.
- [ ] **Modify `lane-stage.tsx`**:
  - Update the debug hit zone `div` to have `height: 1px`.
  - Adjust its positioning to match the `IntersectionObserver's` new detection area.
- [ ] **Adjust CSS (if needed)**:
  - Ensure `.container` in `lane-segment.module.css` allows notes to slightly overflow or that the detection area is within bounds.

## Phase 3: Validation

- [ ] **Lint & Type Check**: `npm run lint` and `npm run type-check`.
- [ ] **Unit Tests**: `npm test` to ensure no regression in midi/playback logic.
- [ ] **Visual Verification**: Check debug indicators in a local dev environment (simulated via terminal logs if needed).

## Phase 4: Finalization

- [ ] Create Pull Request.
- [ ] Squash and Merge after approval.
