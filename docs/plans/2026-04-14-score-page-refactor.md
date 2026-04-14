# ScorePage Refactor & Arcade UI Implementation (Unified)

Refactor the `ScorePage` to a high-performance pure-view architecture, standardize the layout with arcade-style components (Cards, Tables), and clean up deprecated UI elements.

## Summary of Evolution
This task evolved through three phases of UI iteration:
1. **Phase 1**: Initial refactor to RSC/Client/View architecture using the 8bitcn `VictoryScreen` block.
2. **Phase 2**: Transition from `VictoryScreen` to a vertical stack of individual `Card` components for better visual clarity.
3. **Phase 3**: Final optimization replacing cards with a compact 8-bit `Table` to address vertical space concerns and align with the `OptionsPage` header style.

## Proposed Changes

### [Project Infrastructure]

#### [MODIFY] [AGENTS.md](file:///Users/yanhong/Github/hongy20/midi-jam/AGENTS.md)
- Updated Rule 0 to prioritize the **shadcn MCP** for exploring and adding 8bitcn components.

### [UI Components]

#### [NEW] [Table Component](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/ui/8bit/table.tsx)
- Installed `@8bitcn/table` and its standard shadcn primitives.

#### [DELETE] [Deprecated Components]
- Removed `StatCard` (deprecated by refactor).
- Removed `VictoryScreen` block (replaced by bespoke layout).
- Removed `8bit/alert.tsx` and `ui/alert.tsx` (unused after VictoryScreen removal).

### [Score Page Refactor]

#### [MODIFY] [page.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/page.tsx)
- Converted to RSC wrapping `ScorePageClient`.

#### [NEW] [score-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/components/score-page.client.tsx)
- Logic layer: Handles session results, accuracy labels, and data transformation for the view.

#### [NEW] [score-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/components/score-page.view.tsx)
- Pure UI layer:
  - Header: Streamlined `OptionsPage` style (tracking-tighter).
  - Stats: Compact 8-bit `Table` for Score, Accuracy, and Max Combo.
  - Actions: Centered flexbox footer with fixed-width (`w-48`) buttons.

---

## Verification Plan

### Automated Tests
- [x] `npm run lint`: Verified clean baseline.
- [x] `npm run type-check`: Verified cross-component prop consistency.
- [x] `npm run build`: Verified production readiness.

### Manual Verification
- [x] Verified Accuracy state variations (Outstanding, Great Job, etc.) in Storybook.
- [x] Verified navigation flow (Retry, Songs, Home) in the live dev environment.
- [x] Verified responsive layout (stacked buttons on mobile vs horizontal on desktop).
