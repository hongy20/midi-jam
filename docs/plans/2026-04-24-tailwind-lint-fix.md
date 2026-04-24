# Plan: Resolve Tailwind CSS Lint Warnings

Date: 2026-04-24
Topic: Tailwind CSS Lint Warnings Configuration

## Context & Problem
The `eslint-plugin-tailwindcss` plugin was generating 77 `no-custom-classname` warnings because it could not resolve Tailwind v4 theme variables (e.g., `bg-accent`, `text-foreground/70`) without a traditional `tailwind.config.js`.

## Proposed Solution
Instead of refactoring the codebase, we update the `eslint.config.mjs` settings to include a comprehensive whitelist of valid classes and variants. This satisfies the linter while keeping the component code clean and readable.

## Execution Steps

### 1. Identify Flagged Classes
- [x] Run `npx eslint .` to capture all unique custom class names causing warnings.
- [x] Extract unique base names and variants (e.g., `bg-accent`, `font-retro`, `ring-ring`).

### 2. Update ESLint Configuration
- [x] Update `eslint.config.mjs` with the comprehensive `whitelist`.
- [x] Add an empty `config: {}` object to silence the "Cannot resolve default tailwindcss config path" error message.

### 3. Verification
- [x] Run `npx eslint .` to confirm zero warnings remain.
- [x] Verify that existing unit tests pass.

## Final Results
- All 77 Tailwind lint warnings have been resolved.
- Pull Request: [PR #151](https://github.com/hongy20/midi-jam/pull/151)
- Walkthrough: [walkthrough.md](file:///Users/yanhong/.gemini/antigravity/brain/b1ac4dab-381c-4698-9309-aa40a9211c73/walkthrough.md)
