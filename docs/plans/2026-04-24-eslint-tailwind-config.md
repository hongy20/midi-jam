# Plan: Configure ESLint for Tailwind CSS

Configure ESLint to report Tailwind CSS warnings (class ordering, custom classes, contradictions) and enable auto-fixing via `eslint --fix`.

## User Review Required

> [!IMPORTANT]
> This plan involves installing `eslint-plugin-tailwindcss` and modifying `eslint.config.mjs`. While Tailwind CSS v4 is used, the plugin provides valuable checks for class ordering and contradictions that are still relevant.

## Proposed Changes

### [Tooling]

#### [MODIFY] [eslint.config.mjs](file:///Users/yanhong/Github/hongy20/midi-jam/eslint.config.mjs)
- Import `eslint-plugin-tailwindcss`.
- Add `tailwindcss.configs["flat/recommended"]` to the config array.
- Customize rules if necessary (e.g., set `tailwindcss/classnames-order` to `warn` or `error`).

#### [MODIFY] [package.json](file:///Users/yanhong/Github/hongy20/midi-jam/package.json)
- Add `eslint-plugin-tailwindcss` to `devDependencies`.

## Verification Plan

### Automated Tests
- Run `npm run lint` to see new Tailwind-related warnings.
- Run `npm run lint:fix` to verify that class names are automatically reordered or fixed where possible.
- Run `npm run build` to ensure no regressions in the build process.

### Manual Verification
- Introduce a Tailwind class ordering issue or a contradicting class (e.g., `p-2 p-4`) and verify that ESLint reports it.
