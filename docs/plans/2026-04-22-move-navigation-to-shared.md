# Move Navigation to Shared Infrastructure

Investigate the feasibility and architectural impact of moving the `useNavigation` hook and related navigation logic from `src/features/navigation` to `src/shared`.

## User Review Required

> [!IMPORTANT]
> This is a structural change. Moving core hooks to `shared` implies they are considered infrastructure rather than feature logic. We need to decide if the navigation logic (including History Neutrality) is generic enough for `shared`.

## Open Questions

1. Should the `NavigationGuard` component also move to `shared`, or should it remain as a feature?
2. If `useNavigation` moves, should the `navigation` feature be deleted entirely?

## Proposed Approaches

### Approach 1: Move Only `useNavigation` to `shared/hooks`
- **Pros**: `useNavigation` is used everywhere; moving it to `shared` makes it easily accessible as an infrastructure hook.
- **Cons**: Splits the navigation logic between `shared` and `features/navigation` (if `NavigationGuard` stays).

### Approach 2: Move Entire `navigation` Logic to `shared`
- **Pros**: Keeps all navigation-related logic (hook and guard) together in the infrastructure layer.
- **Cons**: `shared` starts to grow with app-specific logic (routes).

### Approach 3: Keep as a Feature (Status Quo)
- **Pros**: Follows "Feature-Based Architecture" strictly. Navigation is a domain, even if cross-cutting.
- **Cons**: Every feature that needs to navigate must import from another feature, which can lead to complex dependency graphs if not handled via public APIs.

## Proposed Changes

### [Infrastructure Layer]

#### [NEW] [use-navigation.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/hooks/use-navigation.ts)
Move the content of `src/features/navigation/hooks/use-navigation.ts` here.

#### [NEW] [navigation-guard.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/shared/components/navigation/navigation-guard.tsx) (Optional)
If we decide to move the guard as well.

### [Domain Layer]

#### [DELETE] [navigation](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/navigation)
If we move everything.

## Verification Plan

### Automated Tests
- Run existing tests for `NavigationGuard` and `useNavigation` (if any) after moving.
- Check for broken imports across the codebase using `npm run type-check`.

### Manual Verification
- Verify navigation still works correctly in the browser (History Neutrality).
