# Design & Implementation Plan: Knip Setup

**Goal:** Set up [Knip](https://knip.dev/) to identify and prevent unused files, dependencies, and exports in the codebase, integrated into the CI pipeline.

**Scope:**

- Fail CI on unused files and dependencies.
- Warn on unused exports.
- Perform an initial cleanup of existing unused items.
- Respect `.gitignore`.

---

## Proposed Changes

### [NEW] [knip.jsonc](file:///Users/yanhong/Github/hongy20/midi-jam/knip.jsonc)

Configure Knip with plugins for Next.js, Storybook, and Vitest.

```jsonc
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "entry": [
    "src/app/**/page.tsx",
    "src/app/layout.tsx",
    "src/features/*/index.ts", // Public APIs for features
  ],
  "project": ["src/**/*.{ts,tsx}"],
  "ignore": [
    "src/shared/components/ui/**", // shadcn components can have unused exports by design
  ],
  "rules": {
    "files": "error",
    "dependencies": "error",
    "devDependencies": "error",
    "unlisted": "error",
    "binaries": "error",
    "unresolved": "error",
    "exports": "warn",
    "types": "warn",
    "enumMembers": "warn",
    "classMembers": "warn",
  },
  "next": {
    "entry": [
      "next.config.ts",
      "src/app/**/page.tsx",
      "src/app/**/layout.tsx",
      "src/app/**/loading.tsx",
      "src/app/**/error.tsx",
      "src/app/**/not-found.tsx",
      "src/app/**/route.ts",
      "src/middleware.ts",
    ],
  },
  "vitest": {
    "entry": ["src/**/*.test.{ts,tsx}", "vitest.config.ts"],
  },
  "storybook": {
    "entry": ["src/**/*.stories.{ts,tsx}", ".storybook/main.ts", ".storybook/preview.tsx"],
  },
}
```

### [MODIFY] [package.json](file:///Users/yanhong/Github/hongy20/midi-jam/package.json)

Add `knip` scripts and update `lint`.

```json
{
  "scripts": {
    "knip": "knip",
    "lint": "eslint . && prettier --check . && knip"
  }
}
```

---

## Tasks

### 1. Installation & Configuration

- [ ] Install `knip` as a dev dependency.
- [ ] Create `knip.jsonc` with the proposed configuration.
- [ ] Update `package.json` scripts.
- [ ] Verify setup with `npm run knip`.

### 2. Initial Cleanup

- [ ] Run `npm run knip` and analyze results.
- [ ] Remove unused files identified by Knip.
- [ ] Remove unused dependencies identified by Knip.
- [ ] (Optional) Address unused exports if simple to do so.

### 3. CI Verification

- [ ] Verify that `npm run lint` now includes Knip and fails correctly on unused files/deps.
- [ ] Verify CI workflow passes with the new command.

---

## Verification Plan

### Automated Tests

- `npm run knip`: Should exit with code 0 after cleanup.
- `npm run lint`: Should pass all checks.

### Manual Verification

- Temporarily create an unused file and verify `npm run knip` fails.
- Temporarily add an unused dependency and verify `npm run knip` fails.
