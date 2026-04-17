# Implementation Plan: Add Fullscreen Button to PlayPage

Add a fullscreen toggle button next to the pause button in the `PlayPage` header. The button will switch between "enter" and "exit" icons and attempt to lock the screen to landscape mode when in fullscreen (if supported by the browser).

## User Review Required

> [!IMPORTANT]
> **Landscape Lock**: The Screen Orientation API's `lock()` method requires a user gesture and only works when the page is in fullscreen mode. It is primarily supported on mobile browsers; on desktop, it will likely resolve silently or fail gracefully depending on the browser.
>
> **Icons**: Based on feedback, using `Maximize2` and `Minimize2` from `lucide-react`.

## Proposed Changes

### Core Logic

#### [NEW] [use-fullscreen.ts](file:///Users/yanhong/Github/hongy20/midi-jam/src/hooks/use-fullscreen.ts)

- Implement `useFullscreen` hook.
- Handle `fullscreenchange` event to sync local state with browser state.
- Implement `toggleFullscreen` with `requestFullscreen`, `exitFullscreen`, and `screen.orientation.lock('landscape')`.

---

### PlayPage Integration

#### [MODIFY] [play-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.client.tsx)

- Consumes the `useFullscreen` hook.
- Destructures `isFullscreen` and `toggleFullscreen`.
- Passes these as props to `PlayPageView`.

#### [MODIFY] [play-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/play-page.view.tsx)

- Add `isFullscreen` and `handleToggleFullscreen` to `PlayPageViewProps`.
- Render a new `Button` next to (left of) the existing Pause button.
- Use `Maximize2` and `Minimize2` icons.

---

### Documentation Updates

#### [MODIFY] [AGENTS.md](file:///Users/yanhong/Github/hongy20/midi-jam/AGENTS.md)

- Update "Commands" table to include HTTPS protocol.
- Clarify mandatory HTTPS usage in "Core Principles".

#### [MODIFY] [README.md](file:///Users/yanhong/Github/hongy20/midi-jam/README.md)

- Add `[!IMPORTANT]` alert for HTTPS requirement.
- Ensure example URLs use `https`.

## Open Questions

None at this time based on the brainstorming session.

## Verification Plan

### Automated Tests

- Run `npm run lint` and `npm run type-check` to ensure code quality.

### Manual Verification

- Verify the button appearance in the `PlayPage` header.
- Click the button to enter fullscreen and observe the icon change.
- Verify that pressing `Esc` exits fullscreen and correctly updates the icon back to "enter".
- (On Mobile/Tablet) Verify screen orientation lock if possible.
