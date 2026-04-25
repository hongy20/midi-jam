# Enforce Import Grouping at Top of Files

This plan aims to enforce that all import statements are grouped at the top of the file, preventing other code (like interface definitions) from being interspersed between imports.

## Proposed Changes

### [ESLint Configuration](file:///Users/yanhong/Github/hongy20/midi-jam/eslint.config.mjs)

#### [MODIFY] [eslint.config.mjs](file:///Users/yanhong/Github/hongy20/midi-jam/eslint.config.mjs)
- Add `import/first` rule to enforce imports at the top.
- Add `import/newline-after-import` to ensure a clean separation between imports and the rest of the code.
- Add `import/no-duplicates` to prevent duplicate imports.

### [Code Cleanup]

#### [MODIFY] [NoteHighway.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/features/note-highway/components/note-highway/NoteHighway.tsx)
- Run `eslint --fix` to reorder imports to the top.

#### [PROJECT-WIDE]
- Run `npm run lint:fix` to ensure all files comply with the new rules.

## Verification Plan

### Automated Tests
- Run `npx eslint src/features/note-highway/components/note-highway/NoteHighway.tsx` to verify no more import errors.
- Run `npm run lint` project-wide to ensure compliance.
- Run `npm run type-check` and `npm test` to ensure no regressions.
