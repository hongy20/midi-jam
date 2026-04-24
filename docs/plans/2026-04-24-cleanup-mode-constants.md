# Implementation Plan - Cleanup Mode Constants

Remove redundant `DARK` and `LIGHT` constants from `src/shared/types/mode.ts` and replace their usages with string literals in `src/features/theme/context/theme-context.tsx`.

## Proposed Changes

### Theme Feature

#### [MODIFY] [theme-context.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/theme/context/theme-context.tsx)

- Update imports from `@/shared/types/mode` to only include `Mode`.
- Replace `DARK` with `"dark"` and `LIGHT` with `"light"`.

### Shared Infrastructure

#### [MODIFY] [mode.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/types/mode.ts)

- Remove `export const DARK: Mode = "dark";`
- Remove `export const LIGHT: Mode = "light";`

## Verification Plan

### Automated Tests

- `npm run lint`
- `npm run type-check`
- `npm test` (to ensure no regressions in theme logic)
