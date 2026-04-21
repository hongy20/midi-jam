# Design & Implementation Plan: MIDI Types Refactor

Refactor the core MIDI interfaces and their usages to improve semantic clarity by renaming ambiguous properties.

## Goal

- Rename property `note` to `pitch` in `MidiNote` and `MIDINoteEvent`.
- Rename property `spans` to `notes` in `MidiNoteGroup`.
- Propagate these changes across all local variables, parameters, and tests (Approach A).

## User Review Required

> [!IMPORTANT]
> This is a wide-reaching refactor that affects:
>
> 1. Core type definitions in `src/shared/types/midi.ts`.
> 2. MIDI parsing logic in `src/features/midi-assets`.
> 3. Gameplay scoring logic in `src/features/score`.
> 4. MIDI hardware event handling in `src/features/midi-hardware`.

## Proposed Changes

### [Infrastructure] MIDI Types

#### [MODIFY] [midi.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/types/midi.ts)

- Rename `MidiNote.note` to `MidiNote.pitch`.
- Rename `MidiNoteGroup.spans` to `MidiNoteGroup.notes`.
- Rename `MIDINoteEvent.note` to `MIDINoteEvent.pitch`.

---

### [Feature] MIDI Assets (Parsing & Utilities)

#### [MODIFY] [midi-parser.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/midi-parser.ts)

- Rename internal `spans` array to `notes`.
- Update object creation to use `pitch`.

#### [MODIFY] [lane-segment-utils.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/lib/lane-segment-utils.ts)

- Rename `BuildMidiNoteGroupsOptions.spans` to `notes`.
- Update property accesses from `.spans` to `.notes`.
- Update local variables (`spans` -> `notes`, `currentGroupSpans` -> `currentGroupNotes`).

#### [MODIFY] [track-context.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-assets/context/track-context.tsx)

- Update `TrackSegment` type definition.

---

### [Feature] Score & Gameplay

#### [MODIFY] [use-score-engine.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/score/hooks/use-score-engine.ts)

- Update `pitch` property accesses.
- Rename parameters and variables from `note` to `pitch` where they refer to the MIDI number.

---

### [Feature] MIDI Hardware

#### [MODIFY] [use-active-notes.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-hardware/hooks/use-active-notes.ts)

- Update `event.note` to `event.pitch`.

---

### [Tests] Verification Updates

- [MODIFY] `lane-segment-utils.test.ts`
- [MODIFY] `midi-parser.test.ts`
- [MODIFY] `use-score-engine.test.ts`
- [MODIFY] `use-midi-notes.test.ts`

## Verification Plan

### Automated Tests

- `npm test src/shared/types/midi.ts` (Type checking)
- `npm test src/features/midi-assets`
- `npm test src/features/score`
- `npm test src/features/midi-hardware`

### Manual Verification

- Launch the app and verify MIDI input still drives the piano visualizer.
- Verify that scoring still works in Gameplay.
