# Plan: Audio Refactor and Lint Cleanup

This plan addresses the refactoring of `useMidiAudio`, the associated changes in `PlayPage`, and general linting cleanup to ensure project integrity and performance.

## 1. Research & Analysis
- **`useMidiAudio` Refactor**: The hook has been simplified to remove `demoMode` dependency, `stopAllNotes`, and `playCountdownBeep`. It now primarily handles individual note on/off via Tone.js or external MIDI.
- **`PlayPage` Adjustments**: `playNote` and `stopNote` calls are now wrapped in `setTimeout(..., 0)` to potentially offload them from the main render cycle or align with event loop timing.
- **Broken Tests**: `src/hooks/use-midi-audio.test.ts` is failing due to API mismatch.

## 2. Strategy
- Update `src/hooks/use-midi-audio.test.ts` to reflect the new signature and removed methods.
- Verify that `setTimeout` in `PlayPage` is necessary and correctly implemented.
- Run full validation suite (lint, type-check, test, build).

## 3. Execution Plan

### Task 1: Fix `useMidiAudio` Tests
- Update `src/hooks/use-midi-audio.test.ts` signature.
- Remove tests for `demoMode` (it's gone).
- Remove tests for `stopAllNotes` and `playCountdownBeep`.
- Fix the `mockOutput` usage to match the new argument order.

### Task 2: Lint Cleanup
- Already performed `npm run lint:fix`.
- Ensure no new lint errors are introduced.

### Task 3: Validation
- Run `npm test`.
- Run `npm run type-check`.
- Run `npm run lint`.
- Run `npm run build`.

## 4. Finalization
- Create PR using `gh pr create --fill`.
