# Design Doc: Unified Button Styling & Responsiveness

**Date:** April 15, 2026
**Topic:** Unified Button Styling & Responsiveness
**Goal:** Create a consistent button experience across all Midi Jam themes and layouts without modifying the underlying 8bitcn/shadcn source code.

---

### Section 1: CSS Architecture (Mobile-First)

The `.btn-jam` utility will be defined in `src/styles/base.css` or `src/app/globals.css` as a global Tailwind `@layer components` rule. This ensures it's available to all components and respects the project's theme variables.

**The Rule:**
```css
/* src/styles/base.css or globals.css */
@layer components {
  .btn-jam {
    /* 1. Mobile Default (Compact) */
    @apply w-28 px-2 py-1 flex items-center justify-center transition-all;
    
    /* Icons are hidden by default on small mobile */
    & svg {
      @apply hidden;
    }

    /* 2. Tablet / Small Desktop (Medium) */
    @media (min-width: 768px) {
      @apply w-40 px-3 py-1.5;
      
      /* Show icons and add margin for text */
      & svg {
        @apply block mr-2;
      }
    }

    /* 3. Large Desktop (Standard) */
    @media (min-width: 1024px) {
      @apply w-48 px-4 py-2;
    }
  }
}
```

---

### Section 2: Component Integration

We will apply the `.btn-jam` class to all navigational and primary action buttons. 

**Standard Rules:**
*   **Icon Position:** Always on the **Left**.
*   **Width:** `w-48` (Desktop), `w-40` (Tablet), `w-28` (Mobile).
*   **Icons:** Hidden on mobile (`max-sm`).
*   **Theme Support:** Automatically inherits theme variables from the 8bitcn `Button` component.

---

### Section 3: Key Pages to Update

*   **Home/Welcome (`Hero3` / `HomePageView`)**
*   **Gear Setup (`GearView`)**
*   **Collection Browser (`CollectionView`)**
*   **Pause/Score Menus (`PauseView`, `ScoreView`)**

---

### Section 4: Testing & Validation

*   **Visual Check:** Verify button width and icon visibility at various breakpoints (320px, 768px, 1024px+).
*   **Theme Check:** Ensure buttons look correct in both Light and Dark modes, and across different retro themes.
*   **Regression Check:** Ensure no existing layouts are broken by the change to a fixed width.
