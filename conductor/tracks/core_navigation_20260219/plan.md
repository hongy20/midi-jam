# Implementation Plan - Core Navigation Pages Implementation

## Phase 1: Context & Infrastructure Update
- [x] Task: Update `SelectionContext` to include `sessionResults` state (score, accuracy, combo).
- [x] Task: Extend `getSoundTracks` server action or create a wrapper to provide hardcoded difficulty and titles.
- [x] Task: Implement a Global Theme Provider or update `globals.css` to support data-attribute based theme switching (Neon, Dark, Light).

## Phase 2: Page Implementation (Mobile-First & Landscape Optimized)
- [x] Task: Refactor `src/app/page.tsx` (Welcome) with a mobile-first, centered layout that scales for landscape.
- [x] Task: Implement `src/app/instruments/page.tsx` using CSS Grid to adjust from 1-column (mobile) to multi-column (landscape) for device cards.
- [ ] Task: Implement `src/app/tracks/page.tsx` with a scrollable song grid optimized for landscape viewing.
- [ ] Task: Update `src/app/game/page.tsx` to generate and persist results to context.
- [ ] Task: Implement `src/app/results/page.tsx` using `NavigationLayout` with landscape-aware spacing for metrics and actions.
- [ ] Task: Update `src/app/settings/page.tsx` with the 3-step speed slider and global theme toggle.

## Phase 3: Refinement & Validation
- [ ] Task: Audit all pages for "History Neutrality" and `NavigationGuard` compliance.
- [ ] Task: Verify responsive behavior specifically for mobile landscape and tablet landscape.
- [ ] Task: Conductor - User Manual Verification 'Core Navigation Pages' (Protocol in workflow.md)
