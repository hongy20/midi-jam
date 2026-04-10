# Refactor CollectionPage Architecture (Gear-Style & Cleanup)

## Goal
Refactor the `CollectionPage` from a monolithic client component into a modular structure that matches the immersive, non-grid layout of the `GearPage`. This includes splitting logic from presentation and cleaning up legacy components.

## Proposed Changes

### 1. New Components in `src/app/collection/components/`

#### [NEW] `song-card.tsx`
- **Purpose**: A new carousel item based on the `GearCard` from the Gear page.
- **Features**:
  - Displays song title, artist name, and difficulty level (as a badge).
  - Uses `8bitcn` Card and Badge components.
  - Implements the same hover/selection effects as `GearCard`.

#### [NEW] `collection-header.tsx`
- **Purpose**: A local header component modeled after `GearHeader`.
- **Features**:
  - Displays "CHOOSE SONG" and instructional text.
  - Uses the `retro` font and uppercase tracking for consistency.

#### [NEW] `collection-page.client.tsx`
- **Purpose**: The logic container for the collection page.
- **Responsibilities**:
  - Fetches tracks from `getSoundTracks`.
  - Manages track selection state.
  - Handles the "SHUFFLE" logic.
  - Orchestrates navigation via `useNavigation`.

#### [NEW] `collection-page.view.tsx`
- **Purpose**: The presentation-only view component.
- **Layout**: 
  - Abandons `PageLayout` grid.
  - Uses `<main className="flex flex-col h-dvh items-center justify-evenly p-4 overflow-x-hidden text-center">`.
  - Integrates the `8bitcn` Carousel with `SongCard` children.
  - Renders the primary action buttons (MAIN MENU / CONTINUE) in a bottom-centered group.

### 2. Implementation in `src/app/collection/page.tsx`
- **Conversion**: Convert to a **Server Component**.
- **Metadata**: Add standard Next.js metadata (title: "Collection | MIDI Jam").
- **Root**: Directly renders `<CollectionPageClient />`.

### 3. Cleanup of Legacy Components
The following files are verified to be unused after this refactor and will be deleted:
- `src/components/carousel/carousel.tsx`
- `src/components/carousel/carousel.module.css`
- `src/components/track-card/track-card.tsx`
- `src/components/gear-card/gear-card.tsx` (Old version, replaced by local page component)
- `src/app/collection/page.module.css` (Empty file)

## Verification Plan

### Automated Verification
- `npm run lint` (Biome check)
- `npm run type-check` (TypeScript check)
- `npm test` (Ensure no regressions in existing tests)

### Manual Verification
- Navigate to `/collection` and verify the layout matches the immersive style of `/gear`.
- Verify the `8bitcn` Carousel supports smooth navigation and selection.
- Verify "SHUFFLE" correctly randomizes the selected track.
- Verify navigation to "Select Gear" and "Play" works correctly.
- Check metadata in the browser tab.
