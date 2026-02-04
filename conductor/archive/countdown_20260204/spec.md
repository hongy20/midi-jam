# Track Specification - Countdown Before Start

## Overview
Currently, MIDI playback starts immediately when the user presses "Play". This feature introduces a 4-second countdown sequence ("3, 2, 1, GO!") to give the user time to prepare. The countdown includes visual overlays and audio cues, and it shifts the entire playback and visualization timeline to accommodate the delay.

## Functional Requirements
- **Countdown Sequence**: A 4-step sequence: "3", "2", "1", and "GO!". Each step lasts exactly 1 second.
- **Visual Overlay**:
    - Large, centered text overlay.
    - Transparent background.
    - Non-blocking (does not prevent interaction with other UI elements).
- **Audio Feedback**:
    - Metronome-style "click" or "beep" for "3", "2", and "1".
    - A distinct, higher-pitched or different sound for "GO!".
- **Timeline Synchronization**:
    - The start of the MIDI file playback and visualizer movement must be delayed by exactly 4 seconds.
    - "GO!" coincides with the actual start of the music (t=0 of the MIDI file).
- **Trigger Logic**:
    - The countdown only triggers when "Play" is pressed and the current playback time is 0.
    - Resuming from a paused state in the middle of a song (time > 0) starts playback immediately without a countdown.
- **Playback Control during Countdown**:
    - **Pause**: Pauses the countdown timer. Resuming will continue from the remaining time.
    - **Stop**: Cancels the countdown, hides the overlay, and resets the application to time 0.

## Non-Functional Requirements
- **Animation**: The countdown numbers should have a slight scale-in or fade-in effect for better visibility.
- **Audio Latency**: Beeps must be tightly synchronized with the visual transitions.
- **Accessibility**: The countdown state should be announced or reflected in the accessibility tree (e.g., `aria-live` region).

## Acceptance Criteria
- [ ] Clicking "Play" at time 0 displays "3" and plays the first beep.
- [ ] The sequence proceeds through "2", "1", and "GO!" at 1-second intervals.
- [ ] The MIDI audio and falldown visualizer start precisely when "GO!" is displayed.
- [ ] Pausing during the "2" count freezes the countdown; resuming starts from "2".
- [ ] Stopping during the countdown resets the UI and cancels all pending counts/sounds.
- [ ] Clicking "Play" when the song is already partially played (e.g., at 10s) starts immediately.
