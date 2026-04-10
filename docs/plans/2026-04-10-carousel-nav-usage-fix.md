# Carousel Navigation Position Override (Usage-Only) Plan

**Goal:** Fix the viewport safety issue for carousel navigation by only adjusting classes in `GearPageView`, without modifying the base `Carousel` component.

**Proposed Approach: Inside-Positioning on Mobile**
On small screens, keep the buttons on the sides but move them **inside** the carousel padding instead of outside. This avoids them being pushed off-screen.

**Architecture:**
1. Increase horizontal padding on mobile to `px-12` (or similar) to create a "safe zone".
2. Override the button positioning with `!left-2` and `!right-2` on mobile to bring them inside the safe zone.

**Tech Stack:** Tailwind CSS.

---

### Task 1: Adjust GearPageView Usage

**Files:**
- [MODIFY] `src/app/gear/components/gear-page.view.tsx`

**Step 1: Update Carousel padding**
- Use `px-12` consistently or adjust for mobile: `px-12 md:px-12`.

**Step 2: Override button positions**
- Apply `!left-2 md:-left-12` to `CarouselPrevious`.
- Apply `!right-2 md:-right-12` to `CarouselNext`.
- Use `!absolute` to ensure the override sticks if needed (though it's already absolute).

### Task 2: Verification

- Run full verification suite.
- Manual check of mobile layout safety.
