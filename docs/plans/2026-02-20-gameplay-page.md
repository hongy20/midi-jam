# Gameplay Page Refactor Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the existing `/play` page to implement a new scroll-driven gameplay experience. This includes rendering a MIDI-based note lane, driving lane motion via Web Animations + JS `ScrollTimeline`, supporting demo playback via IntersectionObserver, and scoring live MIDI input against the parsed MIDI model. We will preserve the existing navigation logic (pause, restart, quit) and optimize for Android Chrome performance.

**Architecture:** The `GamePage` (at `src/app/play/page.tsx`) consumes selection and settings (MIDI devices, track, instrument, demoMode) from global context, owns lane playback and scoring state, and composes three main pieces: `LaneStage` (visual lane + target line), `VirtualInstrument` (instrument-specific UI, default keyboard), and `ScoreHudLite` (aggregated scoring + progress). Lane motion is controlled by a Web Animations motion object on the lane scroll container, while a JS `ScrollTimeline` bound to that container provides canonical song time and progress for scoring and UI.

**Tech Stack:** Next.js App Router (TypeScript, React 19), Tailwind CSS 4, Web MIDI API, Web Animations API, CSS ScrollTimeline (JS API), Vitest, Testing Library, Biome.

---

## Design Document

### 1. Context and Goals

We are introducing a new **gameplay experience** for MIDI-based instrument practice that replaces the previous implementation, which had performance issues and crashes on mobile (especially Android Chrome). The new design:

- Targets **Android Chrome** as the primary environment (Web MIDI not available on iOS Safari).
- Prioritizes **mobile performance** and **strict visual ↔ scoring sync**.
- Uses a **scroll-driven lane** plus **Web Animations + ScrollTimeline** as the canonical notion of time.
- Keeps the **JS main thread as light as possible**, offloading animation to the browser where feasible.
- Is **future-proof for multiple instruments** (keyboard first, later drumset, etc.).

The gameplay page is **not** responsible for MIDI device or track selection; those come from a shared settings/context layer.

### 2. Page Architecture & Responsibilities

#### Settings / Global Context

Owned outside the gameplay page (e.g. in a session/options provider):

- **Selected MIDI input/output**
- **Selected track / MIDI file**
- **Instrument metadata** (e.g. `piano`, `drums`)
- **`demoMode` flag**, controlled from the **Settings** page

These are exposed via hooks/context (e.g. `useSessionSettings`, `useTrackSelection`).

#### `GamePage` (existing route refactor)

Located at `src/app/play/page.tsx`. We will refactor this page to:

- Retain existing **navigation logic** (pause overlay, restart, quit, auto-navigation to results).
- Consume from context:
  - Selected MIDI input/output
  - Selected track / parsed MIDI model (note spans, total duration)
  - Instrument metadata
  - `demoMode` (read-only; no local toggle)
- Own locally:
  - Lane playback state: **play / pause / stop / speed** (synced with the page's `isPaused` state).
  - Web Animations **motion object** that drives lane scroll.
  - JS **`ScrollTimeline`** that converts scroll position into **current time in song / progress**.
  - Scoring state derived from **model notes** + **live MIDI input**.
- Renders:
  - `LaneStage` – scroll-driven note lane + fixed target line band.
  - `VirtualInstrument` – selected from instrument metadata (default: keyboard).
  - `ScoreHudLite` – minimal HUD (score, combo, last hit quality, progress), potentially integrated with the existing header UI.

### 3. Lane Geometry & Time Model

#### Model Notes

We reuse the existing MIDI parsing logic to derive:

- **Note spans**: `{ startTimeMs, endTimeMs, pitch }`
- **Total duration**: `totalDurationMs` (full track length)

These spans act as the **canonical model** used both for:

- Rendering the lane geometry.
- Scoring player input against the song.

#### Geometric Mapping

We construct a tall vertical lane where **time maps to Y-position**:

- `y = (timeMs / totalDurationMs) * laneHeightPx`

Each note becomes an absolutely positioned block:

- Vertical position/height reflect `startTimeMs` → `endTimeMs`.
- Horizontal position/grouping reflect `pitch` (and later instrument layout).

The **target line** (hit zone) is a fixed horizontal band near the bottom of the viewport, just above the instrument visualizer.

#### Canonical Time from ScrollTimeline

Canonical song time is **not** an independent audio clock. Instead:

- A **scroll container** (`#lane-scroll`) wraps the lane and can scroll vertically.
- A **JS `ScrollTimeline`** is bound to this container:

  - `source`: the lane scroll container
  - `orientation`: `"block"`
  - `scrollOffsets`: `[0%, 100%]`
  - `timeRange`: `totalDurationMs`

- As the lane scrolls, the timeline exposes:

  - `currentTimeMs = laneTimeline.currentTime ?? 0`
  - `progress = currentTimeMs / totalDurationMs` (0–1)

This `currentTimeMs` is the **single source of truth** for:

- HUD progress (progress bar / percentage).
- Scoring engine’s notion of “current musical time”.
- Any “near end of song” UI behavior.

---

### 4. Lane Motion, ScrollTimeline, and Control

#### Scroll Container

- The lane lives inside a scrollable container `#lane-scroll`.
- This container is **not user-scrollable** in gameplay (touch/scroll on the lane are prevented).
- We animate its effective scroll via Web Animations.

#### Web Animations API for Motion

On **play**, we create (or restart) a motion animation that advances the lane from start to end:

- Animate either `scrollTop` directly (where supported) or a surrogate property used to set `scrollTop`:

  - Start keyframe: `scrollTop = 0`
  - End keyframe: `scrollTop = scrollHeight - clientHeight`

- Animation options:

  - `duration = totalDurationMs / speed`
  - `easing: "linear"` (for a constant scroll rate)
  - `fill: "forwards"` (lane ends at the bottom)

- Control API:

  - `motion.play()` / `motion.pause()`
  - `motion.playbackRate = speed` (or recreate the animation with adjusted duration)
  - `motion.currentTime` for seeking to a specific position

The animation primarily updates `scrollTop`. The **ScrollTimeline observes that motion** and gives us a robust `currentTimeMs`.

#### ScrollTimeline as Time/Progress

- A JS-created `ScrollTimeline` is bound to `#lane-scroll`.
- With `timeRange = totalDurationMs`, `laneTimeline.currentTime` is already in milliseconds.
- We read:

  - `const currentTimeMs = laneTimeline.currentTime ?? 0;`
  - `const progress = currentTimeMs / totalDurationMs;`

All UI and scoring logic that depend on song time use this value instead of a separate audio clock.

---

### 5. Demo Playback (Visual → Sound in Demo Mode)

#### Target Band

- Define a narrow, fixed **hit zone band** at the target line near the bottom of the viewport.
- This band is where notes should be sounding during demo playback.

#### IntersectionObserver for Demo Notes

- An `IntersectionObserver` (rooted on the lane viewport / hit band) tracks note elements.
- In **demo mode only**:

  - When a note’s rect **enters** the band:

    - Send `noteOn(pitch, velocity)` to the selected MIDI output.

  - When the note **leaves** the band:

    - Send `noteOff(pitch)` for that pitch.

- Thus, **demo audio is driven by the visual lane** crossing the target band, not by separate MIDI playback.

#### Non-Demo Mode

- Lane still animates.
- Scoring still runs.
- **No demo playback** is triggered; only real instrument audio is heard (the player’s hardware).

---

### 6. Scoring Pipeline

#### Inputs

- **Model notes**: from the MIDI parser (`startTimeMs`, `endTimeMs`, `pitch`).
- **Live input**: note-on/note-off events from the selected MIDI input, with timestamps.

#### Mapping Live Events into Song Time

- When a live note event arrives:

  - We read `currentTimeMs` from the ScrollTimeline (`laneTimeline.currentTime`).
  - We treat `currentTimeMs` as the **musical time** of the player’s event.

- We match the player’s note against the **closest model note(s) of the same pitch**:

  - Compute the time delta between the live event’s `currentTimeMs` and the ideal hit time.
  - Classify result as **Perfect / Good / Miss** based on configurable thresholds.
  - Update **combo**, **score**, and **last hit quality** accordingly.

#### Engine Output

- A scoring hook (new or adapted from `useScoreEngine`) exposes:

  - `score: number`
  - `combo: number`
  - `lastHitQuality: "perfect" | "good" | "miss" | null`
  - `progress: number` (from `currentTimeMs / totalDurationMs`)

- These values update **on events** (note-on/note-off, track end), not per-frame, to minimize React overhead.

---

### 7. Instrument Visualization Abstraction

#### Instrument Metadata

- From the settings/context, we read an **instrument id** (e.g. `"piano"`, `"drums"`).
- A utility, e.g. `getVirtualInstrumentConfig(instrumentId)`, will:

  - Select the appropriate **visualizer component**:

    - `PianoKeyboard` (existing)
    - Future: `DrumSetVisualizer`, etc.

  - Provide a **pitch → visual element mapping**:

    - For piano: which key index each MIDI pitch maps to.
    - For drums: which pad / drum element a pitch triggers.

#### `VirtualInstrument` Component

- Props:

  - Instrument id or config
  - Set of **live active notes**
  - Set of **demo notes** (if demo mode is enabled)

- Behavior:

  - For unknown instruments, **fallback to a keyboard** visualizer.
  - Highlights keys/pads based on the pitch mapping and active note sets.

This abstraction allows us to:

- Keep the gameplay lane logic independent of the specific instrument.
- Plug in new instrument views later without changing `GamePlayPage` structure.

---

### 8. HUD and UI Layout

#### `ScoreHudLite`

- Minimal, performance-focused HUD that displays:

  - **Score**
  - **Combo**
  - **Last hit quality** (Perfect / Good / Miss)
  - **Progress** (bar + percentage) based on ScrollTimeline progress

- Design:

  - Small overlay at top/right or top/center.
  - Constant DOM size; no per-note elements.
  - Styled with Tailwind; avoid heavy gradients/shadows that might hurt compositing.

#### Overall Layout

The gameplay page uses a **3-row CSS Grid** layout to ensure strict positioning and zero unexpected scrollbars:

- **Row 1 (Status Bar): `h-20` (Fixed)**
  - Left: `ScoreHudLite` (Score, Combo, Last Hit Quality).
  - Right: Pause Button.
- **Row 2 (Gameplay Lane): `1fr` (Flexible)**
  - Contains `LaneStage` with `overflow: hidden`.
  - **Target Line**: A 1px thin horizontal line fixed at the bottom of this row (`bottom-0`). This line is the hit zone and acts as the `IntersectionObserver` root. It does **not** scroll with the lane.
  - **Falling Notes**: Rendered as vertical bars within this row.
- **Row 3 (Instrument): `auto` (Fixed to Instrument height)**
  - Contains `VirtualInstrument`.
  - Displays the **full standard range** of the instrument (e.g., all 88 keys for piano); no dynamic range shifting or cropping based on song content.

**Visual Constraints:**
- **No 3D perspective**: The layout is strictly 2D for maximum performance and alignment.
- **Performance**: High-performance rendering principles (CSS Grid, layer separation) are strictly followed.

---

### 9. Error Handling & Edge Cases

- **No MIDI device / not supported**:

  - Show a friendly message or fallback UI on the gameplay page.
  - Allow demo mode to still animate the lane and (if an output is available) play demo notes.

- **No track selected**:

  - Do not render the lane; show an instructional message instead.

- **Very short or very long tracks**:

  - Clamp lane height and adjust mapping as needed to avoid absurdly tall DOM structures.
  - Consider limiting minimum duration for the lane animation to avoid overly fast scroll.

- **Animation cancellation / restart**:

  - On track change or restart, explicitly cancel the existing motion animation and ScrollTimeline observers, then recreate them.

---

### 10. Testing Strategy

- **Unit tests**:

  - Mapping between `timeMs` and Y-position.
  - Mapping between ScrollTimeline `currentTimeMs` and progress.
  - Scoring classification for Perfect/Good/Miss thresholds.

- **Integration / E2E (where practical)**:

  - Verify that starting playback advances the lane and progress.
  - Verify that pausing stops lane motion and fixes progress.
  - Verify that speed changes (e.g. 0.5x, 1x, 2x) adjust animation duration correctly.

- **Manual testing on Android Chrome**:

  - Performance and smoothness of lane animation.
  - Stability and lack of crashes over full-length tracks.
  - Responsiveness and fairness of scoring.

---

## Implementation Tasks

### Task 1: Review existing gameplay page and hooks

**Files:**
- Read: `src/app/play/page.tsx`
- Read: `src/hooks/use-active-notes.ts` (or similar)
- Read: `src/hooks/use-midi-player.ts`, `src/hooks/use-score-engine.ts`, and related MIDI hooks

**Step 1: Review current game page composition**

- Open `src/app/play/page.tsx` and identify:
  - Which hooks manage MIDI devices, audio, and scoring.
  - How placeholders are currently wired.
  - Current state management for timer and navigation in `GamePage`.

**Step 2: Identify reusable pieces and refactor strategy**

- Note which hooks and utilities should be reused or adapted.
- Plan how to integrate the new lane logic while keeping the existing `isPaused`, `handleTogglePause`, and navigation logic in `GamePage`.

**Step 3: Document findings**

- Add brief inline comments or a short note in this plan if any assumptions differ from the design.

---

### Task 2: Refactor `GamePage` structure

**Files:**
- Modify: `src/app/play/page.tsx`
- Test: `src/app/play/page.test.tsx` (create if missing or update)

**Step 1: Clean up placeholder UI**

- Remove the placeholder "JAMMING" text and related background mesh if they conflict with the new design.
- Prepare the slots for `LaneStage`, `VirtualInstrument`, and `ScoreHudLite`.

**Step 2: Ensure navigation state is preserved**

- Verify `isPaused`, `timeLeft`, and `showOverlay` are correctly wired to the new playback components (once implemented).

**Step 3: Update/Create smoke tests**

- Ensure tests verify that the page still renders and responds to the pause toggle.

---

### Task 3: Wire `GamePage` to global context and new logic

**Files:**
- Modify: `src/app/play/page.tsx`
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
- Create: `src/lib/play/lane-geometry.ts`
- Test: `src/lib/play/lane-geometry.test.ts`

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

- Run: `npm test -- src/lib/play/lane-geometry.test.ts`

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

### Task 9: Implement `VirtualInstrument` abstraction and default keyboard

**Files:**
- Create: `src/lib/instrument/visualizer-config.ts`
- Create: `src/components/virtual-instrument.tsx`
- Test: `src/components/virtual-instrument.test.tsx`

**Step 1: Implement config utility**

- `getVirtualInstrumentConfig(instrumentId: string)`:
  - For `"piano"`, return:
    - Component: existing `PianoKeyboard`.
    - Note range: Full standard range (88 keys).
  - For unknown instruments, default to the `"piano"` config.

**Step 2: Implement `VirtualInstrument`**

- Props:
  - `instrumentId` (string).
  - Sets of live and demo notes.
- Behavior:
  - Use `getVirtualInstrumentConfig` to choose the component.
  - Render the chosen component with the **full standard range** (no dynamic cropping).

**Step 3: Add tests**

- In `virtual-instrument.test.tsx`:
  - Verify that the component renders with its full default range.

**Step 4: Integrate into `GamePage`**

- Import and render `VirtualInstrument` in the bottom row of the CSS grid.

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
- Modify: `src/app/play/page.tsx`
- Modify: any components/hooks as needed for integration

**Step 1: Connect hooks and components in `GamePlayPage`**

- Use context hooks to get:
  - Selected track and parsed notes.
  - Instrument id.
  - `demoMode`.
  - Selected MIDI input/output.
- Compose:
  - `LaneStage` (with note data, totalDurationMs, demo playback options).
  - `VirtualInstrument` (with live and demo active notes).
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
