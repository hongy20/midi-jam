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
    // 2. App Layer Boundaries
    files: ["src/app/**/*"],
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
            {
              group: [
                "@/app/*/**",
                "!@/app/layout",
                "!@/app/loading",
                "!@/app/error",
                "!@/app/not-found",
              ],
              message:
                "App routes must not import from other app routes. Use features or shared instead. For internal route logic, use relative imports.",
            },
          ],
        },
      ],
    },
  },
  {
    // 3. Features Layer Boundaries
    files: ["src/features/**/*"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["**/features/*/*", "!**/features/*/index"],
              message:
                "Direct import from feature internals is forbidden. Please use the feature barrel file (src/features/[name]/index.ts).",
            },
            {
              group: ["**/app/**", "@/app/**"],
              message: "Feature layer must not import from the app layer.",
            },
            {
              group: ["@/features/*"],
              message:
                "Cross-feature imports are discouraged to ensure high isolation. Consider moving orchestration logic to the app layer or a dedicated orchestration feature.",
            },
          ],
        },
      ],
    },
  },
  {
    // 4. Shared Layer Boundaries
    files: ["src/shared/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/features/**", "@/features/**"],
              message: "Shared layer must not import from the feature layer.",
            },
            {
              group: ["**/app/**", "@/app/**"],
              message: "Shared layer must not import from the app layer.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
