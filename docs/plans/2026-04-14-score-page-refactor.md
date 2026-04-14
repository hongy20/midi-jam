# ScorePage Refactor & 8bitcn Integration

Refactor the `ScorePage` to a pure-view architecture, integrate the `VictoryScreen` block from 8bitcn, update project guidelines, and clean up the unused `StatCard` component.

## User Review Required

> [!IMPORTANT]
> The `StatCard` component is currently only used in the `ScorePage`. It will be deleted as part of the cleanup after the refactor is complete.

## Proposed Changes

### [Project Infrastructure]

#### [MODIFY] [AGENTS.md](file:///Users/yanhong/Github/hongy20/midi-jam/AGENTS.md)
- Update Rule 0 to prefer using **shadcn MCP** for exploring and adding 8bitcn components/blocks.

### [UI Components]

#### [NEW] [VictoryScreen](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/ui/8bit/blocks/victory-screen.tsx)
- Install `@8bitcn/victory-screen` via `npx shadcn@latest add @8bitcn/victory-screen`.

#### [DELETE] [StatCard](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/stat-card/stat-card.tsx)
- Remove the `StatCard` component and its directory as it will be deprecated by the 8bitcn block.

### [Score Page Refactor]

#### [MODIFY] [page.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/page.tsx)
- Convert to a React Server Component (RSC) that simply renders `ScorePageClient`.

#### [NEW] [score-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/components/score-page.client.tsx)
- Logic layer: handles `useScore`, `useStage`, `useNavigation`.
- Calculates accuracy labels and formats stats.
- Passes clean props to `ScorePageView`.

#### [NEW] [score-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/components/score-page.view.tsx)
- Pure UI layer: Renders the `VictoryScreen` layout.
- Maps session results (Score, Accuracy, Combo) to 8bitcn grid slots.

#### [NEW] [score-page.view.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/components/score-page.view.stories.tsx)
- Storybook integration for isolated testing of victory screen states.

---

## Verification Plan

### Automated Tests
- `npm run lint`: Ensure no linting errors in new structure.
- `npm run type-check`: Verify prop consistency between Client and View.

### Manual Verification
1. Run `npm run dev` and navigate to the Score page after a song.
2. Verify the `VictoryScreen` displays the correct title, stats, and actions.
3. Check Storybook (`npm run storybook`) to ensure `ScorePageView` renders all accuracy states correctly.
