# Implementation Plan - Configure Prettier for Tailwind Canonical Classes

The goal is to configure Prettier to automatically fix Tailwind CSS canonical class warnings (e.g., converting `mt-[16px]` to `mt-4`) and ensure classes are consistently sorted.

## User Review Required

> [!IMPORTANT]
> This plan introduces two new Prettier plugins:
>
> 1. `prettier-plugin-tailwindcss`: The official plugin for sorting Tailwind classes.
> 2. `prettier-plugin-tailwindcss-canonical-classes`: A community plugin that handles canonicalization (fixing `suggestCanonicalClasses` warnings).
>
> These will run automatically during `npm run format` or whenever Prettier is triggered by your IDE on save.

## Proposed Changes

### Dependencies

#### [MODIFY] [package.json](file:///Users/yanhong/Github/hongy20/midi-jam/package.json)

- Add `prettier-plugin-tailwindcss` and `prettier-plugin-tailwindcss-canonical-classes` to `devDependencies`.

### Configuration

#### [MODIFY] [.prettierrc.json](file:///Users/yanhong/Github/hongy20/midi-jam/.prettierrc.json)

- Add the `plugins` array to include the new plugins.
- Note: `prettier-plugin-tailwindcss` should usually be last in the array to ensure it sorts the final output.

## Verification Plan

### Automated Tests

- Run `npm run format` to apply the changes and verify that non-canonical classes are updated and sorted.
- Run `npm run lint` to ensure no regressions and that the new formatting is consistent with the linting rules.

### Manual Verification

- Check a file with known non-canonical classes (if any) or manually add one (e.g., `className="mt-[16px] flex"`) and verify it changes to `className="flex mt-4"` (canonicalized and sorted) upon formatting.
