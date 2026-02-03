# Implementation Plan: Demo Mode Toggle

This plan covers the implementation of the "Demo Mode" feature, which links keyboard visual feedback with forced audio states.

## Phase 1: State Logic & Component Props [checkpoint: 99f7b55]
Goal: Implement the core `demoMode` state and propagate it to the visual and audio logic.

- [x] Task: Update `useMidiAudio` to support Demo Mode constraints [2db9a37]
    - [ ] Write Tests: Verify that when `demoMode` is false, audio remains muted even if toggle is attempted.
    - [ ] Implement: Add `demoMode` parameter to `useMidiAudio` to handle forced muting/disabling.
- [x] Task: Conditional Playback Visualization in `Home` [156ee1c]
    - [ ] Write Tests: Verify `PianoKeyboard` receives an empty set for `playbackNotes` when `demoMode` is off.
    - [ ] Implement: Add `demoMode` state to `Home` component and conditionally pass `playbackNotes` to `PianoKeyboard`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: State Logic' (Protocol in workflow.md)

## Phase 2: UI Implementation [checkpoint: 717de32]
Goal: Create the toggle button and integrate it into the layout.

- [x] Task: Create Demo Toggle Button [641e84b]
    - [ ] Write Tests: Verify the button displays correctly in both active and inactive states.
    - [ ] Implement: Add the "Demo" toggle button to the time/duration pill container in `src/app/page.tsx`.
- [x] Task: Update `PlaybackControls` for Demo Mode [71a0be2]
    - [ ] Write Tests: Verify the volume icon reflects the "disabled" state when Demo Mode is off.
    - [ ] Implement: Pass `demoMode` to `PlaybackControls` to visually disable/dim the mute toggle when applicable.
- [x] Task: Conductor - User Manual Verification 'Phase 2: UI Implementation' (Protocol in workflow.md) [717de32]

## Phase 3: Integration & Polish [checkpoint: 4df2315]
Goal: Final end-to-end verification and refinement.

- [x] Task: End-to-End Demo Mode Verification [4df2315]
    - [ ] Write Tests: Verify the transition between Demo Mode ON/OFF correctly switches both visuals and sound.
    - [ ] Implement: Final bug fixes and style adjustments to ensure the button is perfectly aligned.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Integration' (Protocol in workflow.md) [4df2315]
