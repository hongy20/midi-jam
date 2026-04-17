# 2026-04-17 Audio Player Refactor & Type Relocation

Refactor the `audio-player` feature by relocating the automated playback logic and centralizing core MIDI types like `MidiNoteGroup` into the `shared` layer to eliminate cross-feature dependencies.

## Proposed Changes

### 1. Rename Feature to Audio Player
Rename `src/features/note-player` to `src/features/audio-player`.

### 2. Relocate and Rename Playback Hook
Move the hook to the `audio-player` feature and rename it for clarity.

- [MODIFY] `src/app/play/hooks/use-demo-playback.ts` -> move to `src/features/audio-player/hooks/use-track-player.ts`
- [MODIFY] `src/app/play/hooks/use-demo-playback.test.ts` -> move to `src/features/audio-player/hooks/use-track-player.test.ts`

### 3. Refactor Hook Logic
- Rename the function to `useTrackPlayer`.
- Merge `demoMode` and `isLoading` into a single `enabled` prop.
- Update internal guards and tests to use `enabled`.

### 4. Relocate MidiNoteGroup Type
Move the `MidiNoteGroup` interface to `shared` to resolve cross-feature dependency issues.

- [MODIFY] `src/shared/types/midi.ts`: Add `MidiNoteGroup` definition.
- [MODIFY] `src/features/midi-assets/lib/lane-segment-utils.ts`: Remove local definition.
- [MODIFY] `src/features/midi-assets/index.ts`: Remove from barrel export.
- [MODIFY] Update imports in `audio-player`, `midi-assets`, `collection`, and several UI components.

### 5. Update Feature Exports
- [MODIFY] `src/features/audio-player/index.ts`: Export `useTrackPlayer` and `useNotePlayer`.

### 6. Documentation
- [MODIFY] `AGENTS.md`: Update feature list to `audio-player`.

## Open Questions
None. (Naming resolved to `audio-player` and `useTrackPlayer`, type movement to `shared` approved).

## Verification Plan

### Automated Tests
1. Run `npm test` to ensure the sequencer tests still pass in the new location.
2. Run `npm run type-check`.

### Manual Verification
1. Launch the dev server.
2. Enter a song.
3. Toggle Demo Mode and verify that notes still play correctly when they cross the line.
