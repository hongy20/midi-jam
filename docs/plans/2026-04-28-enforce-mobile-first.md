# Plan: Enforce Mobile-First Principle

## Objective

Enforce the mobile-first principle across the codebase for both Tailwind CSS classnames and custom CSS styling.

## Implementation Steps

1. **ESLint Configuration (`eslint.config.mjs`)**
   - Add a custom `no-restricted-syntax` rule to forbid the use of `max-*` Tailwind variants (e.g., `max-sm:`, `max-md:`).

2. **Stylelint Integration**
   - Install `stylelint`, `stylelint-config-standard`, and `stylelint-mobile-first`.
   - Create `.stylelintrc.json` to configure the `mobile-first/no-mobile-first-queries` rule.
   - Update `package.json` to include a `stylelint` script.

3. **CSS Refactoring (`src/app/globals.css`)**
   - Refactor `.btn-jam` to use mobile-first styling (hide SVG by default, show on larger screens).
   - Remove any `@media (max-width: ...)` queries.

4. **Validation**
   - Run `npm run lint:fix`, `npm run lint`, `npm run type-check`, `npm test`, and `npm run build`.
   - Fix any issues that arise.

5. **Finalization**
   - Create a PR for the `feature/enforce-mobile-first` branch.
