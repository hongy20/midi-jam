# Robust Carousel Viewport Safety Plan

**Goal:** Provide a robust, non-arbitrary way to ensure carousel navigation buttons stay within the viewport on all screen sizes.

**Proposed Solution: The "Safe Gutter" Approach**
Instead of using a fixed width like `w-80`, we use a percentage-based width or a viewport-relative `calc` to ensure the carousel always leaves enough space for the side buttons.

**Architecture:**
1. Use `w-[calc(100%-8rem)]` (or similar) on the `Carousel` root on mobile. This explicitly reserves `4rem` (64px) on each side for the navigation buttons and a small safety margin.
2. Maintain `mx-auto` to center the carousel.
3. On larger screens (`md`), reset to `w-full` and use the existing `max-w-4xl`.

**Tech Stack:** Tailwind CSS.

---

### Task 1: Refine GearPageView Carousel Width

**Files:**
- [MODIFY] `src/app/gear/components/gear-page.view.tsx`

**Step 1: Replace `w-80` with a robust responsive width**
- Change: `className="mx-auto w-[calc(100% - 6rem)] md:w-full max-w-4xl px-10 sm:px-12"`
- Note: `6rem` (96px) ensures that even with buttons positioned at `-left-10` (40px), they remain well within the viewport.

### Task 2: Verification

- Run full verification suite.
- Manual check on simulated mobile widths (320px, 375px).
