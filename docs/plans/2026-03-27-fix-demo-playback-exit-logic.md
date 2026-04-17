# Plan: Fix Demo Playback Exit Logic

Refine the intersection observer logic for demo playback to prevent premature note-off events when elements enter from the top.

## User Changes

### 1. Refine Demo Playback Exit Logic

- **File**: `src/hooks/use-demo-playback.ts`
- **Change**: In the `IntersectionObserver` callback, filter exits to only trigger when the element's top is greater than the root's bottom.

## Tasks

- [ ] Commit current changes in `src/hooks/use-demo-playback.ts`
- [ ] Run validation suite (`lint`, `type-check`, `test`, `build`)
- [ ] Create Pull Request

## Verification

### Automated Tests

- Run `npm test` to ensure no regressions in playback logic.
- Run `npm run lint` and `npm run type-check` for code quality.

### Manual Verification (Conceptual)

- Elements entering from the top (during fast scroll/init) should not trigger `onNoteOff` immediately if they are momentarily considered "exiting" by the intersection observer before being fully tracked.
