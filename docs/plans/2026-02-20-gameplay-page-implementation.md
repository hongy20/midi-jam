# Gameplay Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a new scroll-driven gameplay page that renders a MIDI-based note lane, drives lane motion via Web Animations + JS `ScrollTimeline`, supports demo playback via IntersectionObserver, and scores live MIDI input against the parsed MIDI model, with a future-proof instrument visualizer and lightweight HUD, optimized for Android Chrome performance.

**Architecture:** The gameplay page consumes selection and settings (MIDI devices, track, instrument, demoMode) from global context, owns lane playback and scoring state, and composes three main pieces: `LaneStage` (visual lane + target line), `InstrumentVisualizer` (instrument-specific UI, default keyboard), and `ScoreHudLite` (aggregated scoring + progress). Lane motion is controlled by a Web Animations motion object on the lane scroll container, while a JS `ScrollTimeline` bound to that container provides canonical song time and progress for scoring and UI.

**Tech Stack:** Next.js App Router (TypeScript, React 19), Tailwind CSS 4, Web MIDI API, Web Animations API, CSS ScrollTimeline (JS API), Vitest, Testing Library, Biome.

---

### Task 1: Review existing archive player and hooks

**Files:**
- Read: `src/app/archive-player/page.tsx`
- Read: `src/hooks/use-active-notes.ts` (or similar)
- Read: `src/hooks/use-midi-player.ts`, `src/hooks/use-score-engine.ts`, and related MIDI hooks

**Step 1: Review archive player composition**

- Open `src/app/archive-player/page.tsx` and identify:
  - Which hooks manage MIDI devices, audio, and scoring.
  - How `FalldownVisualizer`, `PianoKeyboard`, and `ScoreHud` are wired together.

**Step 2: Identify reusable pieces**

- Note which hooks and utilities should be reused or adapted in the new gameplay page (e.g. `useActiveNotes`, score engine logic, MIDI loader/parser).

**Step 3: Document findings**

- Add brief inline comments or a short note in `docs/plans/2026-02-20-gameplay-page-design.md` if any assumptions differ from the design (e.g. additional hooks discovered).

---

### Task 2: Scaffold `GamePlayPage` route

**Files:**
- Create: `src/app/gameplay/page.tsx`
- Test: `src/app/gameplay/page.test.tsx`

**Step 1: Create minimal page component**

- Add `src/app/gameplay/page.tsx` with:
  - `"use client";`
  - A placeholder `GamePlayPage` React component that renders a simple `<main>` with text like "Gameplay Page (WIP)".

**Step 2: Add smoke test for the route**

- Create `src/app/gameplay/page.test.tsx` using Testing Library:
  - Render the page component.
  - Assert that the placeholder text is present.

**Step 3: Run tests**

- Run: `npm test`
- Expected: New test passes.

---

### Task 3: Wire `GamePlayPage` to global context (settings, track, instrument, demo mode)

**Files:**
- Modify: `src/app/gameplay/page.tsx`
- Read/Use: any existing settings/selection hooks (e.g. `src/hooks/use-midi-selection.ts`, track/instrument selection hooks)

**Step 1: Import context hooks**

- Import existing hooks that expose:
  - Selected MIDI input/output.
  - Selected track / MIDI file (and potentially parsed data).
  - Instrument metadata.
  - `demoMode` flag (from settings page).

**Step 2: Consume context in `GamePlayPage`**

- In `GamePlayPage`, call these hooks and handle edge cases:
  - If no track is selected, render an instructional message instead of gameplay.
  - If no MIDI device is available, render a friendly warning but still allow demo mode if possible.

**Step 3: Replace placeholder layout**

- Replace the placeholder text with a basic structure:
  - A full-screen container.
  - Slots (or placeholder `<div>`s) for `LaneStage`, `InstrumentVisualizer`, and `ScoreHudLite`.

**Step 4: Run tests**

- Update `page.test.tsx` to assert that when track/context hooks are mocked with valid data, the placeholders render.
- Run: `npm test`

---

### Task 4: Implement lane geometry utilities (time → Y mapping)

**Files:**
- Create: `src/lib/gameplay/lane-geometry.ts`
- Test: `src/lib/gameplay/lane-geometry.test.ts`

**Step 1: Add utility functions**

- Implement pure functions:
  - `timeToY(timeMs: number, totalDurationMs: number, laneHeightPx: number): number`
  - Helpers to compute note block `top` and `height` from `{ startTimeMs, endTimeMs }`.

**Step 2: Write unit tests**

- In `lane-geometry.test.ts`:
  - Test that `timeToY(0)` maps to `0`.
  - Test that `timeToY(totalDurationMs)` maps to `laneHeightPx`.
  - Test intermediate values and note span height calculations.

**Step 3: Run tests**

- Run: `npm test -- src/lib/gameplay/lane-geometry.test.ts`

---

### Task 5: Implement static `LaneStage` layout (no animation yet)

**Files:**
- Create: `src/components/lane-stage.tsx`
- Test: `src/components/lane-stage.test.tsx`

**Step 1: Implement static lane + target line**

- `LaneStage` props:
  - Model notes (parsed note spans).
  - Total duration.
  - Range of pitches (for horizontal positioning).
  - Optional className.
- Render:
  - A scrollable container (`#lane-scroll`) with fixed height.
  - A tall inner lane where note `<div>`s are absolutely positioned using `lane-geometry` utilities.
  - A fixed-position target line band near the bottom.

**Step 2: Basic render test**

- In `lane-stage.test.tsx`:
  - Render `LaneStage` with a small set of fake notes.
  - Assert that the expected number of note elements and target line are in the DOM.

**Step 3: Integrate into `GamePlayPage`**

- Import `LaneStage` into `page.tsx` and pass in parsed notes and duration from the selected track (mock or placeholder parser call).

**Step 4: Run tests**

- Run: `npm test`

---

### Task 6: Implement Web Animations + JS `ScrollTimeline` hook

**Files:**
- Create: `src/hooks/use-lane-timeline.ts`
- Test: `src/hooks/use-lane-timeline.test.ts`
- Modify: `src/components/lane-stage.tsx`

**Step 1: Implement `useLaneTimeline` hook**

- Responsibilities:
  - Given:
    - A ref to the lane scroll container.
    - `totalDurationMs`.
    - Current `speed`.
  - Create and manage:
    - A Web Animations **motion** object that animates scroll from top to bottom.
    - A JS **`ScrollTimeline`** bound to the same container with `timeRange = totalDurationMs`.
  - Expose an API:
    - `play()`, `pause()`, `stop()`, `setSpeed(newSpeed)`.
    - `getCurrentTimeMs()` and `getProgress()` (reading `laneTimeline.currentTime`).

**Step 2: Use the hook in `LaneStage`**

- Attach a `ref` to the scroll container.
- Call `useLaneTimeline` to:
  - Start motion on play.
  - Pause/stop based on playback state (passed in from `GamePlayPage`).
  - Derive `progress` for debugging or UI if desired.

**Step 3: Write basic hook tests**

- In `use-lane-timeline.test.tsx`:
  - Use JSDOM to render a fake div, attach the hook, and verify:
    - `play()` sets up an animation object.
    - `pause()` calls `motion.pause()` (mocked).
  - For deeper tests, mock the Web Animations API.

**Step 4: Run tests**

- Run: `npm test -- src/hooks/use-lane-timeline.test.ts`

---

### Task 7: Implement demo playback via IntersectionObserver

**Files:**
- Create: `src/hooks/use-demo-playback.ts`
- Modify: `src/components/lane-stage.tsx`

**Step 1: Implement `useDemoPlayback` hook**

- Inputs:
  - Reference to the lane viewport and target band.
  - Model notes mapped to DOM elements (e.g. data attributes for pitch).
  - `demoMode` flag.
  - MIDI output handle and `playNote` / `stopNote` functions.
- Behavior:
  - Set up an `IntersectionObserver` to observe note elements.
  - When a note **enters** the target band and `demoMode` is true:
    - Call `playNote(pitch)`.
  - When the note **leaves** the band:
    - Call `stopNote(pitch)`.

**Step 2: Integrate into `LaneStage`**

- Ensure each note element carries identifying data (pitch, note id).
- Use `useDemoPlayback` to connect the target band and notes to the MIDI output.

**Step 3: Manual verification placeholder**

- Add a TODO-style comment in the plan to run manual tests later on Android Chrome once the full page is wired.

---

### Task 8: Implement gameplay scoring hook

**Files:**
- Create: `src/hooks/use-lane-score-engine.ts`
- Test: `src/hooks/use-lane-score-engine.test.ts`

**Step 1: Implement scoring logic**

- Inputs:
  - Model notes (spans, pitches).
  - Live MIDI input events (note-on/note-off with timestamps).
  - A function or callback to get `currentTimeMs` from `useLaneTimeline` / `ScrollTimeline`.
- Behavior:
  - On live note events:
    - Read `currentTimeMs`.
    - Match event to nearest model note of the same pitch.
    - Classify as Perfect/Good/Miss based on time delta thresholds.
    - Update score, combo, and last hit quality.

**Step 2: Expose aggregated state**

- Return:
  - `score`, `combo`, `lastHitQuality`, `progress`.

**Step 3: Unit tests**

- Simulate a few model notes and live events at specific times:
  - Verify that events within small windows are Perfect, slightly off are Good, and far off are Miss.
  - Verify combo increments/resets correctly.

**Step 4: Run tests**

- Run: `npm test -- src/hooks/use-lane-score-engine.test.ts`

---

### Task 9: Implement `InstrumentVisualizer` abstraction and default keyboard

**Files:**
- Create: `src/lib/instrument/visualizer-config.ts`
- Create: `src/components/instrument-visualizer.tsx`
- Test: `src/components/instrument-visualizer.test.tsx`

**Step 1: Implement config utility**

- `getInstrumentVisualizerConfig(instrumentId: string)`:
  - For `"piano"`, return:
    - Component: existing `PianoKeyboard`.
    - Pitch → key index mapping.
  - For unknown instruments, default to the `"piano"` config for now.

**Step 2: Implement `InstrumentVisualizer`**

- Props:
  - `instrumentId` (string).
  - Sets of live and demo notes.
- Behavior:
  - Use `getInstrumentVisualizerConfig` to choose the component + mapping.
  - Render the chosen component with the correct active note sets.

**Step 3: Add tests**

- In `instrument-visualizer.test.tsx`:
  - Verify that `"piano"` id renders the `PianoKeyboard`.
  - Verify that unknown ids fall back to `PianoKeyboard`.

**Step 4: Integrate into `GamePlayPage`**

- Import and render `InstrumentVisualizer`, passing instrument id and active note sets.

---

### Task 10: Implement `ScoreHudLite`

**Files:**
- Create: `src/components/score-hud-lite.tsx`
- Test: `src/components/score-hud-lite.test.tsx`

**Step 1: Implement HUD component**

- Props:
  - `score`, `combo`, `lastHitQuality`, `progress`.
- Layout:
  - Small, fixed overlay with:
    - Score number.
    - Current combo.
    - Last hit quality label.
    - Progress bar and percentage text.

**Step 2: Basic render tests**

- In `score-hud-lite.test.tsx`:
  - Render with sample props and assert they appear correctly.

**Step 3: Integrate into `GamePlayPage`**

- Feed props from `useLaneScoreEngine` and ScrollTimeline progress.

---

### Task 11: Wire everything together and run full test suite

**Files:**
- Modify: `src/app/gameplay/page.tsx`
- Modify: any components/hooks as needed for integration

**Step 1: Connect hooks and components in `GamePlayPage`**

- Use context hooks to get:
  - Selected track and parsed notes.
  - Instrument id.
  - `demoMode`.
  - Selected MIDI input/output.
- Compose:
  - `LaneStage` (with note data, totalDurationMs, demo playback options).
  - `InstrumentVisualizer` (with live and demo active notes).
  - `ScoreHudLite` (with data from scoring hook).

**Step 2: Run test suite**

- Run: `npm test`
- Expected: All new and existing tests pass.

**Step 3: Run lint and type-check**

- Run: `npm run lint`
- Run: `npm run type-check`

**Step 4: Manual testing on Android Chrome**

- Start dev server: `npm run dev`
- On a physical Android device (Chrome):
  - Load the gameplay page.
  - Select a track and device.
  - Verify:
    - Lane motion is smooth and stable (no crashes after prolonged play).
    - Demo mode plays notes as they cross the target line.
    - Scoring responds correctly to early/late hits and misses.
    - HUD updates are responsive and do not cause visible jank.

