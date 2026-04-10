# Carousel Navigation Viewport Safety Plan

**Goal:** Prevent carousel navigation buttons from being pushed out of the viewport on small screens while maintaining the 8-bit aesthetic and usability.

**Problem:** The current `px-10` padding combined with negative absolute positioning (`-left-10`) on buttons causes the buttons to hit the edge of the screen or go off-screen on devices narrower than 400px.

**Proposed Solution:** On small screens (below `md`), move the navigation buttons to a centrally aligned row below the carousel content. On medium screens and above, maintain the side-positioned layout.

**Tech Stack:** React, Tailwind CSS.

---

### Task 1: Update Carousel Components for Flexibility

**Files:**
- [MODIFY] `src/components/ui/8bit/carousel.tsx`

**Step 1: Update `CarouselPrevious` and `CarouselNext` to allow overriding the positioning**
- Add support for custom positioning classes by making the default `absolute` and offset classes conditional or easily overridable.
- Ensure the `top-1/2` and `translate` logic only applies when in "side" mode.

### Task 2: Update GearPageView Layout

**Files:**
- [MODIFY] `src/app/gear/components/gear-page.view.tsx`

**Step 1: Adjust Carousel padding**
- Reduce mobile padding (e.g., `px-4` or `px-2`) to give more room to the cards.

**Step 2: Re-position Navigation Buttons**
- Wrap `CarouselPrevious` and `CarouselNext` in a container that displays them in a row below the content on mobile:
  ```tsx
  <div className="flex items-center justify-center gap-4 mt-6 md:block">
    <CarouselPrevious className="relative md:absolute md:-left-12 ..." />
    <CarouselNext className="relative md:absolute md:-right-12 ..." />
  </div>
  ```

### Task 3: Verification

- Run full verification suite.
- Manual check of mobile layout (simulated with standard widths).
