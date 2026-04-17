# Plan: Collection Page Refactor

This plan outlines the refactor of the Song Collection page to align with the coding patterns and UI architecture standards defined in `AGENTS.md`.

## 1. Objectives

- **Deep Destructuring**: Extract `setSelectedTrack` and `selectedTrack` directly from `useAppContext`.
- **List Abstraction**: Move the track list item logic into a dedicated `TrackCard` component in `src/components/track-card/`.
- **Inline Handlers**: Replace the `handleSurprise`, `handlePlay`, and `handleBack` functions with inline logic in the component's JSX.
- **Grouped Status UI**: Consolidate the `isLoading` and track mapping logic into a single nested ternary block.
- **Minimal DOM Nesting**: Flatten the main grid layout and simplify the card structure.
- **HTML Attribute Extension**: Ensure the new `TrackCard` extends `ButtonHTMLAttributes<HTMLButtonElement>`.

## 2. Refactoring Details

### A. Context & Navigation

**Current:**

```tsx
const { toPlay, toGear } = useNavigation();
const { collection: contextCollection } = useAppContext();
const { setSelectedTrack, selectedTrack } = contextCollection;
```

**Refactored:**

```tsx
const { toPlay, toGear } = useNavigation();
const {
  collection: { setSelectedTrack, selectedTrack },
} = useAppContext();
```

### B. TrackCard Abstraction

Create `src/components/track-card/track-card.tsx` and `track-card.module.css`.

- **Props**: `track`, `isSelected`, `onClick`, and standard `ButtonHTMLAttributes`.
- **Style**: Use the established 3xl rounded corners, border transitions, and "active" state colors.

### C. UI Block Consolidation

The main content will use a grouped ternary:

```tsx
{
  isLoading ? (
    <LoadingState />
  ) : tracks.length === 0 ? (
    <EmptyState />
  ) : (
    <div className={styles.grid}>
      {tracks.map((track) => (
        <TrackCard
          key={track.id}
          track={track}
          isSelected={selected === track.id}
          onClick={() => setSelected(track.id)}
        />
      ))}
    </div>
  );
}
```

## 3. Verification Plan

- [ ] Verify `npm run lint` passes.
- [ ] Verify `npm run type-check` passes.
- [ ] Verify `npm test` passes.
- [ ] Manual check: Song selection works.
- [ ] Manual check: "SURPRISE" button correctly selects a random track.
- [ ] Manual check: "PLAY" button correctly sets the track in context and navigates.
