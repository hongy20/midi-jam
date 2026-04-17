# Design & Implementation Plan: Unified Lint & Format

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Unify ESLint and Prettier checks into a single `npm run lint` command for CI/CD validation.

**Architecture:** Use script-level orchestration in `package.json` to run logic checks and formatting checks sequentially.

**Tech Stack:** ESLint, Prettier.

---

### Task 1: Update `package.json` scripts

**Files:**

- Modify: `package.json`

**Step 1: Update the `lint` and `lint:fix` scripts**

Update `lint` to include `prettier --check .`.

```json
"lint": "eslint . && prettier --check .",
"lint:fix": "eslint . --fix && prettier --write ."
```

**Step 2: Run verification**

Run: `npm run lint`
Expected: FAIL if unformatted, PASS otherwise.

**Step 3: Commit**

```bash
git add package.json
git commit -m "chore: unify lint and format scripts"
```

---

### Task 2: Verify Validation Behavior

**Files:**

- Create: `src/temp-test.ts` (temp file to test violation)

**Step 1: Create a file with formatting and linting violations**

```typescript
const unused = "test"; // Extra space and unused variable
```

**Step 2: Run `npm run lint`**

Run: `npm run lint`
Expected: FAIL with both ESLint and Prettier errors.

**Step 3: Run `npm run lint:fix`**

Run: `npm run lint:fix`
Expected: PASS (extra space removed by Prettier, unused variable may remain if not auto-fixable, but formatting should be fixed).

**Step 4: Cleanup and Commit**

```bash
rm src/temp-test.ts
git add .
git commit -m "test: verify unified lint and format behavior"
```

---

### Task 3: Check CI Configuration

**Files:**

- Modify: `.github/workflows/ci.yml` (if needed)

**Step 1: Verify CI uses `npm run lint`**

Run: `grep "npm run lint" .github/workflows/ci.yml`
Expected: Matches the lint step.

**Step 2: Commit**

```bash
git commit -m "chore: verify CI lint configuration"
```
