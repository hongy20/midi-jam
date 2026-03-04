# Design: CSS-Driven Piano Visibility & Range Calculation

## Overview
Refactor the MIDI visualization logic to shift the "source of truth" for visible notes from JavaScript arrays (`visibleNotes`) to CSS Grid variables (`--start-unit`, `--end-unit`). This simplifies component logic, improves performance by reducing React re-renders, and leverages the browser's CSS Grid engine for layout and clipping.

## Objectives
1.  **Remove `visibleNotes` JS Filtering**: Components will render a "universe" of notes (MIDI 21–108) and let CSS handle visibility.
2.  **Dynamic Range Calculation**: Implement a utility to calculate the optimal viewport range based on the MIDI track's notes, with a small buffer.
3.  **Unified Grid Logic**: Ensure all components (BackgroundLane, TrackLane, PianoKeyboard) use the same CSS variables for alignment.

## Architecture & Data Flow

### 1. Range Utility (`src/lib/device/piano.ts`)
A new function `getVisibleMidiRange(notes: number[])` will:
- Identify the `min` and `max` MIDI notes in the track.
- Add a buffer of **2 white keys** to both sides (e.g., if the highest note is C4, the buffer extends to E4).
- Clamp the range to `PIANO_88_KEY_MIN` (21) and `PIANO_88_KEY_MAX` (108).
- Return `{ startNote, endNote }`.

Using white keys for the buffer ensures that the viewport always ends on a "full" key boundary and provides consistent visual spacing.

### 2. Page-Level Orchestration (`src/app/game/page.tsx`)
The `GamePage` will:
- Call `getVisibleMidiRange` once the track is loaded.
- Use `getNoteUnits(startNote, endNote)` to get `--start-unit` and `--end-unit`.
- Apply these units as CSS variables to the root container.

### 3. Component Implementation

#### BackgroundLane & PianoKeyboard
- **Remove Props**: Remove `notes`, `rangeStart`, and `rangeEnd` props where they are used for filtering.
- **Render Loop**: Iterate from `PIANO_88_KEY_MIN` (21) to `PIANO_88_KEY_MAX` (108).
- **CSS Clipping**: The container's `overflow: hidden` and the grid's `grid-column` calculation will naturally hide keys outside the `--start-unit` to `--end-unit` range.

#### KeyGlows
- **Remove Filtering**: Render all currently active notes (live + playback).
- **Positioning**: Rely on the same `gridStyles` as the keys to place glows correctly on the grid.

## CSS Changes (`src/components/piano-keyboard/piano-grid.module.css`)
- **Consistency**: All `note-X` classes (already defined for 21-108) must use the `noteBase` composition for `grid-column` calculation.

## Performance Considerations
- **DOM Size**: Rendering 88 keys is negligible for modern browsers (~100–200 DOM nodes).
- **Layout**: CSS Grid updates (variable changes) are handled by the browser's style/layout pass, which is significantly faster than React's reconciliation for large lists of elements.

## Testing Strategy
- **Visual Verification**: Ensure the "snapped" range correctly shows the song's notes plus the requested buffer.
- **Edge Cases**: Verify that notes at the very edges of the piano (21 and 108) render correctly when they are the min/max.
- **Active Notes**: Confirm that "Glows" for off-screen notes do not cause layout shifts or scrollbar issues.
