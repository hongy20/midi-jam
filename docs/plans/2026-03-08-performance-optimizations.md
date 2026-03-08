# Performance Optimizations Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve performance for long tracks by capping TrackLane height and refactoring useDemoPlayback to use a more efficient pointer-based rAF system.

**Architecture:**
- **TrackLane Height**: Use CSS `min()` to clamp TrackLane height at 16,000px.
- **useDemoPlayback Refactor**: Replace `IntersectionObserver` with a `requestAnimationFrame` (rAF) loop.
- **Pointer System**: Use a `nextStartIndexRef` to scan the `spans` array (already sorted by `startTime`).
- **Active Note Tracking**: Maintain `activeSpansRef` to track currently sounding notes.
- **Synchronization**: Use `getCurrentTimeMs()` from `useLaneTimeline` to ensure perfect sync between visuals and audio.

**Tech Stack:** React 19, CSS Modules, Web Animation API (Timeline).

---

### Task 1: Cap TrackLane Height

**Files:**
- Modify: `src/components/lane-stage/track-lane.module.css`

**Step 1: Apply height clamp**

```css
/* src/components/lane-stage/track-lane.module.css */
.container {
  display: grid;
  width: 100%;
  position: relative;
  grid-template-columns: repeat(
      calc(var(--end-unit) - var(--start-unit)),
      minmax(0, 1fr)
    );
  /* Clamp height to 16000px max */
  height: min(
    16000px,
    calc(
      calc(100dvh - var(--header-height) - var(--footer-height)) *
      (var(--total-duration-ms) / 2000 + 1)
    )
  );
}
```

**Step 2: Commit**

```bash
git add src/components/lane-stage/track-lane.module.css
git commit -m "perf: clamp TrackLane height to 16000px"
```

---

### Task 2: Refactor useDemoPlayback Interface

**Files:**
- Modify: `src/hooks/use-demo-playback.ts`

**Step 1: Update hook props interface**

Change `containerRef` to optional/removed and add `getCurrentTimeMs`.

```typescript
/* src/hooks/use-demo-playback.ts */
interface UseDemoPlaybackProps {
  demoMode: boolean;
  isLoading: boolean;
  spans: NoteSpan[];
  getCurrentTimeMs: () => number; // New prop
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
}
```

**Step 2: Commit**

```bash
git add src/hooks/use-demo-playback.ts
git commit -m "refactor: update useDemoPlayback signature to accept getCurrentTimeMs"
```

---

### Task 3: Update PlayPage Integration

**Files:**
- Modify: `src/app/play/page.tsx`

**Step 1: Update useDemoPlayback usage**

```typescript
/* src/app/play/page.tsx */
  useDemoPlayback({
    demoMode,
    isLoading,
    spans,
    getCurrentTimeMs, // Pass from useLaneTimeline
    onNoteOn: handleNoteOn,
    onNoteOff: handleNoteOff,
  });
```

**Step 2: Commit**

```bash
git add src/app/play/page.tsx
git commit -m "refactor: update PlayPage to pass getCurrentTimeMs to useDemoPlayback"
```

---

### Task 4: Implement Pointer-Based Playback Logic

**Files:**
- Modify: `src/hooks/use-demo-playback.ts`

**Step 1: Write the pointer-based logic**

Implement the rAF loop with `nextStartIndex` and `activeSpans` tracking.

```typescript
/* src/hooks/use-demo-playback.ts */
import { useEffect, useRef } from "react";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import { LEAD_IN_DEFAULT_MS } from "@/lib/midi/constant";

// ... props ...

export function useDemoPlayback({
  demoMode,
  isLoading,
  spans,
  getCurrentTimeMs,
  onNoteOn,
  onNoteOff,
}: UseDemoPlaybackProps) {
  const nextStartIndexRef = useRef(0);
  const activeSpansRef = useRef<Set<NoteSpan>>(new Set());
  const lastTimeRef = useRef(-1);

  useEffect(() => {
    if (!demoMode || isLoading || spans.length === 0) return;

    let rafId: number;

    const tick = () => {
      const rawTime = getCurrentTimeMs();
      // Adjust for lead-in: timeline starts at 0, but notes have LEAD_IN_DEFAULT_MS offset
      const currentTime = (rawTime - LEAD_IN_DEFAULT_MS) / 1000;

      // Handle timeline reset or jump
      if (rawTime < lastTimeRef.current || Math.abs(rawTime - lastTimeRef.current) > 500) {
        nextStartIndexRef.current = 0;
        for (const span of activeSpansRef.current) {
          onNoteOff(span.note);
        }
        activeSpansRef.current.clear();
      }
      lastTimeRef.current = rawTime;

      // 1. Process Offs
      for (const span of activeSpansRef.current) {
        if (span.startTime + span.duration <= currentTime) {
          onNoteOff(span.note);
          activeSpansRef.current.delete(span);
        }
      }

      // 2. Process Ons
      while (
        nextStartIndexRef.current < spans.length &&
        spans[nextStartIndexRef.current].startTime <= currentTime
      ) {
        const span = spans[nextStartIndexRef.current];
        // Only start if it's not already finished (in case of jumps)
        if (span.startTime + span.duration > currentTime) {
          onNoteOn(span.note, span.velocity || 0.7);
          activeSpansRef.current.add(span);
        }
        nextStartIndexRef.current++;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      for (const span of activeSpansRef.current) {
        onNoteOff(span.note);
      }
      activeSpansRef.current.clear();
      nextStartIndexRef.current = 0;
      lastTimeRef.current = -1;
    };
  }, [demoMode, isLoading, spans, getCurrentTimeMs, onNoteOn, onNoteOff]);
}
```

**Step 2: Commit**

```bash
git add src/hooks/use-demo-playback.ts
git commit -m "perf: implement pointer-based rAF playback in useDemoPlayback"
```

---

### Task 5: Update useDemoPlayback Tests

**Files:**
- Modify: `src/hooks/use-demo-playback.test.ts`

**Step 1: Update tests to mock `getCurrentTimeMs` and trigger rAF**

```typescript
/* src/hooks/use-demo-playback.test.ts */
// Update mocks and test cases to use the new signature
```

**Step 2: Run tests**

Run: `npm test src/hooks/use-demo-playback.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add src/hooks/use-demo-playback.test.ts
git commit -m "test: update useDemoPlayback tests for new rAF logic"
```

---

### Task 6: Final Validation

**Step 1: Run full suite**

Run: `npm run lint && npm run type-check && npm test && npm run build`
Expected: ALL PASS
