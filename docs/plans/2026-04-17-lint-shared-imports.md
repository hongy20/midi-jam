# Plan: Enforce Shared Folder isolation via ESLint

In accordance with the project's feature-based folder structure, modules in `src/shared` (Infrastructure Layer) must not import from higher-level layers (`src/features`, `src/app`). This ensures that shared code remains generic, reusable, and free of domain-specific dependencies.

## Design

We will utilize the built-in ESLint `no-restricted-imports` rule within the Flat Config (`eslint.config.mjs`). This rule will be scoped specifically to files in `src/shared`.

### Patterns to Block:

- **Aliases**: `@/features/*`, `@/app/*`
- **Relative Paths**:
  - `../features/*`, `../../features/*`, `../../../features/*`
  - `../app/*`, `../../app/*`, `../../../app/*`

Using `**/features/*` and `**/app/*` in the `group` pattern of `no-restricted-imports` can catch relative imports that resolve to these paths, but standard practice is to specify common relative depths or use the `@/` alias. Since the project uses aliases, we will prioritize blocking those, and also common relative patterns.

## Implementation Details

### 1. Update ESLint Configuration

Modify `eslint.config.mjs` to add a new configuration block.

```javascript
  {
    files: ["src/shared/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/app/*", "@/proxy"],
              message: "Shared modules (src/shared) must not import from features, app, or proxy layers. keep infrastructure layer pure."
            },
            {
              group: ["**/features/*", "**/app/*"],
              message: "Shared modules (src/shared) must not import from features or app layers via relative paths."
            }
          ]
        }
      ]
    }
  }
```

## Task List

- [ ] Create feature branch `feature/lint-shared-imports` (Completed)
- [ ] Implement the rule in `eslint.config.mjs`
- [ ] Verify by running `npm run lint`
- [ ] (Optional) Fix any discovered violations if minimal
- [ ] Verify fix by introducing a temporary violation and seeing it fail
- [ ] Create PR

## Verification Plan

### Automated

- `npm run lint`: Verify the codebase is clean with the new rule.
- Trigger test: Add `import { Gear } from "@/features/midi-hardware/context/GearContext"` to a file in `src/shared/hooks` and verify `npm run lint` fails.
