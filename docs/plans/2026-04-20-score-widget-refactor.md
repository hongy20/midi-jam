# Refactor: Move and Rename ScoreWidget to LiveScore

Move the `ScoreWidget` component from `src/app/play/components/` to `src/features/score/components/` and rename it to `LiveScore` to better distinguish it from the final `ScorePage`.

## User Review Required

> [!NOTE]
> The component is being renamed from `ScoreWidget` to `LiveScore` as per brainstorming.

## Proposed Changes

### [Score Feature]

#### [NEW] [live-score.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/score/components/live-score/live-score.tsx)

- Port logic from `ScoreWidget`.
- Update `HitQuality` import to use relative path `../../hooks/use-score-engine` to avoid circular dependencies.

#### [NEW] [live-score.module.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/score/components/live-score/live-score.module.css)

- Port styles from `score-widget.module.css`.

#### [NEW] [live-score.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/score/components/live-score/live-score.stories.tsx)
- Port and update story.
- Title: `Features/Score/Components/LiveScore` (Explicit hierarchy reflecting filesystem).

#### [NEW] [live-score.test.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/score/components/live-score/live-score.test.tsx)
- Port and update tests.

#### [MODIFY] [index.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/score/index.ts)
- Export `LiveScore` component.
- Review and remove any exports that are no longer needed externally now that `LiveScore` is co-located.

---

### [Storybook Internal Audit & Normalization]

#### [MODIFY] [piano-keyboard.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/piano/components/piano-keyboard/piano-keyboard.stories.tsx)
- Update title: `"Features/Piano/PianoKeyboard"` -> `"Features/Piano/Components/PianoKeyboard"`

#### [MODIFY] [lane-stage.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/lane-stage/lane-stage.stories.tsx)
- Update title: `"App/Play/LaneStage"` -> `"App/Play/Components/LaneStage"`

---

### [Play Page Component]

#### [MODIFY] [play-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.view.tsx)
- Replace `ScoreWidget` import/usage with `LiveScore` from `@/features/score`.

#### [DELETE] [score-widget/](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/score-widget/)
- Remove the legacy folder once successfully moved and verified.

## Verification Plan

### Automated Tests
- `npm run type-check`: Ensure no broken imports or missing types.
- `npm test`: Verify `LiveScore` tests pass.
- `npm run build`: Ensure production build integrity.

### Manual Verification
- Check Storybook (`npm run storybook`) to verify the new explicit hierarchy:
    - [x] `Features/Score/Components/LiveScore`
    - [x] `Features/Piano/Components/PianoKeyboard`
    - [x] `App/Play/Components/LaneStage`
- Verify that no unnecessary private types are exposed in the final `index.ts`.
