# GearHeader Abstraction Implementation Plan

**Goal:** Abstract the Title and Description block into a reusable `GearHeader` component and unify the "Empty State" and "Gear Selection" headers.

**Architecture:**

1. Create `GearHeader` component in `src/app/gear/components/gear-header.tsx`.
2. Replace the inlined header in `GearPageView` and the `GearEmptyState` component with `GearHeader`.
3. Ensure the vertical spacing remains balanced within the `justify-evenly` container.

**Tech Stack:** React, Tailwind CSS.

---

### Task 1: Create GearHeader Component

**Files:**

- [NEW] `src/app/gear/components/gear-header.tsx`

**Step 1: Implement `GearHeader` with `title` and `description` props**

- Use the styling from the block at `gear-page.view.tsx:L40-L47`.

### Task 2: Update GearPageView

**Files:**

- [MODIFY] `src/app/gear/components/gear-page.view.tsx`

**Step 1: Import `GearHeader`**
**Step 2: Replace inlined header block (lines 40-47) with `<GearHeader ... />`**
**Step 3: Replace `GearEmptyState` call with `<GearHeader ... />` using empty state text**

### Task 4: Cleanup & Verification

**Files:**

- [DELETE] `src/app/gear/components/gear-empty-state.tsx`

**Step 1: Run verification suite**

- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run build`
