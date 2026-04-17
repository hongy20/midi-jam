# Refactor: Centralize and Rename MIDI Note Type

Relocate the `NoteSpan` interface from the `midi-assets` feature to a shared location (`src/shared/types/midi.ts`) and rename it to `MidiNote`. This centralization makes the core MIDI data structure available to all features while providing a more descriptive, industry-standard name.

## User Review Required

> [!IMPORTANT]
> This refactor involves a global rename of `NoteSpan` to `MidiNote`. While technically a breaking change for internal consumers, it clarifies the domain model by distinguishing parsed notes (`MidiNote`) from raw hardware events (`MIDINoteEvent`).

## Proposed Changes

### [Component] Shared Types

#### [NEW] [midi.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/types/midi.ts)

- Define and export the `MidiNote` interface.

### [Component] MIDI Assets

#### [MODIFY] [midi-parser.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-parser.ts)

- Import `MidiNote` from `@/shared/types/midi`.
- Update `parseMidiNotes` return type and internal logic.
- [DELETE] `NoteSpan` interface definition.

#### [MODIFY] [lane-segment-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/lane-segment-utils.ts)

- Update `SegmentGroup` and function signatures to use `MidiNote`.

#### [MODIFY] [index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/index.ts)

- Export `MidiNote` (type) instead of `NoteSpan`.

### [Component] Consumers & Tests

#### [MODIFY] [use-track-sync.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/hooks/use-track-sync.ts)

- Update local variable naming and types to `MidiNote`.

#### [MODIFY] [midi-parser.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-parser.test.ts)

- Update test cases to reflect the renaming.

#### [MODIFY] [lane-segment-utils.integration.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/lane-segment-utils.integration.test.ts)

- Update integration tests to reflect the renaming.

---

## Verification Plan

### Automated Tests

- `npm test src/features/midi-assets/lib/midi-parser.test.ts`
- `npm test src/features/midi-assets/lib/lane-segment-utils.integration.test.ts`
- `npm run type-check`

### Manual Verification

- Verify that song loading and segment rendering still function perfectly in the browser.
