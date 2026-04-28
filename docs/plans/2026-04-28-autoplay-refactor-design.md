# Design: AutoPlay Refactor (Feature Isolation)

## Goal

Move the "auto-play" (demo mode) logic from `features/audio-player` to `features/gameplay` while strictly adhering to feature isolation principles.

## Problem

Currently, `useTrackPlayer` (the auto-play logic) lives in `features/audio-player`. This is a domain leak:

1.  **Domain Mismatch**: Deciding _when_ to play notes based on gameplay visual state (IntersectionObserver) is a gameplay concern, not a pure audio concern.
2.  **Coupling**: The logic is tightly coupled to `useNotePlayer`, making it harder to test and reuse.
3.  **Architecture**: Violates the goal of having a pure "audio synthesis" feature.

## Proposed Design

### 1. Feature Isolation & Inversion of Control

Instead of `gameplay` importing from `audio-player`, we will use **Inversion of Control**.

- `useAutoPlay` (the new hook in `gameplay`) will be "audio-agnostic".
- It will accept `onNoteOn` and `onNoteOff` callbacks.
- The **App Layer** (`PlayPageClient`) will orchestrate the interaction by passing audio-player methods into the gameplay hook.

### 2. Component Migration

- **Hook**: `src/features/audio-player/hooks/use-track-player.ts` -> `src/features/gameplay/hooks/use-auto-play.ts`
- **Library**: `src/features/audio-player/lib/note-observer.ts` -> `src/features/gameplay/lib/note-observer.ts`
- **Tests**: `src/features/audio-player/hooks/use-track-player.test.ts` -> `src/features/gameplay/hooks/use-auto-play.test.ts`

### 3. API Changes

- `useAutoPlay` Props:
  ```typescript
  interface UseAutoPlayProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    enabled: boolean;
    onNoteOn: (pitch: number) => void;
    onNoteOff: (pitch: number) => void;
    processNoteEvent: (event: MIDINoteEvent) => void;
  }
  ```

## Success Criteria

- [ ] No imports from `features/audio-player` inside `features/gameplay`.
- [ ] `PlayPageClient` correctly orchestrates the two features.
- [ ] Demo mode works exactly as before.
- [ ] Tests pass in the new location with injected mocks.

## AGENTS.md Update

We will also codify the "Strict Isolation Rule" in `AGENTS.md` to prevent future domain leaks.
