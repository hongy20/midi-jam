# Design Document: Piano Feature Reorganization

## Overview
This document outlines the architectural shift from colocated piano logic in the `/play` route to a centralized `features/piano` domain. This move aligns with the project's layered, domain-driven architecture guidelines and prepares the codebase for multi-instrument support (e.g., Drums) without compromising the high-performance rendering of the Gameplay Stage.

## Goals
1. **Encapsulation**: Move all piano-specific math, constants, and UI components into `src/features/piano`.
2. **Decoupling**: Standardize how the Gameplay Stage (Lanes) interacts with instrument layouts without hardcoding piano-specific paths.
3. **Performance Preservation**: Maintain the 60fps compositor-driven rendering in the `/play` route by preserving CSS Module class usage and specialized animation timing.
4. **Documentation Alignment**: Correct `AGENTS.md` to reflect the actual project structure.

## Proposed Changes

### 1. New Feature: `src/features/piano`
This feature will become the single source of truth for the Piano instrument.
- **`lib/piano.ts`**: (Moved from `app/play/lib`) Orchestrates the 21-unit octave grid math.
- **`lib/constants.ts`**: (Moved from `midi-assets`) Contains `PIANO_88_KEY_MIN/MAX` and `MIDI_NOTE_C4`.
- **`components/piano-keyboard/`**: (Moved from `app/play/components`) The interactive React keyboard.
- **`styles/piano-grid.module.css`**: The CSS classes used for pixel-perfect alignment.
- **`index.ts`**: Public API exporting the component and layout utilities.

### 2. Gameplay Stage Refactor (`src/app/play`)
- **`LaneSegment.tsx`**: Update imports to use the centralized piano styles while keeping the core animation logic (`useLayoutEffect` / `requestAnimationFrame`) untouched.
- **`PlayPageClient.tsx`**: Update constant and utility imports.

### 3. Guidelines Update
- **`AGENTS.md`**: Update Section 0 to reference `src/shared/components/ui/` instead of `src/components/ui/`.

## Performance Considerations
- **No Data-Attribute Switch**: To avoid potential performance regressions in complex chord rendering, we will continue using direct CSS Class selectors for note positioning.
- **Surgical Moves**: Files will be moved via Git to preserve history, and logic changes will be minimized to "import updates only" where possible.

## Verification Plan
1. **Unit Tests**: Run `npm test` to ensure `piano.test.ts` and `midi-parser.test.ts` still pass after reorganization.
2. **Visual Audit**: Manually verify that the Piano Keyboard and falling notes remain perfectly aligned in the `/play` route across different themes.
3. **Build Check**: Run `npm run build` to ensure no broken imports or type errors.
