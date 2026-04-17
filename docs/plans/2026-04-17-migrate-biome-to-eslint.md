# Biome to ESLint 9 + Prettier Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Biome with ESLint 9 and Prettier as the styling and linting standard for the project, following Next.js 16 defaults.

**Architecture:** We will use ESLint 9 for identifying logical issues and code quality problems, and Prettier for maintaining consistent code formatting. They will be integrated using `eslint-config-prettier` to ensure no conflict between linting rules and formatting styles.

**Tech Stack:** Next.js 16, ESLint 9, Prettier, TypeScript.

---

## User Review Required

> [!IMPORTANT]
> This migration will replace the existing Biome linting/formatting with the Next.js 16 standard ESLint 9 + Prettier.
> Linting will be slower but will follow the default Next.js ecosystem patterns more closely.

---

### Task 1: Dependency Transition

**Files:**

- Modify: `package.json`

**Step 1: Remove Biome and install ESLint/Prettier**

Run:

```bash
source ~/.nvm/nvm.sh && nvm use default && \
npm uninstall @biomejs/biome && \
npm install --save-dev eslint@9 eslint-config-next@latest eslint-config-prettier@latest prettier@latest @eslint/compat @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: migrate dependencies from biome to eslint/prettier"
```

---

### Task 2: Configuration Setup

**Files:**

- Create: `eslint.config.mjs`
- Create: `.prettierignore`
- Create: `.prettierrc.json`
- Delete: `biome.json`

**Step 1: Create `eslint.config.mjs`**

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/*", "node_modules/*", "dist/*", "build/*", "coverage/*", "storybook-static/*"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
```

**Step 2: Create `.prettierrc.json`**

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

**Step 3: Create `.prettierignore`**

```text
.next
node_modules
dist
build
coverage
storybook-static
package-lock.json
```

**Step 4: Delete `biome.json`**

Run: `rm biome.json`

**Step 5: Commit**

```bash
git add eslint.config.mjs .prettierrc.json .prettierignore
git rm biome.json
git commit -m "chore: add eslint and prettier configurations"
```

---

### Task 3: Script & CI Update

**Files:**

- Modify: `package.json`
- Modify: `.github/workflows/ci.yml`

**Step 1: Update scripts in `package.json`**

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix && prettier --write .",
"format": "prettier --write ."
```

**Step 2: Update `ci.yml`**

Ensure the lint step uses `npm run lint`.

**Step 3: Commit**

```bash
git add package.json .github/workflows/ci.yml
git commit -m "chore: update lint scripts and CI workflow"
```

---

### Task 4: Documentation Update

**Files:**

- Modify: `AGENTS.md`
- Modify: `README.md`

**Step 1: Update Tooling sections**

Replace Biome mentions with ESLint/Prettier.

**Step 2: Commit**

```bash
git add AGENTS.md README.md
git commit -m "docs: update tooling documentation"
```

---

### Task 5: Code Cleanup

**Files:**

- Modify: All files containing `// biome-ignore`

**Step 1: Replace ignore comments**

Use `sed` or a subagent to search and replace `// biome-ignore` with `// eslint-disable-next-line` or appropriate equivalents.

**Step 2: Final Verification**

Run:

```bash
source ~/.nvm/nvm.sh && nvm use default && \
npm run lint && \
npm run type-check
```

**Step 3: Commit**

```bash
git commit -am "chore: cleanup biome-ignore comments and finalize migration"
```
