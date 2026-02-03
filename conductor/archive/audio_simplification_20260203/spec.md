# Specification: Audio Simplification and MIDI Device Output

This track refactors the audio system to remove redundant UI controls and adds the ability to route MIDI playback to external hardware.

## Overview
The goal is to streamline the UI by removing the manual mute toggle and leveraging the connected MIDI device for high-quality audio output when available.

## Functional Requirements

### 1. Unified Audio/Demo Logic
- Remove the `isMuted` state and the manual mute toggle button from `PlaybackControls`.
- **Demo Mode ON**: Audio is audible.
    - If a compatible MIDI output device is found, send MIDI messages to it.
    - Otherwise, fallback to the browser's built-in synth.
- **Demo Mode OFF**: Audio is completely silenced (no synth, no MIDI output).

### 2. External MIDI Output
- Update MIDI discovery to track available **Outputs**.
- When a user selects a MIDI **Input** (e.g., "Yamaha Piano"), automatically attempt to find and use the corresponding **Output** with the same name.
- Playback data (Note On/Off) should be sent to this output in real-time during song playback.

### 3. UI Refactor
- Remove the volume icon/mute toggle from the `PlaybackControls` component.
- The "Demo" button remains the primary toggle for both visual highlights and audio presence.

### 4. Technical Cleanup
- Refactor `useMidiAudio` to:
    - Accept `selectedDevice` and `demoMode`.
    - Handle switching between external MIDI output and browser synth.
    - Remove the internal `isMuted` toggle logic.
- Update/Remove unit tests that reference the old mute button or independent muting logic.

## Acceptance Criteria
- There is no "Mute" button in the UI.
- Turning Demo Mode OFF silences the app.
- If a MIDI device is connected and selected, it plays the backing track (using its internal sounds) instead of the browser's triangle synth.
- If no MIDI device is connected, the browser synth still works when Demo Mode is ON.
- Pausing playback stops the sound regardless of output method.

## Out of Scope
- Manual selection of a *different* MIDI output than the selected input.
- Detailed MIDI channel mapping (defaulting to Channel 1).
