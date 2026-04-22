# Task: Decentralize Navigation Guards & Move to Shared

- [x] Move `useNavigation` hook to `src/shared/hooks/use-navigation.ts`
- [x] Update all `useNavigation` imports across the codebase
- [x] Remove `NavigationGuard` from `src/app/layout.tsx`
- [x] Implement guard in `PlayPageClient`
- [x] Implement guard in `PausePageClient`
- [x] Implement guard in `CollectionPageClient`
- [x] Implement guard in `ScorePageClient`
- [x] Delete `src/features/navigation` folder
- [x] Tighten ESLint rules for cross-feature imports in `.eslintrc.json`
- [x] Run `npm run type-check` and `npm run lint` to verify
