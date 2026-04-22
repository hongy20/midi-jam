# Refactor Play Engine & MIDI Assets Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Merge Stage and Track logic into a colocated Play Engine context, decouple midi-assets from React Context, and leverage Next.js native loading boundaries.

**Architecture:** We will combine `StageContext` and `TrackContext` into a new `PlayContext` located inside `app/play/context/play-context.tsx`. `features/midi-assets` will be stripped of Context to become a pure stateless utility module. `app/play/components/play-page.client.tsx` will fetch and parse the MIDI track directly, throwing a Promise if it's not ready to trigger the native `app/play/loading.tsx` boundary. This correctly fixes the architectural boundary violation where features were importing from `app/`.

**Tech Stack:** React 19 (use, Suspense), Next.js App Router, TypeScript.

---

### Task 1: Create PlayContext

**Files:**
- Create: `src/app/play/context/play-context.tsx`

**Step 1: Write the combined PlayContext implementation**
Implement `PlayContext` merging `GameSession` state and `TrackStatus` state. It should expose `playStatus`, `setPlayStatus`, `gameSession`, `setGameSession`, `resetPlay` (resets both). 

**Step 2: Commit**
```bash
git add src/app/play/context/play-context.tsx
git commit -m "feat: create combined play engine context"
```

### Task 2: Migrate layout and navigation guard

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/features/navigation/components/navigation-guard.tsx`

**Step 1: Remove TrackProvider from layout**
Remove `TrackProvider` from `src/app/layout.tsx` imports and JSX tree.

**Step 2: Remove Play dependencies from NavigationGuard**
In `src/features/navigation/components/navigation-guard.tsx`, remove `useTrackSync` and `useStage`. The Navigation Guard should not read `gameSession` to redirect; instead it should only check `sessionResults` for the Score route. If `ROUTES.PLAY`, check `selectedTrack` and redirect if missing. Do not call `setGameSession(null)` here; the `/play` page or Score engine should manage its own state lifecycle.

**Step 3: Commit**
```bash
git add src/app/layout.tsx src/features/navigation/components/navigation-guard.tsx
git commit -m "refactor: remove TrackProvider from layout and clean up NavigationGuard"
```

### Task 3: Strip Context from MIDI Assets

**Files:**
- Delete: `src/features/midi-assets/context/track-context.tsx`
- Delete: `src/features/midi-assets/context/track-context.test.tsx`
- Modify: `src/features/midi-assets/index.ts`

**Step 1: Delete context files and update barrel export**
Remove context files and remove `TrackProvider`, `useTrack` exports from `src/features/midi-assets/index.ts`.

**Step 2: Run typecheck**
Run: `npm run type-check`
Expected: FAIL (play-page.client.tsx and use-track-sync.ts will complain about missing useTrack).

**Step 3: Commit**
```bash
git rm src/features/midi-assets/context/track-context.tsx src/features/midi-assets/context/track-context.test.tsx
git add src/features/midi-assets/index.ts
git commit -m "refactor: remove context from midi-assets domain"
```

### Task 4: Remove Track Sync orchestration hook

**Files:**
- Delete: `src/features/collection/hooks/use-track-sync.ts`
- Modify: `src/features/collection/index.ts`

**Step 1: Delete use-track-sync.ts and clean up barrel**
Delete the file and remove its export from `src/features/collection/index.ts`.

**Step 2: Commit**
```bash
git rm src/features/collection/hooks/use-track-sync.ts
git add src/features/collection/index.ts
git commit -m "refactor: delete useTrackSync hook"
```

### Task 5: Integrate PlayContext into Play Page Client

**Files:**
- Modify: `src/app/play/components/play-page.client.tsx`
- Modify: `src/app/play/page.tsx`

**Step 1: Update page.tsx to provide PlayProvider**
Wrap the page content in `<PlayProvider>`.

**Step 2: Update play-page.client.tsx**
Replace `useStage` and `useTrack` with `usePlay`.
Read `selectedTrack` from `useCollection`. If it exists but `playStatus` is not ready, start the fetching/parsing logic inline via a React `use()` promise or throw the promise to trigger Suspense (`loading.tsx`). Let the parsing logic use `loadMidiFile`, `parseMidiNotes`, and `buildMidiNoteGroups`.

**Step 3: Verify build and types**
Run: `npm run type-check && npm run lint`
Expected: PASS

**Step 4: Commit**
```bash
git add src/app/play/components/play-page.client.tsx src/app/play/page.tsx
git commit -m "refactor: integrate PlayContext and native Suspense loading"
```
