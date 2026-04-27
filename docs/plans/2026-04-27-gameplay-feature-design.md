# Gameplay Feature Design

Consolidate `features/play-session` and `features/score` into a single `features/gameplay` module using a unified state machine.

## Problem Statement
Current gameplay state is split across two features, leading to redundant state (score/combo managed in both) and complex synchronization logic during transitions (pause/finish).

## Proposed Design

### 1. State Machine (Discriminated Union)
We will use a single state object to manage the gameplay lifecycle:

```typescript
type GameplayStatus = 'idle' | 'playing' | 'paused' | 'finished';

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
  | { status: 'idle' }
  | { status: 'playing' } & SessionData
  | { status: 'paused' } & SessionData
  | { status: 'finished'; results: ResultsData };
```

### 2. Feature Structure
- `src/features/gameplay/`
  - `components/`: `LiveScore`
  - `hooks/`: `useTimeline`, `useScoreEngine`
  - `context/`: `GameplayProvider`, `useGameplay`
  - `index.ts`: Public API

### 3. Migration Plan
1. Create `features/gameplay` structure.
2. Implement `GameplayProvider` with the new state machine.
3. Move and refactor `useTimeline` and `useScoreEngine` into the new feature.
4. Update `RootLayout` to use `GameplayProvider`.
5. Update `PlayPage`, `PausePage`, `ScorePage`, and `HomePage` to use the new `useGameplay` hook.
6. Delete legacy `features/play-session` and `features/score`.

## Success Criteria
- [ ] No redundant score/combo state across the app.
- [ ] `PlayPageClient` logic is simplified.
- [ ] TypeScript prevents accessing results while in `playing` state.
- [ ] All gameplay transitions (pause, resume, finish, reset) work correctly.
