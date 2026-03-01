# Codebase Cleanup and Optimization Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the codebase to remove anti-patterns, optimize performance for large MIDI files, and clean up redundant logic while maintaining full functionality.

**Architecture:** 
1. Improve React patterns by moving ref updates out of render bodies.
2. Optimize score engine performance from O(N) to O(1) or O(small_window) using temporal indexing.
3. Consolidate MIDI event handling for better stability.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Biome.

---

### Task 1: Fix GamePage Anti-patterns

**Files:**
- Modify: `src/app/game/page.tsx`

**Step 1: Write the failing test**
*Note: Existing tests might pass, but we want to ensure stability. I'll add a test case that verifies the finish callback works correctly without triggering extra renders.*

**Step 2: Run test to verify it fails**
Run: `npm test src/app/game/page.test.tsx`

**Step 3: Implement the fix**
- Move `handleFinishRef.current` update into a `useCallback` or `useEffect`.
- Ensure `onFinishProxy` uses a stable reference.
- Remove redundant `useState` if possible (e.g., `progress` can be derived or handled more efficiently).

**Step 4: Run test to verify it passes**
Run: `npm test src/app/game/page.test.tsx`

**Step 5: Manually verify and seek approval**
- Verify game still plays, pause works, and navigation to results works.
- Ask user for approval of the approach and implementation.

**Step 6: Commit**
```bash
git add src/app/game/page.tsx
git commit -m "refactor(game): fix ref-in-render anti-pattern and simplify state"
```

---

### Task 2: Optimize Score Engine Performance

**Files:**
- Modify: `src/hooks/use-lane-score-engine.ts`

**Step 1: Write the failing test (Performance/Edge Case)**
Add a test case with a large number of `modelEvents` and verify that `handleLiveNote` still processes correctly and quickly.

**Step 2: Run test to verify it fails**
Run: `npm test src/hooks/use-lane-score-engine.test.ts`

**Step 3: Implement sliding window optimization**
- Add a `currentIndexRef` to track the last processed note.
- In `handleLiveNote` and `useEffect`, only iterate from `currentIndexRef.current` onwards, and stop once the time is too far in the future.

**Step 4: Run test to verify it passes**
Run: `npm test src/hooks/use-lane-score-engine.test.ts`

**Step 5: Manually verify and seek approval**
- Verify scoring still works accurately during gameplay.
- Ask user for approval of the optimization approach.

**Step 6: Commit**
```bash
git add src/hooks/use-lane-score-engine.ts
git commit -m "perf(score): optimize event matching with sliding window"
```

---

### Task 3: Refactor useMIDINotes for Stability

**Files:**
- Modify: `src/hooks/use-midi-notes.ts`

**Step 1: Write the failing test**
Verify that `useMIDINotes` doesn't re-subscribe unnecessarily when the callback changes but the input stays the same.

**Step 2: Run test to verify it fails**
Run: `npm test src/hooks/use-midi-notes.test.ts`

**Step 3: Fix ref update pattern**
- Move `onNoteRef.current = onNote` into a `useLayoutEffect` to follow React best practices.

**Step 4: Run test to verify it passes**
Run: `npm test src/hooks/use-midi-notes.test.ts`

**Step 5: Manually verify and seek approval**
- Verify MIDI input still works without lag or missed notes.
- Ask user for approval of the fix.

**Step 6: Commit**
```bash
git add src/hooks/use-midi-notes.ts
git commit -m "refactor(hooks): use useLayoutEffect for stable callback refs"
```

---

### Task 4: Memoize PianoKeys for Rendering Performance

**Files:**
- Modify: `src/components/piano-keyboard/PianoKeyboard.tsx`

**Step 1: Write the failing test**
Verify that `PianoKeys` doesn't re-render when only `liveNotes` or `playbackNotes` change.

**Step 2: Run test to verify it fails**
*Note: This might be hard to test purely with Vitest without profiling, but we can verify the structure.*

**Step 3: Implement React.memo**
- Wrap `PianoKeys` in `memo`.
- Ensure props passed to it are stable (e.g., `visibleNotes`).

**Step 4: Run test to verify it passes**
Run: `npm test src/components/piano-keyboard/virtual-instrument.test.tsx`

**Step 5: Manually verify and seek approval**
- Verify piano keyboard still lights up correctly for both live and playback notes.
- Ask user for approval of the memoization strategy.

**Step 6: Commit**
```bash
git add src/components/piano-keyboard/PianoKeyboard.tsx
git commit -m "perf(ui): memoize static piano keys to reduce re-renders"
```
