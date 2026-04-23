# Plan: Play Route Architecture Refactor

Consolidated brainstorming, design, and implementation plan for modularizing the Play route and decoupling the visualizer.

## Goal

Refactor the `app/play` route to improve modularity, decouple the visualizer from piano-specific logic, and adopt modern Next.js data-fetching patterns.

## Proposed Changes

### 1. MIDI Data Pipeline (`midi-assets`)

- **Consolidation**: Created `getTrackData(url)` to handle loading, parsing, and grouping in one step.
- **Simplification**: Removed manual multi-step loading in the route.

### 2. Visualizer Feature (`visualizer`)

- **Decoupling**: Migrated `LaneStage` and `LaneSegment` to `features/visualizer`.
- **Genericity**: Refactored components to accept `noteClassName` and children, allowing any instrument to use the visualizer.
- **Isolation**: Created `lib/constants.ts` and `lib/utils.ts` within the feature to house visualization-specific logic.

### 3. Play Session Management (`play-session`)

- **State Migration**: Moved `useLaneTimeline` to `features/play-session`.
- **Context Cleanup**: Removed track-specific loading state (`playStatus`) from global context.

### 4. Route Architecture (`app/play`)

- **Data Fetching**: Switched to the React `use()` hook for Suspense-based data resolution.
- **Simplification**: Deleted `PlayPageLoader.tsx`.

## Verification Plan

- **Automated Tests**: Run full Vitest suite (135 tests).
- **Linting**: Ensure `npx eslint` passes.
- **Type-Checking**: Ensure `npx tsc --noEmit` passes.
- **Manual Verification**: Verify gameplay at `/play` and pause behavior.

## Implementation Steps

- [x] Consolidate MIDI Data Pipeline
- [x] Decouple Visualizer Feature
- [x] Refactor Play Route State & Data Fetching
- [x] Enforce Isolation and Final Verification
- [x] Create Pull Request
