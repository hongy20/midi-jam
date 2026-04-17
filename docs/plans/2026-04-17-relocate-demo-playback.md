# 2026-04-17 Relocate and Refactor useDemoPlayback

Relocate `useDemoPlayback` from the Play page hooks to the `audio-player` feature and rename it to `useAutoPlay` to reflect its role in automated gameplay.

## Proposed Changes

### 1. Rename Feature to Audio Player
Rename `src/features/note-player` to `src/features/audio-player`.

### 2. Relocate and Rename Hook
Move the hook to the `audio-player` feature.

- [MODIFY] `src/app/play/hooks/use-demo-playback.ts` -> move to `src/features/audio-player/hooks/use-auto-play.ts`
- [MODIFY] `src/app/play/hooks/use-demo-playback.test.ts` -> move to `src/features/audio-player/hooks/use-auto-play.test.ts`

### 3. Refactor Hook Logic
- Rename the function to `useAutoPlay`.
- Merge `demoMode` and `isLoading` into a single `enabled` prop.
- Update internal guards to use `enabled`.

### 4. Update Feature Exports
- [MODIFY] `src/features/audio-player/index.ts`: Export `useAutoPlay` and `useNotePlayer`.

### 5. Update Consumers
- [MODIFY] `src/app/play/components/play-page.client.tsx`: Update imports and usage. Pass `enabled={demoMode && !isLoading && groups.length > 0}` to the hook.

### 6. Documentation
- [MODIFY] `AGENTS.md`: Update the features list to replace `note-player` with `audio-player`.

## Open Questions
None. (Naming resolved to `audio-player` and `useAutoPlay`, prop merging approved).

## Verification Plan

### Automated Tests
1. Run `npm test` to ensure the sequencer tests still pass in the new location.
2. Run `npm run type-check`.

### Manual Verification
1. Launch the dev server.
2. Enter a song.
3. Toggle Demo Mode and verify that notes still play correctly when they cross the line.
