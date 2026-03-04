# Implementation Plan: MIDI Note Collision Gap

## Problem
MIDI output devices often fail to re-trigger a note if a `noteOff` and the subsequent `noteOn` for the same pitch occur at the exact same timestamp. This results in "ringing" notes that don't reset. To fix this, we need to introduce a tiny gap (e.g., 50ms) between sequential notes of the same pitch.

To maintain musical synchronization, if one note in a chord (notes starting at the same time) needs a gap, the **entire chord** should be shifted by the same amount.

## Proposed Changes

### 1. Configuration (`src/lib/midi/constant.ts`)
- Add `MIDI_NOTE_GAP_S = 0.05` (50ms) to the MIDI constants.

### 2. MIDI Parsing Logic (`src/lib/midi/midi-parser.ts`)
- Update `getNoteSpans` to post-process the generated spans.
- Group spans by their `startTime` (creating "chords" or "time-slices").
- For each slice (starting from the second one):
  - Check if any note in the current slice has the same pitch as a note from the *immediately preceding* slice that ended at the current slice's `startTime`.
  - If a collision is detected for **any** note in the slice, apply a 50ms (or `MIDI_NOTE_GAP_S`) adjustment to **all** notes in that slice:
    - Increase `startTime` by `MIDI_NOTE_GAP_S`.
    - Decrease `duration` by `MIDI_NOTE_GAP_S` (ensuring it doesn't drop below a minimum threshold, e.g., 20ms).
- Ensure the adjusted spans are returned in the correct order.

### 3. Unit Testing (`src/lib/midi/midi-parser.test.ts`)
- Add a test case for sequential notes of the same pitch to verify the gap is introduced.
- Add a test case for a chord where only one note collisions with a previous note, verifying the entire chord is shifted together.

---

## Verification Plan

### Automated Tests
- Run `npm test src/lib/midi/midi-parser.test.ts` to verify the logic.
- Run `npm test` to ensure no regressions in other parts of the system.

### Manual Verification
- Load a MIDI file with fast repeating notes (like a drum roll or fast piano piece).
- Connect a MIDI output device.
- Verify that repeating notes now trigger correctly and chords remain synchronized.
- Observe the visualizer (`LaneStage`) to ensure bars don't overlap and reflect the new gaps.
