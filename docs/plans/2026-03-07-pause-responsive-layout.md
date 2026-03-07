# Plan: Pause Page Responsive Refactor

This plan outlines the refactor of the Pause page to improve its responsiveness on different viewports, especially narrow-height landscape views.

## 1. Objectives
- **Responsive Layout**: Default to a vertical button stack for portrait/tall viewports.
- **Adaptive Grid**: Switch to a horizontal 3-column grid for narrow-height viewports (e.g., landscape mobile) to maximize usable space.
- **UI Architecture**: Extract layout logic into a dedicated CSS module (`page.module.css`).
- **Coding Standards**: Ensure consistent button sizing and spacing across orientations.

## 2. Refactoring Details

### A. CSS Module Implementation
Create `src/app/pause/page.module.css` with:
- `.actions`: Default `flex flex-col` layout.
- Media query: `@media (min-width: 640px) and (max-height: 600px)` to switch to `grid-template-columns: repeat(3, 1fr)`.

### B. Component Update
- Import and apply `styles.actions`.
- Remove hardcoded grid classes from the JSX.
- Normalize button padding by removing orientation-specific overrides like `sm:py-8`.

## 3. Verification Plan
- [ ] Verify `npm run lint` passes.
- [ ] Verify `npm run type-check` passes.
- [ ] Manual check: Buttons are stacked vertically in portrait.
- [ ] Manual check: Buttons switch to 3-column grid in landscape mobile (e.g., 844x390).
