# Play Route Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the `app/play` route to use a generic visualizer feature and a simplified MIDI loading pipeline.

**Architecture:** 
- Consolidate MIDI loading in `midi-assets`.
- Move visualizer components to a new `visualizer` feature.
- Move timeline logic to `play-session`.
- Refactor `app/play` to use the `use()` hook for data resolution.

**Tech Stack:** Next.js (App Router), React 19, TypeScript.

---

### Task 1: Simplify `midi-assets` API

**Files:**
- Modify: `src/features/midi-assets/lib/midi-loader.ts`
- Modify: `src/features/midi-assets/index.ts`

**Step 1: Add `getTrackData` to `midi-loader.ts`**
Implement the aggregated loading function.

**Step 2: Export `getTrackData` from `index.ts`**
Clean up imports in `PlayPageLoader` (temporarily) or just prepare for the refactor.

**Step 3: Commit**
`git add src/features/midi-assets && git commit -m "feat(midi-assets): add getTrackData utility"`

---

### Task 2: Create `visualizer` Feature

**Files:**
- [NEW] Create: `src/features/visualizer/index.ts`
- [MOVE] Move: `src/app/play/components/lane-stage/` -> `src/features/visualizer/components/`
- Modify: `src/features/visualizer/components/lane-stage.tsx`
- Modify: `src/features/visualizer/components/lane-segment.tsx`

**Step 1: Move components and update internal imports**
Move the folder and ensure `lane-stage.tsx` imports `LaneSegment` locally.

**Step 2: Refactor `LaneSegment` for generic support**
Add `noteClassName` prop and use it instead of `PIANO_GRID_ITEM_CLASS`.

**Step 3: Refactor `LaneStage` for generic support**
Add `noteClassName` and `children` (for background) props.

**Step 4: Commit**
`git add src/features/visualizer src/app/play/components && git commit -m "feat(visualizer): move and decouple visualizer components"`

---

### Task 3: Move Timeline to `play-session`

**Files:**
- [MOVE] Move: `src/app/play/hooks/use-lane-timeline.ts` -> `src/features/play-session/hooks/use-lane-timeline.ts`
- Modify: `src/features/play-session/index.ts`

**Step 1: Move the hook and export it**
Ensure the hook is available via the `play-session` public API.

**Step 2: Commit**
`git add src/features/play-session src/app/play/hooks && git commit -m "feat(play-session): move useLaneTimeline hook"`

---

### Task 4: Refactor `app/play` Route

**Files:**
- Modify: `src/app/play/page.tsx`
- Modify: `src/app/play/components/play-page.client.tsx`
- Modify: `src/app/play/components/play-page.view.tsx`
- [DELETE] Delete: `src/app/play/components/play-page.loader.tsx`

**Step 1: Update `page.tsx`**
Initialize `trackDataPromise` and pass to client.

**Step 2: Update `PlayPageClient.tsx`**
Replace `PlayPageLoader` usage with `use(trackDataPromise)`. Update imports to use new features.

**Step 3: Update `PlayPageView.tsx`**
Pass `BackgroundLane` as a child to `LaneStage`.

**Step 4: Commit and Cleanup**
Remove unused imports and delete the old loader.
`git add src/app/play && git commit -m "refactor(play): adopt use() pattern and generic visualizer"`

---

### Task 5: Verification

**Step 1: Run Lint/Type-check**
`npm run lint && npm run type-check`

**Step 2: Manual Smoke Test**
Open `/play` and verify song loads and plays correctly.
