# Plan: fix/lane-visibility - StageLane Background Visibility

The goal of this task is to resolve the visibility issues of the `StageLane` background stripes by implementing a high-performance arcade-style vertical fade.

## Proposed Design
- **Single Parent Mask**: Use a single `mask-image` on the `.container` in `background-lane.module.css` for a hardware-accelerated vertical fade-out (opaque at bottom, transparent at top).
- **Dynamic Lane Coloring**: Use `color-mix` to create subtle white/black background stripes for each lane based on the `--is-black` variable from the existing 21-unit octave grid.
- **Performance**: Offset all rendering work to the compositor thread by avoiding layout-triggering properties and multiple gradients.

## Proposed Changes

### [Play Component]

#### [MODIFY] [background-lane.module.css](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/lane-stage/background-lane.module.css)
- Implement `mask-image` on `.container`.
- Set `background-color` on `.lane` using `color-mix` with `--piano-key-white` and `--piano-key-black`.
- Add a subtle 1px border for black keys to enhance depth.

#### [MODIFY] [background-lane.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/play/components/lane-stage/background-lane.tsx)
- No functional changes needed, but ensure it continues to map all 88 notes correctly.

## Task List
- [x] Checkout branch `fix/lane-visibility`
- [ ] Update `background-lane.module.css` with mask and color-mix logic
- [ ] Verify alignment and visibility in dev server
- [ ] Run technical integrity checks (`lint`, `type-check`, `test`)
- [ ] Create Pull Request

## Verification Plan
### Automated Tests
- Run `npm test` to ensure no regressions in playback logic.
- Run `npm run lint` and `npm run type-check`.

### Manual Verification
- Open `https://localhost:3000/play` and verify:
    - Lanes are visible near the piano keys.
    - Lanes fade out smoothly toward the top.
    - White and black lanes match their respective piano keys.
    - No performance drops (60fps target).
