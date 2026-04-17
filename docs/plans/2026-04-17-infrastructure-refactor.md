# Infrastructure & Routes Refactor

This refactor reorganizes shared utilities and navigation logic to follow more descriptive naming patterns and centralize common constants.

## User Review Required

> [!NOTE]
> This refactor involves moving and renaming central constants (`ROUTES`, `COMMAND_NOTE_OFF`). I will update all consumers to ensure no regressions.

## Proposed Changes

### [Component] Shared Infrastructure

#### [NEW] [digital-instrument.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/lib/digital-instrument.ts)

- Relocate and rename constants from `midi.ts`:
  - `MIDI_COMMAND_NOTE_OFF` -> `COMMAND_NOTE_OFF`
  - `MIDI_COMMAND_NOTE_ON` -> `COMMAND_NOTE_ON`
- [DELETE] [midi.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/lib/midi.ts)

#### [NEW] [routes.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/lib/routes.ts)

- Move `ROUTES` from `features/navigation`.
- [DELETE] [routes.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/navigation/lib/routes.ts)

### [Component] Navigation Feature

#### [MODIFY] [use-navigation.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/navigation/hooks/use-navigation.ts) & [navigation-guard.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/navigation/components/navigation-guard.tsx)

- Update imports to point to `@/shared/lib/routes`.

### [Component] Hardware & Audio

#### [MODIFY] [midi-listener.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/midi-hardware/lib/midi-listener.ts) & [use-midi-audio.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/audio/hooks/use-midi-audio.ts)

- Update imports and usage to reflect `digital-instrument.ts` and renamed constants.

---

## Verification Plan

### Automated Tests

- `npm test src/features/midi-hardware/lib/midi-listener.test.ts`
- `npm test src/features/navigation/components/navigation-guard.test.tsx`
- `npm run type-check`

### Manual Verification

- Verify that navigation and MIDI interactions still work seamlessly.
