# Play Route Refactoring Design

**Goal:** Modernize the `app/play` route architecture, simplify the `midi-assets` API, and decouple the visualizer for future instrument support (e.g., Drums).

## Proposed Changes

### 1. `src/features/midi-assets` (Rescoped: MIDI Data Pipeline)
- **Consolidate Exports**: Add `getTrackData(url: string)` to `lib/midi-loader.ts`.
- **Logic**: This function will await `loadMidiFile`, then call `parseMidiNotes`, calculate `totalDurationMs`, and finally `buildMidiNoteGroups`.
- **Public API**: Export `getTrackData` from `index.ts`.

### 2. `src/features/visualizer` [NEW] (Generic Rendering Engine)
- **Domain**: High-performance "falldown" visualizer logic.
- **Components**:
    - `LaneStage`: The scrolling container. It will now accept `noteClassName` and `children` (for background) to remain instrument-agnostic.
    - `LaneSegment`: Renders individual notes. Uses `noteClassName` prop instead of hardcoded piano classes.
- **Styling**: Generic CSS module for layout; instrument-specific alignment is provided via the `noteClassName` (e.g., `PIANO_GRID_ITEM_CLASS`).

### 3. `src/features/play-session` (Rescoped: Gameplay State)
- **Timeline Logic**: Move `useLaneTimeline` hook here. It manages the "clock" for the session, which is a core session state.

### 4. `src/app/play` (Route Orchestration)
- **Data Fetching**: Refactor `page.tsx` to fetch `trackDataPromise` server-side and pass it to the client.
- **Client Implementation**:
    - Delete `PlayPageLoader.tsx`.
    - Use `use(trackDataPromise)` in `PlayPageClient.tsx`.
    - Pass `BackgroundLane` and `PIANO_GRID_ITEM_CLASS` into the new generic `LaneStage`.

## Verification Plan
- **Unit Tests**:
    - Verify `getTrackData` correctly aggregates the MIDI pipeline.
    - Test `LaneStage` with a generic mock background.
- **Manual Verification**:
    - Ensure smooth gameplay playback in `/play`.
    - Verify `loading.tsx` correctly triggers during MIDI fetch.
