# Surgical Orientation Purge Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate all orientation-based responsive design logic (`landscape`) in favor of future width/height-based logic.

**Architecture:** This is a cleanup task. We will surgically remove all `@media (orientation: landscape)` blocks from CSS/Module CSS files and all `landscape:` Tailwind prefixes from TSX files.

**Tech Stack:** Next.js, Tailwind CSS, CSS Modules.

---

## Design

**Status:** Approved

### Context

The current codebase uses `@media (orientation: landscape)` and Tailwind's `landscape:` prefix to handle limited vertical space. This approach is being retired to provide more granular control over specific viewport dimensions (width/height) without relying on device orientation, which can affect desktop monitors unexpectedly.

### Proposed Changes

#### 1. Global Variables Purge

- **File:** `src/styles/variables.css`
- **Action:** Remove the entire `@media (orientation: landscape)` block.
- **Action:** Remove the combined `@media (max-height: 500px) and (orientation: landscape)` block.
- **Result:** Global layout constants will only scale based on `min-width` or `max-height` (if applicable), but never orientation.

#### 2. Tailwind Utility Purge

- **Scope:** All `.tsx` files in `src/app` and `src/components`.
- **Action:** Remove all instances of the `landscape:` prefix and its associated value from `className` strings.
- **Example:** `px-6 py-4 landscape:py-2` becomes `px-6 py-4`.

#### 3. CSS Modules Purge

- **Scope:** All `*.module.css` files.
- **Action:** Remove all `@media (orientation: landscape)` blocks and any selectors within them.

### Success Criteria

1. No occurrences of the string `landscape` remain in CSS files (`.css`, `.module.css`) except where it might be part of a non-orientation-related word.
2. No occurrences of `landscape:` prefix remain in `.tsx` files.
3. The application builds successfully without CSS compilation errors.

### Future Considerations

- UI/Layout "patches" will be implemented in subsequent branches using `max-height` or `max-width` media queries to address specific breakage on small screens.

---

## Tasks

### Task 1: Clean Up Global Variables

**Files:**

- Modify: `src/styles/variables.css`

**Step 1: Remove orientation-based media queries**

Remove:

```css
@media (orientation: landscape) {
  :root {
    --header-py: 0.5rem;
    --footer-py: 0.5rem;
    --h1-size: 1.5rem;
    --btn-py: 0.5rem;
    --btn-px: 1rem;
    --btn-text: 0.75rem;
    --layout-gap: 0.5rem;
  }
}

@media (max-height: 500px) and (orientation: landscape) {
  :root {
    --header-height: 3rem;
    --footer-height: 70px;
  }
}
```

**Step 2: Verify changes**

Run: `grep "landscape" src/styles/variables.css`
Expected: No output.

**Step 3: Commit**

```bash
git add src/styles/variables.css
git commit -m "style: remove orientation-based global variables"
```

---

### Task 2: Clean Up CSS Modules

**Files:**

- Modify: `src/components/button/button.module.css`
- Modify: `src/components/page-footer/page-footer.module.css`
- Modify: `src/app/play/page.module.css`
- Modify: `src/components/page-layout/page-layout.module.css`
- Modify: `src/components/page-header/page-header.module.css`
- Modify: `src/components/lane-stage/background-lane.module.css`
- Modify: `src/components/lane-stage/track-lane.module.css`
- Modify: `src/components/piano-keyboard/piano-grid.module.css`
- Modify: `src/components/piano-keyboard/piano-keyboard.module.css`

**Step 1: Remove `@media (orientation: landscape)` from all listed files**

For each file, find and delete the entire orientation-based media query block.

**Step 2: Verify changes**

Run: `grep -r "orientation: landscape" src/`
Expected: No output in `.module.css` files.

**Step 3: Commit**

```bash
git add src/**/*.module.css
git commit -m "style: remove orientation-based media queries from CSS modules"
```

---

### Task 3: Clean Up Tailwind Utilities in Pages

**Files:**

- Modify: `src/app/page.tsx`
- Modify: `src/app/gear/page.tsx`
- Modify: `src/app/score/page.tsx`
- Modify: `src/app/collection/page.tsx`
- Modify: `src/app/options/page.tsx`
- Modify: `src/app/pause/page.tsx`

**Step 1: Remove `landscape:` prefixes from TSX files**

Example: `px-6 py-4 landscape:py-2` -> `px-6 py-4`
Example: `grid-cols-1 landscape:grid-cols-2` -> `grid-cols-1`

**Step 2: Verify changes**

Run: `grep -r "landscape:" src/app`
Expected: No output.

**Step 3: Commit**

```bash
git add src/app/*.tsx
git commit -m "style: remove landscape tailwind utilities from pages"
```

---

### Task 4: Final Validation

**Step 1: Run full verification suite**

Run: `npm run lint && npm run type-check && npm test && npm run build`
Expected: All commands PASS.

**Step 2: Commit any final fixes if needed**

```bash
git add .
git commit -m "chore: final orientation purge verification"
```
