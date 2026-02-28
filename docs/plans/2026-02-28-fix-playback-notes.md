# Real-time Playback Notes Display Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the hardcoded `playbackNotes` bug in `GamePage` to correctly display demo notes on the virtual instrument in real-time.

**Architecture:** Lift `useMidiAudio` and `useDemoPlayback` from `LaneStage` up to `GamePage`. Maintain a `playbackNotes` state in `GamePage` that is updated by the `onNoteOn` and `onNoteOff` callbacks of `useDemoPlayback`, then pass this state down to both `LaneStage` and `VirtualInstrument`.

**Tech Stack:** Next.js (App Router), React (Hooks, State), MIDI processing logic.

---

### Task 1: Refactor LaneStage to remove internal playback logic

**Files:**
- Modify: `src/components/lane-stage/lane-stage.tsx`

**Step 1: Remove hooks and internal calls**

```tsx
// src/components/lane-stage/lane-stage.tsx

// Remove:
// import { useDemoPlayback } from "@/hooks/use-demo-playback";
// import { useMidiAudio } from "@/hooks/use-midi-audio";

// Remove from body:
// const { playNote, stopNote } = useMidiAudio(demoMode, selectedMIDIOutput);
// useDemoPlayback({ ... });
```

**Step 2: Commit**
```bash
git add src/components/lane-stage/lane-stage.tsx
git commit -m "refactor(lane-stage): remove internal playback hooks"
```

---

### Task 2: Implement playback state in GamePage

**Files:**
- Modify: `src/app/game/page.tsx`

**Step 1: Import hooks and add playback state**

```tsx
// src/app/game/page.tsx

import { useDemoPlayback } from "@/hooks/use-demo-playback";
import { useMidiAudio } from "@/hooks/use-midi-audio";

// Inside GamePage:
const { demoMode } = useSelection(); // Ensure demoMode is destructured
const [playbackNotes, setPlaybackNotes] = useState<Set<number>>(new Set());

// Initialize audio
const { playNote, stopNote } = useMidiAudio(demoMode, selectedMIDIInput);

// Define callbacks that update state AND play audio
const handleNoteOn = useCallback((note: number, velocity: number) => {
  setPlaybackNotes((prev) => {
    const next = new Set(prev);
    next.add(note);
    return next;
  });
  playNote(note, velocity);
}, [playNote]);

const handleNoteOff = useCallback((note: number) => {
  setPlaybackNotes((prev) => {
    const next = new Set(prev);
    next.delete(note);
    return next;
  });
  stopNote(note);
}, [stopNote]);

// Trigger playback observer
useDemoPlayback({
  containerRef: scrollRef,
  demoMode,
  onNoteOn: handleNoteOn,
  onNoteOff: handleNoteOff,
});
```

**Step 2: Pass real playbackNotes to VirtualInstrument**

```tsx
// src/app/game/page.tsx

<VirtualInstrument
  inputDevice={selectedMIDIInput}
  liveNotes={liveActiveNotes}
  playbackNotes={playbackNotes} // Use the state here
/>
```

**Step 3: Commit**
```bash
git add src/app/game/page.tsx
git commit -m "feat(game): lift playback state to display demo notes on keyboard"
```

---

### Task 3: Verification

**Step 1: Verify all tests pass**
Run: `npm test`

**Step 2: Manual verification**
1. Enable Demo Mode in Settings.
2. Start a Game.
3. Observe the `VirtualInstrument` (Piano Keyboard) - it should now show the demo notes being "played" automatically.
