import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        Buffer: true,
        process: true
      },
    },
    rules: {
      "no-unused-vars": "warn"
    },
  }
];