# Plan: Standardize Storybook Titles

Standardize Storybook titles across the project to follow a cleaner hierarchy: `App/Name`, `Feature/Name`, and `Shared/Name`.

## Proposed Changes

### App Layer

Standardize route-specific views and global app components.

#### [MODIFY] [home-page.view.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/home/components/home-page.view.stories.tsx)

- `App/Home/View` -> `App/Home`

#### [MODIFY] [pause-page.view.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/pause/components/pause-page.view.stories.tsx)

- `App/Pause/View` -> `App/Pause`

#### [MODIFY] [options-page.view.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/options/components/options-page.view.stories.tsx)

- `App/Options/View` -> `App/Options`

#### [MODIFY] [collection-page.view.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/collection/components/collection-page.view.stories.tsx)

- `App/Collection/View` -> `App/Collection`

#### [MODIFY] [gear-page.view.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/gear/components/gear-page.view.stories.tsx)

- `App/Gear/View` -> `App/Gear`

#### [MODIFY] [score-page.view.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/components/score-page.view.stories.tsx)

- `App/Score/View` -> `App/Score`

#### [MODIFY] [not-found.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/not-found.stories.tsx)

- `App/Global/NotFound` -> `App/NotFound`

#### [MODIFY] [error.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/error.stories.tsx)

- `App/Global/Error` -> `App/Error`

#### [MODIFY] [loading.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/loading.stories.tsx)

- `App/Global/Loading` -> `App/Loading`

### Feature Layer

Standardize feature components by removing intermediate directories from the title.

#### [MODIFY] [piano-keyboard.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/piano/components/piano-keyboard/piano-keyboard.stories.tsx)

- `Features/Piano/Components/PianoKeyboard` -> `Feature/Piano/PianoKeyboard`

#### [MODIFY] [live-score.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/score/components/live-score/live-score.stories.tsx)

- `Features/Score/Components/LiveScore` -> `Feature/Score/LiveScore`

#### [MODIFY] [lane-stage.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/visualizer/components/lane-stage/lane-stage.stories.tsx)
- `App/Play/Components/LaneStage` -> `Feature/Visualizer/LaneStage`

### Storybook Configuration
Disable the "Docs" addon and remove MDX support.

#### [MODIFY] [main.ts](file:///Users/yanhong/Github/hongy20/midi-jam/.storybook/main.ts)
- Remove `../src/**/*.mdx` from `stories`.
- Remove `@storybook/addon-docs` from `addons`.

## Verification Plan

### Automated Tests

- Run `npm run lint` to ensure no linting errors were introduced.
- Run `npm run type-check` to ensure type safety.
- Run `npm test` to ensure no regressions.
- Run `npm run build` to verify production build.

### Manual Verification

- Start Storybook (`npm run storybook` - if available, though not strictly required for this title-only change if build passes).
- Check that the sidebar hierarchy matches the new structure.
