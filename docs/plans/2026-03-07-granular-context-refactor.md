# Granular Context & Hook Refactor

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

## 1. Design Overview
Midi Jam currently uses a monolithic `AppContext` ("God Context") that causes unnecessary re-renders across the entire application, particularly on the `Play` page. This refactor splits the context into independent, domain-specific slices and introduces a "Coordinator Hook" pattern to manage cross-slice dependencies without "Provider Hell."

**Goal:** Split the monolithic `AppContext` into 7 granular, independent providers and introduce coordinator hooks to improve performance and maintainability.

**Architecture:** Independent Slices + Coordinator Hook Pattern. Each domain (Gear, Track, Options, etc.) gets its own Provider and Consumer Hook. A `useTrackSync` hook manages cross-context side effects like MIDI loading.

**Tech Stack:** React 19 (Context API), TypeScript, Vitest.

### 1.1. The Slices
| Provider | Hook | Responsibility |
| :--- | :--- | :--- |
| `HomeProvider` | `useHome` | Global MIDI support, initial app loading state. |
| `GearProvider` | `useGear` | MIDI device discovery, input/output selection. |
| `OptionsProvider` | `useOptions` | Playback speed, demo mode toggle. |
| `CollectionProvider` | `useCollection` | Metadata for the currently selected track. |
| `TrackProvider` | `useTrack` | Raw MIDI data (events, spans) and loading status. |
| `StageProvider` | `useStage` | Active gameplay state (score, combo, current time). |
| `ScoreProvider` | `useScore` | Final results of the last completed session. |

### 1.2. Data Flow: Coordinator Hooks
To avoid maintaining a strict nesting order, dependencies between slices are managed by "Coordinator Hooks" used at the top level of the application or within specific page layouts.

*   **`useTrackSync()`**: Bridges `CollectionProvider` and `TrackProvider`. Watches `selectedTrack` and `pathname`. When a track is selected and the user navigates to a play-related path, it triggers the MIDI loader and updates `TrackProvider`.
*   **`useAppReset()`**: Provides a unified `resetAll()` function by calling individual reset functions from all providers.

### 1.3. Performance Strategy
- **Isolation**: Components using `useStage` (like the `ScoreWidget`) will no longer trigger re-renders in components using `useTrack` (like the `TrackLane`).
- **Stable Context Values**: Each provider will use `useMemo` for its value object, ensuring that only relevant state changes trigger consumer updates.
- **Pure Hooks**: Business logic hooks (e.g., `useMidiAudio`, `useLaneTimeline`) will remain pure and receive data via props from the modular consumer hooks.

---

## 2. Implementation Tasks

### Task 1: Create `HomeProvider` and `useHome`
**Files:**
- Create: `src/context/home-context.tsx`
- Test: `src/context/home-context.test.tsx`

**Step 1: Write the failing test**
Verify that `useHome` throws if used outside provider and returns default values when inside.

**Step 2: Implement `HomeProvider`**
Extract `isHomeLoading`, `isSupported`, and `resetAll` (base) logic from `app-context.tsx`.

**Step 3: Run tests and commit**
`npm test src/context/home-context.test.tsx`

---

### Task 2: Create `GearProvider` and `useGear`
**Files:**
- Create: `src/context/gear-context.tsx`

**Step 1: Implement `GearProvider`**
Extract MIDI device selection logic. Use `useMIDIDevices` and `useMIDISelection` hooks internally.

**Step 2: Commit**
`git add src/context/gear-context.tsx && git commit -m "feat: add GearProvider"`

---

### Task 3: Create `OptionsProvider` and `useOptions`
**Files:**
- Create: `src/context/options-context.tsx`

**Step 1: Implement `OptionsProvider`**
Extract `speed` and `demoMode` state and setters.

**Step 2: Commit**
`git add src/context/options-context.tsx && git commit -m "feat: add OptionsProvider"`

---

### Task 4: Create `CollectionProvider` and `useCollection`
**Files:**
- Create: `src/context/collection-context.tsx`

**Step 1: Implement `CollectionProvider`**
Extract `selectedTrack` state and setter.

**Step 2: Commit**
`git add src/context/collection-context.tsx && git commit -m "feat: add CollectionProvider"`

---

### Task 5: Create `TrackProvider` and `useTrack`
**Files:**
- Create: `src/context/track-context.tsx`

**Step 1: Implement `TrackProvider`**
Provide `trackStatus` state and a `setTrackStatus` setter. This provider will be "dumb" and only hold the data.

**Step 2: Commit**
`git add src/context/track-context.tsx && git commit -m "feat: add TrackProvider"`

---

### Task 6: Create `StageProvider` and `useStage`
**Files:**
- Create: `src/context/stage-context.tsx`

**Step 1: Implement `StageProvider`**
Extract `gameSession` state and setter.

**Step 2: Commit**
`git add src/context/stage-context.tsx && git commit -m "feat: add StageProvider"`

---

### Task 7: Create `ScoreProvider` and `useScore`
**Files:**
- Create: `src/context/score-context.tsx`

**Step 1: Implement `ScoreProvider`**
Extract `sessionResults` state and setter.

**Step 2: Commit**
`git add src/context/score-context.tsx && git commit -m "feat: add ScoreProvider"`

---

### Task 8: Implement `useTrackSync` Coordinator
**Files:**
- Create: `src/hooks/use-track-sync.ts`

**Step 1: Implement Logic**
Move the `useEffect` MIDI loading logic from `app-context.tsx` into this hook. It should consume `useCollection`, `useTrack`, and `usePathname`.

**Step 2: Commit**
`git add src/hooks/use-track-sync.ts && git commit -m "feat: add useTrackSync coordinator hook"`

---

### Task 9: Integrate Providers in `RootLayout`
**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/context/combined-provider.tsx` (optional helper)

**Step 1: Wrap children**
Replace `<AppProvider>` with the new stack of providers. Add the `useTrackSync` hook in a client wrapper if needed.

**Step 2: Commit**
`git add src/app/layout.tsx src/context/combined-provider.tsx && git commit -m "refactor: replace monolithic AppProvider"`

---

### Task 10: Update Page Consumers
**Files:**
- Modify: `src/app/play/page.tsx`
- Modify: `src/app/gear/page.tsx`
- Modify: `src/app/collection/page.tsx`
- Modify: `src/app/options/page.tsx`

**Step 1: Replace `useAppContext`**
Update each page to use the granular hooks (`useGear`, `useTrack`, etc.) instead of destructuring from one big object.

**Step 2: Verify Performance**
Run the app and check for re-render isolation in the `PlayPage`.

**Step 3: Commit**
`git add src/app/ && git commit -m "refactor: use granular hooks in pages"`

---

### Task 11: Cleanup
**Files:**
- Delete: `src/context/app-context.tsx`

**Step 1: Remove old file**
Ensure no references remain.

**Step 2: Final Commit**
`git rm src/context/app-context.tsx && git commit -m "cleanup: remove monolithic app-context"`
