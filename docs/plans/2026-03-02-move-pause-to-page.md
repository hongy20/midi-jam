# Move Pause Overlay to Dedicated Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transition the gameplay pause functionality from an overlay within the game page to a dedicated route (`/pause`), ensuring all gameplay state (progress, score, combo) is persisted via `SelectionContext`.

**Architecture:**

- Centralize gameplay state in `SelectionContext` within a `GameSession` object.
- Update `useLaneTimeline` and `useLaneScoreEngine` hooks to initialize from provided state.
- Create `/pause` page that modifies context state and handles navigation back to game or results.

**Tech Stack:** React, Next.js (App Router), Lucide React.

---

### Task 1: Update SelectionContext to Store Full Gameplay State

**Files:**

- Modify: `src/context/selection-context.tsx`

**Step 1: Update GameSession interface**

```typescript
interface GameSession {
  isPaused: boolean;
  score: number;
  combo: number;
  currentTimeMs: number;
}
```

**Step 2: Update SelectionProvider defaults**

Initialize `gameSession` as needed.

**Step 3: Commit**

```bash
git add src/context/selection-context.tsx
git commit -m "feat: expand GameSession state in SelectionContext"
```

---

### Task 2: Update useLaneTimeline to support initialTimeMs

**Files:**

- Modify: `src/hooks/use-lane-timeline.ts`
- Modify: `src/hooks/use-lane-timeline.test.ts`

**Step 1: Add initialTimeMs to props and use it**

```typescript
interface UseLaneTimelineProps {
  // ... existing props
  initialTimeMs?: number;
}
// In updateAnimation:
let prevTime = initialTimeMs ?? 0;
if (animationRef.current) {
  // ...
}
```

**Step 2: Update tests to verify initialTimeMs**

**Step 3: Run tests**

**Step 4: Commit**

```bash
git add src/hooks/use-lane-timeline.ts src/hooks/use-lane-timeline.test.ts
git commit -m "feat: support initialTimeMs in useLaneTimeline"
```

---

### Task 3: Update useLaneScoreEngine to support state restoration

**Files:**

- Modify: `src/hooks/use-lane-score-engine.ts`
- Modify: `src/hooks/use-lane-score-engine.test.ts`

**Step 1: Add initial state props**

```typescript
interface UseLaneScoreEngineProps {
  // ...
  initialScore?: number;
  initialCombo?: number;
}
```

**Step 2: Initialize score, combo, and window references**

Need to calculate `currentIndexRef` and `processedNotesRef` based on `currentTimeMs` to avoid double-processing or missing notes.

**Step 3: Commit**

```bash
git add src/hooks/use-lane-score-engine.ts src/hooks/use-lane-score-engine.test.ts
git commit -m "feat: support state restoration in useLaneScoreEngine"
```

---

### Task 4: Update GamePage to Sync State and Handle Pause Navigation

**Files:**

- Modify: `src/app/play/page.tsx`

**Step 1: Initialize local state from gameSession**

**Step 2: Update handleTogglePause to sync and navigate**

```typescript
const handleTogglePause = () => {
  setGameSession({
    isPaused: true,
    score,
    combo,
    currentTimeMs: getCurrentTimeMs(),
  });
  navigate("/pause");
};
```

**Step 3: Remove PauseOverlay from the page**

**Step 4: Commit**

```bash
git add src/app/play/page.tsx
git commit -m "refactor: sync gameplay state and navigate to /pause"
```

---

### Task 5: Create Dedicated Pause Page

**Files:**

- Create: `src/app/pause/page.tsx`
- Create: `src/app/pause/page.module.css`

**Step 1: Implement the Pause Page**

It should render the `PauseOverlay` logic or its contents.

- `onResume`: Set `isPaused: false` and navigate back to `/play`.
- `onRestart`: Reset context and navigate back to `/play`.
- `onQuit`: Navigate to `/score` with context results.

**Step 2: Commit**

```bash
git add src/app/pause/page.tsx src/app/pause/page.module.css
git commit -m "feat: add dedicated pause page"
```

---

### Task 6: Final Verification

**Step 1: Run all tests**

**Step 2: Manual verification of pause/resume/restart/quit flow**

**Step 3: Commit**

```bash
git commit -m "chore: complete pause-to-page transition"
```
