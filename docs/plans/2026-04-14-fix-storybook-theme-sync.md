# Plan: Fix Storybook Theme Synchronization

## Problem
In Storybook, when switching between different themes via the toolbar, the theme colors are not always applied correctly. This is because:
1. `ThemeProvider` in the app applies `.theme-default` to the `body` by default on mount.
2. The Storybook decorator only sets `data-theme` on the `html` element.
3. CSS variables defined on `body` override variables defined on `html`.
4. `ThemeProvider` internal state is not synchronized with Storybook globals.

## Strategy
1. Modify `ThemeProvider` to accept optional `theme` and `mode` props that override its internal state.
2. Synchronize `ThemeProvider` state with Storybook globals in `.storybook/preview.ts`.
3. Fix malformed CSS in `theme-default` section of `src/app/retro-globals.css`.
4. Fix background issue in `8bit/select.tsx` trigger (use `bg-input/30` as per 8bitcn.com/themes).
5. Fix `RetroModeSwitcher` icon size to be 28x28 (use `!size-7`).

## Tasks
1. [x] Update `src/context/theme-context.tsx` to accept `theme` and `mode` props.
2. [x] Update `.storybook/preview.ts` to pass Storybook globals to `ThemeProvider`.
3. [x] Fix `src/app/retro-globals.css` theme-default nesting.
4. [x] Fix `8bit/select.tsx` backgrounds (SelectTrigger and SelectContent).
5. [x] Fix `RetroModeSwitcher` icon size in `src/components/ui/retro-mode-switcher.tsx`.
6. [x] Add `src/context/theme-context.test.tsx` to verify the fix.
7. [x] Run linting, type-checking, and tests.

## Verification
- [x] `npm test src/context/theme-context.test.tsx` passes.
- [x] `npm run lint` passes (no new errors).
- [x] `npm run type-check` passes.
