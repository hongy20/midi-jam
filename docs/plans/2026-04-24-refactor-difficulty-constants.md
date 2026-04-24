# Refactor Difficulty Constants Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor hardcoded speed values (0.5, 1.0, 2.0) into named constants for better maintainability and reuse.

**Architecture:** Define exported constants in `difficulty.ts`, update internal maps and logic to use them, and expose them via `index.ts`.

**Tech Stack:** TypeScript, Vitest

---

### Task 1: Create Unit Tests for Difficulty Logic

**Files:**

- Create: `src/features/options/lib/difficulty.test.ts`

**Step 1: Write initial tests**

```typescript
import { describe, it, expect } from "vitest";
import { speedToDifficulty, difficultyToSpeed, getDifficultyLabel } from "./difficulty";

describe("difficulty lib", () => {
  it("maps speed to difficulty correctly", () => {
    expect(speedToDifficulty(0.5)).toBe("easy");
    expect(speedToDifficulty(1.0)).toBe("normal");
    expect(speedToDifficulty(2.0)).toBe("hard");
  });

  it("maps difficulty to speed correctly", () => {
    expect(difficultyToSpeed("easy")).toBe(0.5);
    expect(difficultyToSpeed("normal")).toBe(1.0);
    expect(difficultyToSpeed("hard")).toBe(2.0);
  });

  it("returns correct labels", () => {
    expect(getDifficultyLabel("easy")).toContain("0.5x");
    expect(getDifficultyLabel("normal")).toContain("1.0x");
    expect(getDifficultyLabel("hard")).toContain("2.0x");
  });
});
```

**Step 2: Run tests to verify they pass (baseline)**
Run: `source ~/.nvm/nvm.sh && nvm use default && npm test src/features/options/lib/difficulty.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add src/features/options/lib/difficulty.test.ts
git commit -m "test: add baseline tests for difficulty lib"
```

---

### Task 2: Define and Use Speed Constants

**Files:**

- Modify: `src/features/options/lib/difficulty.ts`

**Step 1: Implement constants and update logic**

```typescript
export const SPEED_EASY = 0.5;
export const SPEED_NORMAL = 1.0;
export const SPEED_HARD = 2.0;

export type Difficulty = "easy" | "normal" | "hard";

const DIFFICULTY_SPEEDS: Record<Difficulty, number> = {
  easy: SPEED_EASY,
  normal: SPEED_NORMAL,
  hard: SPEED_HARD,
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: `EASY (${SPEED_EASY}x)`,
  normal: `NORMAL (${SPEED_NORMAL}x)`,
  hard: `HARD (${SPEED_HARD}x)`,
};

export function speedToDifficulty(speed: number): Difficulty {
  if (speed <= SPEED_EASY) return "easy";
  if (speed >= SPEED_HARD) return "hard";
  return "normal";
}
```

**Step 2: Update tests to use constants**
Update `src/features/options/lib/difficulty.test.ts` to import and use the new constants in expectations.

**Step 3: Run tests**
Run: `source ~/.nvm/nvm.sh && nvm use default && npm test src/features/options/lib/difficulty.test.ts`
Expected: PASS

**Step 4: Commit**

```bash
git add src/features/options/lib/difficulty.ts src/features/options/lib/difficulty.test.ts
git commit -m "refactor: use named constants for difficulty speeds"
```

---

### Task 3: Export Constants from Public API

**Files:**

- Modify: `src/features/options/index.ts`

**Step 1: Add exports**

```typescript
export {
  type Difficulty,
  difficultyToSpeed,
  getDifficultyLabel,
  speedToDifficulty,
  SPEED_EASY,
  SPEED_NORMAL,
  SPEED_HARD,
} from "./lib/difficulty";
```

**Step 2: Commit**

```bash
git add src/features/options/index.ts
git commit -m "feat: export speed constants from options feature"
```

---

### Task 4: Final Verification

**Step 1: Run full suite**
Run: `source ~/.nvm/nvm.sh && nvm use default && npm run lint && npm run type-check && npm test`
Expected: PASS

**Step 2: Create PR**
Run: `PATH=$PATH:/opt/homebrew/bin:/usr/local/bin gh pr create --fill`
