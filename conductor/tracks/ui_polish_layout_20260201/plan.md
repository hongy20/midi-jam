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

## Phase 2: Responsive & Zoomable Keyboard
Goal: Make the keyboard responsive to the viewport width and implement contextual zooming based on the MIDI file's note range.

- [ ] Task: Update `PianoKeyboard` for responsiveness
    - [ ] Remove `min-w-[1200px]` and `overflow-x-auto` from `PianoKeyboard`.
    - [ ] Ensure key widths are calculated as percentages of the container width.
- [ ] Task: Implement dynamic note range in `PianoKeyboard`
    - [ ] Add `rangeStart` and `rangeEnd` props to `PianoKeyboard`.
    - [ ] Update key rendering logic to only display keys within the specified range.
    - [ ] Ensure black key positioning remains accurate with a dynamic range.
- [ ] Task: Implement note range detection in `src/app/page.tsx`
    - [ ] Create a utility to analyze `midiEvents` and find the min/max note values.
    - [ ] Pass the detected range (plus a 2-3 note buffer) to `PianoKeyboard` and `FalldownVisualizer`.
    - [ ] Default to full 88-key range (21-108) when no file is loaded.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Responsive Keyboard' (Protocol in workflow.md)

## Phase 3: 3D Projection & Visual Polish
Goal: Implement a 3D perspective for the visualizer and ensure all elements are sharp and clear.

- [ ] Task: Create 3D Visualizer Container
    - [ ] Implement a container with `perspective` and `transform-style: preserve-3d`.
    - [ ] Apply 3D rotation/tilt to the `FalldownVisualizer` and `PianoKeyboard` to create the "track" effect.
    - [ ] Configure the "vanishing point" to be centered/elevated.
- [ ] Task: Optimize `FalldownVisualizer` for sharpness
    - [ ] Synchronize `FalldownVisualizer` horizontal positioning with the keyboard's dynamic range.
    - [ ] Use `will-change: transform` and `translate3d` for smooth, sharp animations.
    - [ ] Audit sharpness; if CSS divs remain blurry under 3D transform, refactor core note rendering to SVG.
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
