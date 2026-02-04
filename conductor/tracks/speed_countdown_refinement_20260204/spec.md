# Track Specification - Speed Controls and Countdown Refinement

## Overview
This track involves updating the playback speed controls with new increments and icons, changing the default application state for "Demo Mode", and fixing a bug to ensure the start-of-song countdown always lasts exactly 4 real-time seconds, regardless of the selected playback speed.

## Functional Requirements
- **Speed Control Updates**:
    - Change speed steps from [0.5, 1, 1.5, 2] to **[0.75, 1, 1.25]**.
    - Update UI to use icons instead of text for speed adjustments:
        - **0.75x**: Lucide `Turtle` icon.
        - **1.0x**: Text "1x".
        - **1.25x**: Lucide `Rabbit` icon.
    - Add a vertical separator line to the left of the speed control group (before the Turtle icon) to distinguish it from playback transport controls.
- **Default State**:
    - Change the initial value of `demoMode` to **false** (Off) so that MIDI audio synthesis is disabled by default.
- **Countdown Bug Fix**:
    - Ensure the countdown ("3, 2, 1, GO!") always takes **exactly 4 real-time seconds** to complete.
    - Decouple the countdown progression from the `speed` multiplier.
- **Visualizer Synchronization**:
    - Adjust the "lead-in" distance/time in the falldown visualizer so that at any selected speed, the notes at MIDI timestamp 0 hit the strike line precisely when the 4-second countdown ends ("GO!").

## Non-Functional Requirements
- **UI Consistency**: Use the existing Lucide React library for new icons.
- **Precision**: The synchronization between the visualizer movement and the real-time countdown must be mathematically precise.

## Acceptance Criteria
- [ ] Speed controls show Turtle, "1x", and Rabbit icons.
- [ ] A visual separator exists between transport controls (Play/Pause/Stop) and speed controls.
- [ ] Application starts with Demo Mode disabled.
- [ ] Countdown duration is 4 seconds when speed is 0.75x.
- [ ] Countdown duration is 4 seconds when speed is 1.25x.
- [ ] In the visualizer, notes move toward the keyboard during the countdown and reach the strike line exactly at "GO!".
