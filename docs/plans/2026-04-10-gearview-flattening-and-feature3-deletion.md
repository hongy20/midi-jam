# GearPageView Flattening & Feature3 Deletion Implementation Plan

**Goal:** Completely flatten the DOM in `GearPageView` by deleting the `Feature3` block and inlining its logic. This allows `justify-evenly` to act on the individual semantic elements (title, description, carousel) for better vertical spacing.

**Architecture:**

1. Abstract the MIDI device card into a new `GearCard` component (`src/app/gear/components/gear-card.tsx`) to keep the page JSX flat (as per `AGENTS.md` Rule 5).
2. Inline the `Carousel` and item mapping directly into `GearPageView`.
3. Support the same layout for both the "Empty State" and "Device Selection" states by allowing their constituents to be direct children of `main`.
4. Delete the unused `Feature3.tsx` block.

**Tech Stack:** React, Tailwind CSS, Lucide Icons, Shadcn-based Carousel/Card.

---

### Task 1: Create GearCard Component

**Files:**

- [NEW] `src/app/gear/components/gear-card.tsx`

**Step 1: Extract the card rendering logic from `Feature3.tsx` into `GearCard`**

- Should accept: `title`, `description`, `icon`, `badge`, `isSelected`, `onClick`.
- Use the 8-bit aesthetic (`retro` font, pixel borders).

### Task 2: Refactor GearPageView

**Files:**

- [MODIFY] `src/app/gear/components/gear-page.view.tsx`

**Step 1: Update imports (add `GearCard`, `Carousel` components, etc.)**
**Step 2: Remove `Feature3` usage**
**Step 3: Inline Title, Description, and Carousel logic directly into the `main` tag**
**Step 4: Ensure the conditional logic for `inputs.length === 0` renders the `GearEmptyState` elements (which are now a Fragment) as direct children of `main`**

### Task 3: Cleanup & Verification

**Files:**

- [DELETE] `src/components/ui/8bit/blocks/feature3.tsx`

**Step 1: Run verification suite**

- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run build`

**Step 2: Commit and push**
