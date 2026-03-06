# CSS-Driven Black Key Distinction Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the piano keyboard and note rendering to use CSS variables as the single source of truth for black/white key distinction, removing reliance on `data-black` attributes and exported JS helper functions for rendering.

**Architecture:** 
- Use `--is-black: 1 | 0` in `piano-grid.module.css` for each note class.
- Derive `--note-span` and layout properties (`grid-row`, `z-index`, `background-color`) in CSS from `--is-black`.
- Remove `isBlack` property from `NoteSpan` and `midi-parser.ts`.
- Make `isBlackKey` private in `piano.ts`.

**Tech Stack:** 
- Next.js (App Router), Tailwind CSS v4, CSS Modules.

---

## Design Document

### 1. Overview
Refactor the piano keyboard and note rendering to use CSS variables as the single source of truth for black/white key distinction, removing reliance on `data-black` attributes and exported JS helper functions for rendering.

### 2. Goals
- Remove `data-black` and `data-white` from DOM elements.
- Stop exporting `isBlackKey` from `src/lib/device/piano.ts` (make it private).
- Use `piano-grid.module.css` as the source of truth for key properties.
- Simplify accessibility and display labels in `PianoKeyboard.tsx`.

### 3. Architecture

#### Source of Truth: `piano-grid.module.css`
- Each note class (`.note-21` through `.note-108`) will define a `--is-black` variable:
    - `0` for white keys.
    - `1` for black keys.
- The `.noteBase` class will derive `--note-span` using `calc(3 - var(--is-black))`.
- This ensures that any element with a `note-N` class automatically "knows" if it's black or white.

#### Styling Logic
- **Layout:**
    - `grid-row: 1 / calc(3 - var(--is-black));` (White: 1/3, Black: 1/2).
    - `z-index: var(--is-black);` (Black keys on top).
- **Aesthetics:**
    - Use `color-mix(in srgb, var(--white-color), var(--black-color) calc(var(--is-black) * 100%))` for background colors.
    - Derive `border-radius` and `box-shadow` from `--is-black` using `calc`.
- **Glow Effects:**
    - Use `--glow-color` derived from `color-mix` based on `--is-black`.

#### JS Data Flow
- **`NoteSpan` Interface:** Remove `isBlack` property.
- **`midi-parser.ts`:** Stop tagging notes with `isBlack`.
- **Components:**
    - `PianoKeyboard.tsx`: Remove `isBlackKey` import and `data-black`. Use simple `note === 60` for the "C4" label.
    - `BackgroundLane.tsx`: Remove `data-black`.
    - `TrackLane.tsx`: Remove `.black`/`.white` classes.
- **`piano.ts`:** Keep `isBlackKey` as a private helper for `getNoteUnits` and `getVisibleMidiRange`, but do not export it.

---

## Implementation Tasks

### Task 1: Update `piano-grid.module.css` with `--is-black`

**Files:**
- Modify: `src/components/piano-keyboard/piano-grid.module.css`

**Step 1: Add `--is-black` and derive `--note-span`**
- Update `.noteBase` to use `calc` for `--note-span`.
- Update each note class (`.note-21` to `.note-108`) to include `--is-black: 0;` (white) or `--is-black: 1;` (black).
- Remove existing `--note-span` from individual note classes.

**Step 2: Verify with a test**
- Run: `npm run lint`

**Step 3: Commit**
```bash
git add src/components/piano-keyboard/piano-grid.module.css
git commit -m "feat: add --is-black and derive --note-span in piano-grid.module.css"
```

---

### Task 2: Refactor `piano-keyboard.module.css`

**Files:**
- Modify: `src/components/piano-keyboard/piano-keyboard.module.css`

**Step 1: Replace `data-black` selectors with CSS variable logic**
- Update `.key` to use `--is-black` for `grid-row`, `z-index`, `border-radius`, and `background-color`.
- Use `color-mix` for colors based on `--is-black`.
- Remove `[data-black="true"]` and `[data-black="false"]` selectors.

**Step 2: Commit**
```bash
git add src/components/piano-keyboard/piano-keyboard.module.css
git commit -m "refactor: use CSS variables for key styling in piano-keyboard.module.css"
```

---

### Task 3: Refactor `background-lane.module.css` and `track-lane.module.css`

**Files:**
- Modify: `src/components/lane-stage/background-lane.module.css`
- Modify: `src/components/lane-stage/track-lane.module.css`

**Step 1: Update `background-lane.module.css`**
- Remove `[data-black]` selectors.
- Use `--is-black` and `color-mix` for background colors.

**Step 2: Update `track-lane.module.css`**
- Remove `.white` and `.black` classes.
- Use `--is-black` and `color-mix` for background colors in `.note`.

**Step 3: Commit**
```bash
git add src/components/lane-stage/background-lane.module.css src/components/lane-stage/track-lane.module.css
git commit -m "refactor: remove data-black usage in lane CSS modules"
```

---

### Task 4: Clean up `NoteSpan` and `midi-parser.ts`

**Files:**
- Modify: `src/lib/midi/midi-parser.ts`
- Modify: `src/lib/midi/midi-parser.test.ts` (if needed)

**Step 1: Remove `isBlack` from `NoteSpan` interface**
**Step 2: Remove `isBlack` assignment in `getNoteSpans`**
**Step 3: Commit**
```bash
git add src/lib/midi/midi-parser.ts
git commit -m "refactor: remove isBlack from NoteSpan and midi-parser"
```

---

### Task 5: Clean up React Components

**Files:**
- Modify: `src/components/piano-keyboard/PianoKeyboard.tsx`
- Modify: `src/components/lane-stage/background-lane.tsx`
- Modify: `src/components/lane-stage/track-lane.tsx`

**Step 1: Update `PianoKeyboard.tsx`**
- Remove `isBlackKey` import.
- Remove `isBlack` constant and `data-black` attribute.
- Simplify `aria-label`.
- Update `C4` label check to `note === 60`.

**Step 2: Update `background-lane.tsx`**
- Remove `isBlackKey` import and `data-black` attribute.

**Step 3: Update `track-lane.tsx`**
- Remove `.black`/`.white` class logic.

**Step 4: Commit**
```bash
git add src/components/piano-keyboard/PianoKeyboard.tsx src/components/lane-stage/background-lane.tsx src/components/lane-stage/track-lane.tsx
git commit -m "refactor: remove isBlackKey usage and data-black in components"
```

---

### Task 6: Make `isBlackKey` private in `piano.ts`

**Files:**
- Modify: `src/lib/device/piano.ts`

**Step 1: Remove `export` from `isBlackKey`**
**Step 2: Verify tests**
- Run: `npm test`
- Run: `npm run type-check`

**Step 3: Commit**
```bash
git add src/lib/device/piano.ts
git commit -m "refactor: make isBlackKey private in piano.ts"
```

---

### Task 7: Final Validation

- Run: `npm run lint`
- Run: `npm run type-check`
- Run: `npm test`
- Run: `npm run build`

**Step 1: Commit final changes if any**
```bash
git commit -m "chore: final verification for CSS-driven black keys"
```
