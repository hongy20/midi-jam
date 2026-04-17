# Cleanup: Remove Unnecessary MidiEvent Export

Remove the `MidiEvent` type from the public API of `features/midi-assets` as it is only used internally by the parser.

## Proposed Changes

### [Component] MIDI Assets
#### [MODIFY] [index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/index.ts)
- Remove `MidiEvent` from the `export type` list.

---

## Verification Plan

### Automated Tests
- `npm run type-check` to ensure no external consumers are broken by this change.
- `npm run lint`
