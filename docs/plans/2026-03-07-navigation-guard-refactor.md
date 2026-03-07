# Design Doc: Navigation Guard Refactor

## 1. Overview
The goal of this refactor is to centralize navigation logic within a single `NavigationGuard` component. The guard will enforce page-level requirements based on the application's state (`AppContext`), ensuring users are always on a page they have the necessary data for.

## 2. Page Hierarchy & Requirements
We define three levels of page requirements:

### Level 2: High Requirement (`/play`, `/pause`)
- **Requirements**: `selectedMIDIInput` AND `selectedTrack`.
- **Violation (No MIDI)**: 
  - Call `setGameSession(null)` to stop and clear the game.
  - Redirect to `/gear` (optionally with `from=game`).
- **Violation (No Track)**:
  - Call `setGameSession(null)`.
  - Redirect to `/collection`.

### Level 1: Medium Requirement (`/collection`)
- **Requirements**: `selectedMIDIInput`.
- **Violation (No MIDI)**: Redirect to `/gear`.

### Level 0: No Requirement (`/`, `/gear`, `/score`, `/options`)
- **Requirements**: None.
- **Action**: No automatic redirection. The `/gear` page remains "dumb"—it only moves forward when the user explicitly interacts with it.

## 3. Implementation Details
- **Location**: `src/components/navigation-guard.tsx`.
- **Hooks**: Uses `useAppContext`, `usePathname`, and `useNavigation`.
- **Redirection**: All redirects use `router.replace()` via the `useNavigation` hook to maintain "History Neutrality".
- **Cleanup**: The guard is responsible for clearing the `gameSession` when moving *out* of Level 2 due to a violation.
- **Stability**: The guard will not trigger if the user is already on the target route to prevent infinite loops.

## 4. Specific Scenarios
- **Direct URL Entry**: Typing `/play` without a track or MIDI will trigger the waterfall: `No MIDI -> /gear`. After picking Gear and moving to `/collection`, it might still lack a track, staying there.
- **Hardware Changes**: Unplugging a MIDI device while playing immediately stops the game and moves the user to the Gear selection page.
- **Score Page Persistence**: Users can view results (`/score`) even if they unplug their device, as it is a Level 0 page.
\n---\n
# Navigation Guard Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Centralize and enforce page-level state requirements (MIDI, Track) in a single `NavigationGuard` component.

**Architecture:** A centralized "waterfall" of redirection rules based on page hierarchy (Level 0, 1, 2) to ensure the user is always on a valid page for their current state.

**Tech Stack:** React 19, Next.js 15 (App Router), Lucide Icons, Vitest.

---

### Task 1: Refactor `NavigationGuard` Logic

**Files:**
- Modify: `src/components/navigation-guard.tsx`

**Step 1: Update the `NavigationGuard` component**

Replace the existing `useEffect` logic with the hierarchical waterfall.

```tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";
import { ROUTES } from "@/lib/navigation/routes";

export function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { toCollection, toHome, toGear } = useNavigation();
  const pathname = usePathname();
  const { collection, gear, score, stage: { setGameSession } } = useAppContext();

  useEffect(() => {
    const isPlay = pathname === ROUTES.PLAY;
    const isPause = pathname === ROUTES.PAUSE;
    const isLevel2 = isPlay || isPause;
    const isLevel1 = pathname === ROUTES.COLLECTION;
    const isResults = pathname === ROUTES.SCORE;

    // Level 2 Requirements (Play/Pause): MIDI + Track
    if (isLevel2) {
      if (!gear.selectedMIDIInput) {
        setGameSession(null);
        toGear("game");
        return;
      }
      if (!collection.selectedTrack) {
        setGameSession(null);
        toCollection();
        return;
      }
    }

    // Level 1 Requirements (Collection): MIDI
    if (isLevel1) {
      if (!gear.selectedMIDIInput) {
        toGear();
        return;
      }
    }

    // Level 0 (Score/Home/Gear/Options): No strict requirements
    // Special case: Redirect Score to Home if results are missing
    if (isResults && !score.sessionResults) {
      toHome();
      return;
    }
  }, [
    pathname,
    collection.selectedTrack,
    gear.selectedMIDIInput,
    score.sessionResults,
    setGameSession,
    toCollection,
    toHome,
    toGear,
  ]);

  return <>{children}</>;
}
```

**Step 2: Run Lint and Type Check**

Run: `npm run lint && npm run type-check`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/navigation-guard.tsx
git commit -m "refactor: implement hierarchical navigation guard"
```

---

### Task 2: Verify Redirection Flow

**Files:**
- Modify: `src/components/navigation-guard.test.tsx` (create if missing)
- Existing tests: `src/app/page.test.tsx`, `src/app/play/page.test.tsx`

**Step 1: Write a unit test for the guard**

Create or update `src/components/navigation-guard.test.tsx`.

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NavigationGuard } from "./navigation-guard";
import { useAppContext } from "@/context/app-context";
import { useNavigation } from "@/hooks/use-navigation";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/navigation/routes";

vi.mock("@/context/app-context");
vi.mock("@/hooks/use-navigation");
vi.mock("next/navigation");

describe("NavigationGuard", () => {
  const mockToGear = vi.fn();
  const mockToCollection = vi.fn();
  const mockToHome = vi.fn();
  const mockSetGameSession = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigation as any).mockReturnValue({
      toGear: mockToGear,
      toCollection: mockToCollection,
      toHome: mockToHome,
    });
  });

  it("redirects from Level 2 to Gear if MIDI is missing", () => {
    (usePathname as any).mockReturnValue(ROUTES.PLAY);
    (useAppContext as any).mockReturnValue({
      collection: { selectedTrack: { id: "1" } },
      gear: { selectedMIDIInput: null },
      stage: { setGameSession: mockSetGameSession },
      score: { sessionResults: null },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockSetGameSession).toHaveBeenCalledWith(null);
    expect(mockToGear).toHaveBeenCalledWith("game");
  });

  it("redirects from Level 1 to Gear if MIDI is missing", () => {
    (usePathname as any).mockReturnValue(ROUTES.COLLECTION);
    (useAppContext as any).mockReturnValue({
      collection: { selectedTrack: null },
      gear: { selectedMIDIInput: null },
      stage: { setGameSession: mockSetGameSession },
      score: { sessionResults: null },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockToGear).toHaveBeenCalled();
  });

  it("does not redirect from Level 0 (Gear) even if MIDI is missing", () => {
    (usePathname as any).mockReturnValue(ROUTES.GEAR);
    (useAppContext as any).mockReturnValue({
      collection: { selectedTrack: null },
      gear: { selectedMIDIInput: null },
      stage: { setGameSession: mockSetGameSession },
      score: { sessionResults: null },
    });

    render(<NavigationGuard>Test</NavigationGuard>);

    expect(mockToGear).not.toHaveBeenCalled();
    expect(mockToCollection).not.toHaveBeenCalled();
  });
});
```

**Step 2: Run tests**

Run: `npm test src/components/navigation-guard.test.tsx`
Expected: PASS

**Step 3: Commit**

```bash
git add src/components/navigation-guard.test.tsx
git commit -m "test: add navigation guard redirection tests"
```

---

### Task 3: Global Validation

**Step 1: Run full suite**

Run: `npm run lint && npm run type-check && npm test && npm run build`
Expected: PASS

**Step 2: Finalize**

```bash
git add .
git commit -m "chore: finalize navigation guard refactor"
```
