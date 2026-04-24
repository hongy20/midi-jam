# Upgrade Knip to Version 6 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade Knip configuration and schema to version 6, update middleware entry, and verify compatibility.

**Architecture:** Update the `$schema` URL and entry points in `knip.jsonc`. Run validation to ensure no issues.

**Tech Stack:** Knip v6, Next.js, TypeScript

---

### Task 1: Update Knip Schema and Entry Points

**Files:**

- Modify: `knip.jsonc:2,27`

**Step 1: Update the schema URL and replace src/middleware.ts with src/proxy.ts**

```jsonc
// knip.jsonc
-  "$schema": "https://unpkg.com/knip@5/schema.json",
+  "$schema": "https://unpkg.com/knip@6/schema.json",
...
-      "src/middleware.ts",
+      "src/proxy.ts",
```

**Step 2: Remove trailing commas in knip.jsonc**

```jsonc
// knip.jsonc
-    "unresolved": "error",
-    "exports": "warn",
-    "types": "warn",
-    "enumMembers": "warn",
+    "unresolved": "error"
+    "exports": "warn"
+    "types": "warn"
+    "enumMembers": "warn"
... and others
```

**Step 3: Run knip to verify compatibility**

Run: `source ~/.nvm/nvm.sh && nvm use default && npm run knip`
Expected: Output showing no issues.

**Step 3: Commit**

```bash
git add knip.jsonc
git commit -m "chore: upgrade knip schema to v6 and update proxy entry"
```

### Task 2: Final Verification and Pull Request

**Step 1: Run full linting suite**

Run: `source ~/.nvm/nvm.sh && nvm use default && npm run lint`
Expected: All checks pass.

**Step 2: Create Pull Request**

Run: `PATH=$PATH:/opt/homebrew/bin:/usr/local/bin gh pr create --fill`
Expected: PR created successfully.
