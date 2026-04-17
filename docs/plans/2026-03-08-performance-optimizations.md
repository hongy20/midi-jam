# Performance & Synchronization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Resolve audio/visual synchronization drift, adjust falldown speed, and ensure user settings persist across navigation.

**Architecture:**

- **Synchronization**: Update `useLaneTimeline` to animate the entire `scrollHeight` of the track lane, ensuring the visual playhead perfectly matches the audio duration.
- **Falldown Speed**: Adjust the `TrackLane` height calculation to provide a consistent speed of 1 viewport height per 3000ms.
- **State Persistence**: Refactor `useAppReset` to exclude user options from the global reset.
- **Cleanup**: Tighten the song completion window by reducing lead-out time.

**Tech Stack:** React 19, CSS Modules, Web Animation API (Timeline).

---

### Task 1: Fix Audio/Visual Synchronization Drift

**Files:**

- Modify: `src/hooks/use-lane-timeline.ts`

**Step 1: Adjust animation keyframes**

```typescript
/* src/hooks/use-lane-timeline.ts */
// From:
// { transform: `translateY(-${maxScrollPx}px)` },
// { transform: "translateY(0px)" },

// To:
const keyframes = [
  { transform: `translateY(${-maxScrollPx}px)` },
  { transform: `translateY(${container.clientHeight}px)` },
];
```

**Step 2: Commit**

```bash
git add src/hooks/use-lane-timeline.ts
git commit -m "fix: resolve audio/visual synchronization drift by using full scroll height in animation"
```

---

### Task 2: Adjust Falldown Speed & Height Calculation

**Files:**

- Modify: `src/components/lane-stage/track-lane.module.css`

**Step 1: Update height formula and remove redundant viewport**

```css
/* src/components/lane-stage/track-lane.module.css */
.container {
  /* ... */
  /* Adjust speed to 3000ms per viewport height */
  height: calc(
    calc(100dvh - var(--header-height) - var(--footer-height)) * (var(--total-duration-ms) / 3000)
  );
}
```

**Step 2: Commit**

```bash
git add src/components/lane-stage/track-lane.module.css
git commit -m "style: adjust falldown speed to 3000ms per viewport"
```

---

### Task 3: Persist User Options

**Files:**

- Modify: `src/hooks/use-track-sync.ts`

**Step 1: Remove resetOptions from useAppReset**

```typescript
/* src/hooks/use-track-sync.ts */
export function useAppReset() {
  // Remove resetOptions from imports and callback
}
```

**Step 2: Commit**

```bash
git add src/hooks/use-track-sync.ts
git commit -m "fix: persist user options by removing resetOptions from useAppReset"
```

---

### Task 4: Tweak Song Completion Window

**Files:**

- Modify: `src/lib/midi/constant.ts`

**Step 1: Reduce lead-out time**

```typescript
/* src/lib/midi/constant.ts */
export const LEAD_OUT_DEFAULT_MS = 800;
```

**Step 2: Commit**

```bash
git add src/lib/midi/constant.ts
git commit -m "style: reduce lead-out time to 800ms for tighter song completion"
```

---

### Task 5: Final Validation

**Step 1: Run full suite**

Run: `npm run lint && npm run type-check && npm test && npm run build`
Expected: ALL PASS
