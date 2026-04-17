# Design: Unified Lint & Format Strategy

**Date:** 2026-04-17
**Topic:** Unified Lint & Format Validation
**Status:** Approved

## 1. Objective
To ensure consistent code quality and formatting across the entire codebase (TS, JS, CSS, JSON, MD) by unifying ESLint and Prettier checks into a single validation command (`npm run lint`), while maintaining a distraction-free development environment (no formatting "red squiggles" in the editor).

## 2. Architecture
The project will use **Script-level Unification** (Approach 1). This keeps ESLint (logic) and Prettier (formatting) decoupled as tools but linked as a single stage in the CI/CD pipeline.

- **`npm run lint`**: Updated to `eslint . && prettier --check .`. This command will now perform a complete quality check. If either logic rules or formatting rules are violated, the command will exit with an error.
- **`npm run lint:fix`**: Already configured as `eslint . --fix && prettier --write .`. This remains the "one-click fix" command for local development.
- **Editor Experience**: No changes to `eslint.config.mjs` rules are required. By *not* using `eslint-plugin-prettier`, we avoid showing formatting violations as linting errors in the IDE, adhering to the "Option B" preference.

## 3. Data Flow & Validation
1. **Developer workflow**:
   - Write code.
   - Run `npm run lint:fix` to auto-fix imports and format all files (including non-TS files like `.css` and `.json`).
   - Run `npm run lint` to verify before pushing.
2. **CI/CD pipeline**:
   - Executes `npm run lint`.
   - Fails if *any* file is unformatted or contains linting errors.

## 4. Testing & Success Criteria
- **Verification**: Manually introduce a formatting error (e.g., extra spaces) and a linting error (e.g., unused variable).
- **Success**: `npm run lint` must fail for both cases. `npm run lint:fix` must resolve the formatting error and (if possible) the linting error.
