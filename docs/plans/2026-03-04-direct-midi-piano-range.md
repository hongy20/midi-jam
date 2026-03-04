# Direct MIDI Piano Range Implementation Plan (Note Range Refactor)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `getNoteUnits` to accept a range (start and end notes) and return the corresponding unit coordinates. Update components to use this more direct signature.

**Architecture:** 
- **JS:** `getNoteUnits(startNote, endNote)` returns `{ startUnit, endUnit }`.
- **Components:** Call `getNoteUnits` once per range instead of twice.

**Tech Stack:** Next.js (App Router), React 19, CSS Modules.

---

### Task 1: Update Piano Utilities

**Files:**
- Modify: `src/lib/device/piano.ts`

**Step 1: Refactor `getNoteUnits` to accept range**

```typescript
/**
 * Returns the horizontal unit range (start coordinate of startNote and end coordinate of endNote)
 * for a MIDI note range in a 21-unit-per-octave grid.
 */
export function getNoteUnits(startNote: number, endNote: number) {
  const startOctave = Math.floor(startNote / 12);
  const startSemitone = startNote % 12;
  const startUnit = startOctave * 21 + NOTE_OFFSETS[startSemitone];

  const endOctave = Math.floor(endNote / 12);
  const endSemitone = endNote % 12;
  const endStart = endOctave * 21 + NOTE_OFFSETS[endSemitone];
  const isEndBlack = isBlackKey(endNote);
  const endUnit = endStart + (isEndBlack ? 2 : 3);

  return {
    startUnit,
    endUnit,
  };
}
```

**Step 2: Commit**

```bash
git add src/lib/device/piano.ts
git commit -m "refactor: update getNoteUnits to accept start and end notes"
```

---

### Task 2: Update Components

**Files:**
- Modify: `src/components/piano-keyboard/PianoKeyboard.tsx`
- Modify: `src/components/lane-stage/lane-stage.tsx`

**Step 1: Use new `getNoteUnits` signature**

```typescript
const { startUnit, endUnit } = getNoteUnits(rangeStart, rangeEnd);
```

**Step 2: Run tests**

Run: `npm test src/components/piano-keyboard/PianoKeyboard.test.tsx`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/piano-keyboard/PianoKeyboard.tsx src/components/lane-stage/lane-stage.tsx
git commit -m "feat: use simplified getNoteUnits range signature in components"
```

---

### Task 3: Final Validation

**Step 1: Run full test suite, lint, and type-check**

Run: `npm test && npm run lint && npm run type-check`
Expected: PASS
