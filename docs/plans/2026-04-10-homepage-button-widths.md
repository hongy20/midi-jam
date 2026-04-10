# Homepage Button Widths Implementation Plan

**Goal:** Make "START GAME" and "Options" buttons in the homepage have the same width for visual consistency.

**Architecture:** Update `Hero3` component to support custom classes for actions, then apply a fixed width class to both buttons in `HomePageView`.

**Tech Stack:** React, Tailwind CSS.

---

### Task 1: Update Hero3 Component

**Files:**
- Modify: `src/components/ui/8bit/blocks/hero3.tsx`

**Step 1: Add `className` to `HeroAction` interface**
**Step 2: Pass `className` to `Button` components in `Hero3`**

### Task 2: Update HomePageView

**Files:**
- Modify: `src/app/home/components/home-page.view.tsx`

**Step 1: Add `w-40` class to both actions in `actions` array**

### Task 3: Verification

- Run `npm run lint`
- Run `npm run type-check`
- Manual check of UI (if browser tool available)
