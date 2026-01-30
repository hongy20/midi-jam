# Specification: MIDI File Support and Falldown Visualizer

## Overview
This track introduces the ability to load, play, and visualize MIDI files (`.mid`). It features a server-side file listing mechanism, playback controls, and a "falldown" (piano roll) visualizer that synchronizes with a responsive 88-key piano.

## Functional Requirements
### 1. File Management & Server Integration
- **Directory**: Create `public/midi/` for file storage.
- **Server Action**: 
    - Automatically list and format filenames (snake/camel/kebab to capitalized words).
    - Return objects with `name` and `url`.
    - Sort alphabetically.

### 2. UI Components (MIDI Control Center)
- **Controls**: Dropdown selector, Play, Pause, Stop buttons, and Speed selector ([0.5, 1.0, 1.5, 2.0]).
- **Falldown Visualizer**:
    - A vertical area above the piano keyboard.
    - Notes fall from top to bottom, aligned horizontally with the corresponding piano keys.
    - Responsive to the 88-key layout and horizontal scrolling.
- **Concurrent Input**: Render notes from both the MIDI file AND live MIDI instrument input simultaneously.

### 3. MIDI & Animation Logic
- **Parsing**: Use `@tonejs/midi` for binary file parsing.
- **Animation**: Use Pure CSS and React state for the "falling" effect. Notes must be rendered as DOM elements with calculated `top`, `height`, and `left` positions based on MIDI timestamps.

## Non-Functional Requirements
- **Performance**: Efficient DOM rendering for the visualizer (avoiding unnecessary re-renders of the entire piano roll).
- **Synchronization**: Frame-accurate timing between the falldown bars and the piano key highlights.

## Acceptance Criteria
- [ ] Server Action returns a correctly formatted and sorted file list.
- [ ] Selecting a file and clicking "Play" starts the falldown animation.
- [ ] Falling notes strike the piano keyboard exactly when the sound/highlight triggers.
- [ ] Speed adjustments correctly scale both audio event timing and animation speed.
- [ ] UI remains accessible and responsive on mobile devices.

## Out of Scope
- Recording or editing MIDI files.
- Persistent user libraries (database-backed).
