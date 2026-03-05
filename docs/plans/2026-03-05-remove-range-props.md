# Remove rangeStart / rangeEnd Props

## Overview

`LaneStage`, `VirtualInstrument`, `BackgroundLane`, and `PianoKeyboard` all accept `rangeStart` / `rangeEnd` props to control which notes they render. This information is redundant: the parent (`page.tsx`) already sets `--start-unit` / `--end-unit` CSS variables that cascade to all descendants, and the CSS grid + `opacity` trick introduced in `piano-grid.module.css` already hides out-of-range note elements automatically.

The goal is to remove those props entirely and let all components render the full 88-key range, relying solely on CSS for visibility.

## CSS Mechanism (already in place)

Every note element composes `.noteBase` in `piano-grid.module.css`, which computes:

```css
opacity: min(
  clamp(0, var(--relative-start), 1),               /* 0 when left of range  */
  clamp(0, calc(var(--end-unit) - var(--note-start)), 1)  /* 0 when right of range */
);
```

- **Left of range** (`--note-start < --start-unit`): opacity → 0
- **Right of range** (`--note-start >= --end-unit`): opacity → 0, and `grid-auto-columns: 0` ensures implicit tracks take no space
- **In range**: opacity → 1

No JS needed. No props needed.

---

## Task 1: Clean up `BackgroundLane`

**File:** `src/components/lane-stage/background-lane.tsx`

- Remove `rangeStart`, `rangeEnd`, and `inputDevice` from `BackgroundLaneProps` (none are used in the render body)
- Remove the unused `rangeStart` / `rangeEnd` destructure and defaults
- Remove the debug `console.log`
- The loop already uses `PIANO_88_KEY_MIN` / `PIANO_88_KEY_MAX` — no change needed there

```tsx
// Before
interface BackgroundLaneProps {
  inputDevice: WebMidi.MIDIInput;
  rangeStart?: number;
  rangeEnd?: number;
}
export function BackgroundLane({ rangeStart = PIANO_88_KEY_MIN, rangeEnd = PIANO_88_KEY_MAX }: BackgroundLaneProps)

// After
export function BackgroundLane()
```

---

## Task 2: Clean up `LaneStage`

**File:** `src/components/lane-stage/lane-stage.tsx`

- Remove `rangeStart` and `rangeEnd` from `LaneStageProps`
- Remove them from the destructure and the `<BackgroundLane>` call site
- Remove `inputDevice` from the `<BackgroundLane>` call (no longer part of its interface)

---

## Task 3: Clean up `PianoKeyboard`

**File:** `src/components/piano-keyboard/PianoKeyboard.tsx`

- Remove `rangeStart` and `rangeEnd` from `PianoKeyboardProps`
- In `PianoKeyboard`: remove the inline `const rangeStart` / `const rangeEnd` locals; pass `PIANO_88_KEY_MIN` / `PIANO_88_KEY_MAX` directly (or as named constants) to `PianoKeys` and `KeyGlows`
- In `KeyGlows`: remove the `start` / `end` props and their `.filter()`. Render all active notes — CSS opacity will hide any that fall outside the range

```tsx
// KeyGlows before
const active = [...liveNotes, ...playbackNotes].filter(n => n >= start && n <= end);

// KeyGlows after
const active = Array.from(new Set([...liveNotes, ...playbackNotes]));
```

---

## Task 4: Clean up `VirtualInstrument`

**File:** `src/components/virtual-instrument.tsx`

- Remove `rangeStart` and `rangeEnd` from `VirtualInstrumentProps`
- Remove them from the destructure and the `<PianoKeyboard>` call site

---

## Task 5: Clean up call sites in `page.tsx`

**File:** `src/app/game/page.tsx`

- Remove `rangeStart={visibleMidiRange.startNote}` and `rangeEnd={visibleMidiRange.endNote}` from both `<LaneStage>` and `<VirtualInstrument>`
- Keep `visibleMidiRange`, `startUnit`, `endUnit`, and the CSS variable assignment — these still drive the CSS grid

---

## Task 6: Update tests

**File:** `src/components/piano-keyboard/PianoKeyboard.test.tsx`

- Remove the "renders a specific range when provided" test — the component no longer accepts or acts on those props
- Remove the "renders active notes correctly as glows within range" test — `KeyGlows` no longer filters by range in JS (filtering is CSS-only)
- Update the remaining test if needed (the full-range test should still pass as-is)

**File:** `src/components/virtual-instrument.test.tsx`

- Already clean (no range props in the test render call); verify no changes needed

---

## Task 7: Final verification

```bash
npm test
npm run lint
```

All tests should pass; no TypeScript / lint errors.
