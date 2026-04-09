# Refactor Welcome Page to Hero3

Refactor the welcome page to use the `Hero3` component from 8bitcn, providing a more immersive "press start" experience. This involves creating the `Hero3` block and updating the welcome page view to use it, removing the legacy `PageLayout` and footer.

## User Review Required

> [!IMPORTANT]
> This refactor explicitly removes `PageLayout` and the standard viewport-locking CSS grid for the welcome page, as requested. This deviates from the core project principles in `AGENTS.md` but aligns with the specific design goal for this page.

## Proposed Changes

### [8bit Components]

#### [NEW] [hero3.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/8bit/hero3.tsx)
- Implementation of the `Hero3` block from 8bitcn.
- Includes `BlinkingText` for the "PRESS START" state.
- Supports `title`, `actions`, and `children`.

### [Welcome Page]

#### [MODIFY] [welcome-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/welcome-page.view.tsx)
- Remove `PageLayout`, `PageFooter`, and `PageHeader` (if any).
- Import and use `Hero3` as the root component.
- Pass `"MIDI JAM"` as the `title`.
- Define `actions` for "START GAME" and "Options".
- Pass `isLoading` and `!isSupported` states as `children`.
- Keep the existing icons (`Play`, `Settings`) for the buttons.
- Use default styling from 8bitcn.

## Verification Plan

### Automated Tests
- `npm run lint`: Verify no linting errors in new component.
- `npm run type-check`: Ensure type safety for the new component and its usage.

### Manual Verification
- Verify the new welcome page layout in the browser.
- Check "START GAME" and "Options" buttons functionality.
- Verify the loading state appearance.
- Verify the unsupported browser state appearance (can be simulated by changing `isSupported` prop).
- Ensure no layout shifts or broken styles when removing `PageLayout`.
