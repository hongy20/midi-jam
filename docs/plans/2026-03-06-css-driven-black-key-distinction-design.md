# Design: CSS-Driven Black Key Distinction

Refactor the piano keyboard and note rendering to use CSS variables as the single source of truth for black/white key distinction, removing reliance on `data-black` attributes and exported JS helper functions for rendering.

## Goals
- Remove `data-black` and `data-white` from DOM elements.
- Stop exporting `isBlackKey` from `src/lib/device/piano.ts` (make it private).
- Use `piano-grid.module.css` as the source of truth for key properties.
- Simplify accessibility and display labels in `PianoKeyboard.tsx`.

## Architecture

### 1. Source of Truth: `piano-grid.module.css`
- Each note class (`.note-21` through `.note-108`) will define a `--is-black` variable:
    - `0` for white keys.
    - `1` for black keys.
- The `.noteBase` class will derive `--note-span` using `calc(3 - var(--is-black))`.
- This ensures that any element with a `note-N` class automatically "knows" if it's black or white.

### 2. Styling Logic
- **Layout:**
    - `grid-row: 1 / calc(3 - var(--is-black));` (White: 1/3, Black: 1/2).
    - `z-index: var(--is-black);` (Black keys on top).
- **Aesthetics:**
    - Use `color-mix(in srgb, var(--white-color), var(--black-color) calc(var(--is-black) * 100%))` for background colors.
    - Derive `border-radius` and `box-shadow` from `--is-black` using `calc`.
- **Glow Effects:**
    - Use `--glow-color` derived from `color-mix` based on `--is-black`.

### 3. JS Data Flow
- **`NoteSpan` Interface:** Remove `isBlack` property.
- **`midi-parser.ts`:** Stop tagging notes with `isBlack`.
- **Components:**
    - `PianoKeyboard.tsx`: Remove `isBlackKey` import and `data-black`. Use simple `note === 60` for the "C4" label.
    - `BackgroundLane.tsx`: Remove `data-black`.
    - `TrackLane.tsx`: Remove `.black`/`.white` classes.
- **`piano.ts`:** Keep `isBlackKey` as a private helper for `getNoteUnits` and `getVisibleMidiRange`, but do not export it.

## Success Criteria
- [ ] No `data-black` attributes in the rendered DOM.
- [ ] `isBlackKey` is not exported from `src/lib/device/piano.ts`.
- [ ] Piano keyboard and lanes still render correctly with identical visuals.
- [ ] `npm test` passes.
- [ ] Accessibility labels (ARIA) are simplified but still descriptive.
