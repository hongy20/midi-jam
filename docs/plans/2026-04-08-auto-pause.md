# Auto-Pause on Blur / Tab Switch

## 1. Overview
The user requests a feature to automatically pause the game during gameplay whenever the window loses focus (e.g. clicking out of the browser, screen locking) or the document becomes hidden (e.g. switching tabs). This should also apply when the game is in Demo Mode.

## 2. Design

### Architecture & Components
We will abstract the window focus and visibility logic into a dedicated React hook, `useAutoPause`, located at `src/hooks/use-auto-pause.ts`. This ensures our UI components remain clean.

### Data Flow
- `useAutoPause` will accept a single `onPause` callback function.
- It will bind listeners to `window.addEventListener('blur')` and `document.addEventListener('visibilitychange')`.
- To prevent duplicate triggers if a scenario fires both events simultaneously, the hook will use a simple internal ref-based guard and directly call the callback if focus is lost or visibility is hidden.
- In `src/app/play/page.tsx`, we will pass the existing `handlePause` function to this new hook.

### Error Handling & Edge Cases
- **Simultaneous Events**: Both events might fire practically simultaneously when switching tabs. The hook safely debounces them internally.
- **Unfocus vs Hidden**: We'll make sure `document.visibilityState === 'hidden'` or `document.hasFocus() === false` is verified.
- **Demo Mode**: Because `handlePause` is integrated simply into `PlayPage.tsx`, it will seamlessly trigger during Demo Mode the same way it does during manual play.
