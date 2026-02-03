# Specification: UX Refinement and MIDI Playback Fixes

This track focuses on polishing the user interface, improving the MIDI playback engine's reliability, and adding visual aids for learning (C4 marker and bar-lines).

## Overview
The goal is to resolve several UX inconsistencies, fix critical playback bugs related to speed and pausing, and enhance the visualizer with better orientation markers.

## Functional Requirements

### 1. UI & Layout Tweaks
- **Header Alignment:** Align the heights of the persistent `PlaybackControls` (top-right) and the minimized `MidiHeader` status pill (top-left).
- **Selection Overlay Polish:**
    - Align the styling (font, color, height) of the Device and Music selectors.
    - Improve the internal layout of the expanded selection overlay for better symmetry.
    - **Auto-Pause:** Automatically pause MIDI playback when the selection overlay is opened.
- **Time Display:** Display the current playback time and total duration at the top of the visualizer area, positioned visually below the `PlaybackControls`.
- **C4 (Middle C) Marker:**
    - Add a clear text label ("C4") to the Middle C key on the `PianoKeyboard`.
    - Modify the auto-zoom/range detection logic to ensure C4 is always visible, regardless of the MIDI file's note range.

### 2. MIDI Playback Fixes
- **Hanging Notes (Pause/Resume):**
    - When pausing: Immediately silence all active MIDI notes to prevent "stuck" sounds.
    - When resuming: Identify which notes were active at the moment of pause and re-trigger (re-strike) them.
- **Speed Adjustment Bug:** Fix the issue where speed adjustments (specifically 0.5x) result in unexpected playback behavior or timing desync.

### 3. Visualizer Enhancements
- **Bar-lines:** Implement horizontal bar-lines in the `FalldownVisualizer`.
    - Logic: Calculate positions based on the MIDI file's time signature and tempo events.
    - Visual: Subtle lines that move downward in sync with the falling notes.

## Acceptance Criteria
- `MidiHeader` and `PlaybackControls` have identical heights and aligned styling.
- Music pauses when the header expands and remains paused until manually resumed or the header closes (if intended).
- C4 is always visible on the keyboard and labeled correctly.
- Playback time is visible and accurate.
- Pausing and resuming music results in a clean stop and a full "re-strike" of active notes.
- 0.5x speed playback works smoothly without jitter or timing errors.
- Bar-lines are visible in the visualizer and accurately reflect the MIDI measures.

## Out of Scope
- Adding support for non-standard time signatures (complex meters).
- Advanced song management (favorites, playlists).
- Recording MIDI input.
