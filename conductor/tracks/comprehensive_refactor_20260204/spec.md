# Track Specification - Comprehensive Repository Review & Refactor

## Overview
A top-to-bottom review and refactor of the entire codebase to improve code quality, architectural consistency, test coverage, and performance. This track is fully driven by the user.

## Objectives
- **Code Quality:** Ensure all modules adhere to strict TypeScript patterns and Biome standards.
- **Architecture:** Decouple logic from presentation, standardize hook interfaces, and ensure pure functional utilities where possible.
- **Test Coverage:** Aim for >80% coverage across all modules, focusing on edge cases and complex state transitions.
- **Performance:** Optimize real-time MIDI processing and minimize React re-renders in the visualizer and HUD.

## Functional Requirements
- Review and refine `useMidiPlayer`, `useScoreEngine`, and `useMidiAudio` for state management efficiency.
- Standardize the `scoreStorage` interface and error handling.
- Audit UI components (`FalldownVisualizer`, `ScoreHud`, `PianoKeyboard`) for layout efficiency and animation performance.
- Ensure consistent accessibility (ARIA labels, keyboard navigation) across all interactive elements.

## Acceptance Criteria
- [ ] No Biome linting or formatting errors in the entire `src/` directory.
- [ ] Unit test coverage exceeds 80% for all library modules and custom hooks.
- [ ] No "any" types or suppressed TypeScript errors.
- [ ] Visualizer remains performant (60fps) during dense MIDI playback.
- [ ] Clean separation between MIDI logic, audio synthesis, and UI rendering.

## Out of Scope
- Adding new user-facing features.
- Changing the existing UI/UX design (unless for performance or accessibility fixes).
