# Carousel Viewport Safety (Outer Gutter) Implementation Plan

**Goal:** Ensure carousel navigation buttons are always visible by moving the "safe zone" padding from the Carousel's *internal* padding to an *external* wrapper or margin.

**Root Cause Analysis:**
- The previous fix used `px-12` (internal padding) on the `Carousel` component.
- The `CarouselPrevious/Next` buttons are positioned absolutely relative to the `Carousel` root edges.
- Since the `Carousel` root was `w-full` (occupying the full width allowed by the parent `main`), its edges were too close to the screen boundary (only 16px from the edge due to `main`'s `p-4`).
- Positioning buttons at `-40px` (mobile) or `-56px` (desktop) relative to those edges pushed them off-screen.

**Proposed Solution:**
Wrap the `Carousel` in a "Safe Zone" container that handles the horizontal padding. This moves the `Carousel`'s root edges away from the viewport boundaries, giving the absolute-positioned buttons safe room to "hang" without going off-screen.

**Tech Stack:** React, Tailwind CSS.

---

### Task 1: Refactor GearPageView Layout

**Files:**
- [MODIFY] `src/app/gear/components/gear-page.view.tsx`

**Step 1: Wrap the Carousel in a gutter div**
- Wrap `Carousel`, `CarouselContent`, `CarouselPrevious`, and `CarouselNext` in a `div` with `w-full px-12 md:px-16`.
- Remove the conflicting padding from the `Carousel` component itself (`px-12 md:px-16` becomes `px-0` or is removed).
- This ensures the `Carousel` container's width is correctly restricted by the safety padding, moving its "relative" anchor point for the buttons inward.

### Task 2: Verification

- Run full verification suite.
- Manual check on mobile simulation, especially at the `768px` (md) boundary.
