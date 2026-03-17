# Plan: MIDI Loader Margins Refactor

Refactor the MIDI loading process to include lead-in and lead-out margins directly into the `Midi` object returned by `loadMidiFile` in `src/lib/midi/midi-loader.ts`. This simplifies the rest of the codebase by making these margins part of the MIDI track itself.

## 1. Implementation: `src/lib/midi/midi-loader.ts`
- Implement `patchMidi(midi: Midi): Midi` helper function.
- `patchMidi` will:
    - Shift all note events, control changes, and pitch bends by `LEAD_IN_DEFAULT_MS / 1000`.
    - Shift all header tempo and time signature events by the same amount.
    - Extend the duration of the MIDI object by adding a harmless control change (e.g., CC 120 All Sound Off) at the time `midi.duration + leadOutS`.
- Update `loadMidiFile` to call `patchMidi(midi)` before returning.

## 2. Cleanup: Consuming Files
Remove manual addition of `LEAD_IN_DEFAULT_MS` and `LEAD_OUT_DEFAULT_MS` in the following files:
- `src/lib/midi/lane-segment-utils.ts`
- `src/components/lane-stage/lane-stage.tsx`
- `src/components/lane-stage/lane-segment.tsx`
- `src/hooks/use-lane-score-engine.ts`
- `src/app/play/page.tsx`
- `src/hooks/use-track-sync.ts` (Already uses `midi.duration`, so it should naturally pick up the patched duration).

## 3. Verification
- Run existing tests to ensure no regressions.
- Add a new test case to `src/lib/midi/midi-loader.test.ts` to verify `patchMidi` logic.
- Verify the total duration and note offsets in the `PlayPage` logic.

## Tasks
- [x] Create `patchMidi` in `src/lib/midi/midi-loader.ts`.
- [x] Update `loadMidiFile` in `src/lib/midi/midi-loader.ts`.
- [x] Clean up `src/lib/midi/lane-segment-utils.ts`.
- [x] Clean up `src/components/lane-stage/lane-stage.tsx`.
- [x] Clean up `src/components/lane-stage/lane-segment.tsx`.
- [x] Clean up `src/hooks/use-lane-score-engine.ts`.
- [x] Clean up `src/app/play/page.tsx`.
- [x] Verify everything.
