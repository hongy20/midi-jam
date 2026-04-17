# Refactor: Consolidate MIDI Parsing Logic

Standardize the MIDI parsing pipeline by merging the two-step `getMidiEvents` and `getNoteSpans` process into a single `parseMidiNotes` function. Internalize the `MidiEvent` interface within the new function to hide implementation details from consumers.

## User Review Required

> [!IMPORTANT]
> This refactor changes the public API of the `midi-assets` feature. Consumers will now call a single `parseMidiNotes` function.
> Unit tests in `midi-parser.test.ts` will be significantly refactored to verify logic via the final `NoteSpan[]` output instead of intermediate data structures.

## Proposed Changes

### [Component] MIDI Assets

#### [MODIFY] [midi-parser.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-parser.ts)

- Create `parseMidiNotes(midi: Midi, instrument?: "piano" | "drums"): NoteSpan[]`.
- Move `interface MidiEvent` inside the function scope.
- In-line current `getMidiEvents` and `getNoteSpans` logic.
- [DELETE] `getMidiEvents` and `getNoteSpans`.

#### [MODIFY] [index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/index.ts)

- [DELETE] Remove `getMidiEvents` and `getNoteSpans` from exports.
- [NEW] Export `parseMidiNotes`.

### [Component] Consumers

#### [MODIFY] [use-track-sync.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/collection/hooks/use-track-sync.ts)

- Replace two-step calls with a single `parseMidiNotes(midi)` call.

#### [MODIFY] [lane-segment-utils.integration.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/lane-segment-utils.integration.test.ts)

- Update `loadMidi` helper to use the new unified function.

### [Component] Tests

#### [MODIFY] [midi-parser.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-parser.test.ts)

- Adapt all tests to verify behavior through the final `NoteSpan[]` output.
- Verify collision shifting, instrument filtering, and note pairing within the new unified context.

---

## Verification Plan

### Automated Tests

- `npm test src/features/midi-assets/lib/midi-parser.test.ts`
- `npm test src/features/midi-assets/lib/lane-segment-utils.integration.test.ts`
- `npm run type-check`

### Manual Verification

- Launch the application and load a song to ensure lane segments are generated correctly and demo mode / scoring remains functional.
