# Implementation Plan - Countdown Before Start

This plan outlines the steps to add a 4-second "3, 2, 1, GO!" countdown before MIDI playback starts from the beginning.

## Phase 1: State Management & Logic [checkpoint: 1909658]
Implement the core countdown logic, including timers, state transitions, and integration with the playback system.

- [x] Task: Update `use-midi-player.ts` to include `countdownRemaining` and `isCountdownActive` state.
- [x] Task: Modify the `play` function in `use-midi-player.ts` to trigger the countdown only when `currentTime === 0`.
- [x] Task: Implement the countdown timer logic with support for pause and stop interruptions.
- [x] Task: Ensure the actual MIDI playback start is delayed by 4 seconds when the countdown is triggered.
- [x] Task: Conductor - User Manual Verification 'Phase 1: State Management & Logic' (Protocol in workflow.md)

## Phase 2: Audio & Visual UI
Create the visual overlay and integrate the audio cues.

- [x] Task: Create a `CountdownOverlay` component that displays "3, 2, 1, GO!" based on the countdown state.
- [x] Task: Integrate `CountdownOverlay` into the main page layout, ensuring it is centered and non-blocking.
- [x] Task: Update `use-midi-audio.ts` (or a dedicated hook) to play "beep" sounds synchronized with the countdown steps.
- [x] Task: Apply CSS animations for the countdown numbers (e.g., scale/fade transitions).
- [x] Task: Conductor - User Manual Verification 'Phase 2: Audio & Visual UI' (Protocol in workflow.md)

## Phase 3: Visualizer Synchronization
Ensure the falldown visualizer correctly accounts for the 4-second delay.

- [ ] Task: Update `falldown-visualizer.tsx` to delay the rendering of falling notes until the countdown hits "GO!".
- [ ] Task: Verify that the horizontal bar-lines and measure markers also respect the 4-second offset.
- [ ] Task: Final integration testing to ensure audio, visuals, and MIDI playback are perfectly synchronized.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Visualizer Synchronization' (Protocol in workflow.md)
