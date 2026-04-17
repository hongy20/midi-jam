# Lifecycle-Driven Gameplay (Pause/Resume Refactor)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simplify gameplay pause/resume logic by relying on React component mount/unmount lifecycle.

**Architecture:** "Mounted is Running"
The presence of the `/play` component in the DOM is the definitive signal that the game is active.

- **Start/Resume**: The `/play` component mounts. Hooks initialize using persisted values from `StageContext` (`currentTimeMs`, `score`, `combo`).
- **Pause**: The user navigates to `/pause`. The `/play` component unmounts. Standard React cleanup (clearing intervals, canceling animations, stopping audio) "pauses" the game state.
- **Stop/Reset**: Disconnecting a MIDI device or explicitly ending the session redirects to `/` (Home), where `resetAll()` is called on mount to hard-reset the application.

**Tech Stack:** React 19, Next.js 15, Web Animation API, Vitest.

## Design Details

### Key Components & Hooks

- **`PlayPage`**: Remove `isPaused` state. On MIDI device loss, redirect to home. `handlePause` saves the current session state and navigates to `/pause`.
- **`useLaneTimeline`**: Remove `isPaused` prop. The Web Animation starts immediately on mount using `initialTimeMs`. The cleanup function handles canceling the animation on unmount.
- **`useLaneScoreEngine`**: Remove `isPlaying` prop. Scoring and miss-detection intervals start on mount and clear on unmount.
- **`LaneStage` & `ScoreWidget`**: Remove `isPaused` props. Polling intervals and `requestAnimationFrame` loops run for the duration of the component's mount cycle.

### Data Flow

1. **Play -> Pause**:
   - `PlayPage` saves `currentTimeMs`, `score`, and `combo` to `StageContext`.
   - `toPause()` is called.
   - `/play` unmounts -> Animations/Intervals stop.
2. **Pause -> Play**:
   - `toPlay()` is called.
   - `/play` mounts.
   - Hooks read `initialTimeMs`, `initialScore`, and `initialCombo` from `StageContext`.
   - Gameplay resumes seamlessly from the saved state.

---

## Implementation Tasks

### Task 1: Update `useLaneTimeline` Hook

**Files:**

- Modify: `src/hooks/use-lane-timeline.ts`
- Test: `src/hooks/use-lane-timeline.test.ts`

**Step 1: Update hook signature and remove `isPaused` logic**
Remove `isPaused` from props and the internal effects.

**Step 2: Update tests to reflect removal of `isPaused`**
Modify `src/hooks/use-lane-timeline.test.ts` to remove tests that check for pause/resume behavior via props.

**Step 3: Run tests**
Run: `npm test src/hooks/use-lane-timeline.test.ts`
Expected: PASS

**Step 4: Commit**

```bash
git add src/hooks/use-lane-timeline.ts src/hooks/use-lane-timeline.test.ts
git commit -m "refactor: remove isPaused from useLaneTimeline"
```

---

### Task 2: Update `useLaneScoreEngine` Hook

**Files:**

- Modify: `src/hooks/use-lane-score-engine.ts`
- Test: `src/hooks/use-lane-score-engine.test.ts`

**Step 1: Update hook signature and remove `isPlaying` logic**
Remove `isPlaying` from props and its usage in effects and callbacks.

**Step 2: Update tests**
Modify `src/hooks/use-lane-score-engine.test.ts` to remove `isPlaying` from setup and test cases.

**Step 3: Run tests**
Run: `npm test src/hooks/use-lane-score-engine.test.ts`
Expected: PASS

**Step 4: Commit**

```bash
git add src/hooks/use-lane-score-engine.ts src/hooks/use-lane-score-engine.test.ts
git commit -m "refactor: remove isPlaying from useLaneScoreEngine"
```

---

### Task 3: Update `ScoreWidget` & `LaneStage` Components

**Files:**

- Modify: `src/components/score-widget/score-widget.tsx`
- Modify: `src/components/lane-stage/lane-stage.tsx`
- Test: `src/components/score-widget/score-widget.test.tsx`
- Test: `src/components/lane-stage/lane-stage.test.tsx`

**Step 1: Remove `isPaused` from `ScoreWidget`**
Remove prop and the conditional return in the `useEffect`.

**Step 2: Remove `isPaused` from `LaneStage`**
Remove prop and the conditional return in the polling `useEffect`.

**Step 3: Update component tests**
Remove `isPaused` prop from test renders.

**Step 4: Run tests**
Run: `npm test src/components/score-widget/score-widget.test.tsx src/components/lane-stage/lane-stage.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/score-widget/score-widget.tsx src/components/lane-stage/lane-stage.tsx src/components/score-widget/score-widget.test.tsx src/components/lane-stage/lane-stage.test.tsx
git commit -m "refactor: remove isPaused from ScoreWidget and LaneStage"
```

---

### Task 4: Update `PlayPage` Component

**Files:**

- Modify: `src/app/play/page.tsx`
- Test: `src/app/play/page.test.tsx`

**Step 1: Remove `isPaused` state and update handlers**

- Remove `const [isPaused, setIsPaused] = useState(false)`.
- Update `handlePause` to only save session and navigate.
- Update device-loss effect to navigate to home.

**Step 2: Update JSX**
Remove `isPaused` prop from all child components.

**Step 3: Update `PlayPage` tests**
Refactor tests to reflect the new lifecycle-driven behavior.

**Step 4: Run tests**
Run: `npm test src/app/play/page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/play/page.tsx src/app/play/page.test.tsx
git commit -m "refactor: simplify PlayPage and remove isPaused state"
```

---

### Task 5: Final Verification

**Step 1: Run full suite**
Run: `npm run lint && npm run type-check && npm test`
Expected: ALL PASS

**Step 2: Manual Check (Instructional)**

- Start a game.
- Press Pause -> Verify screen changes and music/animation stops.
- Press Resume -> Verify game continues from same spot.
- Disconnect MIDI device -> Verify redirect to Home and state reset.

**Step 3: Create PR**
Run: `gh pr create --fill`
