# Cleanup: Remove Unnecessary MidiEvent Export

Remove the `MidiEvent` type from the public API of `features/midi-assets` as it is only used internally by the parser.

## Proposed Changes

### [Component] MIDI Assets

#### [MODIFY] [midi-parser.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-parser.ts)

- Removed `export` from `MidiEvent` interface definition.
- [DELETE] Removed unused `getNoteRange` function.
- [DELETE] Removed unused imports of `MIDI_MIN_NOTE` and `MIDI_MAX_NOTE`.

#### [MODIFY] [midi-parser.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-parser.test.ts)

- [DELETE] Removed tests for `getNoteRange`.

#### [MODIFY] [constant.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/constant.ts)

- [DELETE] Removed unused `MIDI_MIN_NOTE` and `MIDI_MAX_NOTE` constants.

#### [MODIFY] [index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/index.ts)

- Remove `MidiEvent` from the `export type` list.

---

## Verification Plan

### Automated Tests

- `npm run type-check` to ensure no external consumers are broken by this change.
- `npm run lint`
