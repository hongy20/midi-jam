# Design Doc: Navigation Guard Refactor

## 1. Overview
The goal of this refactor is to centralize navigation logic within a single `NavigationGuard` component. The guard will enforce page-level requirements based on the application's state (`AppContext`), ensuring users are always on a page they have the necessary data for.

## 2. Page Hierarchy & Requirements
We define three levels of page requirements:

### Level 2: High Requirement (`/play`, `/pause`)
- **Requirements**: `selectedMIDIInput` AND `selectedTrack`.
- **Violation (No MIDI)**: 
  - Call `setGameSession(null)` to stop and clear the game.
  - Redirect to `/gear` (optionally with `from=game`).
- **Violation (No Track)**:
  - Call `setGameSession(null)`.
  - Redirect to `/collection`.

### Level 1: Medium Requirement (`/collection`)
- **Requirements**: `selectedMIDIInput`.
- **Violation (No MIDI)**: Redirect to `/gear`.

### Level 0: No Requirement (`/`, `/gear`, `/score`, `/options`)
- **Requirements**: None.
- **Action**: No automatic redirection. The `/gear` page remains "dumb"—it only moves forward when the user explicitly interacts with it.

## 3. Implementation Details
- **Location**: `src/components/navigation-guard.tsx`.
- **Hooks**: Uses `useAppContext`, `usePathname`, and `useNavigation`.
- **Redirection**: All redirects use `router.replace()` via the `useNavigation` hook to maintain "History Neutrality".
- **Cleanup**: The guard is responsible for clearing the `gameSession` when moving *out* of Level 2 due to a violation.
- **Stability**: The guard will not trigger if the user is already on the target route to prevent infinite loops.

## 4. Specific Scenarios
- **Direct URL Entry**: Typing `/play` without a track or MIDI will trigger the waterfall: `No MIDI -> /gear`. After picking Gear and moving to `/collection`, it might still lack a track, staying there.
- **Hardware Changes**: Unplugging a MIDI device while playing immediately stops the game and moves the user to the Gear selection page.
- **Score Page Persistence**: Users can view results (`/score`) even if they unplug their device, as it is a Level 0 page.
