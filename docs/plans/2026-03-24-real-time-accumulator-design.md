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
  onFinish: () => void;       // Required
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
  - `getCurrentTimeMs` increments at the correct rate (real-time * speed).
  - `onFinish` fires precisely when `currentTimeMs` reaches `totalDurationMs`.
  - Changing `speed` mid-playback does not cause a jump in `currentTimeMs`.
  - `resetTimeline` correctly returns the clock to 0 and schedules a new `onFinish` timeout.
- **Tests**:
  - Update `useLaneTimeline.test.ts` to mock `performance.now()` and verify timing accuracy.
  - Update `PlayPage.test.tsx` for the new prop signature.
