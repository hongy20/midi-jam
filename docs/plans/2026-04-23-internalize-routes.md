# Internalize ROUTES Definition

The `ROUTES` constant is currently defined in a standalone file `src/shared/lib/routes.ts` but is only consumed by the `useNavigation` hook in `src/shared/hooks/use-navigation.ts`. This plan aims to move the definition into the hook module to simplify the codebase and reduce unnecessary module exports.

## User Review Required

> [!NOTE]
> This change will delete `src/shared/lib/routes.ts`. If any other part of the codebase (e.g., middleware, server components not yet implemented) was planned to use this, they will need to import from the hook or a new location. However, based on current usage, it is strictly used in the navigation hook.

## Proposed Changes

### Infrastructure Layer

#### [MODIFY] [use-navigation.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/hooks/use-navigation.ts)

- Define `ROUTES` internally at the top of the file.
- Remove the import from `@/shared/lib/routes`.

#### [DELETE] [routes.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/lib/routes.ts)

- Remove this file as it will be empty/unused.

## Verification Plan

### Automated Tests

- `npm run lint`: Ensure no broken imports or linting errors.
- `npm run type-check`: Ensure TypeScript is happy with the moved constant.
- `npm test`: Run existing tests to ensure navigation functionality remains intact.
- `npm run build`: Verify that the production build still works.

### Manual Verification

- None required for this refactor, as it's a pure code structure change.
