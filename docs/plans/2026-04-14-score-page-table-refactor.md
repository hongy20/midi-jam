# ScorePage Table UI Refactor

Replace the large `Card` components in `ScorePageView` with a compact `Table` from `8bitcn`. This will significantly reduce vertical space while maintaining the arcade aesthetic.

## User Review Required

> [!IMPORTANT]
> The `Table` layout will condense the information. I will group "Total Score", "Accuracy", and "Max Combo" into a single table structure.

## Proposed Changes

### [New Components]

#### [NEW] [Table Component](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/ui/8bit/table.tsx)
- Install `@8bitcn/table` via `npx shadcn@latest add @8bitcn/table`.

### [Score Page Refactor]

#### [MODIFY] [score-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/score/components/score-page.view.tsx)
- Replace the `Card` stack with a single `<Table>`.
- **Columns**: "STAT", "VALUE".
- **Rows**:
  - Total Score
  - Accuracy
  - Max Combo
- Maintain the bold Accuracy Label at the top and the centered flex buttons at the bottom.

---

## Verification Plan

### Automated Tests
- `npm run lint`: Ensure clean code after removal of `Card` sub-components.
- `npm run type-check`: Verify prop consistency.

### Manual Verification
1. Run `npm run dev` and verify the new table-based score screen.
2. Confirm the vertical space usage is reduced and the layout is well-centered.
3. Verify navigation buttons remain functional.
