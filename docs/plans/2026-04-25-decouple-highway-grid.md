# [Decouple Highway Grid] Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove piano-specific grid logic from the `highway` feature and allow it to be injected via props.

**Architecture:**

1. Define a shared `.piano-grid` class in the `piano` feature.
2. Extend `Highway` and `HighwaySegment` components with a `containerClassName` prop.
3. Remove hardcoded `grid-template-columns` from `highway-segment.module.css`.

**Tech Stack:** React, CSS Modules, Tailwind CSS.

---

### Task 1: Define Shared Piano Grid Class

**Files:**

- Modify: `src/features/piano/styles/piano-grid.css`

**Step 1: Add the .piano-grid class**

```css
.piano-grid {
  display: grid;
  grid-template-columns: repeat(calc(var(--end-unit) - var(--start-unit)), minmax(0, 1fr));
}
```

**Step 2: Commit**

```bash
git add src/features/piano/styles/piano-grid.css
git commit -m "feat(piano): add shared .piano-grid class"
```

---

### Task 2: Update Highway Components API

**Files:**

- Modify: `src/features/highway/components/Highway.tsx`
- Modify: `src/features/highway/components/HighwaySegment.tsx`

**Step 1: Add containerClassName prop to Highway**
Update `HighwayProps` and pass the prop to `HighwaySegment`.

**Step 2: Add containerClassName prop to HighwaySegment**
Update `HighwaySegmentProps` and apply it to the container `div`.

**Step 3: Commit**

```bash
git add src/features/highway/components/Highway.tsx src/features/highway/components/HighwaySegment.tsx
git commit -m "refactor(highway): add containerClassName prop to Highway and HighwaySegment"
```

---

### Task 3: Clean up highway-segment.module.css

**Files:**

- Modify: `src/features/highway/components/highway-segment.module.css`

**Step 1: Remove piano-specific grid logic**
Remove `display: grid;` and `grid-template-columns: ...` from `.container`.

**Step 2: Commit**

```bash
git add src/features/highway/components/highway-segment.module.css
git commit -m "refactor(highway): remove piano-specific grid from CSS module"
```

---

### Task 4: Update PianoStage Implementation

**Files:**

- Modify: `src/features/piano/components/piano-stage/PianoStage.tsx`

**Step 1: Pass the piano-grid class to Highway**
Import the class from `piano-grid.css` (it's already imported globally, so just use the string "piano-grid").

**Step 2: Commit**

```bash
git add src/features/piano/components/piano-stage/PianoStage.tsx
git commit -m "refactor(piano): use .piano-grid class for Highway container"
```

---

### Task 5: Verify & Finalize

**Step 1: Run tests and lint**

```bash
npm run lint && npm test
```

**Step 2: Final commit and PR**

```bash
gh pr create --fill
```
