# Implementation Plan - Score System

This plan covers the implementation of the scoring logic, combo counter, HUD overlay, and local storage persistence.

## Phase 1: Scoring Engine (Logic)
Implement the core scoring and accuracy logic in a standalone hook.

- [x] Task: Create `src/hooks/use-score-engine.ts` to manage score, combo, and accuracy state. a7587b5
- [x] Task: Implement `calculateNoteWeights` utility to pre-calculate the point value of each note in the MIDI events list based on chord density. a7587b5
- [x] Task: Implement timing accuracy logic using real-time constants (`PERFECT_WINDOW`, etc.). a7587b5
- [x] Task: Add logic to track "pending" notes and match user input (Note On/Off) to the closest expected MIDI note. a7587b5
- [x] Task: Ensure notes during countdown (`currentTime < 0`) are ignored. a7587b5
- [x] Task: Add unit tests for `use-score-engine.ts` covering various timing scenarios, chords, and combo resets. a7587b5
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Scoring Engine (Logic)' (Protocol in workflow.md)

## Phase 2: HUD & Feedback (UI)
Create the user interface for displaying real-time feedback.

- [ ] Task: Create `src/components/midi/score-hud.tsx` to display score, combo, and accuracy text (e.g., "PERFECT").
- [ ] Task: Integrate `use-score-engine` into `src/app/page.tsx` and pass the state to `ScoreHud`.
- [ ] Task: Add CSS animations for accuracy text (fade out and move up).
- [ ] Task: Update `PianoKeyboard` or `FalldownVisualizer` if needed to show hit feedback (optional polish).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: HUD & Feedback (UI)' (Protocol in workflow.md)

## Phase 3: Persistence & Refinement
Handle high scores and ensure stability.

- [ ] Task: Implement `localStorage` logic to save and load high scores/combos per MIDI file.
- [ ] Task: Add a "High Score" display in the `MidiHeader` or song selection list.
- [ ] Task: Verify that scoring is consistent across different playback speeds (0.75x, 1x, 1.25x).
- [ ] Task: Final integration testing and polish.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Persistence & Refinement' (Protocol in workflow.md)
