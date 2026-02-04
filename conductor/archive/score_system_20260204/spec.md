# Track Specification - Score System

## Overview
Introduce a scoring system (0-100 points) and a combo counter to provide feedback on playing accuracy. The system tracks how accurately a user presses, holds, and releases keys according to the MIDI file specification.

## Functional Requirements

### 1. Scoring Logic
- **Total Points:** Exactly 100 points for a perfect run of the entire MIDI file.
- **Weighted Scoring:** Chords are worth more points collectively than single notes to reward complexity.
  - **Base Note Weight:** 1.0
  - **Chord Multiplier:** `1 + (notes_in_chord - 1) * 0.1` (e.g., a 3-note chord has a multiplier of 1.2x).
  - **Individual Note Points:** `(NoteWeight * Multiplier) / TotalWeightedNotes * 100`.
- **Accuracy Thresholds (Constants):**
  - `PERFECT_WINDOW`: +/- 50ms (100% points)
  - `GREAT_WINDOW`: +/- 100ms (80% points)
  - `GOOD_WINDOW`: +/- 150ms (50% points)
  - `POOR_WINDOW`: +/- 250ms (20% points)
  - `MISS_WINDOW`: > 250ms (0% points)
- **Note Lifecycle Scoring:**
  - **Press (50%):** Timing of the initial Note On event.
  - **Hold/Release (50%):** Awarded if the key is held for the duration and released within the `GOOD` window or better. Early release reduces points proportionally.
- **Exclusion:** Notes occurring during the 4-second countdown (`currentTime < 0`) are excluded from scoring.

### 2. Combo Counter
- **Increment:** Increases by 1 for every "Good" or better press.
- **Reset:** Resets to 0 if:
  - User presses the wrong key (no matching MIDI note).
  - User misses a note (outside `POOR` window).
  - User hits a note with `POOR` timing.
  - User releases a note too early (outside `GOOD` window).

### 3. User Interface (HUD)
- **Score Display:** Real-time cumulative score (e.g., "Score: 85.4").
- **Combo Display:** High-visibility combo counter (e.g., "12x COMBO").
- **Accuracy Feedback:** Temporary text overlay (e.g., "PERFECT!", "GREAT") when a note is hit.
- **Location:** Floating overlay above the 3D visualizer track.

### 4. Persistence
- **High Score:** Store the highest score and highest combo for each MIDI file in `localStorage`.
- **Format:** Keyed by MIDI file name/URL.

### 5. Playback Compatibility
- **Real-Time Accuracy:** Timing windows are measured in real seconds, independent of playback `speed`.
- **Consistency:** Total 100 points regardless of `speed`.

## Non-Functional Requirements
- **No Libraries:** Implement scoring logic using vanilla TypeScript/JavaScript.
- **Performance:** Scoring calculation must be efficient and not cause frame drops in the visualizer.
- **Reusability:** Leverage existing `useMidiPlayer` and `useActiveNotes` hooks.

## Acceptance Criteria
- [ ] Scoring logic correctly calculates points based on weighted chords.
- [ ] Combo counter resets on wrong keys and poor timing.
- [ ] Score and combo are displayed in a HUD overlay.
- [ ] High scores are persisted in local storage.
- [ ] Notes during countdown are ignored.
- [ ] Accuracy windows remain consistent across different playback speeds.

## Out of Scope
- Detailed leaderboards (future track).
- Multi-track scoring (currently all tracks merged).
- IndexedDB storage (future track).
