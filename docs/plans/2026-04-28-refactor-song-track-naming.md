# Refactor Song Track Naming

This plan outlines the steps to refactor and rename song track related files and directories to improve clarity and consistency.

## Proposed Changes

### 1. Refactor Collection Feature
Renaming `song-track.ts` to `get-collection.ts` for better clarity on its purpose.

- [MODIFY] [src/features/collection/index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/index.ts): Update export path.
- [NEW] [src/features/collection/lib/get-collection.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/lib/get-collection.ts): Renamed from `song-track.ts`.
- [NEW] [src/features/collection/lib/get-collection.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/lib/get-collection.test.ts): Renamed from `song-track.test.ts`.
- [DELETE] [src/features/collection/lib/song-track.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/lib/song-track.ts)
- [DELETE] [src/features/collection/lib/song-track.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/lib/song-track.test.ts)

### 2. Refactor MIDI Assets Feature
Renaming `midi-assets` feature to `song-track` and removing redundant `midi-` prefixes from internal library files.

- [NEW] [src/features/song-track/index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/song-track/index.ts): Renamed from `src/features/midi-assets/index.ts`, updating export path.
- [NEW] [src/features/song-track/lib/](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/song-track/lib/): Renamed from `src/features/midi-assets/lib/`.
    - `constant.ts` (unchanged)
    - `barline-parser.ts` (renamed from `midi-barline-parser.ts`)
    - `barline-parser.test.ts` (renamed from `midi-barline-parser.test.ts`)
    - `loader.ts` (renamed from `midi-loader.ts`)
    - `loader.test.ts` (renamed from `midi-loader.test.ts`)
    - `note-group-parser.ts` (renamed from `midi-note-group-parser.ts`)
    - `note-group-parser.test.ts` (renamed from `midi-note-group-parser.test.ts`)
    - `note-group-parser.integration.test.ts` (renamed from `midi-note-group-parser.integration.test.ts`)
    - `note-parser.ts` (renamed from `midi-note-parser.ts`)
    - `note-parser.test.ts` (renamed from `midi-note-parser.test.ts`)
    - `track-data-loader.ts` (renamed from `midi-track-data-loader.ts`)
- [DELETE] [src/features/midi-assets/](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/)

### 3. Global Import Updates
- Update all occurrences of `@/features/midi-assets` to `@/features/song-track`.
- Update any relative imports within the renamed features.
- Update references in `src/app/play/components/play-page.client.tsx`.

## Verification Plan

### Automated Tests
- Run `npm test` to ensure all tests pass after renaming.
- Run `npm run type-check` to verify no broken imports or type errors.
- Run `npm run lint` to ensure style consistency.

### Manual Verification
- Verify that the game still loads and plays MIDI tracks correctly in the browser.
