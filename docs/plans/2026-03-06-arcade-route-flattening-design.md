# Design: Arcade-Style Route Flattening

## Context & Goals
The current routing structure is nested (e.g., `/game/pause`) and uses technical terminology (`/instruments`, `/tracks`). To enhance the gaming experience ("Midi Jam"), we are flattening the routes and adopting arcade-style naming conventions.

## 1. Route & Page Mapping

| Old Route | New Route | New Name | Folder Path |
| :--- | :--- | :--- | :--- |
| `/` | `/` | Main Menu | `src/app/page.tsx` |
| `/tracks` | `/collection` | Song Collection | `src/app/collection/` |
| `/instruments` | `/gear` | Your Gear | `src/app/gear/` |
| `/game` | `/play` | The Stage | `src/app/play/` |
| `/game/pause` | `/pause` | Pause Menu | `src/app/pause/` |
| `/results` | `/score` | Final Score | `src/app/score/` |
| `/settings` | `/options` | Game Options | `src/app/options/` |

## 2. Structural Changes
- **Directory Move**: `src/app/game/pause/` moves to `src/app/pause/`.
- **Directory Renaming**:
  - `src/app/tracks/` -> `src/app/collection/`
  - `src/app/instruments/` -> `src/app/gear/`
  - `src/app/game/` -> `src/app/play/`
  - `src/app/results/` -> `src/app/score/`
  - `src/app/settings/` -> `src/app/options/`
- **Route Definitions**: Update `src/lib/navigation/routes.ts`.

## 3. Documentation & Global Updates
- **AGENTS.md**: Update project context and references to old pages.
- **Existing Plans**: Update `docs/plans/` to maintain consistent terminology.
- **UI Components**: Update page titles (H1) and breadcrumbs to match new names.

## 4. Verification Strategy
- **Lint & Type Check**: Ensure no broken imports or stale route references.
- **Unit Tests**: Verify `useNavigation` and `NavigationGuard` work with new routes.
- **Manual Check**: Verify that `/` (Main Menu) correctly navigates through the new flow.
