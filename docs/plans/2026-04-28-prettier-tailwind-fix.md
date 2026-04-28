# Implementation Plan - Configure Prettier for Tailwind Canonical Classes

The goal is to configure Prettier to automatically fix Tailwind CSS canonical class warnings (e.g., converting `mt-[16px]` to `mt-4`) and ensure classes are consistently sorted.

## User Review Required

> [!IMPORTANT]
> This plan ensures that the `prettier-plugin-tailwindcss-canonical-classes` plugin is correctly configured for Tailwind CSS v4.
>
> 1. **Plugin Order**: The canonicalization plugin MUST be listed **after** the sorting plugin (`prettier-plugin-tailwindcss`) in the `plugins` array to ensure correct parser chaining.
> 2. **Stylesheet Path**: The `tailwindcssCanonicalStylesheet` option must be set to point to the project's CSS entry point (`./src/app/globals.css`) for accurate design system resolution.

## Proposed Changes

### Configuration

#### [MODIFY] [.prettierrc.json](file:///Users/yanhong/Github/hongy20/midi-jam/.prettierrc.json)

- Update the `plugins` array to move `prettier-plugin-tailwindcss-canonical-classes` to the end.
- Add `"tailwindcssCanonicalStylesheet": "./src/app/globals.css"`.

## Verification Plan

### Automated Tests

- Run `npm run format` to apply the changes and verify that non-canonical classes (e.g., `!basis-[100%]`) are updated to their canonical forms (e.g., `basis-full!`).
- Run `npm run lint` to ensure no regressions.

### Manual Verification

- Check `src/app/globals.css` and verify that arbitrary value classes in `@apply` directives have been replaced with canonical equivalents.
