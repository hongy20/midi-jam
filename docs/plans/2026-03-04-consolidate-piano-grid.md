# Consolidated Piano Grid & Instrument Props Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate duplicated MIDI note positioning CSS classes into a single shared module, prepare components for multi-instrument support by passing `inputDevice` props, and decommission the obsolete `falldown-visualizer`.

**Architecture:** 
1. Create a `piano-grid.module.css` using CSS composition for the 21-unit octave grid.
2. Refactor components (PianoKeyboard, BackgroundLane, TrackLane) to consume the shared module.
3. Update `LaneStage` and its children to accept `inputDevice: WebMidi.MIDIInput` to enable future instrument-specific rendering (Piano vs. Drums).
4. Remove the redundant `src/components/falldown-visualizer` directory and its usages.

**Tech Stack:** Next.js (App Router), CSS Modules, Web MIDI API Types.

---

### Task 1: Create Shared Piano Grid Module

**Files:**
- Create: `src/components/piano-keyboard/piano-grid.module.css`

**Step 1: Write the shared CSS logic**
```css
.noteBase {
  grid-column: calc(var(--note-start) - var(--start-unit) + 1) / span var(--note-span);
}
```

**Step 2: Commit initial structure**
```bash
git add src/components/piano-keyboard/piano-grid.module.css
git commit -m "feat: create shared piano-grid module with base logic"
```

---

### Task 2: Populate Shared Module with All Notes (21-108)

**Files:**
- Modify: `src/components/piano-keyboard/piano-grid.module.css`

**Step 1: Add all 88 note definitions** (21 to 108).
**Step 2: Commit**
```bash
git commit -m "feat: populate shared piano-grid with all 88 notes"
```

---

### Task 3: Refactor PianoKeyboard (CSS Only)

**Files:**
- Modify: `src/components/piano-keyboard/PianoKeyboard.tsx`
- Modify: `src/components/piano-keyboard/piano-keyboard.module.css`

**Step 1: Update Logic**
- Import `gridStyles` from `./piano-grid.module.css`.
- Use `gridStyles[`note-${note}`]` for positioning.

**Step 2: Remove duplicated note classes** from `piano-keyboard.module.css`.

**Step 3: Run tests**
```bash
npm test src/components/piano-keyboard/PianoKeyboard.test.tsx
```

**Step 4: Commit**
```bash
git commit -m "refactor: consolidate CSS in PianoKeyboard"
```

---

### Task 4: Decommission Falldown Visualizer

**Files:**
- Delete: `src/components/falldown-visualizer/BackgroundGrid.tsx`
- Delete: `src/components/falldown-visualizer/background-grid.module.css`
- Modify: `src/app/game/page.tsx` (Remove `BackgroundGrid` import and usage)

**Step 1: Remove references** in `src/app/game/page.tsx`.
**Step 2: Delete the directory** `src/components/falldown-visualizer/`.

**Step 3: Commit**
```bash
git rm -r src/components/falldown-visualizer/
git add src/app/game/page.tsx
git commit -m "chore: remove obsolete falldown-visualizer components"
```

---

### Task 5: Refactor LaneStage and Children (CSS + Props)

**Files:**
- Modify: `src/components/lane-stage/lane-stage.tsx`
- Modify: `src/components/lane-stage/background-lane.tsx`
- Modify: `src/components/lane-stage/track-lane.tsx`
- Modify: `src/components/lane-stage/background-lane.module.css`

**Step 1: Update Interfaces and Logic**
- Add `inputDevice?: WebMidi.MIDIInput` to `LaneStageProps`, `BackgroundLaneProps`, and `TrackLaneProps`.
- Propagate `inputDevice` from `LaneStage` to its children.
- Use shared `gridStyles` in `BackgroundLane` and `TrackLane`.

**Step 2: Clean up duplicated CSS** in `background-lane.module.css`.

**Step 3: Run tests**
```bash
npm test src/components/lane-stage/lane-stage.test.tsx
```

**Step 4: Commit**
```bash
git commit -m "refactor: add inputDevice prop to LaneStage and consolidate child CSS"
```

---

### Task 6: Propagate inputDevice from Game Page

**Files:**
- Modify: `src/app/game/page.tsx`

**Step 1: Pass inputDevice**
- Ensure the `selectedInput` from MIDI context is passed to `LaneStage`.

**Step 2: Commit**
```bash
git commit -m "refactor: propagate inputDevice from game page to LaneStage"
```

---

### Task 7: Final Validation

**Step 1: Full Suite**
```bash
npm run lint && npm run type-check && npm test && npm run build
```

**Step 2: Finalize**
```bash
git commit -m "chore: complete shared grid refactor, prop propagation, and cleanup"
```
