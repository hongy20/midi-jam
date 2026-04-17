# Design: Real-Time Accumulator (useLaneTimeline Refactor)

Date: 2026-03-24
Status: Approved

## Overview

Refactor `useLaneTimeline` to move away from the "dummy" Web Animation API dependency. The new implementation will use a high-resolution performance clock (`performance.now()`) as the source of truth for time and progress.

This simplifies the hook, removes DOM-related side effects, and provides a pure mathematical foundation for the game's playback clock.

## Architecture: Real-Time Accumulator

The hook will track "segments" of playback. Each time `speed` or `totalDurationMs` changes, it "anchors" the current game time and starts a new segment.

### Internal Variables (Refs)

- `baseGameTimeMs`: The game time (in ms) at the start of the current segment.
- `syncRealTimeMs`: The `performance.now()` value when the current segment started.
- `onFinishTimeoutId`: ID of the active `setTimeout` for the `onFinish` callback.

### Logic

1.  **Current Time Calculation**:
    `currentTimeMs = Math.min(totalDurationMs, baseGameTimeMs + (performance.now() - syncRealTimeMs) * speed)`
2.  **Progress Calculation**:
    `progress = currentTimeMs / totalDurationMs`
3.  **Handoff handling (Speed/Duration change)**:
    - Capture current `currentTimeMs` to `baseGameTimeMs`.
    - Set `syncRealTimeMs` to `performance.now()`.
    - Calculate remaining real-world time: `remainingMs = (totalDurationMs - baseGameTimeMs) / speed`.
    - Set `setTimeout(onFinish, remainingMs)`.

## Hook Signature

```typescript
interface UseLaneTimelineProps {
  totalDurationMs: number;
  speed: number;
  initialProgress?: number; // Defaults to 0
  onFinish: () => void; // Required
}

// Returns: { getCurrentTimeMs: () => number, getProgress: () => number, resetTimeline: () => void }
```

## Key Changes

### `useLaneTimeline` (/src/hooks/use-lane-timeline.ts)

- **Remove**: Web Animation API logic (`containerRef.animate`, `animationRef`).
- **Add**: High-resolution clock logic using `performance.now()`.
- **Add**: `setTimeout` logic for `onFinish`.
- **Update**: Dependency array to only trigger on `totalDurationMs`, `speed`, and `initialProgress`.

### `PlayPage` (/src/app/play/page.tsx)

- **Update**: Call `useLaneTimeline` with `initialProgress: (gameSession?.currentTimeMs ?? 0) / totalDurationMs`.
- **Update**: Remove `containerRef` from the props as it's no longer needed for the clock.

## Testing Strategy

- **Verification**:
  - `getCurrentTimeMs` increments at the correct rate (real-time \* speed).
  - `onFinish` fires precisely when `currentTimeMs` reaches `totalDurationMs`.
  - Changing `speed` mid-playback does not cause a jump in `currentTimeMs`.
  - `resetTimeline` correctly returns the clock to 0 and schedules a new `onFinish` timeout.
- **Tests**:
  - Update `useLaneTimeline.test.ts` to mock `performance.now()` and verify timing accuracy.
  - Update `PlayPage.test.tsx` for the new prop signature.

# Real-Time Accumulator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the Web Animation API-driven clock in `useLaneTimeline` with a high-resolution performance-based accumulator.

**Architecture:** Maintain an internal "game clock" using `performance.now()` and a "speed" factor. Each speed change "re-anchors" the time to maintain mathematical precision without jumps.

**Tech Stack:** React 19, Vitest.

---

### Task 1: Update `useLaneTimeline` Hook Implementation

**Files:**

- Modify: `src/hooks/use-lane-timeline.ts`

**Step 1: Rewrite internal logic**

```typescript
import { useCallback, useEffect, useRef } from "react";

interface UseLaneTimelineProps {
  totalDurationMs: number;
  speed: number;
  initialProgress?: number;
  onFinish: () => void;
}

export function useLaneTimeline({
  totalDurationMs,
  speed,
  initialProgress = 0,
  onFinish,
}: UseLaneTimelineProps) {
  // Anchors for the current playback segment
  const baseGameTimeRef = useRef(initialProgress * totalDurationMs);
  const syncRealTimeRef = useRef(performance.now());
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const getCurrentTimeMs = useCallback(() => {
    if (totalDurationMs <= 0) return 0;
    const elapsedRealTime = performance.now() - syncRealTimeRef.current;
    return Math.min(totalDurationMs, baseGameTimeRef.current + elapsedRealTime * speed);
  }, [totalDurationMs, speed]);

  const getProgress = useCallback(() => {
    if (totalDurationMs <= 0) return 0;
    return getCurrentTimeMs() / totalDurationMs;
  }, [totalDurationMs, getCurrentTimeMs]);

  // Sync anchor points when speed or duration changes
  useEffect(() => {
    if (totalDurationMs <= 0) return;

    // 1. Capture current progress at the old speed
    baseGameTimeRef.current = getCurrentTimeMs();
    syncRealTimeRef.current = performance.now();

    // 2. Schedule completion callback
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

    const remainingGameTime = totalDurationMs - baseGameTimeRef.current;
    if (remainingGameTime > 0) {
      const realTimeRemaining = remainingGameTime / speed;
      timeoutIdRef.current = setTimeout(onFinish, realTimeRemaining);
    } else {
      onFinish();
    }

    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [totalDurationMs, speed, onFinish, getCurrentTimeMs]);

  const resetTimeline = useCallback(() => {
    baseGameTimeRef.current = 0;
    syncRealTimeRef.current = performance.now();

    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    if (totalDurationMs > 0) {
      const realTimeRemaining = totalDurationMs / speed;
      timeoutIdRef.current = setTimeout(onFinish, realTimeRemaining);
    }
  }, [totalDurationMs, speed, onFinish]);

  return {
    getCurrentTimeMs,
    getProgress,
    resetTimeline,
  };
}
```

**Step 2: Commit**

```bash
git add src/hooks/use-lane-timeline.ts
git commit -m "refactor: replace WAAPI with performance.now() in useLaneTimeline"
```

---

### Task 2: Update `PlayPage` Call Signature

**Files:**

- Modify: `src/app/play/page.tsx`

**Step 1: Update `useLaneTimeline` call**
Remove `containerRef` and update to `initialProgress`.

**Step 2: Commit**

```bash
git add src/app/play/page.tsx
git commit -m "refactor: update useLaneTimeline call signature in PlayPage"
```

---

### Task 3: Update and Fix Tests

**Files:**

- Modify: `src/hooks/use-lane-timeline.test.ts`
- Modify: `src/app/play/page.test.tsx`

**Step 1: Update `useLaneTimeline.test.ts`**
Mock `performance.now()` and `vi.useFakeTimers()` to verify accuracy.

**Step 2: Update `PlayPage.test.tsx`**
Update mock expectations for the new props.

**Step 3: Run all tests**
Run: `npm test`
Expected: ALL PASS

**Step 4: Commit**

```bash
git add src/hooks/use-lane-timeline.test.ts src/app/play/page.test.tsx
git commit -m "test: update tests for real-time accumulator"
```

---

### Task 4: Final Verification & PR

**Step 1: Full suite verification**
Run: `npm run lint && npm run type-check && npm test`
Expected: ALL PASS

**Step 2: Manual Check (Instructional)**

- Load a song.
- Verify progress bar and lane movement match speed changes.
- Verify the song finishes at the exact end point.

**Step 3: Create PR**
Run: `gh pr create --fill`
