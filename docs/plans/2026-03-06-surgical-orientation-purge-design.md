# Design: Surgical Orientation Purge

**Date:** 2026-03-06  
**Status:** Approved  
**Goal:** Eliminate all orientation-based responsive design logic (`landscape`) in favor of future width/height-based logic.

## Context
The current codebase uses `@media (orientation: landscape)` and Tailwind's `landscape:` prefix to handle limited vertical space. This approach is being retired to provide more granular control over specific viewport dimensions (width/height) without relying on device orientation, which can affect desktop monitors unexpectedly.

## Proposed Changes

### 1. Global Variables Purge
- **File:** `src/styles/variables.css`
- **Action:** Remove the entire `@media (orientation: landscape)` block (lines 32-41).
- **Action:** Remove the combined `@media (max-height: 500px) and (orientation: landscape)` block (lines 50-53).
- **Result:** Global layout constants will only scale based on `min-width` or `max-height` (if applicable), but never orientation.

### 2. Tailwind Utility Purge
- **Scope:** All `.tsx` files in `src/app` and `src/components`.
- **Action:** Remove all instances of the `landscape:` prefix and its associated value from `className` strings.
- **Example:** `px-6 py-4 landscape:py-2` becomes `px-6 py-4`.

### 3. CSS Modules Purge
- **Scope:** All `*.module.css` files.
- **Action:** Remove all `@media (orientation: landscape)` blocks and any selectors within them.
- **Example:**
  ```css
  @media (orientation: landscape) {
    .container { padding: 1rem; }
  }
  ```
  This entire block will be deleted.

## Success Criteria
1. No occurrences of the string `landscape` remain in CSS files (`.css`, `.module.css`) except where it might be part of a non-orientation-related word (none identified).
2. No occurrences of `landscape:` prefix remain in `.tsx` files.
3. The application builds successfully without CSS compilation errors.

## Future Considerations
- UI/Layout "patches" will be implemented in subsequent branches using `max-height` or `max-width` media queries to address specific breakage on small screens.
