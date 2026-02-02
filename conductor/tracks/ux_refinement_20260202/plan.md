# Implementation Plan: UX Refinement and MIDI Playback Fixes

This plan outlines the steps to refine the UI layout, fix playback desync and hanging notes, and enhance the visualizer with C4 markers and bar-lines.

## Phase 1: Layout Alignment & Selection UI [checkpoint: ac7eb59]
Goal: Align top-bar elements and polish the selection overlay.

- [x] Task: Align `MidiHeader` and `PlaybackControls` heights [59c83ec]
    - [ ] Stage the existing unstaged changes related to alignment.
    - [ ] Verify vertical alignment and consistent padding between the top-left status pill and top-right controls.
- [x] Task: Refactor Selection Overlay Styling [6798747]
    - [x] Align font sizes, colors, and component heights for `DeviceSelector` and `MusicSelector`.
    - [x] Adjust the layout of the expanded overlay for better symmetry and spacing.
    - [ ] Align font sizes, colors, and component heights for `DeviceSelector` and `MusicSelector`.
    - [ ] Adjust the layout of the expanded overlay for better symmetry and spacing.
- [x] Task: Implement Auto-Pause on Overlay Open [f14f667]
    - [ ] Add logic to `MidiHeader` to trigger a pause when the overlay expands.
    - [ ] Ensure playback doesn't automatically resume when the overlay closes unless it was playing before.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Layout Alignment' (Protocol in workflow.md) [1e54e4f]

## Phase 2: C4 Marker & Time Display [ ]
Goal: Add learning aids and playback metadata to the UI.

- [ ] Task: Update `PianoKeyboard` for C4 Marker
    - [ ] Add a visual text label "C4" to the Middle C key (MIDI note 60).
    - [ ] Ensure the label is legible against both white and black keys (if overlapping).
- [ ] Task: Update Auto-Zoom Logic for C4
    - [ ] Modify the range detection utility in `src/app/page.tsx` to always include note 60 (C4).
    - [ ] Verify that narrow-range songs (e.g., all high notes) still show C4.
- [ ] Task: Implement Time/Duration Display
    - [ ] Create a small, non-intrusive display for `current_time / total_duration`.
    - [ ] Position it at the top of the visualizer, visually below the `PlaybackControls`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Aids' (Protocol in workflow.md)

## Phase 3: Playback Reliability (Pause/Resume & Speed) [ ]
Goal: Fix hanging notes and speed desync issues.

- [ ] Task: Fix Hanging Notes on Pause/Resume
    - [ ] **Write Tests:** Create a test case for `useMidiPlayer` to verify all notes are silenced on pause.
    - [ ] **Implement:** Update `useMidiPlayer` pause logic to send note-off/all-notes-off.
    - [ ] **Implement:** Add logic to track "active notes" and re-issue note-on events upon resume.
- [ ] Task: Fix Speed Adjustment Bug
    - [ ] **Write Tests:** Create a test case for `useMidiPlayer` specifically with 0.5x speed.
    - [ ] **Implement:** Investigate and fix the scheduling logic in `useMidiPlayer` that causes desync at low speeds.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Playback Reliability' (Protocol in workflow.md)

## Phase 4: Visualizer Bar-lines [ ]
Goal: Implement measure indicators in the falldown visualizer.

- [ ] Task: Extract Tempo/Measure Map from MIDI
    - [ ] Update the MIDI parsing service to calculate bar-line timestamps based on time signature and tempo events.
- [ ] Task: Render Bar-lines in `FalldownVisualizer`
    - [ ] Add a rendering layer for horizontal lines at the calculated measure intervals.
    - [ ] Ensure lines are subtle and move in perfect sync with the falling notes.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Bar-lines' (Protocol in workflow.md)
