# Theme Picker Implementation & Consolidation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the legacy theme dropdown with a unified, high-fidelity `ThemePicker` component to solve mobile overflow issues and align with the game's arcade aesthetic.

**Architecture:** A single-file `ThemePicker` component replaces the original `SelectThemeDropdown` (wrapper) and `ThemeInventoryGrid` (implementation) to reduce complexity and improve maintainability.

**Tech Stack:** Next.js (App Router), Tailwind CSS v4, shadcn/ui, 8bitcn components.

**Design Details (from Brainstorming v7):**

- **Trigger Styling**:
  - 8-bit composite border design with `border-y-6` and `border-x-6` overlay.
  - **Height Calibration**: Total height set to exactly **48px** (inner `h-9` + borders) for parity with the Difficulty selector.
  - **Tactile Feedback**: `active:translate-y-1` transition.
- **Picker UI**: Single-column vertical list with `h-12` rows and bold selection highlighting.
- **UX**: Backdrop-based dismissal (no separate close button).

---

### Task 1: Isolation & Preparation (COMPLETED)

- [x] Create feature branch: `feature/theme-inventory-grid`
- [x] Commit initial plan track in repository

---

### Task 2: UI Implementation & Refinement (COMPLETED)

- [x] Build `ThemeInventoryGrid` as a responsive Dialog picker
- [x] Replicate 8-bit `SelectTrigger` styling for the Dialog trigger
- [x] Calibrate trigger height to 48px for layout consistency
- [x] Implement horizontal centering and tactile `active` states

---

### Task 3: Component Consolidation (COMPLETED)

- [x] Create unified `ThemePicker` component merging all logic
- [x] Update `OptionsPageView` to consume the new `ThemePicker`
- [x] Delete deprecated `SelectThemeDropdown.tsx`
- [x] Delete deprecated `ThemeInventoryGrid.tsx`

---

### Task 4: Verification & Finalization (COMPLETED)

- [x] Run `npm run lint:fix` to ensure Biome compliance
- [x] Run `npm run type-check` for API consistency
- [x] Commit and push final codebase state
- [x] Create and finalize Pull Request [#111](https://github.com/hongy20/midi-jam/pull/111)

---

### Task 5: Toughen AGENTS.md Protocols (IN PROGRESS)

- [/] Update SOP with "Zero Turn Rule" for initial actions
- [ ] Update SOP with "Status Gate" for final summaries
- [ ] Update Plan Monolith rule to prohibit multiple plan files
- [ ] Run final quality check and push update

---
