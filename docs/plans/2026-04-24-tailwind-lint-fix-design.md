# Design: Fixing Tailwind CSS Lint Warnings

Date: 2026-04-24
Topic: Tailwind CSS Lint Warnings Configuration

## Problem
The `eslint-plugin-tailwindcss` plugin is generating 77 warnings because it doesn't recognize Tailwind v4 theme variables (e.g., `bg-accent`, `text-foreground/70`) without a traditional `tailwind.config.js`.

## Proposed Solution
Instead of modifying all component source files to use explicit variable syntax, we will update the `eslint.config.mjs` to include a "phantom" Tailwind configuration in the plugin settings. This tells the plugin which classes are valid based on the project's CSS-based theme.

## Design Details
Update `eslint.config.mjs` with the following:

1. **`settings.tailwindcss.config`**: A theme object containing all standard and custom colors/fonts used in the project, mapped to their CSS variable equivalents.
2. **`settings.tailwindcss.whitelist`**: A list of non-utility classes like `custom-scrollbar`, `btn-jam`, and `jam-action-group` to be ignored by the `no-custom-classname` rule.

## Expected Outcome
- 0 warnings from `tailwindcss/no-custom-classname`.
- Clean, readable class names in component code.
- Automatic validation for future components using the same theme variables.

## Verification Plan
- Run `npm run lint` and verify zero Tailwind warnings.
- Verify no visual regressions in the application.
