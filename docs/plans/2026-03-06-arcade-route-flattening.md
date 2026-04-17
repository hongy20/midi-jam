# Arcade-Style Route Flattening Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Flatten the application's routing structure to remove nested routes and rename pages to use arcade-style terminology (e.g., `/collection`, `/gear`, `/play`, `/score`, `/options`).

**Architecture:** This refactor involves physical directory moves, updating the `ROUTES` constant in `src/lib/navigation/routes.ts`, and a global search-and-replace for documentation and title updates.

**Tech Stack:** Next.js 15+ (App Router), TypeScript, Tailwind CSS.

---

## Design Summary

### 1. Route & Page Mapping

| Old Route      | New Route     | New Name        | Folder Path           |
| :------------- | :------------ | :-------------- | :-------------------- |
| `/`            | `/`           | Main Menu       | `src/app/page.tsx`    |
| `/tracks`      | `/collection` | Song Collection | `src/app/collection/` |
| `/instruments` | `/gear`       | Your Gear       | `src/app/gear/`       |
| `/game`        | `/play`       | The Stage       | `src/app/play/`       |
| `/game/pause`  | `/pause`      | Pause Menu      | `src/app/pause/`      |
| `/results`     | `/score`      | Final Score     | `src/app/score/`      |
| `/settings`    | `/options`    | Game Options    | `src/app/options/`    |

---

## Implementation Tasks

### Task 1: Update Route Definitions

**Files:**

- Modify: `src/lib/navigation/routes.ts`

**Step 1: Write the failing test**
Check that `ROUTES` matches the new design.

```typescript
import { ROUTES } from "./routes";
import { expect, test } from "vitest";

test("ROUTES should match the new arcade naming scheme", () => {
  expect(ROUTES.TRACKS).toBeUndefined(); // Should be replaced by COLLECTION
  expect(ROUTES.COLLECTION).toBe("/collection");
  expect(ROUTES.GEAR).toBe("/gear");
  expect(ROUTES.PLAY).toBe("/play");
  expect(ROUTES.PAUSE).toBe("/pause");
  expect(ROUTES.SCORE).toBe("/score");
  expect(ROUTES.OPTIONS).toBe("/options");
});
```

**Step 2: Run test to verify it fails**
Run: `npm test src/lib/navigation/routes.test.ts`
Expected: FAIL (or compilation error due to missing keys)

**Step 3: Update ROUTES constant**

```typescript
export const ROUTES = {
  HOME: "/",
  COLLECTION: "/collection",
  GEAR: "/gear",
  PLAY: "/play",
  PAUSE: "/pause",
  SCORE: "/score",
  OPTIONS: "/options",
} as const;
```

**Step 4: Run test to verify it passes**
Run: `npm test src/lib/navigation/routes.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/navigation/routes.ts
git commit -m "refactor: update ROUTES constant for arcade terminology"
```

---

### Task 2: Restructure App Directories

**Files:**

- Rename/Move:
  - `src/app/tracks/` -> `src/app/collection/`
  - `src/app/instruments/` -> `src/app/gear/`
  - `src/app/game/` -> `src/app/play/` (move `pause` out first)
  - `src/app/game/pause/` -> `src/app/pause/`
  - `src/app/results/` -> `src/app/score/`
  - `src/app/settings/` -> `src/app/options/`

**Step 1: Execute directory moves**

```bash
mv src/app/game/pause src/app/pause
mv src/app/tracks src/app/collection
mv src/app/instruments src/app/gear
mv src/app/game src/app/play
mv src/app/results src/app/score
mv src/app/settings src/app/options
```

**Step 2: Verify folder structure**
Run: `ls -R src/app/`
Expected: All folders at top-level.

**Step 3: Commit**

```bash
git add src/app/
git commit -m "refactor: flatten and rename app directories"
```

---

### Task 3: Update Page Content & Layouts

**Files:**

- Modify:
  - `src/app/collection/page.tsx`
  - `src/app/gear/page.tsx`
  - `src/app/play/page.tsx`
  - `src/app/pause/page.tsx`
  - `src/app/score/page.tsx`
  - `src/app/options/page.tsx`

**Step 1: Update H1 titles and metadata**
For each page, replace the old display name with the new arcade-style name.
Example: In `src/app/collection/page.tsx`, change `Select Track` or `Tracks` to `Song Collection`.

**Step 2: Update internal navigation references**
Search for stale `ROUTES.TRACKS` etc. across all files and replace with new keys.

**Step 3: Commit**

```bash
git add src/app/
git commit -m "refactor: update page titles and navigation references"
```

---

### Task 4: Global Documentation Alignment

**Files:**

- Modify: `AGENTS.md`, `README.md`, `docs/plans/*.md`

**Step 1: Update AGENTS.md**
Update the "Commands" table and "Project Context" to use the new names.

**Step 2: Update existing plans**
Use `sed` or similar to replace terminology in `docs/plans/`.

- `game/pause` -> `pause`
- `/game` -> `/play`
- `/tracks` -> `/collection`
- `/instruments` -> `/gear`
- `/results` -> `/score`
- `/settings` -> `/options`

**Step 3: Commit**

```bash
git add AGENTS.md README.md docs/plans/
git commit -m "docs: align all documentation with arcade naming scheme"
```

---

### Task 5: Final Validation

**Step 1: Run Lint, Type-Check, and Tests**
Run: `npm run lint && npm run type-check && npm test && npm run build`
Expected: All PASS.

**Step 2: Final Commit**

```bash
git commit --allow-empty -m "chore: final validation complete"
```
