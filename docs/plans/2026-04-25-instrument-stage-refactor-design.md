# Design Doc: Instrument Stage Refactor

Refactor the gameplay UI to encapsulate instrument-specific logic (piano) into its own feature, making it easy to plug in other instruments (drums) in the future.

## Current Issues

- `PlayPageView` has hardcoded piano-specific CSS variables (`--start-unit`, `--end-unit`).
- `PlayPageView` contains ternary logic for switching between piano and drum placeholders.
- Piano layout calculation is performed in `PlayPageClient`, which should be agnostic of the instrument's specific layout needs.
- The `features/visualizer` is slightly coupled to piano via `PIANO_GRID_ITEM_CLASS`.

## Proposed Architecture

### 1. Shared Type Definition

Move the instrument stage contract to the infrastructure layer to avoid cross-feature imports.

**File**: `src/shared/types/instrument.ts`

- Define `InstrumentStageProps` including `notes`, `groups`, `scrollRef`, `getCurrentTimeMs`, `liveActiveNotes`, `playbackNotes`, and `speed`.

### 2. Feature Encapsulation (Piano)

Move all piano-specific layout and rendering into a single "Stage" component.

**File**: `src/features/piano/components/piano-stage/PianoStage.tsx` [NEW]

- Implements `InstrumentStageProps`.
- Calculates `startUnit` and `endUnit` internally using existing lib functions.
- Renders `LaneStage` (from `visualizer`) with `BackgroundLane` and `PianoKeyboard`.
- Manages the CSS variables that were previously in `PlayPageView`.

**File**: `src/features/piano/index.ts`

- Export `PianoStage`.

### 3. Agnostic Play View

Refactor the gameplay shell to be instrument-agnostic.

**File**: `src/app/play/components/play-page.view.tsx`

- Remove piano-specific props (`startUnit`, `endUnit`).
- Remove ternary logic for instruments.
- Render the selected instrument stage component.

**File**: `src/app/play/components/play-page.client.tsx`

- Remove `getPianoLayoutUnits` call.
- Pass raw `notes` to the view.

## Success Criteria

- [ ] Piano gameplay remains identical in appearance and performance.
- [ ] No piano-specific code remains in `src/app/play` or `src/features/visualizer`.
- [ ] Adding a new instrument only requires creating a new feature and plugging its Stage component into `PlayPageView`.
