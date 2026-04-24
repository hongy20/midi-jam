# Refactor midi-assets Feature

Refactor the `features/midi-assets` directory to improve modularity and naming consistency.

## Proposed Changes

### [midi-assets]

#### [NEW] [midi-note-parser.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-note-parser.ts)

- Contains `parseMidiNotes` function.
- Will use the new instrument detection utility instead of a hardcoded default.

#### [NEW] [midi-barline-parser.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-barline-parser.ts)

- Contains `getBarLines` function.

#### [NEW] [midi-note-group-parser.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-note-group-parser.ts)

- Renamed from `lane-segment-utils.ts`.
- Contains `buildMidiNoteGroups`.

#### [NEW] [midi-track-data-loader.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-track-data-loader.ts)

- Extracted from `midi-loader.ts`.
- Contains `MidiTrackData` interface, `trackDataCache`, and `getTrackData` function.

### [shared]

#### [NEW] [midi-instrument-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/lib/midi-instrument-utils.ts)

- Contains a utility to detect instrument type (`piano` | `drums`) from `WebMidi.MIDIInput`.

#### [MODIFY] [midi-loader.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-loader.ts)

- Remove `getTrackData` and its related cache/interface.
- Keep `patchMidi` and `loadMidiFile`.

#### [MODIFY] [index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/index.ts)

- Update export of `getTrackData` to point to the new location.

#### [DELETE] [midi-parser.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-parser.ts)

- Split into two files.

#### [DELETE] [lane-segment-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/lane-segment-utils.ts)

- Renamed.

### [Tests]

#### [NEW] [midi-note-parser.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-note-parser.test.ts)

- Extracted from `midi-parser.test.ts`.

#### [NEW] [midi-barline-parser.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-barline-parser.test.ts)

- Extracted from `midi-parser.test.ts`.

#### [NEW] [midi-note-group-parser.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-note-group-parser.test.ts)

- Renamed from `lane-segment-utils.test.ts`.

#### [NEW] [midi-note-group-parser.integration.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-note-group-parser.integration.test.ts)

- Renamed from `lane-segment-utils.integration.test.ts`.

#### [DELETE] [midi-parser.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-parser.test.ts)

#### [DELETE] [lane-segment-utils.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/lane-segment-utils.test.ts)

#### [DELETE] [lane-segment-utils.integration.test.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/lane-segment-utils.integration.test.ts)

## Verification Plan

### Automated Tests

- Run `npm test` to ensure all tests pass after refactoring.
- Run `npm run lint` and `npm run type-check`.

### Manual Verification

- Verify the app still loads MIDI data correctly by running the dev server and loading a song.
