# Refactor useTrackPlayer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `useTrackPlayer` to internalize audio logic and state management, simplifying the `PlayPageClient`.

**Architecture:** Internalize `useNotePlayer` logic and `playbackNotes` state within `useTrackPlayer`. Update `PlayPageClient` to consume the returned state and remove boilerplate callbacks.

**Tech Stack:** Next.js (App Router), React 19, Tone.js, Web MIDI API.

---

### Task 1: Update `useTrackPlayer` Props and State

**Files:**

- Modify: `src/features/audio-player/hooks/use-track-player.ts`

**Step 1: Write the failing test**
Update `useTrackPlayer.test.ts` to expect `playbackNotes` return value and new props.

**Step 2: Run test to verify it fails**
Run: `npm test src/features/audio-player/hooks/use-track-player.test.ts`
Expected: FAIL (Type mismatch/Missing props)

**Step 3: Update Types and Internalize useNotePlayer**

- Update `UseTrackPlayerProps` to include `selectedMIDIOutput` and `processNoteEvent`.
- Remove `onNoteOn` and `onNoteOff` from props.
- Add `useState<Set<number>>(new Set())` for `playbackNotes`.
- Call `useNotePlayer(selectedMIDIOutput)` internally.

**Step 4: Update logic and return state**

- Update `handleNoteOn` and `handleNoteOff` within the `useEffect` to trigger audio and update the `playbackNotes` state.
- Ensure `processNoteEvent` is called if provided.
- Return `{ playbackNotes }` from the hook.

**Step 5: Commit**

```bash
git add src/features/audio-player/hooks/use-track-player.ts
git commit -m "feat(audio-player): internalize state and audio in useTrackPlayer"
```

### Task 2: Update `PlayPageClient` Consumption

**Files:**

- Modify: `src/app/play/components/play-page.client.tsx`

**Step 1: Simplify Hook Consumption**

- Remove `useNotePlayer` hook call.
- Remove `playbackNotes` state and local `onNoteOn`/`onNoteOff` callbacks.
- Update `useTrackPlayer` call to pass `selectedMIDIOutput` and `processNoteEvent`.
- Destructure `playbackNotes` from `useTrackPlayer`.

**Step 2: Commit**

```bash
git add src/app/play/components/play-page.client.tsx
git commit -m "refactor(play): simplify PlayPageClient by using refactored useTrackPlayer"
```

### Task 3: Internalize `useNotePlayer` (Hiding Public API)

**Files:**

- Modify: `src/features/audio-player/index.ts`

**Step 1: Remove Export**

- Remove `export { useNotePlayer }` from the barrel file.

**Step 2: Commit**

```bash
git add src/features/audio-player/index.ts
git commit -m "refactor(audio-player): hide useNotePlayer from public feature API"
```

### Task 4: Final Verification and Cleanup

**Step 1: Run Full Test Suite**
Run: `npm test` and `npm run type-check`

**Step 2: Verify Linting**
Run: `npm run lint`

**Step 3: Commit Cleanups**

```bash
git commit -m "chore: final cleanup and verification"
```
