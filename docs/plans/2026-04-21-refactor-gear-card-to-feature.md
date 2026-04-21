# Refactor GearCard to midi-hardware feature

Refactor the `GearCard` component from the local `app/gear` directory to the `features/midi-hardware` feature to align with the project's domain-driven architecture.

## Proposed Changes

### [midi-hardware]

- Move `src/app/gear/components/gear-card.tsx` to `src/features/midi-hardware/components/gear-card.tsx`.
- Export `GearCard` from `src/features/midi-hardware/index.ts`.

### [app/gear]

- Update `src/app/gear/components/gear-page.view.tsx` to import from `@/features/midi-hardware`.

## Verification Plan

- `npm run lint`
- `npm run type-check`
- Manual check on `/gear`.
