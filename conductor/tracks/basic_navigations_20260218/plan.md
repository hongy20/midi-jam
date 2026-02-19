# Implementation Plan - Basic Navigations

## Phase 1: Preparation [checkpoint: ee06ce5]
- [x] Task: Move `src/app/page.tsx` content to `src/app/archive-player/page.tsx` (Temporary archive). 5e8581c
- [x] Task: Ensure imports in the `archive-player` page are correct. 5e8581c

## Phase 2: Core Skeleton & UX Components [checkpoint: ee06ce5]
- [x] Task: Create a Reusable `NavigationLayout` component with:
  - Simple breadcrumb/progress indicator.
  - Consistent layout wrapper for game-like views. 5e8581c
- [x] Task: Create new root `src/app/page.tsx` (Welcome). 5e8581c
- [x] Task: Create `src/app/instruments/page.tsx` (Step 1/2). 5e8581c
- [x] Task: Create `src/app/tracks/page.tsx` (Step 2/2). 5e8581c
- [x] Task: Create `src/app/game/page.tsx` with:
  - 15s countdown and Pause Overlay.
  - Keyboard focus trap logic for the overlay. 5e8581c
- [x] Task: Create `src/app/results/page.tsx` with "Play Again", "Next Song", and "Main Menu". 5e8581c
- [x] Task: Create `src/app/settings/page.tsx`. 5e8581c

## Phase 3: History & Navigation Hijacking [checkpoint: ee06ce5]
- [x] Task: Implement a custom navigation hook (`useGameNavigation`) using `router.replace`. 5e8581c
- [-] Task: Implement `popstate` trapping to map browser back/forward to in-app logic (Skipped).
- [-] Task: Add `window.onbeforeunload` logic for reload safeguards (Skipped).
- [x] Task: Implement "Route Guarding" for session integrity. 5e8581c
- [x] Task: Add simple CSS transition animations between screens. 5e8581c
