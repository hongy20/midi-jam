# 2026-04-22-internalize-gear-header

The user wants to refactor the `GearHeader` component, currently defined in its own file, into an internal constant within the `GearPageView` component in `src/app/gear/components/gear-page.view.tsx`.

## User Review Required

> [!NOTE]
> Defining a component inside another component causes it to be re-created on every render, leading to re-mounts. Since `GearPageView` is primarily a setup screen and not a high-frequency gameplay view, this should be acceptable for simplicity and colocation as requested.

## Proposed Changes

### [gear] (src/app/gear)

#### [MODIFY] [gear-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/gear/components/gear-page.view.tsx)
- Remove `import { GearHeader } from "./gear-header";`.
- Add `import "@/shared/components/ui/8bit/styles/retro.css";`.
- Define `GearHeader` as a constant within the `GearPageView` function.

#### [DELETE] [gear-header.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/gear/components/gear-header.tsx)
- This file is no longer needed as the component is internalized.

## Verification Plan

### Automated Tests
- Run `npm run lint` to ensure no linting errors.
- Run `npm run type-check` to ensure type safety.
- Run `npm run build` to verify the production build.

### Manual Verification
- N/A (UI change is structural/refactoring).
