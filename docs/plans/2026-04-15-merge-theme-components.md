# Implementation Plan - Merge Theme Selection Components

This plan outlines the consolidation of `SelectThemeDropdown` and `ThemeInventoryGrid` into a single, well-named component: `ThemePicker`.

## User Review Required

> [!IMPORTANT]
> This refactor will replace the existing `SelectThemeDropdown` and `ThemeInventoryGrid` components with a unified `ThemePicker`. Any other potential consumers (though none are currently identified outside the Options page) will need to be updated.

## Proposed Changes

### [Theme Selection Component]

#### [NEW] [theme-picker.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/options/components/theme-picker.tsx)
- Create a new file incorporating all logic from `ThemeInventoryGrid`.
- Proper naming: `ThemePicker` and `ThemePickerProps`.
- Exported as the primary interface for theme selection in the app.

#### [DELETE] [theme-inventory-grid.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/options/components/theme-inventory-grid.tsx)
- To be removed after merging into `ThemePicker`.

#### [DELETE] [select-theme-dropdown.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/options/components/select-theme-dropdown.tsx)
- To be removed as the wrapper is no longer necessary.

### [Options Page]

#### [MODIFY] [options-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/options/components/options-page.view.tsx)
- Update imports to use `ThemePicker` instead of `SelectThemeDropdown`.
- Update JSX to use `<ThemePicker />`.

## Open Questions
- Is `ThemePicker` the preferred name? (I chose `ThemePicker` as it clearly describes the action).

## Verification Plan

### Automated Tests
- `npm run lint` and `npm run type-check` to ensure all references are updated.

### Manual Verification
- Verify the Options Page loads correctly.
