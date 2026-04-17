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
    files: ["src/shared/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/app/*", "@/proxy"],
              message:
                "Shared modules (src/shared) must not import from features, app, or proxy layers. Keep infrastructure layer pure.",
            },
            {
              group: ["**/features/*", "**/app/*"],
              message:
                "Shared modules (src/shared) must not import from features or app layers via relative paths.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
