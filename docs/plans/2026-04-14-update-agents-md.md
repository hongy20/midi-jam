# Plan: Update AGENTS.md to Reflect Real Implementation

Outdated documentation in `AGENTS.md` is being corrected to align with the current project implementation, following the transition from legacy `PageLayout` to 8bitcn blocks and the `Boundary/Client/View` pattern.

## Implementation Tasks

- [x] Identify conflicts between `AGENTS.md` and real code (Tech Stack, Layout, Components).
- [x] Update `AGENTS.md` with accurate architectural patterns and tech stack.
- [x] Verify changes (Lint, Type Check, Test).

## Verification Plan

- [x] `npm run lint` (Biome check)
- [x] `npm run type-check` (TypeScript tsc)
- [x] `npm test` (Vitest suite)
- [x] `npm run build` (Next.js production build)
