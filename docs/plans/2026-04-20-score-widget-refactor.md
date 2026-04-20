# Refactor: Move ScoreWidget to features/score

Move the `ScoreWidget` component from `src/app/play/components/` to `src/features/score/components/` to adhere to the feature-based folder structure.

## Proposed Changes

### [Component Move]
- Move `src/app/play/components/score-widget/` to `src/features/score/components/score-widget/`.
- Update exports in `src/features/score/index.ts`.
- Update imports in `src/app/play/components/play-page.view.tsx`.

### [Storybook Update]
- Update story title in `score-widget.stories.tsx` to align with `AGENTS.md` (Principle 7.1).
- Should be `App/Global/ScoreWidget` or `Features/Score/ScoreWidget`? `AGENTS.md` says `App/Global/[ComponentName]` for global components.

## Success Criteria
- [ ] Component moved and files correctly located.
- [ ] Project builds without errors (`npm run build`).
- [ ] Tests pass (`npm test`).
- [ ] Storybook reflects the new location and follows the naming standard.
