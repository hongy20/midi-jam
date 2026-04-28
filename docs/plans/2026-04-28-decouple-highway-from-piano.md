# Refactor: Decouple Highway from Piano `--is-black`

The `features/highway` component currently relies on a custom CSS property `--is-black`, which is defined and managed by the `features/piano` module. This creates a tight coupling between a generic visualization component (`HighwaySegment`) and instrument-specific logic (Piano key types).

## Proposed Changes

We will introduce a generic interface variable `--note-bg-alpha` in `features/highway` to control the background opacity of notes. The `features/piano` module will then map its internal `--is-black` state to this generic variable.

### [features/highway]

#### [MODIFY] [highway-segment.module.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/highway/components/highway-segment.module.css)
- Replace the direct usage of `--is-black` with a new generic variable `--note-bg-alpha`.
- Set a default value for `--note-bg-alpha` (20%) to ensure notes remain visible even when no specialized layout is provided.

```css
.note {
  /* ... */
  --note-bg-alpha: 20%;
  background-color: color-mix(in srgb, currentColor var(--note-bg-alpha), transparent);
}
```

### [features/piano]

#### [MODIFY] [piano-layout.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/piano/styles/piano-layout.css)
- Map `--is-black` to `--note-bg-alpha` within the `.piano-grid-item` class.

```css
.piano-grid-item {
  /* ... */
  --note-bg-alpha: calc(20% + 20% * var(--is-black));
}
```

## Verification Plan

### Automated Tests
- Run `npm test` to ensure no regressions.
- Run `npm run lint` and `npm run type-check`.

### Manual Verification
- Verify the piano highway rendering in Storybook.
- Ensure black key notes still appear slightly darker/more opaque than white key notes.
- Verify that generic highway still has visible notes with 20% alpha.
