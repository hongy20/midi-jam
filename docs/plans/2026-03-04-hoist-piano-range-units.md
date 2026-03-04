# Hoist Piano Range CSS Variables to Game Page

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move the calculation of `--start-unit` and `--end-unit` CSS variables from `PianoKeyboard.tsx` and `LaneStage.tsx` to `src/app/game/page.tsx` to reduce redundancy.

**Architecture:** 
- **Game Page:** Calculate `startUnit` and `endUnit` once and set them on the top-level container.
- **Components:** Inherit the variables from the parent instead of calculating them internally.

**Tech Stack:** Next.js (App Router), React 19, CSS Modules.

---

### Task 1: Update Game Page

**Files:**
- Modify: `src/app/game/page.tsx`

**Step 1: Import constants and utility**

```typescript
import { getNoteUnits } from "@/lib/device/piano";
import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "@/lib/midi/constant";
```

**Step 2: Calculate units and apply to container**

```typescript
// Inside GamePage:
const { startUnit, endUnit } = getNoteUnits(PIANO_88_KEY_MIN, PIANO_88_KEY_MAX);

// On return div:
<div 
  className={styles.container}
  style={{
    "--start-unit": startUnit,
    "--end-unit": endUnit,
  } as React.CSSProperties}
>
```

**Step 3: Commit**

```bash
git add src/app/game/page.tsx
git commit -m "refactor: hoist piano range units to game page container"
```

---

### Task 2: Update Lane Stage

**Files:**
- Modify: `src/components/lane-stage/lane-stage.tsx`

**Step 1: Remove redundant calculations and style prop**

**Step 2: Commit**

```bash
git add src/components/lane-stage/lane-stage.tsx
git commit -m "refactor: remove redundant unit calculations from LaneStage"
```

---

### Task 3: Update Piano Keyboard

**Files:**
- Modify: `src/components/piano-keyboard/PianoKeyboard.tsx`

**Step 1: Remove redundant calculations and style prop**

**Step 2: Commit**

```bash
git add src/components/piano-keyboard/PianoKeyboard.tsx
git commit -m "refactor: remove redundant unit calculations from PianoKeyboard"
```

---

### Task 4: Final Validation

**Step 1: Run full test suite, lint, and type-check**

Run: `npm test && npm run lint && npm run type-check`
Expected: PASS
