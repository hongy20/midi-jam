# Implementation Plan - Basic Navigations

## Phase 1: Preparation
- [ ] Task: Move `src/app/page.tsx` content to `src/app/archive-player/page.tsx` (Temporary archive).
- [ ] Task: Ensure imports in the `archive-player` page are correct.

## Phase 2: Core Skeleton & UX Components
- [ ] Task: Create a Reusable `NavigationLayout` component with:
  - Simple breadcrumb/progress indicator.
  - Consistent layout wrapper for game-like views.
- [ ] Task: Create new root `src/app/page.tsx` (Welcome).
- [ ] Task: Create `src/app/instruments/page.tsx` (Step 1/2).
- [ ] Task: Create `src/app/tracks/page.tsx` (Step 2/2).
- [ ] Task: Create `src/app/game/page.tsx` with:
  - 15s countdown and Pause Overlay.
  - Keyboard focus trap logic for the overlay.
- [ ] Task: Create `src/app/results/page.tsx` with "Play Again", "Next Song", and "Main Menu".
- [ ] Task: Create `src/app/settings/page.tsx`.

## Phase 3: History & Navigation Hijacking
- [ ] Task: Implement a custom navigation hook (`useGameNavigation`) using `router.replace`.
- [ ] Task: Implement `popstate` trapping to map browser back/forward to in-app logic.
- [ ] Task: Add `window.onbeforeunload` logic for reload safeguards.
- [ ] Task: Implement "Route Guarding" for session integrity.
- [ ] Task: Add simple CSS transition animations between screens.
