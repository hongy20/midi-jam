# Lint Warnings and Unused Exports Cleanup

Clean up the remaining first-party linting warnings and unused exports identified by `knip` to ensure a lean and warning-free codebase (excluding third-party/shared UI components).

## Proposed Changes

### Theme Feature

#### [MODIFY] [theme-context.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/theme/context/theme-context.tsx)

- Move localStorage theme/mode loading into lazy `useState` initializers.
- Remove `useEffect` that was triggering `react-hooks/set-state-in-effect` warning.
- Ensure Storybook/prop-based overrides still work via render-time sync.

#### [MODIFY] [theme-picker.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/theme/components/theme-picker.tsx)

- Remove `export` from `ThemePickerProps` as it is only used locally.

### Score Feature

#### [MODIFY] [score-context.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/score/context/score-context.tsx)

- Remove `export` from `SessionResults` and `ScoreContextType` as they are only used locally.

### Piano Feature

#### [MODIFY] [piano.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/piano/lib/piano.ts)

- Remove `export` from `getNoteUnits` as it is only used locally within the file.

## Verification Plan

### Automated Tests

- Run `npm run lint` to verify first-party warnings are gone.
- Run `npm run knip` to verify unused exports are resolved.
- Run `npm run type-check` to ensure no breaking changes in types.
- Run `npm run build` to verify production build.
- Run `npm test` to ensure core logic is unaffected.
