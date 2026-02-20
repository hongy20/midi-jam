# Gameplay Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the existing `/game` page to implement a new scroll-driven gameplay experience. This includes rendering a MIDI-based note lane, driving lane motion via Web Animations + JS `ScrollTimeline`, supporting demo playback via IntersectionObserver, and scoring live MIDI input against the parsed MIDI model. We will preserve the existing navigation logic (pause, restart, quit) and optimize for Android Chrome performance.

**Architecture:** The `GamePage` (at `src/app/game/page.tsx`) consumes selection and settings (MIDI devices, track, instrument, demoMode) from global context, owns lane playback and scoring state, and composes three main pieces: `LaneStage` (visual lane + target line), `InstrumentVisualizer` (instrument-specific UI, default keyboard), and `ScoreHudLite` (aggregated scoring + progress). Lane motion is controlled by a Web Animations motion object on the lane scroll container, while a JS `ScrollTimeline` bound to that container provides canonical song time and progress for scoring and UI.

**Tech Stack:** Next.js App Router (TypeScript, React 19), Tailwind CSS 4, Web MIDI API, Web Animations API, CSS ScrollTimeline (JS API), Vitest, Testing Library, Biome.

---

### Task 1: Review existing gameplay page and hooks

**Files:**
- Read: `src/app/game/page.tsx`
- Read: `src/hooks/use-active-notes.ts` (or similar)
- Read: `src/hooks/use-midi-player.ts`, `src/hooks/use-score-engine.ts`, and related MIDI hooks

**Step 1: Review current game page composition**

- Open `src/app/game/page.tsx` and identify:
  - Which hooks manage MIDI devices, audio, and scoring.
  - How placeholders are currently wired.
  - Current state management for timer and navigation in `GamePage`.

**Step 2: Identify reusable pieces and refactor strategy**

- Note which hooks and utilities should be reused or adapted.
- Plan how to integrate the new lane logic while keeping the existing `isPaused`, `handleTogglePause`, and navigation logic in `GamePage`.

**Step 3: Document findings**

- Add brief inline comments or a short note in `docs/plans/2026-02-20-gameplay-page-design.md` if any assumptions differ from the design.

---

### Task 2: Refactor `GamePage` structure

**Files:**
- Modify: `src/app/game/page.tsx`
- Test: `src/app/game/page.test.tsx` (create if missing or update)

**Step 1: Clean up placeholder UI**

- Remove the placeholder "JAMMING" text and related background mesh if they conflict with the new design.
- Prepare the slots for `LaneStage`, `InstrumentVisualizer`, and `ScoreHudLite`.

**Step 2: Ensure navigation state is preserved**

- Verify `isPaused`, `timeLeft`, and `showOverlay` are correctly wired to the new playback components (once implemented).

**Step 3: Update/Create smoke tests**

- Ensure tests verify that the page still renders and responds to the pause toggle.

---

### Task 3: Wire `GamePage` to global context and new logic

**Files:**
- Modify: `src/app/game/page.tsx`
- Read/Use: existing settings/selection hooks

**Step 1: Expand context consumption**

- Ensure `GamePage` correctly consumes:
  - Selected MIDI input/output.
  - Selected track / MIDI file (parsed via `useMIDIPlayer` or similar).
  - Instrument metadata.
  - `demoMode` flag.

**Step 2: Handle edge cases**

- If no track is selected, render an instructional message instead of the game lane.
- If no MIDI device is available, show a warning but allow demo mode.

**Step 3: Integrate initial HUD placeholders**

- Replace existing timer UI with `ScoreHudLite` placeholders if they provide more relevant information (score, combo, etc.).

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
  - Optional className.
- Render:
  - A container taking up its grid cell (`1fr`).
  - A scrollable container (`#lane-scroll`) with `overflow: hidden`.
  - A tall inner lane where note `<div>`s are absolutely positioned.
  - **Target Line**: A 1px thin horizontal line absolute at `bottom-0` of the component (not scrolling).

**Step 2: Basic render test**

- In `lane-stage.test.tsx`:
  - Render `LaneStage` with a small set of fake notes.
  - Assert that the expected number of note elements and the 1px target line are in the DOM.

**Step 3: Integrate into `GamePage`**

- Import `LaneStage` into `page.tsx` and place it in the middle row of the CSS grid.

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
    - Note range: Full standard range (88 keys).
  - For unknown instruments, default to the `"piano"` config.

**Step 2: Implement `InstrumentVisualizer`**

- Props:
  - `instrumentId` (string).
  - Sets of live and demo notes.
- Behavior:
  - Use `getInstrumentVisualizerConfig` to choose the component.
  - Render the chosen component with the **full standard range** (no dynamic cropping).

**Step 3: Add tests**

- In `instrument-visualizer.test.tsx`:
  - Verify that the component renders with its full default range.

**Step 4: Integrate into `GamePage`**

- Import and render `InstrumentVisualizer` in the bottom row of the CSS grid.

---

### Task 10: Implement `ScoreHudLite`

**Files:**
- Create: `src/components/score-hud-lite.tsx`
- Test: `src/components/score-hud-lite.test.tsx`

**Step 1: Implement HUD component**

- Props:
  - `score`, `combo`, `lastHitQuality`, `progress`.
- Layout:
  - Designed to sit in the top row of the grid.
  - **Left-aligned section**: Score, Combo, and Last Hit Quality label.
  - **Progress indicator**: Integrated progress bar or percentage.
  - (The Pause button will be handled in `GamePage` next to the HUD).

**Step 2: Basic render tests**

- In `score-hud-lite.test.tsx`:
  - Render with sample props and assert they appear correctly on the left side of the component.

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

### Task 12: Browser Support Check on Welcome Page

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Implement browser support check**

- Check for:
  - `navigator.requestMIDIAccess` (Web MIDI API)
  - `window.ScrollTimeline` (ScrollTimeline API)
- If not supported:
  - Disable "START JAM" button.
  - Show a message indicating the browser is not supported and recommending Android Chrome.

### Task 13: Clean up legacy files

**Files:**
- Delete: `src/hooks/use-midi-player.ts`
- Delete: `src/hooks/use-playback-clock.ts`
- Delete: `src/hooks/use-score-engine.ts` (if fully replaced by `use-lane-score-engine.ts`)
- Delete: `src/app/archive-player/` (Archived gameplay page and tests)
- Delete: Any other unused legacy components or hooks identified during the refactor.

