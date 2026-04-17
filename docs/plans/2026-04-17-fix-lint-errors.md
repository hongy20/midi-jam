# Plan: Fix Linting Errors (Feature Structure)

Fix linting errors related to restricted imports from feature internals.

## Proposed Changes

### App Layer

- `src/app/collection/components/collection-page.client.tsx`: Update import from `@/features/collection/context/collection-context` to `@/features/collection`.
- `src/app/score/components/score-page.client.tsx`: Update import from `@/features/score/context/score-context` to `@/features/score`.

### Dependencies

- Remove unused/redundant dependencies: `eslint-import-resolver-typescript`, `eslint-plugin-boundaries`, and `eslint-plugin-import`.

## Verification Plan

### Automated Tests

- Run `npm run lint` to verify that errors are resolved.
- Run `npm run type-check` to ensure no regressions.
- Run `npm test` to ensure existing tests still pass.

### Manual Verification

- Verify the application builds correctly with `npm run build`.
