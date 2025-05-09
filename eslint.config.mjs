// .eslintrc.mjs
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // 1) Extiende las configs oficiales de Next.js + TS
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2) Añade aquí tus overrides:
  {
    rules: {
      // Ignorar vars que empiecen por "_" cuando no las uses:
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "args": "after-used",
          "ignoreRestSiblings": true,
          "caughtErrors": "all",
          "varsIgnorePattern": "^_",
          "argsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      // Permitir any con advertencia en lugar de error:
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
