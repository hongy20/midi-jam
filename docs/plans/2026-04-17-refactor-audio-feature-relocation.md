# 2026-04-17 Refactor Audio Feature Scope

Refactor the `features/audio` module by moving track-listing logic to `features/collection` and renaming the remaining synthesis logic to better reflect its purpose.

## Proposed Changes

### 1. Relocate Sound Track Logic
Move `sound-track.ts` and its tests from the audio feature to the collection feature.

- [MODIFY] [sound-track.ts](src/features/audio/lib/sound-track.ts) -> move to `src/features/collection/lib/sound-track.ts`
- [MODIFY] [sound-track.test.ts](src/features/audio/lib/sound-track.test.ts) -> move to `src/features/collection/lib/sound-track.test.ts`

### 2. Update Feature Exports
- [MODIFY] `src/features/collection/index.ts`: Export `getSoundTracks`.
- [MODIFY] `src/features/audio/index.ts`: Remove `getSoundTracks` export.

### 3. Rename Audio Feature to Audio Synthesis
Rename `src/features/audio` to `src/features/audio-synthesis` to better describe its role (MIDI-to-audio synthesis using Tone.js).

- [MODIFY] `src/features/audio/hooks/use-midi-audio.ts` -> move to `src/features/audio-synthesis/hooks/use-midi-audio.ts`
- [MODIFY] `src/features/audio/hooks/use-midi-audio.test.ts` -> move to `src/features/audio-synthesis/hooks/use-midi-audio.test.ts`
- [MODIFY] `src/features/audio/index.ts` -> move to `src/features/audio-synthesis/index.ts`

### 4. Update Consumers
Update all imports to point to the new locations.

- [MODIFY] `src/app/collection/page.tsx`: Update `getSoundTracks` import.
- [MODIFY] `src/app/home/page.tsx`: Update `getSoundTracks` import.
- [MODIFY] `src/app/play/components/play-page.client.tsx`: Update `useMidiAudio` import to `@/features/audio-synthesis`.

### 5. Documentation
- [MODIFY] `AGENTS.md`: Update the features list to replace `audio` with `audio-synthesis`.

## Open Questions

- **Naming**: Do you prefer `audio-synthesis`, `audio-engine`, or `synth` for the renamed feature? I've used `audio-synthesis` in this plan as it is most descriptive.
- **Shared vs Feature**: I believe it belongs in `features` due to its domain complexity. Does this align with your vision?

## Verification Plan

### Automated Tests
1. Run `npm test` to ensure all tests (including the moved ones) still pass.
2. Run `npm run type-check` to verify import updates.

### Manual Verification
1. Launch dev server.
2. Verify home page and collection page load tracks correctly.
3. Start a song and verify audio synthesis still works.
