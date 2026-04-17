# 2026-04-16 - Feature-Based Folder Reorganization

## Goal

Reorganize the Midi Jam codebase into a Layered Feature Architecture to improve maintainability and enforce domain boundaries, following the "Reusable Architecture" blueprint.

## Design

### 1. Colocation Layer (`src/app/`)

- Route-specific components and hooks live inside the `app/[route]/` folders.
- Specifically, the **Gameplay Engine** (`use-lane-timeline`, `use-track-sync`, etc.) will move to `src/app/play/hooks/`.

### 2. Feature Layer (`src/features/`)

Each feature is a self-contained domain with a public `index.ts` API.

- **`midi-hardware`**: Web MIDI API, hardware listeners, and device selection.
- **`midi-assets`**: MIDI file parsing and track processing.
- **`audio`**: Tone.js and synth feedback.
- **`score`**: Scoring engine and hit detection.
- **`navigation`**: Guards and custom routing logic.
- **`collection`**: Track selection state.
- **`settings`**: Persistent user preferences.
- **`theme`**: Retro styling system and state.

### 3. Shared Layer (`src/shared/`)

- **`src/shared/ui/`**: 8bitcn/shadcn visual components.
- **`src/shared/hooks/`**: Generic browser hooks (`use-fullscreen`, etc).
- **`src/shared/lib/`**: Generic utilities like `cn()`.

---

## Proposed Changes

### [New Layer] Shared

- Move `src/components/ui/` to `src/shared/components/ui/`.
- Move `src/lib/utils.ts` to `src/shared/lib/utils.ts`.
- Move generic hooks (`use-auto-pause`, `use-fullscreen`, `use-wake-lock`) to `src/shared/hooks/`.

### [New Layer] Features

- **`midi-hardware`**:
  - `src/lib/midi/midi-access.ts`, `midi-devices.ts`, `midi-listener.ts`
  - `src/hooks/use-midi-devices.ts`, `use-midi-notes.ts`, `use-midi-selection.ts`
  - `src/context/gear-context.tsx`
- **`midi-assets`**:
  - `src/lib/midi/midi-parser.ts`, `midi-loader.ts`, `lane-segment-utils.ts`
  - `src/context/track-context.tsx`
- **`audio`**: `src/hooks/use-midi-audio.ts`.
- **`score`**: `src/lib/score/`, `src/hooks/use-lane-score-engine.ts`, `src/context/score-context.tsx`.
- **`navigation`**: `src/hooks/use-navigation.ts`, `src/components/navigation-guard/`.
- **`settings`**: `src/context/options-context.tsx`.
- **`theme`**: `src/context/theme-context.tsx`, `src/lib/themes.ts`.
- **`collection`**: `src/context/collection-context.tsx`.

### [MODIFY] AGENTS.md

- Add the new architecture standards to the project rules.

---

## Verification Plan

### Automated Tests

- `npm run lint`: Ensure all imports are correctly updated.
- `npm run type-check`: Verify absolute path resolution and barrel exports.
- `npm test`: Ensure all unit and integration tests still pass after the move.
- `npm run build`: Verify production bundle integrity.

### Manual Verification

- Open the app, navigate through `gear`, `collection`, and `play` to ensure state (Context) still flows correctly.
