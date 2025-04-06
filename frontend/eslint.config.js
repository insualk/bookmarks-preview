import { defineConfig } from "eslint-define-config";

export default defineConfig({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: "./tsconfig.json",
      ecmaFeatures: { jsx: true }
    }
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  rules: {
    "react/react-in-jsx-scope": "off", // Next.js doesn't require React import
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "import/order": ["warn", { "alphabetize": { "order": "asc" } }],
    "react/prop-types": "off", // Not needed with TypeScript
    "jsx-a11y/anchor-is-valid": "off" // If using Next.js `<Link>`
  },
  settings: {
    react: { version: "detect" }
  }
});
