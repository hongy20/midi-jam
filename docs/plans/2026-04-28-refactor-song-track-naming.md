# Refactor Track and Collection Naming

This plan outlines the steps to refactor and rename song/track related files, directories, and variables to improve clarity and consistency, while preserving existing UI text.

## Proposed Changes

### 1. Refactor Collection Feature

Renaming `song-card` to `track-card` and `song-track` to `get-collection`.

- [MODIFY] [src/features/collection/index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/index.ts): Update exports for `TrackCard` and `getCollection`.
- [NEW] [src/features/collection/components/track-card.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/components/track-card.tsx): Renamed from `song-card.tsx`. Component renamed to `TrackCard`.
- [NEW] [src/features/collection/lib/get-collection.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/lib/get-collection.ts): Renamed from `song-track.ts`. Function renamed to `getCollection`.
- [NEW] [src/features/collection/lib/get-collection.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/lib/get-collection.test.ts): Renamed from `song-track.test.ts`.
- [DELETE] [src/features/collection/components/song-card.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/components/song-card.tsx)
- [DELETE] [src/features/collection/lib/song-track.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/lib/song-track.ts)
- [DELETE] [src/features/collection/lib/song-track.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/lib/song-track.test.ts)

### 2. Refactor Track Parser Feature (formerly MIDI Assets)

Renaming `midi-assets` to `track-parser` and removing redundant `midi-` prefixes.

- [NEW] [src/features/track-parser/index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/track-parser/index.ts): Renamed from `src/features/midi-assets/index.ts`.
- [NEW] [src/features/track-parser/lib/](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/track-parser/lib/): Renamed from `src/features/midi-assets/lib/`.
  - Files renamed to remove `midi-` prefix (e.g., `loader.ts`, `barline-parser.ts`, `track-data-loader.ts`).
- [DELETE] [src/features/midi-assets/](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/)

### 3. Variable and Prop Renaming

Updating variables and props from "song" to "track" while keeping UI text unchanged.

- [MODIFY] [src/app/home/components/home-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/home/components/home-page.view.tsx): Rename `songsCount` prop to `tracksCount`. **Keep label "SONGS" in UI text.**
- [MODIFY] [src/app/home/components/home-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/home/components/home-page.client.tsx): Update `songsCount` to `tracksCount`.
- [MODIFY] [src/features/gameplay/lib/score-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/gameplay/lib/score-utils.ts): Rename references of "songs" to "tracks" in comments/internal logic.
- [MODIFY] [src/features/piano/lib/utils.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/piano/lib/utils.test.ts): Update "song" references to "track".

### 4. Global Import Updates

- Update all occurrences of `@/features/midi-assets` to `@/features/track-parser`.
- Update all imports of `SongCard` to `TrackCard`.
- Update all imports of `getSongTracks` to `getCollection`.

## Verification Plan

### Automated Tests

- Run `npm test` to ensure all tests pass after renaming.
- Run `npm run type-check` to verify no broken imports or type errors.
- Run `npm run lint` to ensure style consistency.

### Manual Verification

- Verify that the game still loads and plays tracks correctly.
- Confirm that UI text (e.g., "SONGS" stats, loading tips) remains unchanged.
