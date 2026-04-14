# ScorePage Arcade UI Refactor

Replace the current `VictoryScreen` block with a custom arcade-style layout inspired by the `OptionsPage`. This will use individual `Card` components for each stat to ensure visual consistency and better clarity.

## User Review Required

> [!IMPORTANT]
> This refactor will revert most of the `8bitcn` block installations related to `VictoryScreen` in favor of a bespoke layout. Only core components like `Card` and `Button` will be retained.

## Proposed Changes

### [Cleanup]

#### [DELETE] [VictoryScreen](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/ui/8bit/blocks/victory-screen.tsx)
- Remove the `VictoryScreen` block.

#### [DELETE] [Alert Components](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/ui/8bit/alert.tsx)
- Remove `8bit/alert.tsx` as it was only used by the victory screen.
- Remove `components/ui/alert.tsx` (primitive).

### [Score Page Refactor]

#### [MODIFY] [score-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/components/score-page.view.tsx)
- Replace `VictoryScreen` usage with a custom layout.
- Implement a vertical stack of `Card` components for:
    - **Total Score**: Large focal card.
    - **Session Stats**: Individual cards for Accuracy and Max Combo.
- Retain the bold arcade title for the accuracy label.
- Update the footer to match the `OptionsPage` style (BACK button behavior for Home/Songs, and primary RETRY button).

#### [MODIFY] [score-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/components/score-page.client.tsx)
- Minor adjustments to stat object mapping if needed (flattening the props).

#### [MODIFY] [score-page.view.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/components/score-page.view.stories.tsx)
- Update story props to match the new View interface.

---

## Verification Plan

### Automated Tests
- `npm run lint`: Ensure clean code after removal of components.
- `npm run type-check`: Verify prop consistency.

### Manual Verification
1. Run `npm run dev` and verify the new arcade-style score screen.
2. Confirm the layout looks and feels consistent with the `OptionsPage`.
3. Verify all navigation buttons (Main Menu, Songs, Retry) work as expected.
