# Feature Modules Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor six core features to improve modularity, naming consistency, and maintainability.

**Architecture:** Extraction of pure logic from hooks into libraries (observers, difficulty mapping), standardizing naming conventions, and migrating structural styles to Tailwind.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Vitest.

---

### Task 1: `audio-player` Observer Extraction

**Files:**

- Create: `src/features/audio-player/lib/note-observer.ts`
- Modify: `src/features/audio-player/hooks/use-track-player.ts`
- Test: `src/features/audio-player/hooks/use-track-player.test.ts` (Existing)

**Step 1: Create the observer library**
Implement `createNoteObserver` in `src/features/audio-player/lib/note-observer.ts`.

**Step 2: Refactor `useTrackPlayer` to use the library**
Replace internal observer logic with the library call.

**Step 3: Verify with tests**
Run: `npm test src/features/audio-player/hooks/use-track-player.test.ts`
Expected: PASS

**Step 4: Commit**

```bash
git add src/features/audio-player/
git commit -m "refactor(audio-player): extract observer logic to lib"
```

---

### Task 2: `collection` Rename

**Files:**

- Rename: `src/features/collection/lib/sound-track.ts` -> `src/features/collection/lib/song-track.ts`
- Rename: `src/features/collection/lib/sound-track.test.ts` -> `src/features/collection/lib/song-track.test.ts`
- Modify: `src/features/collection/index.ts`
- Modify: `src/app/home/page.tsx` (or wherever getSoundTracks is used)

**Step 1: Rename files and update internal exports**
Rename `getSoundTracks` to `getSongTracks`.

**Step 2: Update barrel file and imports**
Update `src/features/collection/index.ts`.

**Step 3: Verify with tests**
Run: `npm test src/features/collection/lib/song-track.test.ts`
Expected: PASS

**Step 4: Commit**

```bash
git add src/features/collection/
git commit -m "refactor(collection): rename sound-track to song-track"
```

---

### Task 3: `settings` to `options` Full Rename

**Files:**

- Rename: `src/features/settings/` -> `src/features/options/`
- Create: `src/features/options/lib/difficulty.ts`
- Modify: `src/features/options/index.ts`
- Modify: 5+ external call sites (layout, client pages, view)

**Step 1: Rename the folder and update internal references**
Run: `mv src/features/settings src/features/options`

**Step 2: Implement difficulty library**
Create `src/features/options/lib/difficulty.ts` with `speedToDifficulty`, `difficultyToSpeed`, and `getDifficultyLabel`.

**Step 3: Update all imports and component usage**
Update all `@/features/settings` to `@/features/options`.
Refactor `OptionsPageClient` and `OptionsPageView` to use the new library.

**Step 4: Verify with build and type-check**
Run: `npm run type-check && npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/
git commit -m "refactor(settings): rename to options and extract difficulty logic"
```

---

### Task 4: `shared/lib/mode.ts` and Theme Cleanup

**Files:**

- Create: `src/shared/lib/mode.ts`
- Delete: `src/shared/types/mode.ts`
- Modify: `src/features/theme/context/theme-context.tsx`
- Modify: `src/shared/components/ui/retro-mode-switcher.tsx`
- Modify: `src/app/options/components/options-page.view.tsx`

**Step 1: Create mode library and update types**
Define `DARK` and `LIGHT` constants.

**Step 2: Cleanup `theme-context.tsx`**
Remove 'D' hotkey, use constants, and add storage key constants.

**Step 3: Verify 'D' key is disabled**
Manual test in browser: press 'D' on options page.
Expected: No theme toggle.

**Step 4: Commit**

```bash
git add src/
git commit -m "refactor(theme): move mode to lib and cleanup hotkeys"
```

---

### Task 5: `score` Tailwind Migration

**Files:**

- Modify: `src/features/score/components/live-score/live-score.tsx`
- Modify: `src/features/score/components/live-score/live-score.module.css`

**Step 1: Replace structural classes with Tailwind**
Update JSX in `live-score.tsx`.

**Step 2: Cleanup CSS module**
Remove redundant styles, keep quality colors and animation.

**Step 3: Verify UI**
Check Storybook or run dev server.
Expected: No visual change.

**Step 4: Commit**

```bash
git add src/features/score/
git commit -m "refactor(score): migrate live-score to tailwind"
```
