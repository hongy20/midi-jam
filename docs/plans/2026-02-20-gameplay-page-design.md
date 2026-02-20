# Gameplay Page – ScrollTimeline-Based Design

## Context and Goals

We are introducing a new **gameplay experience** for MIDI-based instrument practice that replaces the previous implementation, which had performance issues and crashes on mobile (especially Android Chrome). The new design:

- Targets **Android Chrome** as the primary environment (Web MIDI not available on iOS Safari).
- Prioritizes **mobile performance** and **strict visual ↔ scoring sync**.
- Uses a **scroll-driven lane** plus **Web Animations + ScrollTimeline** as the canonical notion of time.
- Keeps the **JS main thread as light as possible**, offloading animation to the browser where feasible.
- Is **future-proof for multiple instruments** (keyboard first, later drumset, etc.).

The gameplay page is **not** responsible for MIDI device or track selection; those come from a shared settings/context layer.

---

## 1. Page Architecture & Responsibilities

### Settings / Global Context

Owned outside the gameplay page (e.g. in a session/settings provider):

- **Selected MIDI input/output**
- **Selected track / MIDI file**
- **Instrument metadata** (e.g. `piano`, `drums`)
- **`demoMode` flag**, controlled from the **Settings** page

These are exposed via hooks/context (e.g. `useSessionSettings`, `useTrackSelection`).

### `GamePage` (existing route refactor)

Located at `src/app/game/page.tsx`. We will refactor this page to:

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
  - `InstrumentVisualizer` – selected from instrument metadata (default: keyboard).
  - `ScoreHudLite` – minimal HUD (score, combo, last hit quality, progress), potentially integrated with the existing header UI.

---

## 2. Lane Geometry & Time Model

### Model Notes

We reuse the existing MIDI parsing logic to derive:

- **Note spans**: `{ startTimeMs, endTimeMs, pitch }`
- **Total duration**: `totalDurationMs` (full track length)

These spans act as the **canonical model** used both for:

- Rendering the lane geometry.
- Scoring player input against the song.

### Geometric Mapping

We construct a tall vertical lane where **time maps to Y-position**:

- `y = (timeMs / totalDurationMs) * laneHeightPx`

Each note becomes an absolutely positioned block:

- Vertical position/height reflect `startTimeMs` → `endTimeMs`.
- Horizontal position/grouping reflect `pitch` (and later instrument layout).

The **target line** (hit zone) is a fixed horizontal band near the bottom of the viewport, just above the instrument visualizer.

### Canonical Time from ScrollTimeline

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

## 3. Lane Motion, ScrollTimeline, and Control

### Scroll Container

- The lane lives inside a scrollable container `#lane-scroll`.
- This container is **not user-scrollable** in gameplay (touch/scroll on the lane are prevented).
- We animate its effective scroll via Web Animations.

### Web Animations API for Motion

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

### ScrollTimeline as Time/Progress

- A JS-created `ScrollTimeline` is bound to `#lane-scroll`.
- With `timeRange = totalDurationMs`, `laneTimeline.currentTime` is already in milliseconds.
- We read:

  - `const currentTimeMs = laneTimeline.currentTime ?? 0;`
  - `const progress = currentTimeMs / totalDurationMs;`

All UI and scoring logic that depend on song time use this value instead of a separate audio clock.

---

## 4. Demo Playback (Visual → Sound in Demo Mode)

### Target Band

- Define a narrow, fixed **hit zone band** at the target line near the bottom of the viewport.
- This band is where notes should be sounding during demo playback.

### IntersectionObserver for Demo Notes

- An `IntersectionObserver` (rooted on the lane viewport / hit band) tracks note elements.
- In **demo mode only**:

  - When a note’s rect **enters** the band:

    - Send `noteOn(pitch, velocity)` to the selected MIDI output.

  - When the note **leaves** the band:

    - Send `noteOff(pitch)` for that pitch.

- Thus, **demo audio is driven by the visual lane** crossing the target band, not by separate MIDI playback.

### Non-Demo Mode

- Lane still animates.
- Scoring still runs.
- **No demo playback** is triggered; only real instrument audio is heard (the player’s hardware).

---

## 5. Scoring Pipeline

### Inputs

- **Model notes**: from the MIDI parser (`startTimeMs`, `endTimeMs`, `pitch`).
- **Live input**: note-on/note-off events from the selected MIDI input, with timestamps.

### Mapping Live Events into Song Time

- When a live note event arrives:

  - We read `currentTimeMs` from the ScrollTimeline (`laneTimeline.currentTime`).
  - We treat `currentTimeMs` as the **musical time** of the player’s event.

- We match the player’s note against the **closest model note(s) of the same pitch**:

  - Compute the time delta between the live event’s `currentTimeMs` and the ideal hit time.
  - Classify result as **Perfect / Good / Miss** based on configurable thresholds.
  - Update **combo**, **score**, and **last hit quality** accordingly.

### Engine Output

- A scoring hook (new or adapted from `useScoreEngine`) exposes:

  - `score: number`
  - `combo: number`
  - `lastHitQuality: "perfect" | "good" | "miss" | null`
  - `progress: number` (from `currentTimeMs / totalDurationMs`)

- These values update **on events** (note-on/note-off, track end), not per-frame, to minimize React overhead.

---

## 6. Instrument Visualization Abstraction

### Instrument Metadata

- From the settings/context, we read an **instrument id** (e.g. `"piano"`, `"drums"`).
- A utility, e.g. `getInstrumentVisualizerConfig(instrumentId)`, will:

  - Select the appropriate **visualizer component**:

    - `PianoKeyboard` (existing)
    - Future: `DrumSetVisualizer`, etc.

  - Provide a **pitch → visual element mapping**:

    - For piano: which key index each MIDI pitch maps to.
    - For drums: which pad / drum element a pitch triggers.

### `InstrumentVisualizer` Component

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

## 7. HUD and UI Layout

### `ScoreHudLite`

- Minimal, performance-focused HUD that displays:

  - **Score**
  - **Combo**
  - **Last hit quality** (Perfect / Good / Miss)
  - **Progress** (bar + percentage) based on ScrollTimeline progress

- Design:

  - Small overlay at top/right or top/center.
  - Constant DOM size; no per-note elements.
  - Styled with Tailwind; avoid heavy gradients/shadows that might hurt compositing.

### Overall Layout

The gameplay page uses a **3-row CSS Grid** layout to ensure strict positioning and zero unexpected scrollbars:

- **Row 1 (Status Bar): `h-20` (Fixed)**
  - Left: `ScoreHudLite` (Score, Combo, Last Hit Quality).
  - Right: Pause Button.
- **Row 2 (Gameplay Lane): `1fr` (Flexible)**
  - Contains `LaneStage` with `overflow: hidden`.
  - **Target Line**: A 1px thin horizontal line fixed at the bottom of this row (`bottom-0`). This line is the hit zone and acts as the `IntersectionObserver` root. It does **not** scroll with the lane.
  - **Falling Notes**: Rendered as vertical bars within this row.
- **Row 3 (Instrument): `auto` (Fixed to Instrument height)**
  - Contains `InstrumentVisualizer`.
  - Displays the **full standard range** of the instrument (e.g., all 88 keys for piano); no dynamic range shifting or cropping based on song content.

**Visual Constraints:**
- **No 3D perspective**: The layout is strictly 2D for maximum performance and alignment.
- **Performance**: High-performance rendering principles (CSS Grid, layer separation) are strictly followed.

---

## 8. Error Handling & Edge Cases

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

## 9. Testing Strategy

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

