# Design: Lifecycle-Driven Gameplay (Pause/Resume Refactor)

Date: 2026-03-24
Status: Approved

## Overview

Refactor the gameplay pause/resume logic in `/play` to be driven by the React component lifecycle rather than a manual `isPaused` state. Since the `/play` route unmounts when navigating to `/pause`, we can rely on standard unmount cleanup to "pause" the game and mount initialization to "resume" it.

This simplifies the code, reduces prop drilling, and eliminates redundant state synchronization between components and hooks.

## Architecture: "Mounted is Running"

The presence of the `/play` component in the DOM is the definitive signal that the game is active.

- **Start/Resume**: The `/play` component mounts. Hooks (`useLaneTimeline`, `useLaneScoreEngine`) initialize using persisted values from `StageContext` (`currentTimeMs`, `score`, `combo`).
- **Pause**: The user navigates to `/pause`. The `/play` component unmounts. Standard React cleanup (clearing intervals, canceling animations, stopping audio) "pauses" the game state.
- **Stop/Reset**: Disconnecting a MIDI device or explicitly ending the session redirects to `/` (Home), where `resetAll()` is called on mount to hard-reset the application.

## Key Components & Hooks

### `PlayPage` (/src/app/play/page.tsx)
- **Remove**: `isPaused` state and its associated logic.
- **Update**: `handleTogglePause` only saves the current session state and navigates to `/pause`.
- **Device Loss**: If `selectedMIDIInput` is lost, navigate to `/` and call `setGameSession(null)`. The `WelcomePage` will handle the full `resetAll()`.

### `useLaneTimeline` (/src/hooks/use-lane-timeline.ts)
- **Remove**: `isPaused` prop.
- **Behavior**: The Web Animation starts immediately on mount using `initialTimeMs`. The cleanup function handles canceling the animation on unmount.

### `useLaneScoreEngine` (/src/hooks/use-lane-score-engine.ts)
- **Remove**: `isPlaying` prop.
- **Behavior**: Scoring and miss-detection intervals start on mount and clear on unmount.

### `LaneStage` & `ScoreWidget`
- **Remove**: `isPaused` props.
- **Behavior**: Polling intervals and `requestAnimationFrame` loops run for the duration of the component's mount cycle.

## Data Flow

1. **Play -> Pause**:
   - `PlayPage` saves `currentTimeMs`, `score`, and `combo` to `StageContext`.
   - `toPause()` is called.
   - `/play` unmounts -> Animations/Intervals stop.
2. **Pause -> Play**:
   - `toPlay()` is called.
   - `/play` mounts.
   - Hooks read `initialTimeMs`, `initialScore`, and `initialCombo` from `StageContext`.
   - Gameplay resumes seamlessly from the saved state.

## Testing Strategy

- **Verification**:
  - Navigating to `/pause` stops all sound and animations.
  - Returning to `/play` resumes from the exact `currentTimeMs`.
  - MIDI device disconnection triggers a redirect to `/` and a full state reset.
- **Tests**:
  - Update `PlayPage.test.tsx`, `useLaneTimeline.test.ts`, and component tests to reflect the removal of `isPaused`.
