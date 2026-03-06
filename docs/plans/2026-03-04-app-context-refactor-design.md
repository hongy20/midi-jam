# Design Document: AppContext Refactor & Navigation Guard

## 1. Overview
The current `SelectionContext` has grown beyond its original scope, mixing MIDI device management, track selection, and game session state. This refactor will rename it to `AppContext`, group its properties by domain/page, and introduce a "State-Driven Router" via a `NavigationGuard` to enforce business rules globally.

## 2. Goals
- **Domain Grouping**: Clear separation of state for `tracks`, `instruments`, `game`, `results`, and `settings`.
- **Reactive Navigation**: Move navigation logic into a centralized `NavigationGuard` that reacts to state changes (e.g., device disconnection).
- **Explicit Track Status**: Use a discriminated union to represent the loading state of MIDI tracks within the `game` group.
- **History Neutrality**: Continue using `router.replace` for all semantic navigation to maintain a flat history stack.

## 3. Architecture

### 3.1 AppContext Structure
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

### 3.2 Navigation Guard Table
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

### 3.3 Data Flow: MIDI Parsing
1. **Trigger**: When the user navigates to `/play` and `tracks.selected` exists.
2. **Execution**: `AppContext` uses a `useEffect` to parse the selected track.
3. **State Update**: `game.track` transitions from `{ isLoading: true }` to the final result.
4. **UI**: `GamePage` renders a loader if `game.track.isLoading` is true.

## 4. Implementation Strategy
1. **Constants**: Define `src/lib/navigation/routes.ts`.
2. **Context**: Refactor `src/context/selection-context.tsx` to `src/context/app-context.tsx`.
3. **Hook**: Refactor `src/hooks/use-game-navigation.ts` to `src/hooks/use-navigation.ts` with semantic methods.
4. **Guard**: Update `src/components/navigation-guard.tsx` to implement the Guard Table.
5. **Consumption**: Update `GamePage`, `TracksPage`, etc., to use the new grouped context structure.

## 5. Success Criteria
- [ ] No `useEffect` redirects inside individual pages (except the Guard).
- [ ] Mid-game device disconnect triggers the `/reconnect` page.
- [ ] Reconnecting the device returns the user to the `/pause` screen.
- [ ] `GamePage` handles the `game.track.isLoading` state explicitly.
- [ ] All tests pass and type-checking is clean.
