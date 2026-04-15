# Theme Inventory Grid Picker Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the existing vertical theme dropdown with a grid-based Dialog picker (Inventory Grid) to eliminate vertical overflow issues on mobile and improve the arcade aesthetic.

**Architecture:** A new pure-view component `ThemeInventoryGrid` will wrap `Dialog`. It will display themes in a responsive CSS Grid. The existing `SelectThemeDropdown` will be refactored to consume this new component.

**Tech Stack:** Next.js (App Router), Tailwind CSS v4, shadcn/ui, 8bitcn components.

**Design Details (from Brainstorming):**
- **Grid Layout**: 3 columns on mobile, 4 on desktop.
- **Tiles**: Square buttons with a large color block on top and the theme name below in retro font.
- **Selection Logic**: Active theme highlighted with a primary-colored glowing border.
- **UX**: Opens via a trigger that looks like the existing dropdown trigger.

---

### Task 1: Isolation & Preparation (IN PROGRESS)

**Step 1: Create feature branch**
Run: `git checkout -b feature/theme-inventory-grid` (COMPLETED)

**Step 2: Commit initial plan**
Run: `git add docs/plans/2026-04-15-theme-grid-picker.md && git commit -m "docs: add theme inventory grid implementation plan"`

---

### Task 2: Implement Theme Inventory Grid Component

**Files:**
- Create: `src/app/options/components/theme-inventory-grid.tsx`
- Ref: `src/components/ui/8bit/dialog.tsx`

**Step 1: Write the minimal component structure**
Implement `ThemeInventoryGrid` using `Dialog`, `DialogContent`, `DialogTrigger`, and `DialogTitle`.

**Step 2: Define the responsive grid layout**
Add a `div` with `grid grid-cols-3 md:grid-cols-4 gap-4` inside a scrollable container (standard `overflow-y-auto` with thin custom scrollbars).

**Step 3: Implement Theme tiles**
Map through the `themes` array. Each theme tile includes:
- A `bg-[color]` div for preview.
- `span` with `theme.name` (properly capitalized).
- Dynamic border class for the active theme.

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
