# Theme Inventory Grid Picker Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the existing vertical theme dropdown with a grid-based Dialog picker (Inventory Grid) to eliminate vertical overflow issues on mobile and improve the arcade aesthetic.

**Architecture:** A new pure-view component `ThemeInventoryGrid` will wrap `Dialog`. It will display themes in a responsive CSS Grid. The existing `SelectThemeDropdown` will be refactored to consume this new component.

**Tech Stack:** Next.js (App Router), Tailwind CSS v4, shadcn/ui, 8bitcn components.

**Design Details (from Brainstorming v7):**
- **Trigger Styling**: 
    - Replicate the `SelectTrigger` design with thick composite borders.
    - **Height Calibration**: Set inner height to `h-9` (36px) so that total height with `border-y-6` (+12px) equals exactly **48px**, matching the Difficulty selector.
    - **Interaction**: `active:translate-y-1`.
- **Items**: `h-12` rows with `shrink-0`.
- **Selection Logic**: `bg-foreground/20` highlight.
- **UX**: No close button, backdrop closes.

---

### Task 1: Isolation & Preparation (COMPLETED)

**Step 1: Create feature branch**
Run: `git checkout -b feature/theme-inventory-grid` (COMPLETED)

**Step 2: Commit initial plan** (COMPLETED)

---

### Task 2: Refine Theme Inventory List Component

**Files:**
- Modify: `src/app/options/components/theme-inventory-grid.tsx`

**Step 1: Pixel-Perfect Height Adjustment**
- Change inner `div` height from `h-10` to `h-9`.
- Verify total height is 48px.
- Ensure vertical centering of label and color square.

---

### Task 3: Refactor SelectThemeDropdown

**Files:**
- Modify: `src/app/options/components/select-theme-dropdown.tsx`

**Step 1: Replace Select with ThemeInventoryGrid**
Import the new component and replace the `<Select>` block with `<ThemeInventoryGrid>`. 

**Step 2: Clean up unused imports**
Remove the now-unused Select components.

---

### Task 4: Verification & Cleanup

**Step 1: Storybook Review**
Verify the picker in the "App/Options/View" story at 320px width.

**Step 2: Final Verification**
- `npm run lint`
- `npm run type-check`

**Step 3: Commit and PR**
- `git add . && git commit -m "feat: replace theme dropdown with grid dialog picker"`
- `gh pr create --fill`
