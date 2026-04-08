# Implementation Plan: Auto-Pause Feature

This document outlines the steps to implement the auto-pause feature, which triggers when the game loses focus or the tab is switched.

## User Review Required

> [!IMPORTANT]
> - The feature will be always-on.
> - It will apply to both regular gameplay and Demo Mode.
> - We will use a custom hook `useAutoPause` for better encapsulation.

- [ ] Does the implementation strategy for the `useAutoPause` hook look correct?
- [ ] Are there any additional edge cases for focus loss we should consider (e.g., certain browser dialogs)?

## Proposed Changes

### Hooks

#### [NEW] `src/hooks/use-auto-pause.ts`
- Create a `useAutoPause` hook that accepts an `onPause` callback.
- Implement `useEffect` to manage `blur` and `visibilitychange` events.
- Use a `ref` to track "debouncing" of simultaneous events.

### Components

#### `src/app/play/page.tsx`
- Import and use `useAutoPause` hook.
- Pass the existing `handlePause` callback to the hook.

### Testing

#### [NEW] `src/hooks/use-auto-pause.test.ts`
- Mock `window.addEventListener` and `document.addEventListener`.
- Simulate `blur` and `visibilitychange` events.
- Assert that `onPause` is called correctly and only once for simultaneous triggers.

## Verification Plan

### Automated Tests
- Run `npm test src/hooks/use-auto-pause.test.ts`.
- Run `npm run lint`.
- Run `npm run type-check`.

### Manual Verification
- Start the game (`npm run dev`).
- Switch tabs while playing; verify it pauses.
- Click out of the browser window; verify it pauses.
- Check Demo Mode; verify it also pauses.
