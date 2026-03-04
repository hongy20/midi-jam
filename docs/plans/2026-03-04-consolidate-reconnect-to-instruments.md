# Plan: Consolidate Reconnect into Instruments Page

## Problem
The project has a concept of a `/reconnect` route for mid-game device disconnections, but it lacks a dedicated page and the redirection logic doesn't preserve game state reliably. The goal is to use the existing `/instruments` page for reconnection and ensure the game state is saved when a device is lost.

## Proposed Changes

### 1. Update Navigation Logic
- **`src/lib/navigation/routes.ts`**: Remove `RECONNECT` constant.
- **`src/hooks/use-navigation.ts`**: 
  - Update `toInstruments` to accept an optional `from` query parameter.
  - Remove `toReconnect`.

### 2. Handle Mid-Game Disconnection in Game Page
- **`src/app/game/page.tsx`**:
  - Add a `useEffect` to detect when `selectedMIDIInput` becomes `null` while `isPlaying` is true.
  - When detected, save the current game state (`score`, `combo`, `currentTimeMs`) to the `gameSession` in `AppContext`. This ensures that when the user returns, they can resume from where they left off.

### 3. Update Navigation Guard
- **`src/components/navigation-guard.tsx`**:
  - Update the redirect logic: when `(isGame || isPause)` and `!instruments.input`, redirect to `ROUTES.INSTRUMENTS + "?from=game"`.
  - Remove the auto-redirect logic for "reconnected" status (it will be handled by the user clicking "Resume" in the Instruments page).

### 4. Enhance Instruments Page for Reconnection
- **`src/app/instruments/page.tsx`**:
  - Use `useSearchParams` to check if `from === 'game'`.
  - If it is, change the "Continue" button label to "Resume Game".
  - Change the "Continue" action to navigate back to `ROUTES.PAUSE` instead of `ROUTES.TRACKS`.
  - This allows the user to pick a new device (or wait for the old one to reconnect) and then return to the pause menu of their current game.

### 5. Cleanup Tests
- **`src/app/game/page.test.tsx`** & **`src/app/page.test.tsx`**:
  - Update mocks to reflect the removal of `toReconnect`.

---

## Verification Plan
1. **Manual Test: Mid-game disconnect**:
   - Start a game and play for a few seconds.
   - Manually disconnect the MIDI device (or simulate via console if possible).
   - Verify redirect to `/instruments?from=game`.
   - Reconnect/select a device and click "Resume Game".
   - Verify return to `/game/pause` with the correct score and time.
2. **Manual Test: Normal flow**:
   - Verify that navigating to `/instruments` from the main menu still works correctly and continues to `/tracks`.
3. **Automated Tests**:
   - Run `npm test` to ensure all existing navigation and game logic remains intact.
