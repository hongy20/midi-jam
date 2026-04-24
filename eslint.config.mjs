import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tailwindcss from "eslint-plugin-tailwindcss";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  ...tailwindcss.configs["flat/recommended"],
  prettier,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    settings: {
      tailwindcss: {
        callees: ["classnames", "clsx", "ctl", "cva", "twMerge"],
        config: {},
        whitelist: [
          "retro",
          "font-retro",
          "custom-scrollbar",
          "btn-jam",
          "jam-action-group",
          "bg-accent",
          "bg-background/5",
          "bg-foreground/10",
          "bg-foreground/20",
          "bg-input/40",
          "border-foreground/10",
          "bg-ring",
          "text-accent-foreground",
          "ring-foreground",
          "ring-ring",
          "bg-destructive/80",
          "bg-destructive/90",
          "bg-input/60",
          "bg-primary/80",
          "bg-primary/90",
          "bg-secondary/80",
          "text-foreground/70",
          "text-muted-foreground/50",
        ],
      },
    },
  },
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
      "@typescript-eslint/no-unused-vars": "error",
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
        "error",
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
                "Cross-feature imports are forbidden to ensure high isolation. Orchestration logic must reside in the app layer (src/app/).",
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
