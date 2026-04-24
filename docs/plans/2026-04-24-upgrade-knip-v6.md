# Upgrade Knip to Version 6 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade Knip configuration and schema to version 6 and verify compatibility.

**Architecture:** Update the `$schema` URL in `knip.jsonc` and verify the installation in `package.json`. Run validation to ensure no new issues are introduced.

**Tech Stack:** Knip v6, Next.js, TypeScript

---

### Task 1: Update Knip Schema and Verify Version

**Files:**
- Modify: `knip.jsonc:2`
- Verify: `package.json:63`

**Step 1: Update the schema URL in knip.jsonc**

```jsonc
// knip.jsonc
-  "$schema": "https://unpkg.com/knip@5/schema.json",
+  "$schema": "https://unpkg.com/knip@6/schema.json",
```

**Step 2: Verify knip version in package.json**

Ensure `"knip": "^6.6.1"` (or higher) is present. (Already confirmed).

**Step 3: Run knip to verify compatibility**

Run: `source ~/.nvm/nvm.sh && nvm use default && npm run knip`
Expected: Output showing found issues (if any) or clean run.

**Step 4: Commit**

```bash
git add knip.jsonc
git commit -m "chore: upgrade knip schema to v6"
```

### Task 2: Final Verification and Pull Request

**Step 1: Run full linting suite**

Run: `source ~/.nvm/nvm.sh && nvm use default && npm run lint`
Expected: All checks pass (ESLint, Prettier, Knip).

**Step 2: Create Pull Request**

Run: `PATH=$PATH:/opt/homebrew/bin:/usr/local/bin gh pr create --fill`
Expected: PR created successfully.
