# Specification: Demo Mode Toggle

This track introduces a "Demo Mode" toggle that allows users to control whether the application provides automatic visual and auditory feedback from the MIDI playback, effectively acting as a "learning" vs. "performance" mode.

## Overview
The goal is to provide a clear switch that toggles the visual "auto-press" effect on the keyboard and synchronizes the audio state accordingly. This is particularly useful for users who want to play along without the distraction of automatic highlights or for those who want to use the app as a silent visualizer for their own MIDI device.

## Functional Requirements

### 1. Demo Mode State
- Implement a `demoMode` state (defaulting to `true`).
- **Demo Mode ON**:
    - The `PianoKeyboard` component displays `playbackNotes` (auto-press effect).
    - Audio output for the MIDI file is **enabled** and **unmuted**.
- **Demo Mode OFF**:
    - The `PianoKeyboard` component does **not** display `playbackNotes` (visuals only for live MIDI input).
    - Audio output for the MIDI file is **disabled** and **muted**.
    - The mute toggle in `PlaybackControls` should be disabled or visually indicated as "locked" in the muted state.

### 2. UI - Toggle Button
- **Placement**: Located directly to the left of the `current_time / total_duration` pill.
- **Visual Style**:
    - A hybrid button consisting of a Lucide icon (e.g., `Sparkles`) and the text "Demo".
    - Active state: Should have a visual highlight (e.g., blue/purple glow or colored background) to indicate it is ON.
    - Inactive state: Desaturated or neutral styling to indicate it is OFF.
- **Interactivity**: Clicking the button toggles the `demoMode` state.

## Acceptance Criteria
- Clicking the "Demo" button toggles the `demoMode` state.
- When Demo Mode is OFF, the piano keys only light up when the user plays their physical MIDI device.
- When Demo Mode is OFF, the backing track audio is muted and cannot be unmuted via the standard controls.
- When Demo Mode is ON, the piano keys light up automatically with the MIDI file, and audio is audible.
- The button is correctly positioned next to the time display and matches the existing UI aesthetic.

## Out of Scope
- Per-track demo mode (the setting is global for the current session).
- Recording the demo playback.
