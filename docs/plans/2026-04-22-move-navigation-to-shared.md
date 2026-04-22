# Decentralize Navigation Guards & Move to Shared

Refactor the navigation logic by moving the core hook to infrastructure and decentralizing route guarding into feature-specific pages. This removes the tight coupling in `src/features/navigation` and allows for stricter cross-feature import rules.

## User Review Required

> [!IMPORTANT]
> This refactor will move logic from a centralized `NavigationGuard` to individual page components. While this improves feature isolation, it requires each page to be diligent about its own prerequisites.

## Proposed Changes

### [Infrastructure Layer]

#### [NEW] [use-navigation.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/hooks/use-navigation.ts)

Move the `useNavigation` hook here. It will remain the unified API for "History Neutrality."

#### [MODIFY] [layout.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/layout.tsx)

Remove the `NavigationGuard` wrapper from the root layout.

### [App Layer (Decentralized Guards)]

#### [MODIFY] [play-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.client.tsx)

Add prerequisite check for `selectedMIDIInput` and `selectedTrack`.

#### [MODIFY] [pause-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/pause/components/pause-page.client.tsx)

Add prerequisite check for `selectedMIDIInput` and `selectedTrack`.

#### [MODIFY] [collection-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/collection/components/collection-page.client.tsx)

Add prerequisite check for `selectedMIDIInput`.

#### [MODIFY] [score-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/components/score-page.client.tsx)

Add prerequisite check for `sessionResults`.

### [Cleanup]

#### [DELETE] [navigation](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/navigation)

Remove the entire navigation feature folder.

#### [MODIFY] [.eslintrc.json](file:///Users/yanhong/Github/hongy20/midi-jam/.eslintrc.json)

Tighten cross-feature import rules from `warn` to `error`.

## Verification Plan

### Automated Tests

- Run `npm run type-check` to ensure all imports are updated correctly.
- Run `npm run lint` to verify that the new stricter rules are passing.

### Manual Verification

- Navigate directly to `/play` without a track or MIDI input selected and verify redirect to `/home`.
- Navigate directly to `/score` without session results and verify redirect to `/home`.
- Navigate to `/collection` without MIDI input and verify redirect to `/gear`.
