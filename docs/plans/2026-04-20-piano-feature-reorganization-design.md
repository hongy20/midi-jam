# Implementation Plan: Piano Feature Reorganization

## Overview

This document outlines the architectural shift from colocated piano logic in the `/play` route to a centralized `features/piano` domain. This move aligns with the project's layered, domain-driven architecture guidelines and prepares the codebase for multi-instrument support (e.g., Drums) without compromising the high-performance rendering of the Gameplay Stage.

## Proposed Changes

### 1. Document Cleanup

- **[MODIFY] [AGENTS.md](file:///Users/yanhong/Github/hongy20/midi-jam/AGENTS.md)**: Update Section 0 to reference `src/shared/components/ui/`.

### 2. Piano Feature Extraction (`src/features/piano`)

- **[NEW] [constants.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/piano/lib/constants.ts)**: Move `PIANO_88_KEY_MIN`, `PIANO_88_KEY_MAX`, and `MIDI_NOTE_C4` from `midi-assets`.
- **[NEW] [piano.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/piano/lib/piano.ts)**: Move from `src/app/play/lib/piano.ts`.
- **[NEW] [piano.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/piano/lib/piano.test.ts)**: Move from `src/app/play/lib/piano.test.ts`.
- **[NEW] [piano-keyboard/](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/piano/components/piano-keyboard/)**: Move the entire directory from `src/app/play/components/piano-keyboard/`.
- **[NEW] [index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/piano/index.ts)**: Export the component and layout utilities.

### 3. Dependency Updates

- **[MODIFY] [midi-parser.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-parser.ts)**: Update piano constant imports.
- **[MODIFY] [play-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.client.tsx)**: Update imports to use `@/features/piano`.
- **[MODIFY] [lane-segment.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/lane-stage/lane-segment.tsx)**: Update CSS Module import path.

## Performance Preservation

- **No Data-Attribute Switch**: To avoid potential performance regressions in complex chord rendering, we will continue using direct CSS Class selectors for note positioning.
- **Surgical Moves**: Files will be moved via Git to preserve history, and logic changes will be minimized to "import updates only" where possible.

## Verification Plan

1. **Unit Tests**: Run `npm test` to ensure `piano.test.ts` and `midi-parser.test.ts` still pass after reorganization.
2. **Visual Audit**: Manually verify that the Piano Keyboard and falling notes remain perfectly aligned in the `/play` route across different themes.
3. **Build Check**: Run `npm run build` to ensure no broken imports or type errors.
