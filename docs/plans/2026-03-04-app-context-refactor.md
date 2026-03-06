# AppContext Refactor & Navigation Guard Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `SelectionContext` into a grouped `AppContext`, centralize navigation rules in a `NavigationGuard`, and implement explicit MIDI track loading status.

**Architecture:** Use a state-driven router pattern where a top-level `NavigationGuard` enforces redirects based on the `AppContext` state and current `pathname`. Move MIDI parsing logic into the context's `game` group.

**Tech Stack:** React 19, Next.js 15 (App Router), Web MIDI API, Tone.js, Vitest, Biome.

---

## Design Document

### 1. Overview
The current `SelectionContext` has grown beyond its original scope, mixing MIDI device management, track selection, and game session state. This refactor will rename it to `AppContext`, group its properties by domain/page, and introduce a "State-Driven Router" via a `NavigationGuard` to enforce business rules globally.

### 2. Goals
- **Domain Grouping**: Clear separation of state for `tracks`, `instruments`, `game`, `results`, and `settings`.
- **Reactive Navigation**: Move navigation logic into a centralized `NavigationGuard` that reacts to state changes (e.g., device disconnection).
- **Explicit Track Status**: Use a discriminated union to represent the loading state of MIDI tracks within the `game` group.
- **History Neutrality**: Continue using `router.replace` for all semantic navigation to maintain a flat history stack.

### 3. Architecture

#### 3.1 AppContext Structure
The context will use nested objects for grouping. Setters will be colocated with their properties.

```typescript
type TrackLoadStatus = 
  | { isLoading: true }
  | { isLoading: false; isReady: false; error: string | null }
  | { 
      isLoading: false; 
      isReady: true; 
      originalDurationMs: number; 
      events: MidiEvent[]; 
      spans: NoteSpan[]; 
    };

interface AppContextType {
  tracks: {
    selected: Track | null;
    set: (track: Track | null) => void;
  };
  instruments: {
    input: WebMidi.MIDIInput | null;
    output: WebMidi.MIDIOutput | null;
    lastInputName: string | null; // For the reconnect page
    selectInput: (input: WebMidi.MIDIInput | null) => void;
    selectOutput: (output: WebMidi.MIDIOutput | null) => void;
  };
  game: {
    track: TrackLoadStatus;
    session: GameSession | null;
    setSession: (s: GameSession | null) => void;
  };
  results: {
    last: SessionResults | null;
    set: (r: SessionResults | null) => void;
  };
  settings: {
    speed: number;
    demoMode: boolean;
    setSpeed: (speed: number) => void;
    setDemoMode: (enabled: boolean) => void;
  };
  actions: {
    resetAll: () => void;
  };
}
```

#### 3.2 Navigation Guard Table
A centralized `NavigationGuard` component will monitor the `pathname` and `AppContext` state.

| Path | Condition | Target Path | Reason |
| :--- | :--- | :--- | :--- |
| `/play` | `!tracks.selected` | `/collection` | No music chosen |
| `/play` | `!instruments.input` | `/reconnect` | Device disconnected |
| `/pause` | `!tracks.selected` | `/collection` | Lost track context |
| `/pause` | `!instruments.input` | `/reconnect` | Device disconnected while paused |
| `/reconnect` | `instruments.input !== null` | `/pause` | Device restored; return to pause |
| `/gear` | `!tracks.selected` | `/collection` | Must pick music before instrument |
| `/score` | `!results.last` | `/` | No results to display |
| `/options` | *(None)* | *(None)* | Always accessible |

#### 3.3 Data Flow: MIDI Parsing
1. **Trigger**: When the user navigates to `/play` and `tracks.selected` exists.
2. **Execution**: `AppContext` uses a `useEffect` to parse the selected track.
3. **State Update**: `game.track` transitions from `{ isLoading: true }` to the final result.
4. **UI**: `GamePage` renders a loader if `game.track.isLoading` is true.

---

## Implementation Tasks

### Task 1: Define Route Constants

**Files:**
- Create: `src/lib/navigation/routes.ts`

**Step 1: Create the routes constants file**

```typescript
export const ROUTES = {
  HOME: '/',
  TRACKS: '/collection',
  INSTRUMENTS: '/gear',
  GAME: '/play',
  PAUSE: '/pause',
  RESULTS: '/score',
  RECONNECT: '/reconnect',
  SETTINGS: '/options',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
```

**Step 2: Commit**

```bash
git add src/lib/navigation/routes.ts
git commit -m "feat: define centralized route constants"
```

---

### Task 2: Refactor Context Types & Initial State

**Files:**
- Modify: `src/context/selection-context.tsx` (Rename to `src/context/app-context.tsx` later)

**Step 1: Define the new `AppContextType` and `TrackLoadStatus`**

Update the interface to match the design document.

```typescript
export type TrackLoadStatus = 
  | { isLoading: true; isReady: false; error: null }
  | { isLoading: false; isReady: false; error: string | null }
  | { 
      isLoading: false; 
      isReady: true; 
      originalDurationMs: number; 
      events: MidiEvent[]; 
      spans: NoteSpan[]; 
      error: null;
    };

// ... other nested interfaces for AppContextType
```

**Step 2: Commit**

```bash
git commit -m "refactor: define new AppContext types and structure"
```

---

### Task 3: Implement AppContext Logic & MIDI Parsing

**Files:**
- Modify: `src/context/app-context.tsx`
- Remove: `src/hooks/use-midi-track.ts` (Logic moved to context)

**Step 1: Move MIDI parsing logic into `AppContext`**

Add a `useEffect` inside `AppProvider` that watches `tracks.selected` and the current path. If on `/play`, trigger `loadMidiFile` and update `game.track`.

**Step 2: Update `instruments` group with `lastInputName`**

Ensure `selectInput` updates `lastInputName` whenever a non-null input is selected.

**Step 3: Update `resetAll` action**

Implement a single function to clear all state groups.

**Step 4: Commit**

```bash
git add src/context/app-context.tsx
git commit -m "feat: implement AppContext logic and internal MIDI parsing"
```

---

### Task 4: Refactor useNavigation Hook

**Files:**
- Modify: `src/hooks/use-game-navigation.ts` (Rename to `src/hooks/use-navigation.ts`)

**Step 1: Implement semantic navigation methods**

```typescript
export function useNavigation() {
  const router = useRouter();
  const navigate = (path: string) => router.replace(path);

  return {
    toHome: () => navigate(ROUTES.HOME),
    toTracks: () => navigate(ROUTES.TRACKS),
    toInstruments: () => navigate(ROUTES.INSTRUMENTS),
    toGame: () => navigate(ROUTES.GAME),
    toPause: () => navigate(ROUTES.PAUSE),
    toResults: () => navigate(ROUTES.RESULTS),
    toReconnect: () => navigate(ROUTES.RECONNECT),
    toSettings: () => navigate(ROUTES.SETTINGS),
    goBack: (fallback = ROUTES.HOME) => navigate(fallback),
  };
}
```

**Step 2: Commit**

```bash
git commit -m "refactor: create semantic useNavigation hook"
```

---

### Task 5: Implement Global Navigation Guard

**Files:**
- Modify: `src/components/navigation-guard.tsx`

**Step 1: Implement the Guard Table logic**

Use `usePathname` and `useAppContext` to enforce the rules from the design doc.

**Step 2: Commit**

```bash
git add src/components/navigation-guard.tsx
git commit -m "feat: implement state-driven NavigationGuard"
```

---

### Task 6: Update Pages & Components to new Context

**Files:**
- Modify: `src/app/play/page.tsx`
- Modify: `src/app/collection/page.tsx`
- Modify: `src/app/gear/page.tsx`
- Modify: `src/app/score/page.tsx`
- Modify: `src/components/device-selector.tsx`
- ... (Other components using useSelection)

**Step 1: Bulk update `useSelection()` to `useAppContext()`**

Update property access (e.g., `selectedTrack` -> `tracks.selected`).

**Step 2: Update `GamePage` to handle `game.track.isLoading`**

Replace the old `useMidiTrack` call with `game.track` from context.

**Step 3: Run Biome fix**

Run: `npm run lint:fix`

**Step 4: Commit**

```bash
git commit -m "refactor: update all components to use new AppContext structure"
```

---

### Task 7: Verification & Cleanup

**Step 1: Run Type Check**

Run: `npm run type-check`
Expected: PASS

**Step 2: Run Tests**

Run: `npm test`
Expected: PASS (Update tests as needed for new context structure)

**Step 3: Final Build**

Run: `npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git commit -m "chore: final verification and cleanup"
```
