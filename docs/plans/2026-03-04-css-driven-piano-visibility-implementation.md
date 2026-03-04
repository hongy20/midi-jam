# CSS-Driven Piano Visibility Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor piano/lane visibility to be entirely CSS-driven based on `--start-unit` and `--end-unit`, removing `visibleNotes` JS filtering.

**Architecture:** Components render the full 88-key "universe" (MIDI 21–108) and rely on CSS Grid `grid-column` and `overflow: hidden` for clipping. A new utility calculates the song-specific range.

**Tech Stack:** Next.js (App Router), React 19, Tailwind CSS v4, CSS Modules.

---

### Task 1: Implement Range Calculation Utility

**Files:**
- Modify: `src/lib/device/piano.ts`
- Test: `src/lib/device/piano.test.ts` (Create if missing)

**Step 1: Write the failing test**
```typescript
import { getVisibleMidiRange } from './piano';
import { PIANO_88_KEY_MIN, PIANO_88_KEY_MAX } from '../midi/constant';

describe('getVisibleMidiRange', () => {
  it('should return default 88-key range for empty notes', () => {
    const range = getVisibleMidiRange([]);
    expect(range).toEqual({ startNote: PIANO_88_KEY_MIN, endNote: PIANO_88_KEY_MAX });
  });

  it('should add 2 white keys buffer to song notes and clamp to 88-key range', () => {
    // Song uses C4 (60)
    // -1 white key: B3 (59)
    // -2 white keys: A3 (57)
    // +1 white key: D4 (62)
    // +2 white keys: E4 (64)
    const range = getVisibleMidiRange([60]); 
    expect(range).toEqual({ startNote: 57, endNote: 64 });
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npm test src/lib/device/piano.test.ts`
Expected: FAIL (function not defined)

**Step 3: Implement `getVisibleMidiRange` and helper**
```typescript
function shiftWhiteKey(note: number, delta: number): number {
  let current = note;
  let count = Math.abs(delta);
  const step = delta > 0 ? 1 : -1;
  
  while (count > 0) {
    current += step;
    if (current < 0 || current > 127) break;
    if (!isBlackKey(current)) {
      count--;
    }
  }
  return current;
}

export function getVisibleMidiRange(notes: number[], buffer = 2) {
  if (!notes || notes.length === 0) {
    return { startNote: PIANO_88_KEY_MIN, endNote: PIANO_88_KEY_MAX };
  }
  const minNote = Math.min(...notes);
  const maxNote = Math.max(...notes);
  
  const startNote = shiftWhiteKey(minNote, -buffer);
  const endNote = shiftWhiteKey(maxNote, buffer);

  return {
    startNote: Math.max(PIANO_88_KEY_MIN, startNote),
    endNote: Math.min(PIANO_88_KEY_MAX, endNote)
  };
}
```

**Step 4: Run test to verify it passes**
Run: `npm test src/lib/device/piano.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add src/lib/device/piano.ts src/lib/device/piano.test.ts
git commit -m "feat: add getVisibleMidiRange utility"
```

---

### Task 2: Update GamePage to use Dynamic Range

**Files:**
- Modify: `src/app/game/page.tsx`

**Step 1: Update range calculation**
Import `getVisibleMidiRange` and use it with `spans` (if ready).
```typescript
const visibleMidiRange = useMemo(() => {
  const notes = spans.map(s => s.note);
  return getVisibleMidiRange(notes);
}, [spans]);

const { startUnit, endUnit } = getNoteUnits(
  visibleMidiRange.startNote,
  visibleMidiRange.endNote
);
```

**Step 2: Verify build**
Run: `npm run build` (or just check dev mode)

**Step 3: Commit**
```bash
git add src/app/game/page.tsx
git commit -m "feat: calculate dynamic piano range in GamePage"
```

---

### Task 3: Refactor PianoKeyboard (Remove visibleNotes)

**Files:**
- Modify: `src/components/piano-keyboard/PianoKeyboard.tsx`

**Step 1: Simplify PianoKeyboard component**
- Remove `visibleNotes` useMemo.
- Remove `rangeStart`/`rangeEnd` props from `KeyGlows`.
- Pass `PIANO_88_KEY_MIN` and `PIANO_88_KEY_MAX` to `PianoKeys`.

**Step 2: Simplify KeyGlows**
- Remove the `.filter()` logic. Render all active notes.

**Step 3: Update PianoKeys**
- Change `notes` prop to just render from min to max (21 to 108).

**Step 4: Run tests**
Run: `npm test src/components/piano-keyboard/PianoKeyboard.test.tsx`

**Step 5: Commit**
```bash
git add src/components/piano-keyboard/PianoKeyboard.tsx
git commit -m "refactor: remove visibleNotes from PianoKeyboard"
```

---

### Task 4: Refactor LaneStage and BackgroundLane

**Files:**
- Modify: `src/components/lane-stage/lane-stage.tsx`
- Modify: `src/components/lane-stage/background-lane.tsx`

**Step 1: Update LaneStage**
- Remove `visibleNotes` useMemo.
- Remove `rangeStart`/`rangeEnd` props.
- Pass nothing to `BackgroundLane`.

**Step 2: Update BackgroundLane**
- Remove `notes` prop.
- Render from `PIANO_88_KEY_MIN` (21) to `PIANO_88_KEY_MAX` (108).

**Step 3: Run tests**
Run: `npm test src/components/lane-stage/lane-stage.test.tsx`

**Step 4: Commit**
```bash
git add src/components/lane-stage/lane-stage.tsx src/components/lane-stage/background-lane.tsx
git commit -m "refactor: remove visibleNotes from LaneStage and BackgroundLane"
```

---

### Task 5: Final Verification & SOP Check

**Step 1: Run Full Verification Suite**
- [ ] `npm run lint`
- [ ] `npm run type-check`
- [ ] `npm test`
- [ ] `npm run build`

**Step 2: Final Commit**
```bash
git commit --allow-empty -m "chore: final verification of css-driven visibility refactor"
```
