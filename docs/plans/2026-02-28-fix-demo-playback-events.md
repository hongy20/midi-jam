# Demo Playback Event Logic Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the `useDemoPlayback` hook to prevent the initial burst of `onNoteOff` calls and ensure correct event ordering (Off then On) for contiguous or overlapping notes of the same pitch.

**Architecture:** 
- **Reference Counting**: Use a `Map<number, number>` inside the `useEffect` to track how many spans are currently active for a given pitch.
- **Event Partitioning**: In the `IntersectionObserver` callback, process all exits (not intersecting) before all entries (intersecting) to ensure that if a pitch "hands off" between two spans, the synthesizer receives `Off` then `On`.
- **Initial Burst Prevention**: The reference counting naturally prevents `onNoteOff` from firing if the pitch wasn't already active (count > 0).

**Tech Stack:** React (Hooks), TypeScript, Vitest.

---

### Task 1: Create failing test for `useDemoPlayback`

**Files:**
- Create: `src/hooks/use-demo-playback.test.ts`

**Step 1: Write the test suite**

```typescript
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDemoPlayback } from "./use-demo-playback";

describe("useDemoPlayback", () => {
  it("does not fire onNoteOff initially for non-intersecting notes", () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    
    // We need to mock IntersectionObserver to simulate the initial callback
    // and subsequent events.
  });

  it("fires onNoteOff then onNoteOn for contiguous notes of the same pitch", () => {
    // Simulate a batch where one span exits and another enters for the same pitch
  });
});
```

**Step 2: Run test to verify failure**

Run: `npm test src/hooks/use-demo-playback.test.ts`
Expected: FAIL

---

### Task 2: Implement reference counting and event ordering

**Files:**
- Modify: `src/hooks/use-demo-playback.ts`

**Step 1: Update the hook logic**

```typescript
// Inside useEffect
const activeCounts = new Map<number, number>();

const observer = new IntersectionObserver(
  (entries) => {
    // 1. Partition entries
    const exits = entries.filter(e => !e.isIntersecting);
    const entries_in = entries.filter(e => e.isIntersecting);

    // 2. Process exits first (Off)
    for (const entry of exits) {
      const pitch = Number(entry.target.getAttribute("data-pitch"));
      if (Number.isNaN(pitch)) continue;

      const currentCount = activeCounts.get(pitch) || 0;
      if (currentCount > 0) {
        const nextCount = currentCount - 1;
        activeCounts.set(pitch, nextCount);
        if (nextCount === 0) {
          onNoteOff(pitch);
        }
      }
    }

    // 3. Process entries second (On)
    for (const entry of entries_in) {
      const pitch = Number(entry.target.getAttribute("data-pitch"));
      if (Number.isNaN(pitch)) continue;

      const currentCount = activeCounts.get(pitch) || 0;
      activeCounts.set(pitch, currentCount + 1);
      if (currentCount === 0) {
        onNoteOn(pitch, 0.7);
      }
    }
  },
  { ... }
);
```

**Step 2: Run test to verify fix**

Run: `npm test src/hooks/use-demo-playback.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add src/hooks/use-demo-playback.ts src/hooks/use-demo-playback.test.ts
git commit -m "fix(hooks): improve demo playback event ordering and prevent initial burst"
```

---

### Task 3: Verify overall gameplay integration

**Step 1: Manual verification**

1. Run the app and enter a game in Demo Mode.
2. Verify that repeated notes (same pitch) trigger correctly on the virtual keyboard and audio.
3. Verify no unexpected `Off` messages are logged or sent to MIDI outputs on startup.

**Step 2: Run all tests**

Run: `npm test`
Expected: ALL PASS
