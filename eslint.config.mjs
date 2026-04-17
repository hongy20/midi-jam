import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  prettier,
  {
    ignores: [
      ".next/*",
      "node_modules/*",
      "dist/*",
      "build/*",
      "coverage/*",
      "storybook-static/*",
      "public/*",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    // 1. Enforce explicit exports in barrel files (no export *)
    files: ["src/features/*/index.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportAllDeclaration",
          message:
            "Exporting all from a file (export *) is forbidden in feature barrel files. Please use explicit exports.",
        },
      ],
    },
  },
  {
    // 2. Enforce barrel file usage from outside
    // Prevent importing from feature internals from anywhere except within the same feature
    files: ["src/app/**/*", "src/features/*/**/*", "src/shared/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/features/*/*", "!**/features/*/index"],
              message:
                "Direct import from feature internals is forbidden. Please use the feature barrel file (src/features/[name]/index.ts).",
            },
          ],
        },
      ],
    },
  },
  {
    // 3. Prevent features from importing from app layer
    files: ["src/features/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/app/**", "@/app/**"],
              message: "Feature layer must not import from the app layer.",
            },
          ],
        },
      ],
    },
  },
  {
    // 4. Warn on cross-feature imports
    // This will also catch aliased self-imports, encouraging relative paths for internal logic
    files: ["src/features/**/*"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["@/features/*"],
              message:
                "Cross-feature imports should be minimized. If this is a self-import, use relative paths instead of aliases.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
