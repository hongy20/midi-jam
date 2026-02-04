# Implementation Plan - Speed Controls and Countdown Refinement

This plan covers updating the speed control UI, setting the default demo mode to off, and fixing the countdown to be a consistent 4-second real-time lead-in that scales correctly with the visualizer.

## Phase 1: Logic & State
Update the core player logic to support the new speed steps and the real-time countdown.

- [x] Task: Update `src/app/page.tsx` to set the initial `demoMode` state to `false`.
- [x] Task: Update `use-midi-player.ts` to replace existing speed steps with `[0.75, 1, 1.25]`.
- [x] Task: In `use-midi-player.ts`, set the default and reset `currentTime` to exactly `-4`.
- [x] Task: In `use-midi-player.ts`, modify the `tick` function to ensure that when `currentTime < 0`, it progresses at a fixed rate of 1.0 real second per second, ignoring the `speed` multiplier.
- [x] Task: In `use-midi-player.ts`, ensure that the `speed` change effect only recalculates `startTimeRef` if `currentTime >= 0`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Logic & State' (Protocol in workflow.md)

## Phase 2: UI & Icons
Update the playback controls to use icons and the new speed steps.

- [x] Task: In `playback-controls.tsx`, import `Turtle` and `Rabbit` icons from `lucide-react`.
- [x] Task: Update the speed selection buttons to use the `Turtle` icon for 0.75, "1x" text for 1.0, and `Rabbit` icon for 1.25.
- [x] Task: Add a vertical separator line to the left of the speed control button group.
- [x] Task: Update `playback-controls.test.tsx` to reflect the new speed steps and UI elements.
- [x] Task: Conductor - User Manual Verification 'Phase 2: UI & Icons' (Protocol in workflow.md)

## Phase 3: Visualizer & Polish
Ensure the visualizer and general UI handle the lead-in gracefully.

- [x] Task: Verify that `falldown-visualizer.tsx` correctly handles the visual gap created by the `-4` start time across all speeds.
- [x] Task: Update `page.tsx` ensure the time display shows `0:00` for all negative `currentTime` values.
- [x] Task: Final integration testing to confirm the countdown is exactly 4 seconds regardless of speed and that visuals are synced.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Visualizer & Polish' (Protocol in workflow.md)
