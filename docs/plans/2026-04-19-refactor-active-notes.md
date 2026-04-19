# Refactor: Move `useActiveNotes` to `midi-hardware` and Unify Scoring

This refactor moves the `useActiveNotes` hook into the `midi-hardware` feature, flattens its arguments, and flattens the scoring logic by making `useScoreEngine` headless.

## Proposed Changes

### [midi-hardware]

#### [NEW] [use-active-notes.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-hardware/hooks/use-active-notes.ts)

- Implement `useActiveNotes` with flattened arguments: `(input: WebMidi.MIDIInput | null, onNoteEvent: (event: MIDINoteEvent) => void)`.
- Use internal `useState` for `activeNotes` set.
- Use `useMIDINotes` to subscribe to events and forward them to `onNoteEvent`.

#### [MODIFY] [index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-hardware/index.ts)

- Export `useActiveNotes` from the new hook file.

---

### [score]

#### [MODIFY] [use-score-engine.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/score/hooks/use-score-engine.ts)

- Remove `midiInput` from `UseScoreEngineProps`.
- Remove the internal `useMIDINotes` call.
- The hook will now exclusively rely on the caller to invoke `processNoteEvent`.

#### [MODIFY] [use-score-engine.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/score/hooks/use-score-engine.test.ts)

- Update tests to reflect the removal of `midiInput` and the internal listener.
- Tests will now manually call `processNoteEvent` to verify scoring logic.

---

### [app/play]

#### [MODIFY] [play-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.client.tsx)

- Import `useActiveNotes` from `@/features/midi-hardware`.
- Initialize `useScoreEngine` first to get `processNoteEvent`.
- Pass `processNoteEvent` into `useActiveNotes`.

#### [DELETE] [use-active-notes.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/hooks/use-active-notes.ts)

- Remove the deprecated hook file.

## Verification Plan

### Automated Tests

- Run `npm test` to ensure `useScoreEngine` and other related hooks pass.
- Run `npm run type-check` to ensure all imports and prop types are correct.
- Run `npm run lint` to ensure code style compliance.

### Manual Verification

- Verify in the browser that physical MIDI input correctly:
  1. Highlights keys on the virtual piano.
  2. Updates the score/combo in the UI.
