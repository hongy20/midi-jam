# Implementation Plan: UI Polish and Layout Overhaul

This plan outlines the steps to overhaul the MIDI Jam UI, including a collapsible header, responsive keyboard zooming, and a 3D perspective visualizer.

## Phase 1: Top Bar & Layout Restructuring [checkpoint: 513d6dd]
Goal: Split controls into selectors (top-left, collapsible) and playback controls (top-right, persistent).

- [x] Task: Create `PlaybackControls` component [c59c195]
    - [x] Extract Play, Stop, Mute, and Speed logic from `MidiControlCenter`.
    - [x] Implement a compact, horizontal layout for the top-right position.
- [x] Task: Refactor `MidiControlCenter` to `MusicSelector` [c59c195]
    - [x] Remove playback controls, leaving only the file selection dropdown.
- [x] Task: Update `MidiHeader` for top-left popup behavior [c59c195]
    - [x] Reposition the minimized "Pill" to the top-left.
    - [x] Remove playback-related props and logic.
    - [x] Ensure the expanded popup only contains selectors.
- [x] Task: Refactor `src/app/page.tsx` for the new Top Bar [c59c195]
    - [x] Integrate `MidiHeader` (top-left) and `PlaybackControls` (top-right).
    - [x] Ensure both remain fixed and accessible.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Top Bar' (Protocol in workflow.md)

## Phase 2: Responsive & Zoomable Keyboard [checkpoint: e2fc7d1]
Goal: Make the keyboard responsive to the viewport width and implement contextual zooming based on the MIDI file's note range.

- [x] Task: Update `PianoKeyboard` for responsiveness [84d0414]
    - [x] Remove `min-w-[1200px]` and `overflow-x-auto` from `PianoKeyboard`.
    - [x] Ensure key widths are calculated as percentages of the container width.
- [x] Task: Implement dynamic note range in `PianoKeyboard` [84d0414]
    - [x] Add `rangeStart` and `rangeEnd` props to `PianoKeyboard`.
    - [x] Update key rendering logic to only display keys within the specified range.
    - [x] Ensure black key positioning remains accurate with a dynamic range.
- [x] Task: Implement note range detection in `src/app/page.tsx` [c1ad65e]
    - [x] Create a utility to analyze `midiEvents` and find the min/max note values.
    - [x] Pass the detected range (plus a 2-3 note buffer) to `PianoKeyboard` and `FalldownVisualizer`.
    - [x] Default to full 88-key range (21-108) when no file is loaded.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Responsive Keyboard' (Protocol in workflow.md) [e2fc7d1]

## Phase 3: 3D Projection & Visual Polish
Goal: Implement a 3D perspective for the visualizer and ensure all elements are sharp and clear.

- [x] Task: Create 3D Visualizer Container [38bb052]
    - [x] Implement a container with `perspective` and `transform-style: preserve-3d`.
    - [x] Apply 3D rotation/tilt to the `FalldownVisualizer` and `PianoKeyboard` to create the "track" effect.
    - [x] Configure the "vanishing point" to be centered/elevated.
- [x] Task: Optimize `FalldownVisualizer` for sharpness [38bb052]
    - [x] Synchronize `FalldownVisualizer` horizontal positioning with the keyboard's dynamic range.
    - [x] Use `will-change: transform` and `translate3d` for smooth, sharp animations.
    - [x] Audit sharpness; if CSS divs remain blurry under 3D transform, refactor core note rendering to SVG.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: 3D Perspective' (Protocol in workflow.md)

## Phase 4: Final Refinement & Mobile Optimization
Goal: Ensure the new UI is polished across all device sizes and follows accessibility best practices.

- [ ] Task: Mobile Responsiveness Audit
    - [ ] Adjust 3D perspective intensity for mobile portrait vs landscape.
    - [ ] Ensure touch targets in the minimized header are adequate.
- [ ] Task: Final CSS Polish and Transitions
    - [ ] Add smooth transitions for header expansion and keyboard zooming.
    - [ ] Final check for color contrast and layout spacing.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Refinement' (Protocol in workflow.md)
