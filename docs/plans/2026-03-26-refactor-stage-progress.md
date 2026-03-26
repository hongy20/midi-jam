# Plan: Refactor Stage Context to use `currentProgress`

Replace `currentTimeMs` with `currentProgress` (0.0 to 1.0) in `GameSession` to simplify timeline restoration and ensure consistency across tracks with different durations.

## Proposed Changes

### 1. `src/context/stage-context.tsx`
- Update `GameSession` interface: replace `currentTimeMs: number` with `currentProgress: number`.

### 2. `src/app/play/page.tsx`
- Update `useLaneTimeline` initialization: use `gameSession?.currentProgress ?? 0` for `initialProgress`.
- Update `useLaneScoreEngine` initialization: calculate `initialTimeMs` as `(gameSession?.currentProgress ?? 0) * totalDurationMs`.
- Update `handlePause`: save `getProgress()` instead of `getCurrentTimeMs()`.

### 3. `src/hooks/use-lane-score-engine.ts` (Optional but recommended)
- Consider if it should also use `initialProgress`, but keeping `initialTimeMs` is fine as it's an internal hook that deals with absolute midi times.

### 4. Tests
- Update `src/context/stage-context.test.tsx`.
- Update `src/app/play/page.test.tsx`.

## Verification Plan

### Automated Tests
- `npm test src/context/stage-context.test.tsx`
- `npm test src/app/play/page.test.tsx`
- `npm run type-check`
- `npm run lint`

### Manual Verification
- Start a song, play a bit, pause.
- Observe `currentProgress` being saved.
- Resume and verify the position and score are restored correctly.
