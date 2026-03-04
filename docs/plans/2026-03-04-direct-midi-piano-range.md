# Direct MIDI Piano Range Implementation Plan (Simplified Pitch Range)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the piano model to use `pitch` (MIDI number) naming and replace the `--piano-visible-units` variable with `--piano-end-unit`. The CSS will calculate the width automatically.

**Architecture:** 
- **JS:** Rename `note` variables/helpers to `pitch`. Use `getPitchUnits(pitch)` to get both start and end coordinates.
- **CSS:** Update the container to calculate `grid-template-columns` from the start and end units.
- **Rules:** Keep the 88 hardcoded CSS rules in `piano-grid.module.css`.

**Tech Stack:** Next.js (App Router), React 19, CSS Modules.

---

### Task 1: Update Piano Utilities

**Files:**
- Modify: `src/lib/device/piano.ts`

**Step 1: Rename and update helpers to use "Pitch" and return range units**

```typescript
export function isBlackKey(pitch: number): boolean {
  const n = pitch % 12;
  return [1, 3, 6, 8, 10].includes(n);
}

const PITCH_OFFSETS = [0, 2, 3, 5, 6, 9, 11, 12, 14, 15, 17, 18];

/**
 * Returns the horizontal unit range (start and end) for a MIDI pitch.
 */
export function getPitchUnits(pitch: number) {
  const octave = Math.floor(pitch / 12);
  const semitone = pitch % 12;
  const start = octave * 21 + PITCH_OFFSETS[semitone];
  const isBlack = [1, 3, 6, 8, 10].includes(semitone);
  return {
    start,
    end: start + (isBlack ? 2 : 3),
  };
}
```

**Step 2: Commit**

```bash
git add src/lib/device/piano.ts
git commit -m "refactor: rename to pitch and add getPitchUnits helper"
```

---

### Task 2: Update Container CSS

**Files:**
- Modify: `src/components/piano-keyboard/piano-keyboard.module.css`

**Step 1: Calculate columns from start and end units**

```css
.container {
  display: grid;
  width: 100%;
  height: 100%;
  position: relative;
  /* Columns = End Unit - Start Unit */
  grid-template-columns: repeat(calc(var(--piano-end-unit) - var(--piano-start-unit)), 1fr);
  grid-template-rows: 2fr 1fr;
  user-select: none;
}
```

**Step 2: Commit**

```bash
git add src/components/piano-keyboard/piano-keyboard.module.css
git commit -m "style: calculate piano columns from start and end units"
```

---

### Task 3: Update Piano Keyboard Component

**Files:**
- Modify: `src/components/piano-keyboard/PianoKeyboard.tsx`

**Step 1: Update range logic to use `getPitchUnits`**

```typescript
import { getPitchUnits } from "@/lib/device/piano";

// Calculate range markers
const startUnit = getPitchUnits(rangeStart).start;
const endUnit = getPitchUnits(rangeEnd).end;

// In container div:
<div 
  className={styles.container}
  style={{ 
    "--piano-start-unit": startUnit, 
    "--piano-end-unit": endUnit 
  } as React.CSSProperties}
>
```

**Step 2: Rename internal variables from `note` to `pitch`**

**Step 3: Run tests**

Run: `npm test src/components/piano-keyboard/PianoKeyboard.test.tsx`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/piano-keyboard/PianoKeyboard.tsx
git commit -m "feat: use pitch naming and end-unit marker in PianoKeyboard"
```

---

### Task 4: Update Lane Stage Components

**Files:**
- Modify: `src/components/lane-stage/lane-stage.tsx`
- Modify: `src/components/lane-stage/track-lane.tsx`
- Modify: `src/components/lane-stage/background-lane.tsx`

**Step 1: Apply the `pitch` naming and `startUnit`/`endUnit` pattern to LaneStage and its children.**

**Step 2: Commit**

```bash
git add src/components/lane-stage/
git commit -m "feat: use pitch naming and end-unit marker in LaneStage"
```

---

### Task 5: Final Validation

**Step 1: Run full test suite, lint, and type-check**

Run: `npm test && npm run lint && npm run type-check`
Expected: PASS
