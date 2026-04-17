import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
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
    },
  },
];

export default eslintConfig;
