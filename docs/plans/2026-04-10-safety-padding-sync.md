# Safety Padding Synchronization Implementation Plan

**Goal:** Ensure carousel navigation buttons are always visible by synchronizing the container's horizontal padding with the button offsets across all breakpoints.

**Analysis:**
- `CarouselPrevious/Next` use:
    - Mobile: `-left-10` / `-right-10` (40px offset)
    - Desktop (`md`+): `-left-14` / `-right-14` (56px offset)
- To keep the buttons on-screen with an 8px safety margin, we need:
    - Mobile: `px-12` padding (48px - 40px = 8px margin)
    - Desktop: `px-16` padding (64px - 56px = 8px margin)

**Proposed Solution:** Use `w-full` but with "Sync Padding" that always exceeds the absolute button offsets by a safe margin. This is more robust than `calc` because it survives breakpoint transitions where the button offsets change.

**Tech Stack:** Tailwind CSS.

---

### Task 1: Update GearPageView Carousel Padding

**Files:**
- [MODIFY] `src/app/gear/components/gear-page.view.tsx`

**Step 1: Apply Sync Padding**
- Change: `className="mx-auto w-full max-w-4xl px-12 md:px-16"`
- This replaces the previous `calc` and `px-10/12` logic.

### Task 2: Verification

- Run full verification suite.
- Manual check of breakpoints `320px` (min-mobile), `640px` (`sm`), `768px` (`md` transition), and `1024px` (`lg`).
- Verify that buttons maintain a consistent gap from the viewport edge.
