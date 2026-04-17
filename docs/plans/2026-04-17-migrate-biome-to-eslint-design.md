# Design: Migrate Biome to ESLint 9 + Prettier

This design outlines the migration from Biome to ESLint 9 (Flat Config) and Prettier, following the latest Next.js 16 defaults.

## Architecture
We will use ESLint 9 for identifying logical issues and code quality problems, and Prettier for maintaining consistent code formatting. They will be integrated using `eslint-config-prettier` to ensure no conflict between linting rules and formatting styles.

## Proposed Changes

### 1. Tooling & Dependencies
- **Remove**: `@biomejs/biome` from `devDependencies`.
- **Add**: 
  - `eslint` (v9+)
  - `eslint-config-next`
  - `eslint-config-prettier`
  - `@eslint/compat` (for legacy config support in Flat Config)
  - `prettier`
  - `@typescript-eslint/eslint-plugin`
  - `@typescript-eslint/parser`

### 2. Configuration Files
- **[NEW] `eslint.config.mjs`**: The new Flat Config file for ESLint 9. It will use `FlatCompat` to load `next/core-web-vitals` and incorporate TypeScript rules.
- **[NEW] `.prettierrc.json`**: Prettier configuration matching the current Biome style (2-space tabs, double quotes, trailing commas).
- **[DELETE] `biome.json`**: Removed as it's no longer needed.

### 3. Build & CI Integration
- **`package.json`**:
  - Update `lint` script to use `eslint .`.
  - Update `lint:fix` script to use `eslint . --fix && prettier --write .`.
- **`.github/workflows/ci.yml`**: Ensure the `Lint` step runs the updated `npm run lint`.

### 4. Codebase Cleanup
- Perform a surgical replacement of `// biome-ignore` comments with their equivalent `// eslint-disable` or `// prettier-ignore` counterparts where preservation is necessary.

### 5. Documentation
- Update `AGENTS.md` and `README.md` to reflect that ESLint and Prettier are now the primary tooling for linting and formatting.

## Verification Plan

### Automated Tests
- Run `npm run lint` to verify all files pass the new ESLint rules.
- Run `prettier --check .` to verify formatting.
- Run the full CI suite (`lint`, `type-check`, `test`) to ensure no regressions.

### Manual Verification
- Inspect a few modified files to ensure `biome-ignore` comments were correctly converted.
- Verify that the development experience in VS Code (or other editors) remains functional with the new config.
