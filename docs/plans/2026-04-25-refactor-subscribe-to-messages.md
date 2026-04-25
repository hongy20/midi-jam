# Refactor `subscribeToNotes` to `subscribeToMessages`

This plan refactors the specialized `subscribeToNotes` function into a generic `subscribeToMessages` utility. The parsing logic for MIDI notes will be moved into `useMIDINotes`, where it is specifically needed, allowing `useAutoSelection` to use the same basic listener for activity detection.

## Proposed Changes

### [Component] MIDI Hardware Feature

#### [MODIFY] [midi-listener.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-hardware/lib/midi-listener.ts)

- Rename `subscribeToNotes` to `subscribeToMessages`.
- Remove `MIDINoteEvent` import and all parsing logic.
- Signature: `(input: WebMidi.MIDIInput, callback: (event: WebMidi.MIDIMessageEvent) => void) => () => void`.

#### [MODIFY] [use-midi-notes.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-hardware/hooks/use-midi-notes.ts)

- Import `subscribeToMessages` instead of `subscribeToNotes`.
- Move message parsing logic (command detection, velocity normalization) here.
- Call `onNote` with the parsed `MIDINoteEvent`.

#### [MODIFY] [use-auto-selection.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-hardware/hooks/use-auto-selection.ts)

- Import `subscribeToMessages`.
- Replace manual `addEventListener`/`removeEventListener` with `subscribeToMessages`.

#### [MODIFY] [midi-listener.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-hardware/lib/midi-listener.test.ts)

- Update tests to use `subscribeToMessages`.
- Verify basic subscription/unsubscription behavior.

## Verification Plan

### Automated Tests

- Run `npm test` to ensure `midi-listener.test.ts` passes and no other MIDI tests are broken.
- Run `npm run type-check` to ensure all imports and types are correct.
- Run `npm run lint` to verify style.

### Manual Verification

- Verify MIDI input auto-selection still works by providing MIDI input activity.
- Verify piano keyboard/gameplay still receives note events correctly.
