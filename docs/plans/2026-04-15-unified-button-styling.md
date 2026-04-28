# Unified Button Styling (Approach B: Grid Equalizer)

**Date:** April 15, 2026
**Topic:** Unified Button Styling & Responsiveness
**Goal:** Create a consistent button experience across all Midi Jam themes and layouts using a "Grid Equalizer" approach. This ensures all buttons in an action group have the same width (matching the longest label) while scaling responsively and hiding icons on mobile.

---

## Architecture & Design

### 1. CSS Utilities (Mobile-First)

The project uses two primary utility classes defined in `src/styles/base.css` to manage button layouts:

#### `.jam-action-group`

A container utility that equalizes button widths within a group using CSS Grid.

```css
.jam-action-group {
  @apply mx-auto grid w-full max-w-fit grid-cols-1 gap-4;
  @media (min-width: 500px) {
    @apply auto-cols-fr grid-flow-col;
  }
}
```

#### `.btn-jam`

A unified button class that handles scaling and icon visibility.

- **Mobile Default:** Vertical stack (one column), full width (`min-w-48`), icons hidden on small viewports.
- **Tablet/Desktop:** Horizontal row, auto-equalized width, icons shown with margin.
- **Icon Position:** Always on the **Left**.

### 2. Integration Standards

- Apply `.btn-jam` to all navigational and primary action buttons.
- Wrap button groups in `.jam-action-group`.
- **Theme Support:** Automatically inherits theme variables from the `Button` primitive.

---

## Implementation Tasks

### Task 1: Update CSS Utilities

**Files:** `src/styles/base.css`

- Refactor `.btn-jam` and add `.jam-action-group`.
- [x] Completed

### Task 2: Update Home Page (Hero3)

**Files:** `src/components/ui/8bit/blocks/hero3.tsx`

- Update actions container to use `.jam-action-group`.
- [x] Completed

### Task 3: Update Gear Page

**Files:** `src/app/gear/components/gear-page.view.tsx`

- Update footer container and apply `.btn-jam`.
- [x] Completed

### Task 4: Update Collection Page

**Files:** `src/app/collection/components/collection-page.view.tsx`

- Update footer container and apply `.btn-jam`.
- [x] Completed

### Task 5: Update Score Page

**Files:** `src/app/score/components/score-page.view.tsx`

- Update footer container and apply `.btn-jam`.
- [x] Completed

### Task 6: Update Pause Menu Block

**Files:** `src/components/ui/8bit/blocks/pause-menu.tsx`

- Ensure Pause Menu buttons have equal width via vertical grid.
- [x] Completed

### Task 7: Final Validation

- [x] Run full suite: `npm run lint && npm run type-check && npm test && npm run build`
- [x] Finalize PR

---

## Verification Plan

### Manual Verification

- **Visual Check:** Verify button width and icon visibility at various breakpoints (320px, 768px, 1024px+).
- **Theme Check:** Ensure buttons look correct in both Light and Dark modes, and across different retro themes.
- **Regression Check:** Ensure no existing layouts are broken by the change to fixed/equalized widths.
