# Refactor SongCard to Features/Collection

Move `SongCard` into `src/features/collection` and unify the track metadata interfaces.

## 1. Design

### Metadata Level

We will introduce `src/shared/types/track.ts` to hold the domain-agnostic metadata for music tracks. This allows any feature or route to reference track info without depending on the `collection` feature's internal types.

### Feature Level

- `SongCard` becomes a part of the `collection` feature's UI.
- The `collection` feature's public API (`index.ts`) will now export `SongCard`.

## 2. Proposed Changes

### [NEW] [track.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/types/track.ts)

```typescript
export interface Track {
  id: string;
  name: string;
  artist: string;
  difficulty: string;
  url: string;
}
```

### [MOVE] [song-card.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/components/song-card.tsx)

- Move component and refactor to use the new `Track` interface.

### [MODIFY] [index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/index.ts)

- Add `SongCard` export.
- Re-export `Track` type.

### [MODIFY] [collection-context.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/context/collection-context.tsx)

- Use shared `Track` type.

### [MODIFY] [sound-track.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/lib/sound-track.ts)

- Use shared `Track` type for `getSoundTracks`.

### [MODIFY] [collection-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/collection/components/collection-page.client.tsx)

- Update imports.

### [MODIFY] [collection-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/collection/components/collection-page.view.tsx)

- Update imports.

### [MODIFY] [collection-page.view.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/collection/components/collection-page.view.stories.tsx)

- Update imports.

## 3. Verification Plan

- `npm run type-check`: Verify all type references are correct.
- `npm run lint`: Ensure code quality.
- Manual check of the Collection page.
