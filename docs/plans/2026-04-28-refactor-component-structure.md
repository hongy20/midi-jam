# Refactor Component Structure and Naming

This plan refactors the project's component structure and naming conventions to improve consistency and alignment with project standards (kebab-case file naming and flat structure for specific features).

## User Review Required

> [!IMPORTANT]
> This refactor involves moving files and renaming them, which will affect many imports. I will use `git mv` where possible to preserve history.
> I will also flatten the `DrumStage` and `LiveScore` directories as requested.

## Proposed Changes

### [Component Relocation]

#### [MOVE] [drum-stage.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/drum/components/drum-stage.tsx)
- Move from `src/features/drum/components/drum-stage/DrumStage.tsx` to `src/features/drum/components/drum-stage.tsx`.

#### [MOVE] [live-score.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/gameplay/components/live-score.tsx)
- Move from `src/features/gameplay/components/live-score/live-score.tsx` to `src/features/gameplay/components/live-score.tsx`.
- Move associated files (`.module.css`, `.test.tsx`, `.stories.tsx`) to the same parent directory.

### [Naming Convention Unification]

#### [RENAME] PascalCase to kebab-case
- `src/features/piano/components/piano-stage/PianoStage.tsx` -> `src/features/piano/components/piano-stage/piano-stage.tsx`
- `src/features/piano/components/background-lane/BackgroundLane.tsx` -> `src/features/piano/components/background-lane/background-lane.tsx`
- `src/features/piano/components/piano-keyboard/PianoKeyboard.tsx` -> `src/features/piano/components/piano-keyboard/piano-keyboard.tsx`
- `src/features/piano/components/piano-keyboard/PianoKeyboard.test.tsx` -> `src/features/piano/components/piano-keyboard/piano-keyboard.test.tsx`
- `src/features/highway/components/Highway.tsx` -> `src/features/highway/components/highway.tsx`
- `src/features/highway/components/HighwaySegment.tsx` -> `src/features/highway/components/highway-segment.tsx`

### [Storybook Convention Update]

#### [MODIFY] Storybook titles
- `src/features/gameplay/components/live-score.stories.tsx`: `Features/Score/LiveScore` -> `Features/Gameplay/LiveScore`
- `src/features/highway/components/highway.stories.tsx`: `Features/Highway/Highway` -> `Features/Highway`
- `src/app/not-found.stories.tsx`: `App/NotFound` -> `App/Not Found` (to match `App/[Name]` convention if applicable, or keep as is if `NotFound` is preferred)

### [Infrastructure & Tooling]

#### [MODIFY] [piano index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/piano/index.ts)
#### [MODIFY] [highway index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/highway/index.ts)
#### [MODIFY] [drum index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/drum/index.ts)
#### [MODIFY] [gameplay index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/gameplay/index.ts)
- Update exports to point to new file locations.

#### [MODIFY] [play-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.view.tsx)
- Update imports if relative paths were used (though it seems `@/features/...` is used).

## Verification Plan

### Automated Tests
- Run `npm test` to ensure all tests still pass after file moves.
- Run `npm run type-check` to verify no broken imports.
- Run `npm run lint` to check for any new naming/linting issues.

### Manual Verification
- Verify that Storybook loads and the titles are correctly organized.
- Verify that the game still runs (`npm run dev`).
