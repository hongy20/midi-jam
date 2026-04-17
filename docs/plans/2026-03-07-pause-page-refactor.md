# Plan: Pause Page Refactor

This plan outlines the refactor of the Pause page to align with the coding patterns and UI architecture standards defined in `AGENTS.md`.

## 1. Objectives

- **Deep Destructuring**: Extract `gameSession`, `setGameSession`, `trackStatus`, `selectedMIDIInput`, `selectedTrack`, and `setSessionResults` directly from `useAppContext`.
- **Inline Handlers**: Replace `handleResume`, `handleRestart`, `handleOptions`, and `handleExit` with inline logic where concise, or keep complex logic but ensure it uses the destructured variables.
- **UI Consistency**: Align the layout and spacing with the `Score` page, ensuring responsiveness on different viewports.
- **Navigation Patterns**: Verify button placement and hierarchy (Resume as Primary in Footer, others as Secondary in Main).

## 2. Refactoring Details

### A. Context & Navigation

**Current:**

```tsx
const { stage, gear, collection, score } = useAppContext();
// ... multiple lines of destructuring
```

**Refactored:**

```tsx
const {
  stage: { gameSession, setGameSession, trackStatus },
  gear: { selectedMIDIInput },
  collection: { selectedTrack },
  score: { setSessionResults },
} = useAppContext();
```

### B. Logic & Handlers

- **Exit Logic**: The `handleExit` logic involves calculation (accuracy). This might be better kept as a helper or `useCallback` to avoid cluttering the JSX, but the invocation can be inline.
- **Restart/Resume**: Inline these simple navigations.

### C. Layout & Styling

- Use `flex-1` or `h-full` containers to ensure vertical centering.
- Ensure the "Currently Playing" section matches the typographic scale of the `Score` page's title/subtitle.
- Check button sizes and spacing for touch targets.

## 3. Verification Plan

- [ ] Verify `npm run lint` passes.
- [ ] Verify `npm run type-check` passes.
- [ ] Manual check: Resume returns to game.
- [ ] Manual check: Restart resets session and returns to game.
- [ ] Manual check: End Jam calculates score (if applicable) and goes to results.
- [ ] Manual check: Options navigates correctly.
