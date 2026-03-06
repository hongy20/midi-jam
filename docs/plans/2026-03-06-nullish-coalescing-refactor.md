# Nullish Coalescing Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor verbose `typeof` checks for numeric defaults to use nullish coalescing (`??`) and update coding standards.

**Architecture:** Update `AGENTS.md` to mandate nullish coalescing for default values. Refactor `src/hooks/use-lane-timeline.ts` to follow this pattern.

**Tech Stack:** TypeScript, React, Vitest

---

### Task 1: Update AGENTS.md Coding Standards

**Files:**
- Modify: `AGENTS.md`

**Step 1: Add Coding Patterns section to AGENTS.md**

Add the following section under `### 3. Architecture & Styling Standards`:

```markdown
### 4. Coding Patterns
- **Nullish Coalescing**: Prefer the Nullish Coalescing operator (`??`) or Conditional (Ternary) operator (`? :`) for default values over verbose `typeof` checks for `null` or `undefined` (e.g., `value ?? 0` instead of `typeof value === 'number' ? value : 0`).
```

**Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add nullish coalescing coding pattern to AGENTS.md"
```

---

### Task 2: Refactor use-lane-timeline.ts

**Files:**
- Modify: `src/hooks/use-lane-timeline.ts`
- Test: `src/hooks/use-lane-timeline.test.ts`

**Step 1: Run existing tests**

Run: `npm test src/hooks/use-lane-timeline.test.ts`
Expected: PASS

**Step 2: Refactor currentProgress assignment**

In `updateAnimation` function:
Replace:
```typescript
        currentProgress =
          typeof animationRef.current.currentTime === "number"
            ? animationRef.current.currentTime
            : 0;
```
With:
```typescript
        currentProgress = animationRef.current.currentTime ?? 0;
```

**Step 3: Refactor getCurrentTimeMs callback**

Replace:
```typescript
  const getCurrentTimeMs = useCallback(() => {
    const animation = animationRef.current;
    if (!animation || typeof animation.currentTime !== "number") return 0;
    return animation.currentTime;
  }, []);
```
With:
```typescript
  const getCurrentTimeMs = useCallback(() => {
    return (animationRef.current?.currentTime as number) ?? 0;
  }, []);
```
*Note: We use `as number` because Web Animations API `currentTime` is technically `CSSNumericValue | number | null`, but in our usage it is always a number when not null.*

**Step 4: Run tests to verify no regressions**

Run: `npm test src/hooks/use-lane-timeline.test.ts`
Expected: PASS

**Step 5: Run full validation**

Run: `npm run lint && npm run type-check`
Expected: PASS

**Step 6: Commit**

```bash
git add src/hooks/use-lane-timeline.ts
git commit -m "refactor: use nullish coalescing for animation currentTime"
```
