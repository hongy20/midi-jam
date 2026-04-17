# Piano Keyboard Performance Refactor

## Overview

The current `PianoKeyboard` component suffers from performance degradation during high-frequency MIDI events. It dynamically mounts and unmounts `div` elements for "glow" effects, which triggers expensive browser layout and style recalculation phases for every note press/release.

This plan refactors the keyboard to use a **Stable DOM Tree** with **Imperative Updates**. We will:

1.  Flatten the nested layout containers.
2.  Eliminate the `KeyGlows` component and dynamic mounting.
3.  Use a `useRef` Map to track key elements.
4.  Surgically update `data-live` and `data-playback` attributes on the keys via `useEffect`.
5.  Move all visual effects to CSS attribute selectors.

---

## Task 1: Flatten Layout & Prepare Ref Map

**File:** `src/components/piano-keyboard/PianoKeyboard.tsx`

- Consolidate the two top-level `div`s into a single `.container` element.
- Initialize `const keyRefs = useRef<Map<number, HTMLButtonElement>>(new Map())`.
- **Consolidate Component**: Move the logic from `PianoKeys` directly into the `PianoKeyboard` render function.

```tsx
// Proposed PianoKeyboard structure
export const PianoKeyboard = ({ liveNotes, playbackNotes }: PianoKeyboardProps) => {
  const keyRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  // ... setup notes array and constants ...

  return (
    <div className={styles.container} role="img" aria-label="Piano keyboard">
      {notes.map((note) => (
        <button
          key={`key-${note}`}
          ref={(el) => {
            if (el) keyRefs.current.set(note, el);
          }}
          // ... rest of button props ...
        />
      ))}
    </div>
  );
};
```

---

## Task 2: Register Keys & Logic Consolidation

**File:** `src/components/piano-keyboard/PianoKeyboard.tsx`

- Use a Ref callback on each `<button>` inside the main map loop to register the MIDI note:
  `ref={(el) => { if (el) keyRefs.current.set(note, el); }}`.
- Ensure the `NOTE_NAMES` and `PIANO_88_KEY_*` constants are accessible within the component or imported.

---

## Task 3: Implement Imperative Sync Logic

**File:** `src/components/piano-keyboard/PianoKeyboard.tsx`

- Add a `useEffect` that runs when `liveNotes` or `playbackNotes` changes.
- Loop through the `keyRefs` Map (88 keys).
- Update `el.dataset.live = liveNotes.has(note).toString()` and `el.dataset.playback = playbackNotes.has(note).toString()`.
- Remove the `KeyGlows` component entirely.

---

## Task 4: Refactor CSS for Attribute-Driven Glows

**File:** `src/components/piano-keyboard/piano-keyboard.module.css`

- Remove the `.glow` class and its animations.
- Add glow styles directly to the `.key` selector using data attributes.
- Use `::after` or `box-shadow` on the `.key` to replicate the glow effect without extra DOM nodes.

```css
/* Example */
.key[data-live="true"] {
  background-color: rgba(6, 182, 212, 0.5);
  box-shadow: inset 0 0 20px #06b6d4;
}
.key[data-playback="true"] {
  background-color: rgba(59, 130, 246, 0.4);
  box-shadow: inset 0 0 20px #3b82f6;
}
```

---

## Task 5: Document Performance Learnings

**File:** `AGENTS.md`

Update the **"High-Performance Rendering (60fps Target)"** section to include the **"Stable DOM"** principle:

- **Rule**: Never mount/unmount elements for high-frequency (60fps) visual feedback.
- **Solution**: Use stable elements and toggle attributes or classes via imperative Refs to bypass React reconciliation.
- **Benefit**: Zero layout shifts, minimal style recalculation, and guaranteed 60fps performance for MIDI events.

---

## Task 6: Final Verification

- Run `npm test` to ensure piano rendering logic remains correct.
- Run `npm run lint` to ensure no Biome/TypeScript regressions.
- Manual verification: Check that glows still appear for both live input and playback.
