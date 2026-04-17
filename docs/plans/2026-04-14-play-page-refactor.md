# PlayPage Refactor Implementation Plan

Date: 2026-04-14
Topic: PlayPage Refactor & Legacy Cleanup

## Goal

Refactor the `PlayPage` to follow the project's "Client/View" separation pattern, localize theater-specific components, and decommission legacy global layout components.

## Proposed Changes

### [Play Page Component Refactor]

- **`src/app/play/page.tsx`**: Thin component entry point.
- **`src/app/play/components/play-page.client.tsx`**: Client-side logic, hooks, and event handlers.
- **`src/app/play/components/play-page.view.tsx`**: Stateless view component using semantic HTML.

### [Component Relocation]

Move from `src/components/` to `src/app/play/components/`:

- `piano-keyboard/`
- `score-widget/`

### [Cleanup]

Delete from `src/components/`:

- `page-layout/`
- `page-header/`
- `page-footer/`
- `virtual-instrument/`

---

### Task 1: Isolation & Preparation

1. `git checkout -b feature/play-page-refactor`
2. Commit this plan to `docs/plans/2026-04-14-play-page-refactor.md`.

### Task 2: Relocate PianoKeyboard

1. `mkdir -p src/app/play/components`
2. `mv src/components/piano-keyboard src/app/play/components/`
3. Update imports in `src/app/play/components/piano-keyboard/PianoKeyboard.tsx`.
4. Create `src/app/play/components/piano-keyboard/piano-keyboard.stories.tsx`.

### Task 3: Relocate ScoreWidget

1. `mv src/components/score-widget src/app/play/components/`
2. Update imports in `src/app/play/components/score-widget/score-widget.tsx`.
3. Create `src/app/play/components/score-widget/score-widget.stories.tsx`.

### Task 4: Implement PlayPageView

1. Create `src/app/play/components/play-page.view.tsx`.
2. Implement layout using `<header>`, `<main>`, and `<footer>`.
3. Import `ScoreWidget` and `PianoKeyboard` from local relative paths.
4. **Happy Path Only**: No conditional logic for loading or errors.

### Task 5: Implement PlayPageClient

1. Create `src/app/play/components/play-page.client.tsx`.
2. Extract hooks and handlers from `page.tsx`.
3. **Native Boundaries**: Throw `Error` if `trackStatus.error` is present.
4. Pass only ready data to `PlayPageView`.

### Task 6: Finalize & Decommission

1. Update `src/app/play/page.tsx`.
2. Remove legacy folders from `src/components/`.
3. Run verification: `npm run type-check && npm run lint && npm test`.
