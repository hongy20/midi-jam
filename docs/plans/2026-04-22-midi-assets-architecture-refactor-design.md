# Architecture Refactor: Play Engine & MIDI Assets

## 1. Architecture & Domain Boundaries
*   **`features/midi-assets` (Pure Domain Module)**: All React Context (`TrackProvider`, `useTrack`) will be completely removed. This feature will strictly become a pure library of stateless utility functions: `loadMidiFile`, `parseMidiNotes`, and `buildMidiNoteGroups`.
*   **`app/play/context/play-context.tsx` (Colocated Engine)**: A new context that merges the current `StageContext` (score, combo, progress) and the former `TrackContext` (loaded MIDI notes, segments, duration, ready/loading state). This becomes the single source of truth for an active game session.
*   **Cleanup**: We will delete `features/collection/hooks/use-track-sync.ts`, as the track loading orchestration will no longer happen cross-domain. 

## 2. The Next.js Suspense & Loading Flow
*   We will strictly honor the Next.js `loading.tsx` standard. 
*   **Implementation**: We will reuse `app/play/components/play-page.client.tsx`. When it mounts, it will read the `selectedTrack` from `CollectionContext` and initiate the MIDI parsing. 
*   To trigger the Next.js loading boundary, `play-page.client.tsx` will utilize React Suspense by **throwing the parsing promise** (or using React `use()`). This will cleanly bubble up to the native `app/play/loading.tsx` boundary until the track is fully prepared.

## 3. Rendering Segments
*   **Visual Ownership**: The visual components representing the MIDI segments will live exclusively in `app/play/components/lane-stage/` (e.g., `lane-segment.tsx`).
*   **Performance**: As mandated by `AGENTS.md`, these UI components will rely purely on CSS variables, `transform`, and `opacity` to animate seamlessly down the lane at 60fps, managed by the colocated Play Engine.

## 4. ESLint Boundary Enforcement
*   We will add the `import/no-restricted-paths` (or native `no-restricted-imports`) rule to the project's ESLint configuration. 
*   **Rule**: Files matching `src/features/**/*` are strictly forbidden from importing anything from `src/app/**/*`. This will automatically prevent boundary bleeding in the future.
