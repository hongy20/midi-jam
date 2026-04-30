# Lane Visual Effects (Beam + Flare)

Add reactive CSS visual effects to `BackgroundLane` that respond to `liveNotes` and `playbackNotes` during gameplay. When a lane's pitch is active, it displays a **vertical beam** (light pillar from the hit zone upward) and a **radial flare** (burst at the hit zone bottom), differentiating live playing from song playback via color.

## Proposed Changes

### `piano` feature

#### [MODIFY] [background-lane.tsx](../../src/features/piano/components/background-lane/background-lane.tsx)

- Add `liveNotes: Set<number>` and `playbackNotes: Set<number>` props.
- Add a single `containerRef: React.RefObject<HTMLDivElement>` attached to the container div.
- Add a `useEffect` that runs on `liveNotes`/`playbackNotes` changes. It queries all `[data-pitch]` lane divs via `containerRef.current.querySelectorAll<HTMLDivElement>('[data-pitch]')`, reads each `lane.dataset.pitch`, and imperatively sets `lane.dataset.live` and `lane.dataset.playback` (`"true"` / `"false"`). No `Map`, no callback refs.
- The component becomes a `"use client"` module (adds the directive).

#### [MODIFY] [background-lane.module.css](../../src/features/piano/components/background-lane/background-lane.module.css)

Two new pseudo-element declarations on `.lane`, each driven by attribute selectors. All animations use only `transform` and `opacity` (compositor-safe, per AGENTS.md).

**Beam — `::before`**

A vertical gradient strip anchored to the bottom of the lane. It is hidden by default (`opacity: 0`) and fades in instantly when the note is active, then fades out on release via `transition: opacity`. The gradient is bottom-opaque → top-transparent, giving the "light pillar shooting up" appearance.

```css
.lane::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 60%;          /* covers lower portion of the lane */
  opacity: 0;
  pointer-events: none;
  background: linear-gradient(to top, var(--lane-effect-color) 0%, transparent 100%);
  transition: opacity 0.08s ease-in;
  will-change: opacity;
}

.lane[data-live='true']::before,
.lane[data-playback='true']::before {
  opacity: 1;
  transition: opacity 0.25s ease-out;
}
```

Color is set per-state via a CSS variable on the lane element:
- `data-live="true"` → `--lane-effect-color: var(--lane-live-color)`
- `data-playback="true"` → `--lane-effect-color: var(--lane-playback-color)`

(If both are active, `data-live` takes priority since it is set last in the effect loop.)

**Flare — `::after`**

A one-shot radial burst centered at the bottom of the lane. It fires each time `data-live` or `data-playback` transitions from `"false"` → `"true"` via a CSS `@keyframes`. Because the animation rule only applies while the attribute matches, leaving the selector state removes the rule, and re-entering restarts the animation — no JS animation management needed.

```css
@keyframes lane-flare {
  0%   { transform: scale(0);   opacity: 0.9; }
  60%  { transform: scale(2.5); opacity: 0.4; }
  100% { transform: scale(4);   opacity: 0;   }
}

.lane::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 100%;
  aspect-ratio: 1;
  transform-origin: center bottom;
  translate: -50% 0;
  border-radius: 50%;
  background: radial-gradient(circle, var(--lane-effect-color) 0%, transparent 70%);
  opacity: 0;
  pointer-events: none;
}

.lane[data-live='true']::after,
.lane[data-playback='true']::after {
  animation: lane-flare 0.35s ease-out forwards;
}
```

**Color variables** (added to `.lane` defaults):

```css
.lane {
  /* existing declarations ... */
  --lane-live-color: /* warm accent — derived from theme foreground with warm hue */;
  --lane-playback-color: /* cool accent — derived from theme ring color */;
  --lane-effect-color: var(--lane-live-color); /* default; overridden per state */
}

.lane[data-live='true'] {
  --lane-effect-color: var(--lane-live-color);
}

.lane[data-playback='true'] {
  --lane-effect-color: var(--lane-playback-color);
}
```

The exact color values should reference existing semantic theme variables (e.g., `color-mix(in srgb, var(--foreground) 60%, transparent)` for live, and `color-mix(in srgb, var(--ring) 50%, transparent)` for playback) so they adapt across all retro themes automatically.

#### [MODIFY] [piano-stage.tsx](../../src/features/piano/components/piano-stage/piano-stage.tsx)

Pass `liveActiveNotes` and `playbackNotes` (already in scope via `StageProps`) into the `<BackgroundLane>` instantiation inside `React.cloneElement`:

```tsx
// before
children: <BackgroundLane />

// after
children: <BackgroundLane liveNotes={liveActiveNotes} playbackNotes={playbackNotes} />
```

No other changes to `PianoStage`.

#### [MODIFY] [background-lane.stories.tsx](../../src/features/piano/components/background-lane/background-lane.stories.tsx)

Update the story to accept and pass `liveNotes`/`playbackNotes` args so the effect can be demoed in Storybook. Add a second story variant with pre-populated active notes.

## Verification Plan

### Automated Tests
- `npm run lint:fix` — formatting
- `npm run lint` — ESLint / Prettier / Knip clean
- `npm run type-check` — TypeScript tsc
- `npm test` — Vitest suite (no new unit tests needed; the effect is purely visual/CSS)
- `npm run build` — Next.js production build

### Manual Verification (browser)
1. Start dev server (`npm run dev`, HTTPS).
2. Navigate to `/play` with a MIDI instrument connected.
3. Press any key — the corresponding lane should show the beam (sustained) and the flare (one-shot burst at the bottom).
4. Release the key — beam fades out.
5. Press the same key again rapidly — flare re-fires on each press.
6. Verify `playbackNotes` (demo mode / song autoplay) shows a visually distinct color vs live notes.
7. Verify no frame-rate degradation when many notes are active simultaneously (chord playing).
8. Verify the effects work across multiple retro themes (theme picker in Options).
