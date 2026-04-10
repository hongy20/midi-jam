# Plan: Gear Page Refactor

Refactor the Gear page to use `Feature3` directly, remove `PageLayout`, and adopt the same architecture as the Home page (View/Client separation, loading/error pages, and Storybook support).

## Proposed Changes

### 1. `src/components/ui/8bit/blocks/`
#### [MODIFY] `feature3.tsx`
- Add `onItemClick` callback to `Feature3Props`.
- Add `selectedItemTitle` (or `selectedItemId`) to `Feature3Props`.
- Update the item rendering to be interactive (e.g., wrap in a button or add `onClick` to `Card`) and show selection state.

### 2. `src/app/`
#### [CREATE] `loading.tsx` & `loading.stories.tsx`
- Implement a global retro-style loading screen with combined tips.
- Consolidate individual `loading.tsx` files from `home` and `gear` routes.
#### [CREATE] `gear/error.tsx` & `gear/error.stories.tsx`
- Implement a retro-style error screen for gear issues.
#### [MODIFY] `gear/page.tsx`
- Simplify to a wrapper that renders `GearPageClient`.

### 3. `src/app/gear/components/`
#### [CREATE] `gear-page.view.tsx` & `gear-page.view.stories.tsx`
- Pure React component for the gear selection view.
- Uses `Feature3` directly.
- Title: "Choose Gear".
- Description: "Play a note on your gear to select it, or tap a card below."
- Items: Mapped from connected MIDI devices.
#### [CREATE] `gear-page.client.tsx`
- Consumes `useGear` and `useNavigation` hooks.
- Manages the MIDI activity listener for auto-selection.
- Renders `GearPageView`.

## Verification Plan

### Automated Tests
- Run `npm test` to ensure existing tests pass.
- Create tests for `GearPageView` if necessary.

### Manual Verification
- Check Storybook for `GearPageView`, `Loading`, and `Error` states.
- Verify gear selection via MIDI activity.
- Verify gear selection via card tapping.
- Verify "CONTINUE" button enablement.
