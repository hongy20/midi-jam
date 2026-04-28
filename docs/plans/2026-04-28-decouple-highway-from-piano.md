# Refactor: Decouple Highway from Piano `--is-black`

The `features/highway` component currently relies on a custom CSS property `--is-black`, which is defined and managed by the `features/piano` module. This creates a tight coupling.

The user has requested to decouple this by hardcoding the background opacity in the highway feature, even if it means losing the visual distinction between black and white key notes in the highway visualization.

## Proposed Changes

We will remove the dependency on `--is-black` by hardcoding the `background-color` opacity in `features/highway`.

### [features/highway]

#### [MODIFY] [highway-segment.module.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/highway/components/highway-segment.module.css)
- Replace the direct usage of `--is-black` with a hardcoded opacity value (20%).

```css
.note {
  /* ... */
  background-color: color-mix(in srgb, currentColor 20%, transparent);
}
```

### [features/piano]

No changes are required in `features/piano` since we are no longer trying to map `--is-black` to any highway property. The `--is-black` property will remain internal to the piano feature for its own layout and styling needs.

## Verification Plan

### Automated Tests
- Run `npm test` to ensure no regressions.
- Run `npm run lint` and `npm run type-check`.

### Manual Verification
- Verify the piano highway rendering in Storybook.
- Ensure all notes have the same background opacity (20%).
