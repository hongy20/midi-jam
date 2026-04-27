# Gameplay Feature Design & Implementation Plan

Consolidate `features/play-session` and `features/score` into a single `features/gameplay` module using a unified state machine.

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate `play-session` and `score` into a single `gameplay` feature using a Discriminated Union state machine.

**Architecture:** Use a unified `GameplayState` machine managed by a single `GameplayProvider`. Components and hooks will interact with this central source of truth for both live sessions and post-game results.

**Tech Stack:** React 19, Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Vitest.

---

## Design Specifications

### 1. State Machine (Discriminated Union)

We will use a single state object to manage the gameplay lifecycle:

```typescript
type GameplayStatus = "idle" | "playing" | "paused" | "finished";

interface SessionData {
  score: number;
  combo: number;
  currentProgress: number;
}

interface ResultsData {
  score: number;
  combo: number;
}

type GameplayState =
  | { status: "idle" }
  | ({ status: "playing" } & SessionData)
  | ({ status: "paused" } & SessionData)
  | { status: "finished"; results: ResultsData };
```

### 2. Feature Structure

- `src/features/gameplay/`
  - `components/`: `LiveScore`
  - `hooks/`: `useTimeline`, `useScoreEngine`
  - `context/`: `GameplayProvider`, `useGameplay`
  - `index.ts`: Public API
  - `types.ts`: Shared types

---

## Implementation Tasks

### Task 1: Initialize Feature Structure

**Files:**

- [NEW] `src/features/gameplay/index.ts`
- [NEW] `src/features/gameplay/types.ts`

**Step 1: Define types**
Create `src/features/gameplay/types.ts` with the Discriminated Union state machine.

**Step 2: Create public API**
Create `src/features/gameplay/index.ts` exporting types.

**Step 3: Commit**
`git add src/features/gameplay/ && git commit -m "feat(gameplay): initialize feature types and structure"`

---

### Task 2: Implement GameplayProvider

**Files:**

- [NEW] `src/features/gameplay/context/gameplay-context.tsx`
- [NEW] `src/features/gameplay/context/gameplay-context.test.tsx`

**Step 1: Write failing test for GameplayProvider**
Test that it initializes to `idle` and throws if used outside provider.

**Step 2: Implement GameplayProvider & useGameplay**
Implement the context with `gameState` and actions (`startGame`, `pauseGame`, `finishGame`, `resetGame`).

**Step 3: Run tests & Commit**
`npm test src/features/gameplay/context/gameplay-context.test.tsx`
`git add src/features/gameplay/context/ && git commit -m "feat(gameplay): implement gameplay context"`

---

### Task 3: Migrate Hooks (Timeline & Score Engine)

**Files:**

- [NEW] `src/features/gameplay/hooks/use-timeline.ts`
- [NEW] `src/features/gameplay/hooks/use-score-engine.ts`

**Step 1: Move and refactor useTimeline**
Migrate from `play-session` to `gameplay/hooks`.

**Step 2: Move and refactor useScoreEngine**
Migrate from `score` to `gameplay/hooks`.

**Step 3: Commit**
`git add src/features/gameplay/hooks/ && git commit -m "feat(gameplay): migrate timeline and score engine hooks"`

---

### Task 4: Migrate UI Components

**Files:**

- [NEW] `src/features/gameplay/components/live-score.tsx`

**Step 1: Migrate LiveScore**
Move from `features/score/components/live-score/` to `features/gameplay/components/`.

**Step 2: Commit**
`git add src/features/gameplay/components/ && git commit -m "feat(gameplay): migrate livescore component"`

---

### Task 5: Integrate with Root Layout

**Files:**

- [MODIFY] `src/app/layout.tsx`

**Step 1: Replace providers**
Remove `PlayProvider` and `ScoreProvider`, add `GameplayProvider`.

**Step 2: Commit**
`git add src/app/layout.tsx && git commit -m "feat(gameplay): replace legacy providers in root layout"`

---

### Task 6: Update Pages

**Files:**

- [MODIFY] `src/app/play/components/play-page.client.tsx`
- [MODIFY] `src/app/pause/components/pause-page.client.tsx`
- [MODIFY] `src/app/score/components/score-page.client.tsx`
- [MODIFY] `src/app/home/components/home-page.client.tsx`

**Step 1: Refactor PlayPageClient**
Update to use `useGameplay` and the new state machine logic.

**Step 2: Refactor Pause/Score/Home pages**
Update hook imports and logic.

**Step 3: Commit**
`git add src/app/ && git commit -m "feat(gameplay): update pages to use new gameplay feature"`

---

### Task 7: Cleanup Legacy Features

**Files:**

- [DELETE] `src/features/play-session/`
- [DELETE] `src/features/score/`

**Step 1: Verify everything works**
Run full build and tests.

**Step 2: Delete legacy folders**
`rm -rf src/features/play-session src/features/score`

**Step 3: Final Commit**
`git commit -m "refactor(gameplay): remove legacy play-session and score features"`
