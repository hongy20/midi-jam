# Implementation Plan: MIDI File Support and Falldown Visualizer

## Phase 1: Infrastructure & Server Integration
- [x] Task: Setup MIDI directory and Server Action (5714519)
    - [ ] Create `public/midi/` directory.
    - [ ] Implement `getMidiFiles` Server Action in `src/lib/action/midi.ts`.
    - [ ] Add regex-based formatting logic to convert filenames to human-readable strings.
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: MIDI Parsing & Basic Playback
- [ ] Task: Implement MIDI Parsing Service
    - [ ] Install `@tonejs/midi`.
    - [ ] Create `src/lib/midi/midi-player.ts` to handle file fetching and parsing.
    - [ ] Implement a custom scheduler/hook to emit MIDI events at the correct time based on the playback clock.
- [ ] Task: Integrated Playback State
    - [ ] Create `useMidiPlayer` hook to manage `isPlaying`, `currentTime`, and `speed`.
    - [ ] Update `PianoKeyboard` to listen to the player's event stream.
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: MIDI Control UI
- [ ] Task: Create `MidiControlCenter` component
    - [ ] Implement the dropdown using the Server Action data.
    - [ ] Add Play/Pause/Stop/Speed controls with Tailwind styling.
    - [ ] Integrate the component into the main page layout.
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

## Phase 4: Falldown Visualizer (The Piano Roll)
- [ ] Task: Implement `FalldownVisualizer` component
    - [ ] Create a container that matches the horizontal scale of the 88-key `PianoKeyboard`.
    - [ ] Implement logic to calculate note positions:
        - `left`: Horizontal alignment with the piano key.
        - `height`: Proportional to the MIDI note duration.
        - `top`: Proportional to the time remaining until the note is played.
    - [ ] Use CSS transitions/animations for smooth vertical movement.
- [ ] Task: Optimization & Synchronization
    - [ ] Ensure the falldown effect stays in sync when the speed is changed.
    - [ ] Optimize rendering to handle MIDI files with many simultaneous notes.
- [ ] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)
