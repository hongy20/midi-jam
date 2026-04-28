# AutoPlay Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move auto-play logic to `features/gameplay` and refactor it to use Inversion of Control, ensuring zero dependencies from gameplay to audio-player.

**Architecture:** We will move the `IntersectionObserver` logic and the auto-play hook to the gameplay feature. The hook will be renamed to `useAutoPlay` and will accept callbacks for note-on/off events. Orchestration will be handled by `PlayPageClient`.

**Tech Stack:** React 19, Tone.js (via callbacks), Vitest.

---

### Task 1: Migrate Note Observer Library

**Files:**
- Create: `src/features/gameplay/lib/note-observer.ts`
- Delete: `src/features/audio-player/lib/note-observer.ts`

**Step 1: Move the file**
Run: `mv src/features/audio-player/lib/note-observer.ts src/features/gameplay/lib/note-observer.ts`

**Step 2: Commit**
```bash
git add src/features/gameplay/lib/note-observer.ts src/features/audio-player/lib/note-observer.ts
git commit -m "refactor(gameplay): move note-observer to gameplay feature"
```

---

### Task 2: Implement `useAutoPlay` with IoC

**Files:**
- Create: `src/features/gameplay/hooks/use-auto-play.ts`
- Delete: `src/features/audio-player/hooks/use-track-player.ts`

**Step 1: Create the new hook with callback-based API**
Implement `useAutoPlay` in `src/features/gameplay/hooks/use-auto-play.ts`. It must NOT import from `audio-player`.

```typescript
import { useEffect, useState } from "react";
import { type MIDINoteEvent } from "@/shared/types/midi";
import { createNoteObserver } from "../lib/note-observer";

interface UseAutoPlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
  onNoteOn: (pitch: number) => void;
  onNoteOff: (pitch: number) => void;
  processNoteEvent: (event: MIDINoteEvent) => void;
}

export function useAutoPlay({
  containerRef,
  enabled,
  onNoteOn,
  onNoteOff,
  processNoteEvent,
}: UseAutoPlayProps) {
  const [playbackNotes, setPlaybackNotes] = useState<Set<number>>(new Set());

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const { disconnect } = createNoteObserver({
      container,
      onPitchStart: (pitch) => {
        setPlaybackNotes((prev) => {
          const next = new Set(prev);
          next.add(pitch);
          return next;
        });
        onNoteOn(pitch);
        processNoteEvent({ type: "note-on", pitch, velocity: 0.7 });
      },
      onPitchEnd: (pitch) => {
        setPlaybackNotes((prev) => {
          const next = new Set(prev);
          next.delete(pitch);
          return next;
        });
        onNoteOff(pitch);
        processNoteEvent({ type: "note-off", pitch, velocity: 0 });
      },
    });

    return () => {
      disconnect();
      setPlaybackNotes(new Set());
    };
  }, [containerRef, enabled, onNoteOn, onNoteOff, processNoteEvent]);

  return { playbackNotes };
}
```

**Step 2: Commit**
```bash
git add src/features/gameplay/hooks/use-auto-play.ts src/features/audio-player/hooks/use-track-player.ts
git commit -m "feat(gameplay): implement useAutoPlay hook with Inversion of Control"
```

---

### Task 3: Migrate and Update Tests

**Files:**
- Create: `src/features/gameplay/hooks/use-auto-play.test.ts`
- Delete: `src/features/audio-player/hooks/use-track-player.test.ts`

**Step 1: Move and refactor test to use callbacks instead of mocks**
Update `use-auto-play.test.ts` to pass `onNoteOn` and `onNoteOff` spies instead of mocking `useNotePlayer`.

**Step 2: Run tests**
Run: `npm test use-auto-play.test.ts`
Expected: PASS

**Step 3: Commit**
```bash
git add src/features/gameplay/hooks/use-auto-play.test.ts src/features/audio-player/hooks/use-track-player.test.ts
git commit -m "test(gameplay): migrate and refactor autoplay tests"
```

---

### Task 4: Update Feature Exports

**Files:**
- Modify: `src/features/audio-player/index.ts`
- Modify: `src/features/gameplay/index.ts`

**Step 1: Clean up audio-player exports**
Remove `useTrackPlayer`.

**Step 2: Add gameplay export**
Add `useAutoPlay`.

**Step 3: Commit**
```bash
git add src/features/audio-player/index.ts src/features/gameplay/index.ts
git commit -m "refactor: update feature exports for autoplay migration"
```

---

### Task 5: App Layer Orchestration

**Files:**
- Modify: `src/app/play/components/play-page.client.tsx`

**Step 1: Update imports and wire up callbacks**
Import `useAutoPlay` from `@/features/gameplay` and pass `playNote`/`stopNote` from `useNotePlayer` into it.

**Step 2: Commit**
```bash
git add src/app/play/components/play-page.client.tsx
git commit -m "refactor(app): orchestrate autoplay via PlayPageClient"
```

---

### Task 6: Final Verification

**Step 1: Run full suite**
Run: `npm run lint && npm run type-check && npm test`
Expected: All pass.

**Step 2: Commit**
```bash
git commit --allow-empty -m "chore: final verification complete"
```
