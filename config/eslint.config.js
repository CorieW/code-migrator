import js from "@eslint/js";

export default [
  {
    ignores: [".astro/**", "coverage/**", "dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        Buffer: "readonly",
        console: "readonly",
        clearTimeout: "readonly",
        fetch: "readonly",
        globalThis: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        URLSearchParams: "readonly",
      },
    },
  },
];
