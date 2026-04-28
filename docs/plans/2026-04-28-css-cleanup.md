# Design & Implementation Plan: CSS Cleanup

Clean up redundant and unused CSS in `base.css` and `variables.css` after the introduction of 8bitcn themes in `retro-globals.css`.

## User Review Required

> [!IMPORTANT]
> `src/features/theme/styles/retro-globals.css` and `src/shared/components/ui/8bit/styles/retro.css` will remain UNTOUCHED per user instructions.

## Proposed Changes

### Global Styles

#### [MODIFY] [base.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/styles/base.css)

- Remove the redundant `@theme inline` block (lines 1-34).
- Remove redundant properties from `html, body` (lines 44, 49, 50): `background`, `color`, `font-family`.
- Keep viewport locking (`100dvh`, `position: fixed`) and the grid `background-image`.
- Keep `.jam-` utility classes.

#### [MODIFY] [variables.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/styles/variables.css)

- Remove unused variables:
  - `--h1-size`
  - `--btn-py`
  - `--btn-px`
  - `--btn-text`
  - `--layout-gap`
  - `--ui-card-radius`

#### [MODIFY] [globals.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/globals.css)

- Remove `@import "tailwindcss";` (line 1) as it is already imported in `retro-globals.css`.

## Verification Plan

### Automated Tests

- `npm run build` to ensure no CSS errors or build failures.
- `npm run lint` to check for any style-related linting issues.

### Manual Verification

- Verify that the app still has the viewport locking (no scrolling).
- Verify that themes still apply correctly (background colors and foreground colors).
- Verify that the subtle grid background is still visible.
