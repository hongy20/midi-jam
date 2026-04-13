# Design Doc: PausePage Refactor

## Goal
Refactor the `PausePage` to align with the modular architecture of `CollectionPage` and `GearPage`, simplify the UI using the `8bitcn` `PauseMenu` block, and ensure testability via Storybook without complex hook mocking.

## Architecture

### Components
1. **`src/app/pause/page.tsx` (Server)**:
   - Metadata definition.
   - Entry point rendering the `PausePageClient`.

2. **`src/app/pause/components/pause-page.client.tsx` (Client Logic)**:
   - **Context Consumption**: `useStage`, `useNavigation`, `useTrack`, `useGear`, `useCollection`, `useScore`.
   - **Error Guard**: If `selectedTrack` or `selectedMIDIInput` is missing, throw an Error to trigger the global `error.tsx` boundary.
   - **Handler Logic**:
     - `onContinue`: `toPlay()`
     - `onRestart`: `setGameSession(null)`, `toPlay()`
     - `onSettings`: `toOptions("pause")`
     - `onQuit`: Calculate score, `setSessionResults`, `setGameSession(null)`, `toScore()`
   - **View Rendering**: Returns `<PausePageView />` with handlers.

3. **`src/app/pause/components/pause-page.view.tsx` (Pure View)**:
   - **Layout**: `main` tag with centering styles (`min-h-[100dvh]`, `flex items-center justify-center`).
   - **Component**: Renders the `@8bitcn/pause-menu` block.
   - **Props**: Receives handlers for the menu actions.

4. **`src/app/pause/components/pause-page.view.stories.tsx` (Storybook)**:
   - Isolated preview of `PausePageView`.
   - Mocked handlers to demonstrate interactivity.

5. **`src/components/ui/8bit/blocks/pause-menu.tsx` (8bitcn Block)**:
   - Installed via `npx shadcn@latest add @8bitcn/pause-menu`.
   - Retro 8-bit aesthetic for the pause overlay.

## UI Simplification
- Remove the "Currently Playing" card.
- Consolidate actions to component defaults: `CONTINUE`, `RESTART`, `SETTINGS`, `QUIT`.
- Centered layout using standard Tailwind classes within the `main` tag.

## Testing & Validation
- **Storybook**: Verify layout and button interactivity.
- **Manual**: Verify navigation and session/score state persistence through the full flow (Play -> Pause -> Resume/Restart/Quit).
- **Automated**: Run `lint`, `type-check`, and `test` to ensure no regression.
