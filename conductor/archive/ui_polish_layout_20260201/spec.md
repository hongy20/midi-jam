# Track Specification: UI Polish and Layout Overhaul

## Overview
This track focuses on enhancing the user interface and experience of the MIDI Jam application. Key improvements include a more efficient layout with collapsible controls, a responsive and context-aware piano keyboard, and a "3D perspective" visualizer inspired by rhythm games to create a more immersive "track-like" experience.

## Functional Requirements

### 1. Collapsible Control Header
- Move MIDI device selector and music selector to a fixed header at the top of the page.
- Implement a "Minimized" state: After a selection is made, the header collapses into a compact status bar (e.g., "Connected: [Device] | Music: [Song]").
- Implement an "Expanded" state: Clicking the status bar expands the full selector UI.

### 2. Responsive Piano Keyboard
- The keyboard must span the full width of the viewport and be non-scrollable horizontally.
- The keyboard must be responsive, adjusting key widths to fit the screen size.

### 3. Contextual Keyboard Zooming
- When a MIDI file is loaded:
    - Analyze the file to find the lowest and highest MIDI notes.
    - Automatically "zoom in" the keyboard to show only the active range (plus a small buffer of 2-3 notes on each side).
- When no MIDI file is loaded (live jamming):
    - Default to the full 88-key range.

### 4. 3D Perspective Visualizer
- Implement a 3D projection for the falldown note visualizer and the piano keyboard.
- Create a "vanishing point" effect in the center or upper portion of the screen, making notes appear to travel from the distance toward the user.
- The piano keyboard should appear "closer" to the user at the bottom of the perspective.

### 5. Visual Polish and Sharpness
- Resolve the "blurriness" in the falldown note visualizer.
- Optimize HTML/CSS rendering for sharpness (e.g., using `transform: translate3d`, high-quality rendering properties).
- Fallback to SVG rendering if CSS optimization does not achieve the desired sharpness.

## Acceptance Criteria
- [ ] Controls are accessible via a compact status bar when minimized.
- [ ] Keyboard is fully responsive and fits the viewport width without scrolling.
- [ ] Keyboard automatically zooms to the relevant note range when a MIDI file is loaded.
- [ ] The visualizer exhibits a clear 3D perspective with a central vanishing point.
- [ ] Notes in the falldown visualizer appear sharp and clear, even during animation.

## Out of Scope
- Adding new MIDI processing features (e.g., recording).
- Implementing multi-instrument visualization (staying focused on piano).
