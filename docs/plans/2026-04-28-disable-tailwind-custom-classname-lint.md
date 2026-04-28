# Plan: Disable Tailwind Custom Classname Lint Rule

Disabling the `tailwindcss/no-custom-classname` rule in `eslint.config.mjs` to allow for custom retro styles and theme-specific classes used in the project.

## Proposed Changes

### [MODIFY] [eslint.config.mjs](file:///Users/yanhong/Github/hongy20/midi-jam/eslint.config.mjs)

- Set `"tailwindcss/no-custom-classname": "off"` in the rules configuration.

## Verification Plan

### Automated Tests

- Run `npm run lint` to ensure no linting warnings remain related to custom Tailwind classnames.
- Run `npm run type-check` to ensure no regressions.
