# Semantic Theme Refactor (Design & Plan)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

Extract all hardcoded visual properties (colors, fonts, shadows, radii) into semantic CSS variables in `globals.css` to enable easy theme customization and maintain consistency across the entire application (gameplay and UI).

## Goals

- Define a comprehensive set of semantic variables in `globals.css`.
- Support multiple themes (`neon`, `dark`, `light`) via CSS variable overrides.
- Remove hardcoded color, shadow, and radius values from CSS modules AND inline Tailwind classes where applicable.
- Ensure the "Neon" theme remains the default and most vibrant.

## Architecture

### 1. `globals.css` Restructuring

Organize `globals.css` into layers:

1. **Global Constants:** Fixed spacing, layout, and font variables.
2. **Theme Primitive Variables:** Raw colors and opacity values for each theme.
3. **Semantic Mappings:** Component-level functional aliases.

#### Expanded Variable Categories:

- **Piano Keyboard:** `--piano-key-white`, `--piano-key-black`, `--piano-glow-live-bg`, `--piano-glow-playback-bg`, `--piano-key-radius`.
- **Lanes & Notes:** `--lane-bg-white`, `--lane-bg-black`, `--note-radius`, `--note-bg-intensity`.
- **UI Elements (General):**
  - **Cards:** `--ui-card-bg`, `--ui-card-border`, `--ui-card-shadow`, `--ui-card-radius`.
  - **Buttons:** `--ui-btn-primary-bg`, `--ui-btn-primary-text`, `--ui-btn-secondary-bg`, `--ui-btn-secondary-border`.
  - **Status:** `--ui-status-success`, `--ui-status-error`, `--ui-status-warning`.
  - **Feedback (Hit Quality):** `--ui-hit-perfect`, `--ui-hit-good`, `--ui-hit-miss`.

### 2. Component Refactoring

- **CSS Modules:** `piano-keyboard.module.css`, `track-lane.module.css`, `background-lane.module.css`.
- **Inline Tailwind Styles:** Update `page.tsx`, `tracks/page.tsx`, `instruments/page.tsx`, `settings/page.tsx`, `results/page.tsx`, and `score-hud-lite.tsx` to use semantic variables (e.g., `bg-[var(--ui-card-bg)]`).

---

## Implementation Plan

### Task 1: Update `globals.css` with Comprehensive Semantic Set

**Files:**

- Modify: `src/app/globals.css`

**Step 1: Define Extended Semantic Variables in each theme**

- Update `:root` (Neon), `[data-theme="dark"]`, and `[data-theme="light"]` to include:
  - **Piano/Lanes:** `--piano-key-white`, `--piano-key-black`, `--piano-glow-live-bg`, etc.
  - **UI Cards/Buttons:** `--ui-card-bg`, `--ui-card-border`, `--ui-card-radius`, `--ui-btn-primary-bg`, etc.
  - **Feedback:** `--ui-hit-perfect`, `--ui-hit-good`, etc.

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: define extended semantic theme variables in globals.css"
```

### Task 2: Refactor Gameplay Components (CSS Modules)

**Files:**

- Modify: `src/components/piano-keyboard/piano-keyboard.module.css`
- Modify: `src/components/lane-stage/background-lane.module.css`
- Modify: `src/components/lane-stage/track-lane.module.css`

**Step 1: Update `piano-keyboard.module.css`**

- Replace hardcoded values with semantic variables.

**Step 2: Update Lane CSS Modules**

- Replace hardcoded colors with semantic variables.

**Step 3: Commit**

```bash
git add src/components/piano-keyboard/piano-keyboard.module.css src/components/lane-stage/background-lane.module.css src/components/lane-stage/track-lane.module.css
git commit -m "refactor: use semantic variables in gameplay CSS modules"
```

### Task 3: Refactor UI Components (Tailwind Classes)

**Files:**

- Modify: `src/app/page.tsx`
- Modify: `src/app/collection/page.tsx`
- Modify: `src/app/gear/page.tsx`
- Modify: `src/app/options/page.tsx`
- Modify: `src/app/score/page.tsx`
- Modify: `src/components/score-hud-lite.tsx`

**Step 1: Update `page.tsx` (Welcome)**

- Replace `bg-foreground` with `bg-[var(--ui-btn-primary-bg)]` where semantic.
- Use `shadow-[var(--ui-btn-primary-shadow)]` etc.

**Step 2: Update Selection & Settings Pages**

- Replace hardcoded `bg-foreground/5` with `bg-[var(--ui-card-bg)]` and `border-foreground/10` with `border-[var(--ui-card-border)]`.

**Step 3: Update `score-hud-lite.tsx`**

- Use `--ui-hit-perfect` etc. for hit feedback.

**Step 4: Commit**

```bash
git add src/app/*.tsx src/app/**/*.tsx src/components/score-hud-lite.tsx
git commit -m "refactor: use semantic variables in UI components and pages"
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
