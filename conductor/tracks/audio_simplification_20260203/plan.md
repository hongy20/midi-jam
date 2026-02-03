# Implementation Plan: Audio Simplification and MIDI Device Output

This plan refactors the audio system to use external MIDI hardware for playback when available and removes redundant UI controls.

## Phase 1: MIDI Output Discovery & Routing [checkpoint: b76b256]
Goal: Enable the application to discover and select MIDI output ports that match selected input devices.

- [x] Task: Update MIDI library to support outputs [590977a]
    - [ ] Write Tests: Verify `getMIDIOutputs` returns available output ports.
    - [ ] Implement: Add `getMIDIOutputs` to `src/lib/midi/midi-devices.ts`.
- [x] Task: Update MIDI input hook to include outputs [60d9846]
    - [ ] Write Tests: Verify `useMIDIInputs` returns both inputs and outputs.
    - [ ] Implement: Modify `src/hooks/use-midi-inputs.ts` to fetch and return available outputs.
- [x] Task: Implement Auto-Output selection logic [7c8e724]
    - [ ] Write Tests: Verify `useMIDIConnection` correctly identifies a matching output for a selected input.
    - [ ] Implement: Update `src/hooks/use-midi-connection.ts` to manage a `selectedOutput` state that auto-matches the `selectedDevice`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: MIDI Discovery' (Protocol in workflow.md) [7c8e724]

## Phase 2: Refactor Audio Hook for External Output [checkpoint: ]
Goal: Update `useMidiAudio` to route sound to either the browser synth or external hardware, tied strictly to Demo Mode.

- [ ] Task: Redesign `useMidiAudio` API and Logic
    - [ ] Write Tests: Verify that when an output device is provided, MIDI messages are sent to it instead of triggering the synth.
    - [ ] Write Tests: Verify that when `demoMode` is false, no sound is produced regardless of output type.
    - [ ] Implement: Refactor `src/hooks/use-midi-audio.ts` to remove `isMuted` and support `selectedOutput` routing.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Audio Refactor' (Protocol in workflow.md)

## Phase 3: UI Cleanup & Test Alignment [checkpoint: ]
Goal: Remove the mute button from the UI and update/delete outdated unit tests.

- [ ] Task: Remove Mute Toggle from UI
    - [ ] Write Tests: Verify `PlaybackControls` no longer contains a mute button.
    - [ ] Implement: Remove volume icon and toggle logic from `src/components/midi/playback-controls.tsx`.
- [ ] Task: Clean up project-wide unit tests
    - [ ] Implement: Update `src/app/page.test.tsx`, `src/hooks/use-midi-audio.test.ts`, and `src/components/midi/playback-controls.test.tsx` to align with the new single-toggle audio logic.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Cleanup' (Protocol in workflow.md)
