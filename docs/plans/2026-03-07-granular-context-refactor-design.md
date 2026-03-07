# Design Doc: Granular Context & Hook Refactor

## 1. Overview
Midi Jam currently uses a monolithic `AppContext` ("God Context") that causes unnecessary re-renders across the entire application, particularly on the `Play` page. This refactor splits the context into independent, domain-specific slices and introduces a "Coordinator Hook" pattern to manage cross-slice dependencies without "Provider Hell."

## 2. Architecture: Independent Slices
The `AppContext` will be replaced by 7 granular providers. Each provider is a "dumb" state container responsible for a single domain.

### 2.1. The Slices
| Provider | Hook | Responsibility |
| :--- | :--- | :--- |
| `HomeProvider` | `useHome` | Global MIDI support, initial app loading state. |
| `GearProvider` | `useGear` | MIDI device discovery, input/output selection. |
| `OptionsProvider` | `useOptions` | Playback speed, demo mode toggle. |
| `CollectionProvider` | `useCollection` | Metadata for the currently selected track. |
| `TrackProvider` | `useTrack` | Raw MIDI data (events, spans) and loading status. |
| `StageProvider` | `useStage` | Active gameplay state (score, combo, current time). |
| `ScoreProvider` | `useScore` | Final results of the last completed session. |

## 3. Data Flow: Coordinator Hooks
To avoid maintaining a strict nesting order, dependencies between slices are managed by "Coordinator Hooks" used at the top level of the application or within specific page layouts.

### 3.1. `useTrackSync()`
- **Responsibility**: Bridges `CollectionProvider` and `TrackProvider`.
- **Logic**: Watches `selectedTrack` and `pathname`. When a track is selected and the user navigates to a play-related path, it triggers the MIDI loader and updates `TrackProvider`.

### 3.2. `useAppReset()`
- **Responsibility**: Provides a unified `resetAll()` function.
- **Logic**: Calls the individual reset functions from all providers.

## 4. Performance Strategy
- **Isolation**: Components using `useStage` (like the `ScoreWidget`) will no longer trigger re-renders in components using `useTrack` (like the `TrackLane`).
- **Stable Context Values**: Each provider will use `useMemo` for its value object, ensuring that only relevant state changes trigger consumer updates.
- **Pure Hooks**: Business logic hooks (e.g., `useMidiAudio`, `useLaneTimeline`) will remain pure and receive data via props from the modular consumer hooks.

## 5. Implementation Plan (High Level)
1. Define individual context types and providers in `src/context/`.
2. Implement custom hooks for each slice.
3. Create `useTrackSync` coordinator.
4. Update `RootLayout` to wrap children in the new providers.
5. Incrementally update pages (`PlayPage`, `GearPage`, etc.) to use the granular hooks.
6. Decommission the monolithic `AppContext`.

## 6. Testing & Validation
- **Unit Tests**: Each provider and its corresponding hook will have unit tests for state transitions.
- **Performance Audit**: Use React DevTools Profiler to verify that score updates no longer re-render the `TrackLane`.
- **Regression**: Ensure track switching and MIDI device selection remain functional.
