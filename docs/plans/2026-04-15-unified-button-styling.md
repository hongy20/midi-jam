# Unified Button Styling (Approach B: Grid Equalizer) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement Approach B (Grid Equalizer) to ensure all buttons in an action group have the same width (matching the longest label) while scaling responsively and hiding icons on mobile.

**Architecture:** 
1.  **CSS:** A global `.jam-action-group` utility using `display: grid` and `grid-auto-columns: 1fr` to equalize widths.
2.  **CSS:** Updated `.btn-jam` to be `w-full` within its grid cell, with mobile-first scaling.
3.  **UI:** Update all button containers (footers/blocks) to use `.jam-action-group`.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4.

---

### Task 1: Update CSS Utilities

**Files:**
- Modify: `src/styles/base.css`

**Step 1: Refactor `.btn-jam` and add `.jam-action-group`**

```css
/* src/styles/base.css */
@layer components {
  /* Container to equalize button widths in a group */
  .jam-action-group {
    @apply grid grid-flow-col auto-cols-fr gap-3 w-full max-w-fit mx-auto;
    @media (min-width: 768px) {
      @apply gap-4;
    }
  }

  .btn-jam {
    /* 1. Mobile Default (Flexible Width within Grid) */
    @apply w-full min-w-24 px-2 py-1 flex items-center justify-center transition-all;
    
    /* Icons are hidden by default on small mobile */
    svg {
      @apply hidden;
    }

    /* 2. Tablet / Small Desktop (Medium) */
    @media (min-width: 768px) {
      @apply min-w-32 px-3 py-1.5;
      
      /* Show icons and add margin for text */
      svg {
        @apply block mr-2;
      }
    }

    /* 3. Large Desktop (Standard) */
    @media (min-width: 1024px) {
      @apply min-w-40 px-4 py-2;
    }
  }
}
```

**Step 2: Commit**

```bash
git add src/styles/base.css
git commit -m "feat: add .jam-action-group and refactor .btn-jam for width equalization"
```

---

### Task 2: Update Home Page (Hero3)

**Files:**
- Modify: `src/components/ui/8bit/blocks/hero3.tsx`

**Step 1: Update the actions container to use `.jam-action-group`**

```tsx
/* src/components/ui/8bit/blocks/hero3.tsx */
/* Find the actions container div and replace its classes */
<div className="jam-action-group">
  {/* ... actions.map ... */}
</div>
```

**Step 2: Commit**

```bash
git add src/components/ui/8bit/blocks/hero3.tsx
git commit -m "refactor: use .jam-action-group in Hero3 block"
```

---

### Task 3: Update Gear Page

**Files:**
- Modify: `src/app/gear/components/gear-page.view.tsx`

**Step 1: Update the footer container**

```tsx
/* src/app/gear/components/gear-page.view.tsx */
<div className="jam-action-group shrink-0">
  <Button ... className="btn-jam">...</Button>
  <Button ... className="btn-jam">...</Button>
</div>
```

**Step 2: Commit**

```bash
git add src/app/gear/components/gear-page.view.tsx
git commit -m "refactor: use .jam-action-group in Gear page footer"
```

---

### Task 4: Update Collection Page

**Files:**
- Modify: `src/app/collection/components/collection-page.view.tsx`

**Step 1: Update the footer container**

```tsx
/* src/app/collection/components/collection-page.view.tsx */
<div className="jam-action-group shrink-0">
  <Button ... className="btn-jam">...</Button>
  <Button ... className="btn-jam">...</Button>
  <Button ... className="btn-jam">...</Button>
</div>
```

**Step 2: Commit**

```bash
git add src/app/collection/components/collection-page.view.tsx
git commit -m "refactor: use .jam-action-group in Collection page footer"
```

---

### Task 5: Update Score Page

**Files:**
- Modify: `src/app/score/components/score-page.view.tsx`

**Step 1: Update the footer container**

```tsx
/* src/app/score/components/score-page.view.tsx */
<footer className="jam-action-group shrink-0 px-4 sm:px-0">
  <Button ... className="btn-jam">...</Button>
  <Button ... className="btn-jam">...</Button>
  <Button ... className="btn-jam">...</Button>
</footer>
```

**Step 2: Commit**

```bash
git add src/app/score/components/score-page.view.tsx
git commit -m "refactor: use .jam-action-group in Score page footer"
```

---

### Task 6: Update Pause Menu Block

**Files:**
- Modify: `src/components/ui/8bit/blocks/pause-menu.tsx`

**Step 1: Update the menu items container to use `.jam-action-group` but keep vertical layout if preferred**
Actually, `PauseMenu` buttons are stacked vertically. To keep them equal width while stacked, we can use `flex flex-col` (default) but the grid equalizer works best for *horizontal* rows. For a vertical list, `w-full` on buttons inside a fixed-width container already equalizes them.

However, to stay consistent with Approach B, I'll update the `PauseMenu` to use a single-column grid.

```tsx
/* src/components/ui/8bit/blocks/pause-menu.tsx */
<div
  className={cn(
    "grid grid-cols-1 gap-4 w-full", // Equalizes width in vertical stack
    "[@media(max-height:450px)]:grid-cols-2 [@media(max-height:450px)]:grid-rows-2 [@media(max-height:450px)]:gap-6 [@media(max-height:450px)]:p-2",
  )}
>
  {/* ... items.map ... */}
</div>
```

**Step 2: Commit**

```bash
git add src/components/ui/8bit/blocks/pause-menu.tsx
git commit -m "refactor: ensure Pause Menu buttons have equal width"
```

---

### Task 7: Final Validation

**Step 1: Run full suite**
Run: `npm run lint && npm run type-check && npm test && npm run build`

**Step 2: Final Commit & PR Update**
```bash
git add .
git commit -m "chore: finalize unified button styling with Grid Equalizer"
git push origin feature/unified-button-styling
```
