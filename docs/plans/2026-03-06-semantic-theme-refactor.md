# Semantic Theme Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract visual properties (colors, fonts, shadows, radii) into semantic CSS variables in `globals.css` and update component CSS modules to use them.

**Architecture:** 
- Layers in `globals.css`: Base Primitives -> Semantic Aliases -> Component Usage.
- Themes defined in `:root` with `data-theme` overrides.

**Tech Stack:** 
- Next.js (App Router), Tailwind CSS v4, CSS Modules.

---

### Task 1: Comprehensive Update to `globals.css`

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Define Semantic Aliases in each theme**
- Update `:root` (Neon), `[data-theme="dark"]`, and `[data-theme="light"]` to include semantic variables for the piano keyboard, note lanes, and general UI components.
- Group variables into logical categories like "Piano Keyboard", "Lanes & Notes", and "Global Visuals".

**Step 2: Commit**
```bash
git add src/app/globals.css
git commit -m "feat: define semantic theme variables in globals.css"
```

### Task 2: Refactor `piano-keyboard.module.css`

**Files:**
- Modify: `src/components/piano-keyboard/piano-keyboard.module.css`

**Step 1: Replace hardcoded values with semantic variables**
- Update `.key` for `background-color`, `border`, `border-radius`, and `box-shadow`.
- Update glow layers (`::after`) for `background-color` and `box-shadow`.
- Update `.label` for `color`.

**Step 2: Commit**
```bash
git add src/components/piano-keyboard/piano-keyboard.module.css
git commit -m "refactor: use semantic variables in piano-keyboard.module.css"
```

### Task 3: Refactor `background-lane.module.css` and `track-lane.module.css`

**Files:**
- Modify: `src/components/lane-stage/background-lane.module.css`
- Modify: `src/components/lane-stage/track-lane.module.css`

**Step 1: Update `background-lane.module.css`**
- Replace hardcoded colors with semantic lane variables.

**Step 2: Update `track-lane.module.css`**
- Replace hardcoded shadows, radius, and color-mix logic with semantic note variables.

**Step 3: Commit**
```bash
git add src/components/lane-stage/background-lane.module.css src/components/lane-stage/track-lane.module.css
git commit -m "refactor: use semantic variables in lane and note styles"
```

### Task 4: Final Validation

- Run: `npm run lint`
- Run: `npm run type-check`
- Run: `npm test`
- Run: `npm run build`

**Step 1: Commit final changes if any**
```bash
git commit -m "chore: final verification for semantic theme refactor"
```
